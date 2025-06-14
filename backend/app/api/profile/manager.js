const { Profile } = require('../../models')


const buildProfile = (profileId) => {
  const profile = Profile.getById(profileId)
  return profile
}


const buildProfiles = () => {
  const profiles = Profile.get()
  return profiles.map((profile) => buildProfile(profile.id))
}

module.exports = {
  buildProfile,
  buildProfiles,
}
