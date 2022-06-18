import axios from 'axios'
import config from '../config'

const { siteCN, siteCOM, commnetUrl } = config

interface SubmissionCN {
  submissionId: number
  submitTime: number
  question: {
    questionFrontendId: string
    titleSlug: string
    translatedTitle: string
  }
}

interface RecentACSubmissionsCN {
  data: {
    recentACSubmissions: SubmissionCN[]
  }
}

export function getRecentACSubmissionsCN(username: string) {
  const options = {
    method: 'POST',
    url: siteCN,
    headers: {},
    data: {
      query:
        '\n    query recentACSubmissions($userSlug: String!) {\n  recentACSubmissions(userSlug: $userSlug) {\n    submissionId\n    submitTime\n    question {\n      translatedTitle\n      titleSlug\n      questionFrontendId\n    }\n  }\n}\n    ',
      variables: { userSlug: username },
    },
  }

  return axios.request<RecentACSubmissionsCN>(options)
}

interface SubmissionCOM {
  id: number
  timestamp: number
  title: string
  titleSlug: string
}

export function getRecentACSubmissionsCOM(username: string) {
  const options = {
    method: 'POST',
    url: siteCOM,
    headers: {},
    data: {
      query:
        '\n    query recentAcSubmissions($username: String!, $limit: Int!) {\n  recentAcSubmissionList(username: $username, limit: $limit) {\n    id\n    title\n    titleSlug\n    timestamp\n  }\n}\n    ',
      variables: { username: username, limit: 50 },
    },
  }

  return axios.request<SubmissionCOM[]>(options)
}

interface ProfileCalendarCN {
  data: {
    userCalendar: {
      streak: number
      totalActiveDays: number
      submissionCalendar: string
    }
  }
}

export function getProfileCalendarCN(username: string) {
  const options = {
    method: 'POST',
    url: siteCN,
    headers: {},
    data: {
      query:
        '\n    query userProfileCalendar($userSlug: String!, $year: Int) {\n  userCalendar(userSlug: $userSlug, year: $year) {\n    streak\n    totalActiveDays\n    submissionCalendar\n  }\n}\n    ',
      variables: { userSlug: username },
    },
  }

  return axios.request<ProfileCalendarCN>(options)
}

interface ProfileCalendarCOM {
  data: {
    matchedUser: {
      userCalendar: {
        streak: number
        totalActiveDays: number
        submissionCalendar: string
        dccBadges: any[]
        activeYears: number[]
      }
    }
  }
}

export function getProfileCalendarCOM(username: string) {
  const options = {
    method: 'POST',
    url: siteCOM,
    headers: {},
    data: {
      query:
        '\n    query userProfileCalendar($username: String!, $year: Int) {\n  matchedUser(username: $username) {\n    userCalendar(year: $year) {\n      activeYears\n      streak\n      totalActiveDays\n      dccBadges {\n        timestamp\n        badge {\n          name\n          icon\n        }\n      }\n      submissionCalendar\n    }\n  }\n}\n    ',
      variables: { username: username, limit: 50 },
    },
  }

  return axios.request<ProfileCalendarCOM>(options)
}

interface UserComment {
  id: number
  body: string
}

export function getCommentUsers() {
  const options = {
    method: 'GET',
    url: commnetUrl,
  }

  return axios.request<UserComment[]>(options)
}
