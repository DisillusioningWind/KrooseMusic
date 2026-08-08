#!/usr/bin/env node
/**
 * 生成 IPC 静态 preload 与类型声明（构建时脚本）
 *
 * 扫描 src/main/modules/index.ts 的 mods 数组，解析各模块类上 @Ipc/@IpcEvent 装饰器，
 * 提取 namespace、通道名、方法签名与 JSDoc，生成：
 *   - src/preload/ipc.gen.mjs  （静态 api 对象：invoke 通道 + on<Event> 订阅）
 *   - src/preload/ipc.gen.d.ts （API 字面量类型，保留 JSDoc 供编辑器智能提示）
 * 任何解析失败立即报错退出（fail-fast），避免生成错误代码。
 */
import { writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MODULES_DIR = join(root, 'src', 'main', 'modules')
const PRELOAD_DIR = join(root, 'src', 'preload')
const INDEX_FILE = join(MODULES_DIR, 'index.ts')
const GLOBAL_TYPES_FILE = join(root, 'src', 'renderer', 'src', 'types', 'index.d.ts')

// ---------- 编译上下文 ----------
const configFile = ts.readConfigFile(join(root, 'tsconfig.node.json'), ts.sys.readFile)
if (configFile.error) {
  console.error('[gen-ipc] 读取 tsconfig.node.json 失败:', ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
  process.exit(1)
}
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root)
const program = ts.createProgram(parsed.fileNames, parsed.options)
const checker = program.getTypeChecker()
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

/** fail-fast：打印错误并退出 */
function fail(msg) {
  console.error(`[gen-ipc] 错误: ${msg}`)
  process.exit(1)
}

// ---------- 已知类型集合 ----------
const BUILTIN_TYPES = new Set([
  'string', 'number', 'boolean', 'void', 'any', 'unknown', 'never', 'object', 'undefined', 'null', 'bigint', 'symbol',
  'Function', 'Date', 'RegExp', 'Error', 'Array', 'Promise', 'Record', 'Partial', 'Pick', 'Omit', 'Exclude', 'Extract',
  'Readonly', 'Required', 'ReturnType', 'Parameters', 'Awaited', 'Capitalize', 'Uncapitalize', 'Uppercase', 'Lowercase',
  'TemplateStringsArray', 'ArrayLike', 'ReadonlyArray', 'Iterable', 'Iterator', 'AsyncIterable', 'Map', 'Set',
  'WeakMap', 'WeakSet', 'ArrayBuffer', 'DataView', 'JSON', 'Math', 'Number', 'String', 'Boolean', 'Symbol', 'BigInt', 'Object',
])

/** 项目全局类型（src/renderer/src/types/index.d.ts 的 declare global 块内声明） */
const GLOBAL_TYPES = new Set()
{
  const tsf = program.getSourceFile(GLOBAL_TYPES_FILE)
  if (tsf) {
    ts.forEachChild(tsf, node => {
      if (!ts.isModuleDeclaration(node) || node.name?.text !== 'global' || !node.body) return
      ts.forEachChild(node.body, inner => {
        if ((ts.isInterfaceDeclaration(inner) || ts.isTypeAliasDeclaration(inner) || ts.isEnumDeclaration(inner)) && inner.name) {
          GLOBAL_TYPES.add(inner.name.text)
        }
      })
    })
  }
}

// ---------- mods 数组与 import 映射 ----------
function findModsArray(sf) {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== 'mods' || !decl.initializer) continue
      let init = decl.initializer
      if (ts.isAsExpression(init)) init = init.expression
      if (ts.isArrayLiteralExpression(init)) return init
    }
  }
  return undefined
}

