import { getRecentACSubmissionsCN } from './api'

const username = 'ni-hao-a-pai-da-xing'

;(async () => {
  const submissions = await getRecentACSubmissionsCN(username)
  console.log(submissions.data)
  // const topics = await getRecentTopics(username)
  // console.log(topics)
})()
