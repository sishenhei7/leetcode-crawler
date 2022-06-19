import axios from 'axios'
import config from '../config'

const { siteCN, siteCOM, commnetUrl } = config

interface RecentACSubmissionsCN {
  data: {
    recentACSubmissions: {
      submissionId: number
      submitTime: number
      question: {
        questionFrontendId: string
        titleSlug: string
        translatedTitle: string
      }
    }[]
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

interface QuestionListCOM {
  data: {
    problemsetQuestionList: {
      total: number
      questions: {
        frontendQuestionId: string
        title: string
        titleSlug: string
        acRate: number
        difficulty: string
      }[]
    }
  }
}

export function getQuestionListCOM() {
  const options = {
    method: 'POST',
    url: siteCOM,
    headers: {},
    data: {
      query:
        '\n    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList: questionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total: totalNum\n    questions: data {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId: questionFrontendId\n      isFavor\n      paidOnly: isPaidOnly\n      status\n      title\n      titleSlug\n      topicTags {\n        name\n        id\n        slug\n      }\n      hasSolution\n      hasVideoSolution\n    }\n  }\n}\n    ',
      variables: { categorySlug: '', filters: {}, skip: 0, limit: 20000 },
    },
  }

  return axios.request<QuestionListCOM>(options)
}

interface UserComment {
  id: number
  body: string
}

export function getGithubCommentUsers() {
  const options = {
    method: 'GET',
    url: commnetUrl,
  }

  return axios.request<UserComment[]>(options)
}