function buildImportMap(sf) {
  const map = new Map()
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !stmt.moduleSpecifier || !ts.isStringLiteral(stmt.moduleSpecifier)) continue
    const spec = stmt.moduleSpecifier.text
    if (!spec.startsWith('.')) continue
    const named = stmt.importClause?.namedBindings
    if (named && ts.isNamedImports(named)) {
      for (const el of named.elements) map.set(el.name.text, spec)
    } else if (stmt.importClause && ts.isIdentifier(stmt.importClause.name)) {
      map.set(stmt.importClause.name.text, spec)
    }
  }
  return map
}

// ---------- 类与装饰器解析 ----------
function findClass(sf, name) {
  for (const stmt of sf.statements) {
    if (ts.isClassDeclaration(stmt) && stmt.name?.text === name) return stmt
  }
  return undefined
}

function getNamespace(cls, sf) {
  for (const member of cls.members) {
    if (!ts.isPropertyDeclaration(member) || !ts.isIdentifier(member.name) || member.name.text !== 'namespace') continue
    let init = member.initializer
    if (init && ts.isAsExpression(init)) init = init.expression
    if (init && ts.isStringLiteral(init)) return init.text
  }
  return undefined
}

function getDecoratorInfo(decorator) {
  let callee = decorator.expression
  let arg
  if (ts.isCallExpression(callee)) {
    arg = callee.arguments.length > 0 && ts.isStringLiteral(callee.arguments[0]) ? callee.arguments[0].text : undefined
    callee = callee.expression
  }
  if (!ts.isIdentifier(callee)) return undefined
  return { name: callee.text, arg }
}

/** 方法前的最后一个 JSDoc 块（原样保留，供智能提示） */
function getJsDoc(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart())
  if (!ranges) return undefined
  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i]
    if (r.kind !== ts.SyntaxKind.MultiLineCommentTrivia) continue
    const text = sf.text.slice(r.pos, r.end)
    if (!text.startsWith('/**')) continue
    // 注释 token 本身无前导缩进（range 不含行首空格），故从第二行开始计算公共缩进
    const lines = text.replace(/\r\n/g, '\n').split('\n')
    const body = lines.slice(1)
    const nonEmpty = body.filter(l => l.trim() !== '')
    const min = nonEmpty.length ? Math.min(...nonEmpty.map(l => (l.match(/^\s*/) || [''])[0].length)) : 0
    return [lines[0].trim(), ...body.map(l => l.slice(min))].join('\n').trim()
  }
  return undefined
}

// ---------- 类型提取 ----------
function collectTypeIdentifiers(node, out) {
  if (!node) return
  if (ts.isIdentifier(node)) {
    const parent = node.parent
    if (parent && ts.isPropertySignature(parent) && parent.name === node) return // 属性名
    if (parent && ts.isQualifiedName(parent) && parent.right === node) return // 限定名的右侧
    out.push(node)
  }
  ts.forEachChild(node, n => collectTypeIdentifiers(n, out))
}

function getParamTypeText(p, sf) {
  if (!p.type) fail(`IPC 方法参数缺少类型标注: ${relative(root, sf.fileName)} ${p.name.getText(sf)}`)
  return printer.printNode(ts.EmitHint.Unspecified, p.type, sf)
}

/** 返回类型 TypeNode（优先显式标注，否则用类型检查器推断） */
function getReturnTypeNode(member, sf) {
  if (member.type) return member.type
  const type = checker.getTypeAtLocation(member)
  const sig = type.getCallSignatures()[0]
  if (!sig) fail(`无法推断 IPC 方法返回类型: ${relative(root, sf.fileName)} ${member.name.getText(sf)}`)
  const node = checker.typeToTypeNode(checker.getReturnTypeOfSignature(sig), member, ts.TypeFormatFlags.NoTruncation)
  if (!node) fail(`无法推断 IPC 方法返回类型: ${relative(root, sf.fileName)} ${member.name.getText(sf)}`)
  return node
}

function getReturnTypeText(node, sf) {
  return printer.printNode(ts.EmitHint.Unspecified, node, sf)
}

