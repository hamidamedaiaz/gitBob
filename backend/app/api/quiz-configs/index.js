const { Router } = require('express')
const { QuizConfig } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')

const router = new Router()


router.get('/', (req, res) => {
  try {
    const quizConfigs = QuizConfig.get()
    res.status(200).json(quizConfigs)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.get('/:quizConfigId', (req, res) => {
  try {
    const config = QuizConfig.getById(req.params.quizConfigId)
    res.status(200).json(config)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.post('/', (req, res) => {
  try {
    const newConfig = QuizConfig.create({ ...req.body })
    res.status(201).json(newConfig)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.put('/:quizConfigId', (req, res) => {
  try {
    const updated = QuizConfig.update(req.params.quizConfigId, req.body)
    res.status(200).json(updated)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:quizConfigId', (req, res) => {
  try {
    QuizConfig.delete(req.params.quizConfigId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
