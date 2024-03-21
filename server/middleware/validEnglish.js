import nlp from 'compromise'
import sw from 'stopword'
import checkWord from 'check-word'

export function isInputUnderstandable(sentence) {
  const doc = nlp(sentence)
  const tokens = doc
    .text()
    .split(' ')
    .map((word) => word.toLowerCase())
  const cleanedTokens = sw.removeStopwords(tokens)

  // must have between 1 and 200 words
  if (tokens.length < 1 || tokens.length > 200) {
    return false
  }

  // check the proportion of words like "the", "a", "an"
  const stopwordRatio = cleanedTokens.length / tokens.length
  if (stopwordRatio < 0.1) {
    return false
  }

  // check for ratio of English words, we need at least 50% so that the sentence is understandable to ChatGPT
  const words = checkWord('en')
  let englishWordCount = 0
  for (let i = 0; i < cleanedTokens.length; i++) {
    if (words.check(cleanedTokens[i])) {
      englishWordCount++
    } else {
      // remove non-noun words from the array
      const index = tokens.indexOf(cleanedTokens[i])
      if (index !== -1) {
        tokens.splice(index, 1)
      }
    }
  }
  const nounCount = doc.nouns().length
  const properNounCount =
    doc.match('#Person').length +
    doc.match('#Place').length +
    doc.match('#Organization').length
  const englishWordRatio = englishWordCount / cleanedTokens.length
  if (englishWordRatio < 0.5) {
    return false
  }

  const adjectiveCount = doc.adjectives().length
  const firstNameCount = doc.match('#FirstName').length
  const lastNameCount = doc.match('#LastName').length
  const organizationCount = doc.match('#Organization').length
  const placeCount = doc.match('#Place').length
  console.log(
    'nounCount: ' + nounCount,
    'adjectiveCount: ' + adjectiveCount,
    'properNounCount: ' + properNounCount,
    'firstNameCount: ' + firstNameCount,
    'lastNameCount: ' + lastNameCount
  )

  if (
    nounCount +
      adjectiveCount +
      properNounCount +
      firstNameCount +
      organizationCount +
      placeCount +
      lastNameCount <
    1
  ) {
    return false
  }

  return true
}
