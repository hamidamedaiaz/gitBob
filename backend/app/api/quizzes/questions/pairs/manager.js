const { Pair } = require('../../../../models')

/**
 * Enrichit une paire (exemple : on pourrait rajouter des relations plus tard).
 */
const buildPair = (pairId) => {
    return Pair.getById(pairId)
}

/**
 * filterPairsFromQuestion.
 * This function filters pairs that belong to a specific question.
 * @param {string|number} questionId - The question ID
 * @returns {Array} - Array of pairs belonging to the question
 */
const filterPairsFromQuestion = (questionId) => {
    const pairs = Pair.get()
    const parsedId = parseInt(questionId, 10)
    console.log(`Filtering pairs for questionId: ${parsedId}`)
    console.log(`Total pairs in database: ${pairs.length}`)

    const filtered = pairs.filter((pair) => pair.questionId === parsedId)
    console.log(`Found ${filtered.length} pairs for question ${parsedId}`)

    return filtered
}

module.exports = {
    buildPair,
    filterPairsFromQuestion
}
