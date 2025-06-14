const { Router } = require('express')
const { Theme } = require('../../models')

const router = new Router()
const manageAllErrors = require('../../utils/routes/error-management')


router.get('/', (req, res) => {
  try {
    const themes = Theme.get()
    res.status(200).json(themes)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.get('/:themeId', (req, res) => {
  try {
    const theme = Theme.getById(req.params.themeId)
    res.status(200).json(theme)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.post('/', (req, res) => {
  try {
    const theme = Theme.create(req.body)
    res.status(201).json(theme)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.put('/:themeId', (req, res) => {
  try {
    const updatedTheme = Theme.update(req.params.themeId, req.body)
    res.status(200).json(updatedTheme)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.delete('/:themeId', (req, res) => {
  try {
    Theme.delete(req.params.themeId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
