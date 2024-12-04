export interface ILyric {
  time: number
  lyric: string
  uid: string
}

/**
 * 格式化歌词文本
 * @param text 歌词文本
 * @returns 格式化后的歌词
 */
export async function formatLyrics(text: string): Promise<ILyric[]> {
  //按行分割时注意格式为LF或CRLF的情况
  const lines = text.split(/\r?\n/)
  const lyrics: ILyric[] = []
  const reg = /^\[(\d+:\d+\.\d+)\](.*)$/
  for (const line of lines) {
    const matchs = line.match(reg)
    if (matchs) {
      const time = matchs[1]
      const lyric = matchs[2]
      const [min, sec] = time.split(':').map(Number)
      const timeInSec = min * 60 + sec
      lyrics.push({
        time: timeInSec,
        lyric,
        uid: Math.random().toString().slice(-6)
      })
    }
  }
  return lyrics
}
