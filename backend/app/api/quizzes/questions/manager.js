const { Quiz, Question } = require('../../../models')
const { filterPairsFromQuestion } = require('./pairs/manager')
const NotFoundError = require('../../../utils/errors/not-found-error')

/**
 * Questions Manager.
 * This file contains all the logic needed by the question routes.
 */

/**
 * filterQuestionsFromQuizz.
 * This function filters among the questions to return only the questions linked with the given quizId.
 * @param quizId
 */
const filterQuestionsFromQuizz = (quizId) => {
  const questions = Question.get()
  const parsedId = parseInt(quizId, 10)
  console.log(`Filtering questions for quizId: ${parsedId}`)
  console.log(`Total questions in database: ${questions.length}`)

  const filtered = questions.filter((question) => question.quizId === parsedId)
  console.log(`Found ${filtered.length} questions for quiz ${parsedId}`)

  return filtered
}

/**
 * getQuestionFromQuiz.
 * This function retrieves a question from a quiz. It will throw a not found exception if the quizId in the question is different from the one provided in parameter.
 * @param quizId
 * @param questionId
 */
const getQuestionFromQuiz = (quizId, questionId) => {
  // Check if quizId exists, if not it will throw a NotFoundError
  const quiz = Quiz.getById(quizId)
  const quizIdInt = parseInt(quizId, 10)
  const question = Question.getById(questionId)
  if (question.quizId !== quizIdInt) {
    throw new NotFoundError(`Question id=${questionId} was not found for quiz id=${quiz.id} : not found`)
  }
  return question
}

/**
 * buildQuestion.
 * This function builds a complete question with all its pairs.
 * @param {string|number} questionId - The question ID
 * @returns {object} - Question enriched with pairs
 */
const buildQuestion = (questionId) => {
  console.log(`Building question with ID: ${questionId}`)
  const question = Question.getById(questionId)
  if (!question) {
    throw new Error(`Question with id ${questionId} not found`)
  }

  const pairs = filterPairsFromQuestion(question.id)
  console.log(`Found ${pairs.length} pairs for question ${questionId}`)

  return { ...question, pairs }
}

module.exports = {
  filterQuestionsFromQuizz,
  getQuestionFromQuiz,
  buildQuestion
}
