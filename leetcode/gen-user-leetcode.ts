import dayjs from 'dayjs'
import { getRecentACSubmissionsCN, getRecentACSubmissionsCOM } from './api'
import userList from '../data/users.json'
import questionMapCOM from '../data/question-map-com.json'
import { existFile, readFile, writeFile, runTask, getMondayOfWeek, mergeArray } from './utils'

const dayFormat = 'YYYY-MM-DD'
const weekFormat = 'YYYY-MM-DD'
const monthFormat = 'YYYY-MM'
const today = dayjs().format(dayFormat)
const yesterday = dayjs().subtract(1, 'day').format(dayFormat)
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

    // 加入默认day数据
    if (userData.day?.[0]?.date !== today) {
      userData.day.unshift({
        date: today,
        total: 0,
        questionIds: [],
      })

      // 每周第一天的时候重置 weekQuestionIds
      if (today === dayjs(getMondayOfWeek(today)).format(dayFormat)) {
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

    // 更新今天和昨天的数据（防止昨天最后一次任务失败了）
    const todayList = []
    const yesterdayList = []
    if (user.isCN) {
      const data = await getRecentACSubmissionsCN(username)
      data?.data?.data?.recentACSubmissions?.forEach(submission => {
        const {
          submitTime,
          question: { questionFrontendId },
        } = submission
        const date = dayjs(Number(submitTime) * 1000).format(dayFormat)
        date === today && todayList.push(questionFrontendId)
        date === yesterday && yesterdayList.push(questionFrontendId)
      })
    } else {
      const data = await getRecentACSubmissionsCOM(username)
      data?.data?.data?.recentAcSubmissionList?.forEach(submission => {
        const { timestamp, titleSlug } = submission
        const date = dayjs(Number(timestamp) * 1000).format(dayFormat)
        date === today && todayList.push(questionMapCOM[titleSlug] || titleSlug)
        date === yesterday && yesterdayList.push(questionMapCOM[titleSlug] || titleSlug)
      })
    }

    updateUserDataByDay(userData, today, todayList)
    updateUserDataByDay(userData, yesterday, yesterdayList)
    writeFile(userFilePath, userData)
  })

  await runTask(taskList, 10)
  // TODO: add spinner and console
})()

function updateUserDataByDay(userData: UserLeetcode, date: string, ids: number[]) {
  // 这天新增的题目数（不根据weekQuestionIds去重）
  let newCount = 0

  // 更新 weekQuestionIds
  if (dayjs(getMondayOfWeek(today)).isSame(getMondayOfWeek(date), 'day')) {
    const { weekQuestionIds } = userData
    userData.weekQuestionIds = Array.from(new Set([...weekQuestionIds, ...ids]))
  }

  // 更新 day（不根据weekQuestionIds去重）
  const userDataByDay = userData.day.find(item => item.date === date)
  if (userDataByDay) {
    const { questionIds } = userDataByDay
    userDataByDay.questionIds = mergeArray(questionIds, ids)
    userDataByDay.total = userDataByDay.questionIds.length
    newCount = userDataByDay.total - questionIds.length
  }

  if (newCount > 0) {
    // 更新 week
    const week = dayjs(getMondayOfWeek(date)).format(weekFormat)
    const userDataByWeek = userData.week.find(item => item.date === week)
    userDataByWeek.total += newCount

    // 更新 month
    const month = dayjs(date).format(monthFormat)
    const userDataByMonth = userData.month.find(item => item.date === month)
    userDataByMonth.total += newCount

    // 更新total
    userData.total += newCount
  }
}
