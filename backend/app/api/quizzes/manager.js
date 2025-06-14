const { Quiz } = require('../../models')
const { filterQuestionsFromQuizz } = require('./questions/manager')
const { filterPairsFromQuestion } = require('./questions/pairs/manager')

/**
 * Construit un quiz complet avec toutes ses questions et paires.
 * @param {string|number} quizId - L'identifiant du quiz.
 * @returns {object} - Quiz enrichi avec questions et paires.
 * @throws {Error} - Si le quiz n'existe pas.
 */
const buildQuizz = (quizId) => {
  console.log(`Building quiz with ID: ${quizId}`)
  const quiz = Quiz.getById(quizId)
  if (!quiz) {
    throw new Error(`Quiz with id ${quizId} not found`)
  }

  const questions = filterQuestionsFromQuizz(quiz.id)
  console.log(`Found ${questions.length} questions for quiz ${quizId}`)

  const questionsWithPairs = questions.map((question) => {
    console.log(`Getting pairs for question ${question.id}`)
    const pairs = filterPairsFromQuestion(question.id)
    return { ...question, pairs }
  })

  const result = { ...quiz, questions: questionsWithPairs }
  console.log(`Built complete quiz:`, result)
  return result
}

/**
 * Récupère tous les quiz enrichis.
 * @returns {object[]} Liste des quiz avec questions et paires.
 */
const buildQuizzes = () => {
  const quizzes = Quiz.get()

  return quizzes
      .map((quiz) => {
        try {
          return buildQuizz(quiz.id)
        } catch (err) {
          console.warn(`Erreur lors de la construction du quiz ${quiz.id}: ${err.message}`)
          return null
        }
      })
      .filter((quiz) => quiz !== null)
}

module.exports = {
  buildQuizz,
  buildQuizzes,
}
