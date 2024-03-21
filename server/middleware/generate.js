import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import sharp from 'sharp'
import { gptTrainingPrompts } from '../data/gptTrainingPrompts.js'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import { StatusCodes } from 'http-status-codes'

dotenv.config()

/* OPENAI SETUP */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const generate = async (prompt) => {

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 2048,
    temperature: 0.6,
    messages: [
      ...gptTrainingPrompts,
      {
        role: 'user',
        content:
          'In the same format, provide a list of 10 songs from the following prompt: ' +
          prompt,
      },
    ],
  })

  const content = response.data.choices[0].message.content
  if (content.includes('Error')) {
   
    throw new Error(content)
  }

  const trimmedContent = content.slice(content.indexOf('{'))
  const data = JSON.parse(trimmedContent)

  return data
}

export const generateImage = async (prompt, id) => {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    })

    if (response.status === 200) {
      const imageUrl = response.data.data[0].url
      const imageData = await fetch(imageUrl)
      const blob = await imageData.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const imageBuffer = Buffer.from(arrayBuffer)
      const promptSnippet = prompt.replace(/[\s']/g, '').slice(0, 8)
      const imageName = id + uuid() + promptSnippet + '.png'
      const dbImagePath = `public/images/${imageName}`
      const imagePath = `./public/images/${imageName}`

      // Save the image to disk
      await sharp(imageBuffer)
        .png()
        .toFile(imagePath)
        .catch((error) => {
          console.log(error)
        })

      return dbImagePath
    } else {
      console.log('Error:', response.status, response.statusText)
      throw new Error(response.statusText)
    }
  } catch (error) {
    console.log('Error:', error)
    throw error
  }
}

//Retrieves a random prompt from JSON list
export const getRandomPrompt = async (req, res) => {
  try {
    const jsonString = fs.readFileSync(
      './data/FeelingLuckyPrompts.json',
      'utf8'
    )
    const randomPromptsList = JSON.parse(jsonString)
    const randomIndex = Math.floor(Math.random() * randomPromptsList.length)
    const randomPrompt = randomPromptsList[randomIndex].prompt
  
    res.status(200).json(randomPrompt)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err })
  }
}
