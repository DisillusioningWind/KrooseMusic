// Description: 音乐文件信息获取相关的API
import { ICommonTagsResult, parseFile } from 'music-metadata'
import fs from 'fs'
import Color from 'color'
import Sharp from 'sharp'
import * as iconv from 'iconv-lite'
import * as jschardet from 'jschardet'

/**
 * 读取音乐相关的歌词文件
 * @param path 音乐文件路径
 * @returns 歌词列表
 */
export async function loadMusicLyrics(path: string): Promise<ILyric[]> {
  const text = loadFileAsText(path.slice(0, path.lastIndexOf('.')) + '.lrc')
  return text ? formatLyrics(text) : [{ time: 0, lyric: '未找到歌词文件' }]
}
/**
 * 获取音乐文件的信息
 * @param path 音乐文件路径
 * @returns 音乐文件信息，包括标签和图片主色调
 */
export async function loadMusicInfo(path: string): Promise<{ tag: ICommonTagsResult; mainColor: string }> {
  const tag = (await parseFile(path)).common
  const mainColor = tag.picture ? await getPictureMainColor(tag.picture[0].data) : '#1a5d8e'
  return { tag, mainColor }
}

/**
 * 读取文件内容为文本
 * @param path 文件路径
 * @returns 文件内容或null
 */
function loadFileAsText(path: string) {
  try {
    const buffer = fs.readFileSync(path)
    const res = jschardet.detect(buffer)
    const text = iconv.decode(buffer, res.encoding)
    return text
  } catch (err: any) {
    if (err.code === 'ENOENT') { console.error('File Not Found:', path) }
    else { console.error(err) }
    return undefined
  }
}
/**
 * 格式化歌词文本
 * @param text 歌词文本
 * @returns 格式化后的歌词列表
 */
function formatLyrics(text: string): ILyric[] {
  // 按行分割时注意格式为LF或CRLF的情况
  const lines = text.split(/\r?\n/)
  const regex = /^\[(?:(\d{2}):)?(\d{2}):(\d{2}(?:\.\d+)?)\](.*)$/
  const lrcs: ILyric[] = []
  for (const line of lines) {
    const matchs = line.match(regex)
    if (matchs) {
      const hou = Number(matchs[1] ?? '0')
      const min = Number(matchs[2])
      const sec = Number(matchs[3])
      const time = hou * 3600 + min * 60 + sec
      const lyric = matchs[4]
      lrcs.push({ time, lyric })
    }
  }
  return lrcs
}
/**
 * 使用中位切分算法获取图片的主色调
 * @param buffer 图片buffer
 * @returns 图片的主色调
 */
async function getPictureMainColor(buffer: Uint8Array) {
  const data = await Sharp(buffer).ensureAlpha().raw().toBuffer()
  const cube: number[][] = []
  const pale: { rank: number, color: Color }[] = []
  for (let i = 0; i < data.length; i += 4) {
    cube.push([data[i], data[i + 1], data[i + 2]])
  }
  medianCut(cube, pale)
  // 过滤条件：亮度小于70，饱和度大于30小于80，并按rank排序
  const res = pale.filter(c => c.color.lightness() < 70 && c.color.saturationl() > 30 && c.color.saturationl() < 80).sort((a, b) => b.rank - a.rank)
  return res[0]?.color.hex() ?? '#1a5d8e'
}
/**
 * 使用暴力遍历获取图片的主色调
 * @param buffer 图片buffer
 * @returns 图片的主色调
 */
// async function getPictureMainColorByMap(buffer: Uint8Array) {
//   const data = await Sharp(buffer).resize(50, 50).ensureAlpha().raw().toBuffer()
//   let maxcnt = 0
//   let maxcol = Color('#1a5d8e').hex()
//   const colors = new Map<string, number>()
//   for (let i = 0; i < data.length; i += 4) {
//     const color = Color(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`)
//     const l = color.lightness(), s = color.saturationl(), h = color.hue()
//     if (l < 75 && l > 10 && s < 60 && s > 40 && ((h > 140 && h < 175) || h < 30 || h > 220)) {
//       const key = color.hex()
//       const cnt = (colors.get(key) || 0) + 1
//       colors.set(key, cnt)
//       if (cnt > maxcnt) {
//         maxcnt = cnt
//         maxcol = key
//       }
//     }
//   }
//   return maxcol
// }
/**
 * 中位切分算法
 * @param cube 颜色立方体
 * @param res 结果列表
 */
function medianCut(cube: number[][], res: { rank: number, color: Color }[]) {
  // 限定颜色立方体的最大尺寸
  const quality = 100
  let maxr = cube[0][0], minr = cube[0][0]
  let maxg = cube[0][1], ming = cube[0][1]
  let maxb = cube[0][2], minb = cube[0][2]
  for (let i = 1; i < cube.length; i++) {
    maxr = Math.max(maxr, cube[i][0])
    minr = Math.min(minr, cube[i][0])
    maxg = Math.max(maxg, cube[i][1])
    ming = Math.min(ming, cube[i][1])
    maxb = Math.max(maxb, cube[i][2])
    minb = Math.min(minb, cube[i][2])
  }
  const r = maxr - minr
  const g = maxg - ming
  const b = maxb - minb
  // 如果颜色立方体的尺寸小于限定值，则计算平均颜色
  if (r < quality && g < quality && b < quality) {
    const sumcol = cube.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]], [0, 0, 0])
    const avecol = Color(`rgb(${Math.round(sumcol[0] / cube.length)},${Math.round(sumcol[1] / cube.length)},${Math.round(sumcol[2] / cube.length)})`)
    // 以颜色立方体的体积 * 像素数量作为rank
    res.push({ rank: cube.length * (r * g * b), color: avecol })
  } else {
    // 选择颜色立方体中最长的边进行切分
    let maxrgb = 0, maxidx = 0, maxmid = 0
    if (r > maxrgb) {
      maxrgb = r, maxidx = 0, maxmid = (maxr + minr) / 2
    }
    if (g > maxrgb) {
      maxrgb = g, maxidx = 1, maxmid = (maxg + ming) / 2
    }
    if (b > maxrgb) {
      maxrgb = b, maxidx = 2, maxmid = (maxb + minb) / 2
    }
    const left = cube.filter(c => c[maxidx] < maxmid)
    const right = cube.filter(c => c[maxidx] >= maxmid)
    medianCut(left, res)
    medianCut(right, res)
  }
}