// ---------- 类型标识符来源（决定生成的 import 语句） ----------
function declFileToImport(declPath) {
  const norm = declPath.replace(/\\/g, '/')
  if (norm.includes('/src/')) {
    if (norm.endsWith('/src/renderer/src/types/index.d.ts')) return null // 项目全局类型
    return './' + relative(PRELOAD_DIR, declPath).replace(/\\/g, '/').replace(/\.ts$/, '')
  }
  const m = norm.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)
  if (!m) return null
  const pkg = m[1]
  if (pkg === 'typescript' || pkg.startsWith('@types/')) return null // lib 内置 / @types 全局
  return pkg
}

/** 兜底：在 program 的声明文件中查找导出该类型的模块 */
function findDeclarationSource(name) {
  for (const sf of program.getSourceFiles()) {
    if (!sf.isDeclarationFile || !ts.isExternalModule(sf)) continue
    const hit = checker.getExportsOfModule(sf.symbol).find(s => s.name === name)
    if (hit) {
      return hit.declarations?.[0]?.getSourceFile()?.fileName ?? sf.fileName
    }
  }
  return undefined
}

/** import 说明符（相对路径 / 包名）→ 生成 d.ts 可用的 from 字符串 */
function specToFrom(spec, sf) {
  if (!spec.startsWith('.')) return spec
  const target = join(dirname(sf.fileName), spec.replace(/\.js$/, '.ts'))
  return declFileToImport(target)
}

/** 若声明节点是 import 子句，返回其 moduleSpecifier 文本 */
function getImportSpecifier(decl) {
  let node = decl
  while (node && !ts.isImportDeclaration(node)) node = node.parent
  if (!node || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) return undefined
  return { spec: node.moduleSpecifier.text, isDefault: ts.isImportClause(decl) || (decl.parent && ts.isImportClause(decl.parent)) }
}

function resolveTypeSource(name, idNode, sf) {
  if (GLOBAL_TYPES.has(name) || BUILTIN_TYPES.has(name)) return null
  let source, isDefault = false
  if (idNode) {
    const sym = checker.getSymbolAtLocation(idNode)
    const decl = sym?.declarations?.[0]
    if (decl) {
      const imp = getImportSpecifier(decl)
      if (imp) return { from: specToFrom(imp.spec, decl.getSourceFile()), isDefault: imp.isDefault }
      source = decl.getSourceFile().fileName
    }
  }
  if (!source && sf) {
    // 兜底：在模块源文件中查找同名 import（typeToTypeNode 的虚拟节点无符号绑定）
    for (const stmt of sf.statements) {
      if (!ts.isImportDeclaration(stmt) || !stmt.moduleSpecifier || !ts.isStringLiteral(stmt.moduleSpecifier)) continue
      const spec = stmt.moduleSpecifier.text
      const named = stmt.importClause?.namedBindings
      if (named && ts.isNamedImports(named)) {
        for (const el of named.elements) {
          if (el.name.text === name) { source = spec; isDefault = false; break }
        }
      } else if (stmt.importClause && ts.isIdentifier(stmt.importClause.name) && stmt.importClause.name.text === name) {
        source = spec; isDefault = true
      }
      if (source) break
    }
    if (source) return { from: specToFrom(source, sf), isDefault }
  }
  if (!source) source = findDeclarationSource(name)
  if (!source) return null
  const from = declFileToImport(source)
  return from ? { from, isDefault: false } : null
}

// ---------- 主流程 ----------
const indexSF = program.getSourceFile(INDEX_FILE)
if (!indexSF) fail(`找不到 ${relative(root, INDEX_FILE)}`)
const modsArray = findModsArray(indexSF)
if (!modsArray) fail('src/main/modules/index.ts 中找不到 mods 数组')
const importMap = buildImportMap(indexSF)

/** 收集类型来源 import：from -> { defaultNames, namedNames } */
const importNames = new Map()

