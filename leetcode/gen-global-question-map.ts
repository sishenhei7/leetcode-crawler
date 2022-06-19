/**
 * 由于全球服后端不会返回问题id，只会返回问题的titleSlug，所以需要查询一下titleSlug和id的对应关系。
 * 原则上不需要太频繁更新，每周一次即可
 */
import { getQuestionListCOM } from './api'
import { readFile, writeFile } from './utils'

interface QuestionItemCOM {
  frontendQuestionId: string
  title: string
  titleSlug: string
  acRate: number
  difficulty: string
}

;(async () => {
  const path = '../data/question-map-com.json'
  const obj = {}

  const questionList = await getQuestionListCOM()
  questionList.data.data.problemsetQuestionList.questions.forEach(item => {
    obj[item.titleSlug] = {
      frontendQuestionId: item.frontendQuestionId,
      title: item.title,
      titleSlug: item.titleSlug,
      acRate: item.acRate,
      difficulty: item.difficulty,
    }
  })

  writeFile(path, obj)
})()
