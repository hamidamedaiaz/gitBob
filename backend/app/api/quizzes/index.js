// backend/app/api/quizzes/index.js - Optimized version
const { Router } = require('express')
const { Quiz, Question, Pair } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const QuestionsRouter = require('./questions')
const { buildQuizz, buildQuizzes } = require('./manager')
const fs = require('fs')
const path = require('path')

const router = new Router()

// Helper function to save base64 image to file
const saveBase64Image = (base64String, filename) => {
  if (!base64String || !base64String.includes('base64,')) {
    return null
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../../../uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Extract the base64 data
    const base64Data = base64String.split('base64,')[1]

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${filename || 'image.jpg'}`
    const filepath = path.join(uploadsDir, uniqueFilename)

    // Write the file
    fs.writeFileSync(filepath, base64Data, 'base64')

    // Return the relative path that can be served
    return `/uploads/${uniqueFilename}`
  } catch (error) {
    console.error('Error saving image:', error)
    return null
  }
}

// Sub-route for managing questions related to a quiz
router.use('/:quizId/questions', QuestionsRouter)

// Get all quizzes enriched with questions/pairs/etc.
router.get('/', (req, res) => {
  try {
    const quizzes = buildQuizzes()
    res.status(200).json(quizzes)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Get a specific quiz by ID
router.get('/:quizId', (req, res) => {
  try {
    const quiz = buildQuizz(req.params.quizId)
    res.status(200).json(quiz)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Create a new quiz with its questions and pairs
router.post('/', (req, res) => {
  try {
    const { questions = [], ...quizData } = req.body

    console.log('Creating quiz with data:', quizData)
    console.log('Number of questions to create:', questions.length)

    // 1. Create the quiz without the questions
    const quiz = Quiz.create({ ...quizData })
    console.log('Quiz created with ID:', quiz.id)

    // 2. Add the questions with the correct quizId
    questions.forEach((questionData, index) => {
      console.log(`Creating question ${index + 1}:`, questionData)

      // Extract pairs from question data
      const { pairs = [], ...questionWithoutPairs } = questionData

      // Create the question first
      const question = Question.create({
        ...questionWithoutPairs,
        quizId: quiz.id
      })

      console.log(`Question created with ID: ${question.id}, quizId: ${question.quizId}`)

      // Create pairs for this question
      pairs.forEach((pairData, pairIndex) => {
        console.log(`Creating pair ${pairIndex + 1} for question ${question.id}:`, pairData)

        // Save images and get file paths
        const sourceImagePath = saveBase64Image(
            pairData.sourceImage?.preview,
            pairData.sourceImage?.file?.name
        )
        const targetImagePath = saveBase64Image(
            pairData.targetImage?.preview,
            pairData.targetImage?.file?.name
        )

        // Create pair with file paths instead of base64
        const pair = Pair.create({
          sourceImage: {
            file: sourceImagePath || 'placeholder.jpg',
            preview: sourceImagePath || ''
          },
          targetImage: {
            file: targetImagePath || 'placeholder.jpg',
            preview: targetImagePath || ''
          },
          description: pairData.description || '',
          questionId: question.id
        })

        console.log(`Pair created with ID: ${pair.id}, questionId: ${pair.questionId}`)
      })
    })

    // 3. Return the complete quiz with questions and pairs
    const completeQuiz = buildQuizz(quiz.id)
    console.log('Complete quiz with questions:', completeQuiz)

    res.status(201).json(completeQuiz)
  } catch (err) {
    console.error('Error creating quiz:', err)
    manageAllErrors(res, err)
  }
})

// Update an existing quiz
// Cette route existe déjà dans backend/app/api/quizzes/index.js
router.put('/:quizId', (req, res) => {
  try {
    const { questions, ...quizData } = req.body;

    // Update the quiz basic data
    const updated = Quiz.update(req.params.quizId, quizData);

    // If questions are provided, update them too
    if (questions && Array.isArray(questions)) {
      // ... logic for updating questions
    }

    // Return the updated quiz with all its data
    const completeQuiz = buildQuizz(req.params.quizId);
    res.status(200).json(completeQuiz);
  } catch (err) {
    manageAllErrors(res, err);
  }
});
module.exports = router