function collectTypeImports(nodes, sf) {
  const ids = []
  nodes.forEach(n => collectTypeIdentifiers(n, ids))
  for (const id of ids) {
    const res = resolveTypeSource(id.text, id, sf)
    if (!res) continue
    if (!importNames.has(res.from)) importNames.set(res.from, { defaultNames: new Set(), namedNames: new Set() })
    if (res.isDefault) importNames.get(res.from).defaultNames.add(id.text)
    else importNames.get(res.from).namedNames.add(id.text)
  }
}

const modules = []
for (const el of modsArray.elements) {
  if (!ts.isIdentifier(el)) fail('mods 数组元素必须为模块类标识符')
  const className = el.text
  const spec = importMap.get(className)
  if (!spec) fail(`mods 数组中的 ${className} 缺少相对路径 import`)
  const filePath = join(MODULES_DIR, spec.replace(/\.js$/, '.ts'))
  const sf = program.getSourceFile(filePath)
  if (!sf) fail(`找不到模块文件 ${relative(root, filePath)}`)

  const cls = findClass(sf, className)
  if (!cls) fail(`文件 ${relative(root, filePath)} 中找不到类 ${className}`)
  const namespace = getNamespace(cls, sf)
  if (!namespace) fail(`类 ${className} 缺少 namespace 属性`)

  const channels = []
  const events = []
  // @Ipc 装饰器标记的调用通道
  for (const member of cls.members) {
    if (!ts.isMethodDeclaration(member) || !member.modifiers || !member.name) continue
    const decorators = member.modifiers.filter(ts.isDecorator)
    if (decorators.length === 0) continue
    const methodName = member.name.getText(sf)
    for (const decorator of decorators) {
      const info = getDecoratorInfo(decorator)
      if (!info || info.name !== 'IPC') continue
      const item = {
        method: methodName,
        channel: info.arg ?? methodName,
        doc: getJsDoc(member, sf),
        params: member.parameters.map(p => ({ name: p.name.getText(sf).replace(/^_+/, ''), type: getParamTypeText(p, sf) })),
        ret: null,
        typeNodes: [...member.parameters.map(p => p.type)].filter(Boolean),
      }
      const retNode = getReturnTypeNode(member, sf)
      item.ret = getReturnTypeText(retNode, sf)
      item.typeNodes.push(retNode)
      channels.push(item)
    }
  }
  // 事件组：模块文件内 interface/type Events 声明（约定命名，通道为事件名且全项目唯一）
  const eventsDecl = sf.statements.find(s =>
    (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s)) && s.name?.text === 'Events'
  )
  if (eventsDecl) {
    const members = ts.isInterfaceDeclaration(eventsDecl) ? eventsDecl.members : (eventsDecl.type.typeMembers ?? [])
    for (const m of members) {
      if (!ts.isPropertySignature(m) || !m.name || !ts.isIdentifier(m.name) || !m.type) continue
      const fnType = m.type
      if (!ts.isFunctionTypeNode(fnType)) fail(`事件 ${m.name.text} 的类型必须是函数类型（(参数) => void）`)
      events.push({
        method: m.name.text,
        channel: m.name.text,
        doc: getJsDoc(m, sf),
        params: fnType.parameters.map(p => ({ name: p.name.getText(sf), type: getParamTypeText(p, sf) })),
        typeNodes: fnType.parameters.map(p => p.type).filter(Boolean),
      })
    }
  }

  channels.forEach(c => collectTypeImports(c.typeNodes, sf))
  events.forEach(e => collectTypeImports(e.typeNodes, sf))
  modules.push({ namespace, channels, events })
}

if (modules.length === 0) fail('未扫描到任何模块')

// 事件通道为全局唯一（事件名即通道名，无 namespace 前缀）
const eventNames = new Set()
for (const mod of modules) {
  for (const e of mod.events) {
    if (eventNames.has(e.channel)) fail(`事件名 ${e.channel} 重复（事件通道全项目唯一，请改用其他名称）`)
    eventNames.add(e.channel)
  }
}

