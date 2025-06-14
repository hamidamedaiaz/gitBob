
const { Router } = require('express')
const ThemeRouter = require('./themes')
const QuizConfigRouter = require('./quiz-configs')

const router = new Router()


router.get('/status', (req, res) => res.status(200).json('ok'))

router.use('/profiles', require('./profile'))
router.use('/quizzes', require('./quizzes'))
router.use('/questions', require('./quizzes/questions'))
router.use('/pairs', require('./quizzes/questions/pairs'))

router.use('/themes', ThemeRouter)
router.use('/quiz-configs', QuizConfigRouter)

module.exports = router
