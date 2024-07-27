import fs from 'fs'
import { parseBuffer } from 'music-metadata'
import { getMainColorFromBuffer } from './music'

/**
 * 读取文件内容
 * @param path 文件路径
 * @returns 文件内容和大小
 */
export function loadFile(path: string) {
  const size = fs.statSync(path).size
  const buffer = Buffer.alloc(size)
  fs.readSync(fs.openSync(path, 'r'), buffer, 0, size, 0)
  return buffer
}

export async function loadFileAndTag(path: string) {
  const stime = performance.now()
  const buffer = loadFile(path)
  const { common:commonTags } = await parseBuffer(buffer)
  const mainColor = commonTags.picture ? await getMainColorFromBuffer(commonTags.picture[0].data) : '#1a5d8e'
  console.log('loadFileAndTag', performance.now() - stime)
  return { buffer, commonTags, mainColor }
}