// ---------- 生成 ipc.gen.mjs ----------
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
const mjsLines = []
mjsLines.push('// DO NOT EDIT — generated by scripts/gen-ipc.mjs')
mjsLines.push("import { ipcRenderer } from 'electron'")
mjsLines.push('')
mjsLines.push('export const api = {')
for (const mod of modules) {
  mjsLines.push(`  ${mod.namespace}: {`)
  for (const c of mod.channels) {
    mjsLines.push(`    '${c.channel}': (...args) => ipcRenderer.invoke('${mod.namespace}:${c.channel}', ...args),`)
  }
  for (const e of mod.events) {
    const channel = e.channel
    const onName = 'on' + cap(e.channel)
    const offName = 'off' + cap(e.channel)
    mjsLines.push(`    '${onName}': (cb) => ipcRenderer.on('${channel}', cb),`)
    mjsLines.push(`    '${offName}': (cb) => ipcRenderer.removeListener('${channel}', cb),`)
  }
  mjsLines.push('  },')
}
mjsLines.push('}')
writeFileSync(join(PRELOAD_DIR, 'ipc.gen.mjs'), mjsLines.join('\n') + '\n')

// ---------- 生成 ipc.gen.d.ts ----------
const dtsLines = []
dtsLines.push('// DO NOT EDIT — generated by scripts/gen-ipc.mjs')
const hasEvents = modules.some(m => m.events.length > 0)
if (hasEvents) dtsLines.push("import type { IpcRendererEvent } from 'electron'")
for (const [from, { defaultNames, namedNames }] of importNames) {
  if (defaultNames.size > 0) dtsLines.push(`import type ${[...defaultNames].sort().join(', ')} from '${from}'`)
  if (namedNames.size > 0) dtsLines.push(`import type { ${[...namedNames].sort().join(', ')} } from '${from}'`)
}
if (hasEvents || importNames.size > 0) dtsLines.push('')

const writeDoc = (doc, indent) => {
  if (!doc) return
  doc.split('\n').forEach(line => dtsLines.push(`${indent}${line}`))
}

for (const mod of modules) {
  const apiName = cap(mod.namespace) + 'API'
  dtsLines.push(`export interface ${apiName} {`)
  for (const c of mod.channels) {
    writeDoc(c.doc, '  ')
    const params = c.params.map(p => `${p.name}: ${p.type}`).join(', ')
    dtsLines.push(`  ${c.channel}(${params}): ${c.ret}`)
  }
  for (const e of mod.events) {
    writeDoc(e.doc, '  ')
    const onName = 'on' + cap(e.channel)
    const offName = 'off' + cap(e.channel)
    const params = e.params.map(p => `${p.name}: ${p.type}`).join(', ')
    dtsLines.push(`  ${onName}(cb: (event: IpcRendererEvent, ${params}) => void): void`)
    dtsLines.push(`  ${offName}(cb: (event: IpcRendererEvent, ${params}) => void): void`)
  }
  dtsLines.push('}')
}
dtsLines.push('')
dtsLines.push('export interface API {')
for (const mod of modules) {
  dtsLines.push(`  ${mod.namespace}: ${cap(mod.namespace)}API`)
}
dtsLines.push('}')
writeFileSync(join(PRELOAD_DIR, 'ipc.gen.d.ts'), dtsLines.join('\n') + '\n')

// ---------- 摘要 ----------
console.log('[gen-ipc] 已生成:')
console.log('  - src/preload/ipc.gen.mjs')
console.log('  - src/preload/ipc.gen.d.ts')
for (const mod of modules) {
  const chs = mod.channels.map(c => c.channel).join(', ')
  const evs = mod.events.map(e => e.channel).join(', ')
  console.log(`  - ${mod.namespace}: 通道[${chs}]${evs ? ` 事件[${evs}]` : ''}`)
}
