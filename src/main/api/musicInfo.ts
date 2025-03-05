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
 * 获取图片的主色调
 * @param buffer 图片buffer
 * @returns 图片的主色调
 */
async function getPictureMainColor(buffer: Uint8Array) {
  const data = await Sharp(buffer).resize(50, 50).ensureAlpha().raw().toBuffer()
  let max = 0
  let maxColor = Color('#1a5d8e').hex()
  const colors = new Map<string, number>()
  for (let i = 0, len = data.length; i < len; i += 4) {
    const color = Color(`rgba(${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]})`)
    const l = color.lightness(), s = color.saturationl(), h = color.hue()
    if (l < 75 && l > 10 && s < 60 && s > 40 && ((h > 140 && h < 175) || h < 30 || h > 220)) {
      const key = color.hex()
      const count = (colors.get(key) || 0) + 1
      colors.set(key, count)
      if (count > max) {
        max = count
        maxColor = key
      }
    }
  }
  return maxColor
}
