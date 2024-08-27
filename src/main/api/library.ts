import fs from 'fs'
import path from 'path'
import { parseFile } from 'music-metadata'
import { IpcMainInvokeEvent } from 'electron'

const musicExts = ['.mp3', '.flac', '.wav']

export function getDirMusics(e: IpcMainInvokeEvent, dirPath: string) {
  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true,
    recursive: true
  })
  const files = entries.filter(file => file.isFile() && musicExts.includes(path.extname(file.name).toLowerCase()))
  e.sender.send('musicLength', files.length)
  files.forEach(file => {
    const filePath = path.join(file.parentPath, file.name)
    parseFile(filePath).then(data => {
      e.sender.send('musicData', {
        name: file.name,
        path: filePath,
        artist: data.common.artist || '未知艺术家',
        duration: data.format.duration || 0,
        coms: data.common
      })
    })
  })
}
