import dayjs from 'dayjs'
import { getRecentACSubmissionsCN, getRecentACSubmissionsCOM } from './api'
import userList from '../data/users.json'
import questionMapCOM from '../data/question-map-com.json'
import { existFile, readFile, writeFile, runTask, getMondayOfWeek, mergeArray } from './utils'

const dayFormat = 'YYYY-MM-DD'
const weekFormat = 'YYYY-MM-DD'
const monthFormat = 'YYYY-MM'
const today = dayjs().format(dayFormat)
const currentWeek = dayjs(getMondayOfWeek(today)).format(weekFormat)
const currentMonth = dayjs().format(monthFormat)

// 最多记录半年的数据
interface UserLeetcode {
  username: string
  isCN: boolean
  nickname: string
  wechat: string
  github: string
  total: number
  weekQuestionIds: number[]
  day: {
    date: string
    total: number
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
    const { username } = user
    const userFilePath = `../users/${username}.json`
    const userData = existFile(userFilePath)
      ? readFile(userFilePath)
      : {
          ...user,
          total: 0,
          weekQuestionIds: [],
          day: [],
          week: [],
          month: [],
        }

    // 只增量更新今天的数据
    const todayList = []
    if (user.isCN) {
      const data = await getRecentACSubmissionsCN(username)
      data?.data?.data?.recentACSubmissions?.forEach(submission => {
        const {
          submitTime,
          question: { questionFrontendId },
        } = submission
        const date = dayjs(Number(submitTime) * 1000).format(dayFormat)
        date === today && todayList.push(questionFrontendId)
      })
    } else {
      const data = await getRecentACSubmissionsCOM(username)
      data?.data?.data?.recentAcSubmissionList?.forEach(submission => {
        const { timestamp, titleSlug } = submission
        const date = dayjs(Number(timestamp) * 1000).format(dayFormat)
        date === today && todayList.push(questionMapCOM[titleSlug] || titleSlug)
      })
    }

    // 加入默认day数据
    if (userData.day?.[0]?.date !== today) {
      userData.day.unshift({
        date: today,
        total: 0,
        questionIds: [],
      })

      // 每周第一天的时候重置 weekQuestionIds
      if (today === currentWeek) {
        userData.weekQuestionIds = []
      }
    }

    // 加入默认week数据
    if (userData.week?.[0]?.date !== currentWeek) {
      userData.week.unshift({
        date: currentWeek,
        total: 0,
      })
    }

    // 加入默认month数据
    if (userData.month?.[0]?.date !== currentMonth) {
      userData.month.unshift({
        date: currentMonth,
        total: 0,
      })
    }

    // 根据 weekQuestionIds 去重
    const { weekQuestionIds } = userData
    const weekSet = new Set(weekQuestionIds)
    const nubTodayList = todayList.filter(id => !weekSet.has(id))
    userData.weekQuestionIds = mergeArray(weekQuestionIds, nubTodayList)

    // 更新 day
    const userDataToday = userData.day[0]
    const { questionIds } = userDataToday
    userDataToday.questionIds = mergeArray(questionIds, nubTodayList)
    userDataToday.total = userDataToday.questionIds.length

    // 更新 week
    const userDataWeek = userData.week[0]
    userDataWeek.total = userData.weekQuestionIds.length

    // 更新 month
    const userDataMonth = userData.month[0]
    userDataMonth.total += nubTodayList.length

    // 更新total
    userData.total += nubTodayList.length

    writeFile(userFilePath, userData)
  })

  await runTask(taskList, 10)
  // TODO: add spinner and console
})()
