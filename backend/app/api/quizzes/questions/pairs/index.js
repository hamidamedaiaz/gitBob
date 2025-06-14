const { Router } = require('express')
const { Pair } = require('../../../../models')
const manageAllErrors = require('../../../../utils/routes/error-management')
const { buildPair } = require('./manager')

const router = new Router({ mergeParams: true }) // pour accéder à :questionId

// Obtenir toutes les paires d’une question
router.get('/', (req, res) => {
    try {
        const questionId = req.params.questionId
        const pairs = Pair.get().filter(p => p.questionId === questionId)
        res.status(200).json(pairs)
    } catch (err) {
        manageAllErrors(res, err)
    }
})

// Obtenir une seule paire
router.get('/:pairId', (req, res) => {
    try {
        const pair = Pair.getById(req.params.pairId)
        res.status(200).json(pair)
    } catch (err) {
        manageAllErrors(res, err)
    }
})

// Créer une paire
router.post('/', (req, res) => {
    try {
        const questionId = req.params.questionId
        const pair = Pair.create({ ...req.body, questionId })
        res.status(201).json(pair)
    } catch (err) {
        manageAllErrors(res, err)
    }
})

// Modifier une paire
router.put('/:pairId', (req, res) => {
    try {
        const updated = Pair.update(req.params.pairId, req.body)
        res.status(200).json(updated)
    } catch (err) {
        manageAllErrors(res, err)
    }
})

// Supprimer une paire
router.delete('/:pairId', (req, res) => {
    try {
        Pair.delete(req.params.pairId)
        res.status(204).end()
    } catch (err) {
        manageAllErrors(res, err)
    }
})

module.exports = router
