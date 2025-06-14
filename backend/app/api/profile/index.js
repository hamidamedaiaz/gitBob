const { Router } = require('express')

const { Profile } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const { buildProfile, buildProfiles } = require('./manager')

const router = new Router()


router.get('/', (req, res) => {
  try {
    const profiles = buildProfiles()
    res.status(200).json(profiles)
  } catch (err) {
    console.log(err)
    manageAllErrors(res, err)
  }
})

router.get('/:profileId', (req, res) => {
  try {
    const profile = buildProfile(req.params.profileId)
    console.log(req.params.profileId)
    res.status(200).json(profile)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.post('/', (req, res) => {
  try {
    const profile = Profile.create({ ...req.body })
    res.status(201).json(profile)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.put('/:profileId', (req, res) => {
  try {
    const updatedProfile = Profile.update(req.params.profileId, req.body)
    res.status(200).json(updatedProfile)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:profileId', (req, res) => {
  try {
    Profile.delete(req.params.profileId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
