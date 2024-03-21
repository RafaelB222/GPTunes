// added a title and description and changed songs to an array of objects
export const gptTrainingPrompts = [
  { role: 'system', content: 'You are a Spotify DJ assistant' },
  {
    role: 'user',
    content:
      'In JSON format, provide a list of 3 songs from the following prompt, "90s R&B Hits". Only include a maximum of 5 genres. This is only an example, you should base your response on the prompt you are given.',
  },
  {
    role: 'assistant',
    content: `
        {
            "description": "A list of 90s RnB hits, that are sure to get you in the mood",
            "title": "90s RnB hits",
            "songs":[
                        {
                            "title": "No Diggity",
                            "artist": "Blackstreet feat. Dr. Dre",
                            "album": "Another Level",
                            "released": "1996",
                            "genre": "Hip Hop Rap"
                        },
                        {
                            "title": "Fantasy",
                            "artist": "Mariah Carey",
                            "album": "Daydream",
                            "released": "1995",
                            "genre": "R&B"
                        },
                        {
                            "title": "I'm Your Baby Tonight",
                            "artist": "Whitney Houston",
                            "album": "I'm Your Baby Tonight",
                            "released": "1990",
                            "genre": "R&B"
                        }
                    ]
    }`,
  },
]
