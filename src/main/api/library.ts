import fs from 'fs'
import path from 'path'
import { parseFile } from 'music-metadata'
import { IpcMainInvokeEvent } from 'electron'

const musicExts = ['.mp3', '.flac', '.wav']
const picExts = ['.jpg', '.jpeg', '.png']
type DirStruc = {
  name: string
  musics?: { name: string, path: string }[]
  dirs?: DirStruc[]
}

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

export function getDirAlbums(e: IpcMainInvokeEvent, dirPath: string) {
  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true
  })
  const dirs = entries.filter(dir => dir.isDirectory())
  e.sender.send('musicLength', dirs.length)
  dirs.forEach(dir => {
    const pic = fs.readdirSync(path.join(dirPath, dir.name), {
      withFileTypes: true,
      recursive: true
    }).find(file => file.isFile() && picExts.includes(path.extname(file.name).toLowerCase()))
    e.sender.send('musicData', pic ? {
      name: dir.name,
      path: path.join(dirPath, dir.name),
      pic: path.join(pic.parentPath, pic.name)
    } : {
      name: dir.name,
      path: path.join(dirPath, dir.name)
    })
  })
}

export function getDirStruc(_e: IpcMainInvokeEvent, dirPath: string) {
  return getCurDirStruc(dirPath)
}

function getCurDirStruc(dirPath: string) {
  let res = { name: path.basename(dirPath) } as DirStruc
  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true
  })
  entries.forEach(entry => {
    if (entry.isFile() && musicExts.includes(path.extname(entry.name).toLowerCase())) {
      if (!res.musics) res.musics = []
      res.musics.push({ name: entry.name, path: path.join(entry.parentPath, entry.name) })
    } else if (entry.isDirectory()) {
      const tmp = getCurDirStruc(path.join(entry.parentPath, entry.name))
      if (tmp) {
        if (!res.dirs) res.dirs = []
        res.dirs.push(tmp)
      }
    }
  })
  return (!res.dirs && !res.musics) ? null : res
}
