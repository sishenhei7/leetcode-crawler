import { getQuestionListCOM } from './api'
;(async () => {
  const submissions = await getQuestionListCOM()
  console.log(submissions.data.data.problemsetQuestionList.questions.length)
  // const topics = await getRecentTopics(username)
  // console.log(topics)
})()
