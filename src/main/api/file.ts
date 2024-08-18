import fs from 'fs'
import * as jschardet from 'jschardet'
import * as iconv from 'iconv-lite'
import { ICommonTagsResult, parseBuffer, parseFile } from 'music-metadata'
import { getMainColorFromBuffer } from './music.js'
import { ILyric, formatLyrics } from './lyric.js'

/**
 * 读取文件内容为Buffer
 * @param path 文件路径
 * @returns 文件内容和成功标志
 */
export function loadFileBuffer(path: string): { buffer?: Buffer, success: boolean } {
  try {
    const size = fs.statSync(path).size
    const buffer = Buffer.alloc(size)
    const fd = fs.openSync(path, 'r')
    fs.readSync(fd, buffer, 0, size, 0)
    return { buffer, success: true }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}

/**
 * 读取文件内容为文本
 * @param path 文件路径
 * @returns 文件内容和成功标志
 */
export function loadFileText(path: string): { text?: string, success: boolean } {
  try {
    const buffer = fs.readFileSync(path)
    const res = jschardet.detect(buffer)
    const text = iconv.decode(buffer, res.encoding)
    return { text, success: true }
  }
  catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('File Not Found:', path)
      return { success: false }
    }
    console.error(err)
    return { success: false }
  }
}

/**
 * 读取音乐文件
 * @param path 文件路径
 * @returns 音乐文件内容Buffer、音乐文件标签、主色调和成功标志
 */
export async function loadFile(path: string): Promise<{ buffer?: Buffer, commonTags?: ICommonTagsResult, mainColor?: string, success: boolean }> {
  const stime = performance.now()
  const fileRes = loadFileBuffer(path)
  if (!fileRes.success) return { success: false }
  const buffer = fileRes.buffer as Buffer
  const { common:commonTags } = await parseBuffer(buffer)
  const mainColor = commonTags.picture ? await getMainColorFromBuffer(commonTags.picture[0].data) : '#1a5d8e'
  console.log('loadFile', performance.now() - stime)
  return { buffer, commonTags, mainColor, success: true }
}

/**
 * 读取歌词文件
 * @param path 文件路径
 * @returns 歌词列表和成功标志
 */
export async function getLyricFromFile(path: string): Promise<ILyric[]> {
  const lyricRes = loadFileText(path.slice(0, path.lastIndexOf('.')) + '.lrc')
  if (!lyricRes.success) return [{ time: 0, lyric: '未找到歌词文件', uid: '0' }]
  return formatLyrics(lyricRes.text as string)
}

/**
 * 从文件获取主色调
 * @param path 文件路径
 * @returns 主色调
 */
export async function getMainColorFromFile(path: string): Promise<string> {
  const tags = (await parseFile(path)).common
  return tags.picture ? getMainColorFromBuffer(tags.picture[0].data) : '#1a5d8e'
}

/**
 * 从文件获取主色调
 * @param path 文件路径
 * @returns 主色调
 */
export async function getInfoFromFile(path: string): Promise<{ tag: ICommonTagsResult; mainColor: string }> {
  const tag = (await parseFile(path)).common
  return { tag, mainColor: tag.picture ? await getMainColorFromBuffer(tag.picture[0].data) : '#1a5d8e' }
}
