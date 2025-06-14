const { Router } = require('express')
const { Question } = require('../../../models')
const manageAllErrors = require('../../../utils/routes/error-management')
const PairsRouter = require('./pairs')
const { buildQuestion } = require('./manager')

const router = new Router({ mergeParams: true }) // mergeParams pour accéder à :quizId

// Sous-route : /quizzes/:quizId/questions/:questionId/pairs
router.use('/:questionId/pairs', PairsRouter)

// Récupérer toutes les questions d’un quiz (avec leurs paires)
router.get('/', (req, res) => {
  try {
    const { quizId } = req.params
    const questions = Question.get().filter((q) => q.quizId === quizId)
    const enriched = questions.map((q) => buildQuestion(q.id))
    res.status(200).json(enriched)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Récupérer une seule question avec ses paires
router.get('/:questionId', (req, res) => {
  try {
    const question = buildQuestion(req.params.questionId)
    res.status(200).json(question)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Créer une question
router.post('/', (req, res) => {
  try {
    const { quizId } = req.params
    const question = Question.create({ ...req.body, quizId })
    res.status(201).json(question)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Modifier une question
router.put('/:questionId', (req, res) => {
  try {
    const updated = Question.update(req.params.questionId, req.body)
    res.status(200).json(updated)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Supprimer une question
router.delete('/:questionId', (req, res) => {
  try {
    Question.delete(req.params.questionId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
