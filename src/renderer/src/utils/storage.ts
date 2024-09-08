function getVal(key: string, def: string) {
  let val = localStorage.getItem(key)
  if (!val) { localStorage.setItem(key, def) }
  return val || def
}
function setVal(key: string, val: string) {
  localStorage.setItem(key, val)
}

export function getVer(dbName: string) { return parseInt(getVal(dbName, '1')) }
export function addVer(dbName: string) {
  const ver = getVer(dbName) + 1
  setVal(dbName, ver.toString())
  return ver
}

export function getMusicPath() { return getVal('musicPath', '') }
export function setMusicPath(path: string) { setVal('musicPath', path) }

export function getPlayMode() { return getVal('playMode', 'order') }
export function setPlayMode(mode: string) { setVal('playMode', mode) }

export default { getVer, addVer, getMusicPath, setMusicPath, getPlayMode, setPlayMode }
