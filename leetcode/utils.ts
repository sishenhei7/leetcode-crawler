import fs from 'fs'
import path from 'path'

type asyncFunc = () => Promise<any>

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

export async function runTask(taskList: asyncFunc[], limit: number) {
  if (!taskList?.length || limit <= 0) {
    return null
  }

  let i = 0
  const res = Array(limit).fill(null)
  const taskLen = taskList.length

  async function next(k: number) {
    res[k] = await taskList[k]()

    if (i + 1 < taskLen) {
      i += 1
      next(i)
    }
  }

  for (let i = 0; i < limit; i += 1) {
    if (i < taskLen) {
      await next(i)
    }
  }

  return res
}

export function getMondayOfWeek(date: string) {
  const currentDate = new Date(date)
  const day = currentDate.getDay()
  const offset = day === 0 ? 6 : day - 1
  return new Date(currentDate.setDate(currentDate.getDate() - offset))
}

export function mergeArray(...args: number[][]) {
  return Array.from(new Set([...args.flat()]))
}
