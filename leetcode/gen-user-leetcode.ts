import { getRecentACSubmissionsCN, getRecentACSubmissionsCOM } from './api'
import userList from '../data/users.json'
import { runTask } from './utils'

// 最多记录半年的数据
interface UserLeetcode {
  username: string
  isCN: boolean
  nickname: string
  wechat: string
  github: string
  total: number
  totalQuestionIds: number[]
  day: {
    date: string
    questionIds: number[]
  }[]
  week: {
    date: string
    total: number
  }[]
  month: {
    date: string
    total: number
  }[]
}

;(async () => {
  const taskList = userList.map(user => async () => {
    if (user.isCN) {
      const data = await getRecentACSubmissionsCN(user.username)
    }
  })
})()
