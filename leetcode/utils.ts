import fs from 'fs'
import path from 'path'

export const resolve = (p: string) => path.resolve(__dirname, p)

export function existFile(p: string) {
  try {
    fs.accessSync(resolve(p), fs.constants.R_OK | fs.constants.W_OK)
    return true
  } catch (error) {
    return false
  }
}

export function readFile(p: string) {
  try {
    if (!existFile(p)) {
      return null
    }

    const data = fs.readFileSync(resolve(p), 'utf8')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.log(`读取文件失败：${resolve(p)} ${error}`)
    process.exit(1)
  }
}

export function writeFile(p: string, d: any) {
  try {
    fs.writeFileSync(resolve(p), JSON.stringify(d), {
      encoding: 'utf8',
    })
  } catch (error) {
    console.log(`写入文件失败：${resolve(p)} ${error}`)
    process.exit(1)
  }
}
