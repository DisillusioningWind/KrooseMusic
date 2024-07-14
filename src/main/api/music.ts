import { parseBuffer, parseFile } from 'music-metadata'
import Color from 'color'
import Sharp from 'sharp'

/**
 * 从buffer中加载音乐文件的标签信息
 * @param buffer 音乐文件的buffer
 * @returns 音乐文件的标签信息
 */
export async function loadMusicTagsFromBuffer(buffer: Buffer) {
  const metadata = await parseBuffer(buffer)
  return metadata.common
}

/**
 * 从文件中加载音乐文件的标签信息
 * @param path 音乐文件的路径
 * @returns 音乐文件的标签信息
 */
export async function loadMusicTagsFromFile(path: string) {
  const metadata = await parseFile(path)
  return metadata.common
}

/**
 * 从buffer中获取音乐文件图片的主色调
 * @param buffer 音乐文件的buffer
 * @returns 音乐文件图片的主色调
 */
export async function getMainColorFromBuffer(buffer: Buffer) {
  const sharp = Sharp(buffer)
  const { data } = await sharp.resize(50, 50).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let maxColor = Color('#1a5d8e')
  let max = 0
  const colorDic = new Map<string, number>()
  for (let i = 0; i < data.length; i += 4) {
    const color = Color(`rgba(${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]})`)
    const l = color.lightness()
    const s = color.saturationl()
    const h = color.hue()
    if (l < 75 && l > 10
      && s < 60 && s > 40
      && ((h > 140 && h < 175) || h < 30 || h > 220)) {
      const key = color.hex()
      let count = (colorDic.get(key) || 0) + 1
      colorDic.set(key, count)
      if (count > max) {
        max = count
        maxColor = color
      }
    }
  }
  return maxColor.hex()
}
