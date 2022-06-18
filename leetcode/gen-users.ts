import { getCommentUsers } from './api'
import { readFile, writeFile } from './utils'

export interface User {
  username: string
  isCN: boolean
  nickname: string
  wechat: string
  github: string
}

;(async () => {
  const path = '../data/users.json'
  const map = new Map<string, User>()

  const oldData = readFile(path) || []
  oldData.forEach((item: User) => {
    if (item.username) {
      map.set(item.username, item)
    }
  })

  // 用新数据增量更新老数据，同样的用户名，新的数据会覆盖老的数据
  const commentList = await getCommentUsers()
  commentList.data.forEach(item => {
    const user = parseComment(item.body)
    if (user.username) {
      map.set(user.username, user)
    }
  })

  writeFile(path, Array.from(map.values()))
})()

function parseComment(comment: string): User {
  comment = comment.trim()

  const user = {
    username: '',
    isCN: true,
    nickname: '',
    wechat: '',
    github: '',
  }

  if (comment.startsWith('https://')) {
    // 链接
    user.username = comment.split('/')[4]
    user.isCN = comment.includes('leetcode.cn')
  } else if (comment.includes('用户名')) {
    // 换行的 kv 信息
    const kvList = comment.split('\n').map(s => s.trim())
    for (const kvstr of kvList) {
      const username = getCommentField(kvstr, '用户名')
      if (username) {
        user.username = username
        continue
      }

      const isCN = getCommentField(kvstr, '是否国区')
      if (isCN) {
        user.isCN = ['否', '不是', 'false'].includes(isCN) ? false : true
        continue
      }

      const nickname = getCommentField(kvstr, '昵称')
      if (nickname) {
        user.nickname = nickname
        continue
      }

      const wechat = getCommentField(kvstr, '微信')
      if (wechat) {
        user.wechat = wechat
        continue
      }

      const github = getCommentField(kvstr, 'github')
      if (github) {
        user.github = github
        continue
      }
    }
  }

  // fix: username以用户名开头的情况
  if (!user.username && !comment.includes(' ') && !comment.includes('/')) {
    // 有效的数据
    user.username = comment
  }

  return user
}

function getCommentField(s: string, field: string) {
  let res = ''
  const fieldList = ['：', ':', ' ', '-'].map(suffix => `${field}${suffix}`)
  for (const field of fieldList) {
    if (s.startsWith(field)) {
      res = s.replace(field, '').trim()
      break
    }
  }
  return res
}
