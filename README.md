## **Disclaimer** I was not the only person contributing to this project. I was responsible for handling anything to do with Spotify account integraton, playlist creation, playlist export to Spotify, and session management in the backend. 

<br>
# GPTunes
GPTunes utilises a combination of emerging technologies to create playlists based on user prompts. GPTunes makes use of AI image generation, Natural Language Processing, Spotify and Weather APIs, to create unique one-of-a-kind playlists.This web app most notably utilises OpenAI models and the Spotify API to allow users to create curated or random playlists based on their input prompts, which can then be exported to Spotify. 


## Key Features
* Generate playlists from custom prompts provided to ChatGPT
* Have Dall-E generate a custom playlist image for your AI-generated playlist
* Have your top genres taken into consideration during playlist creation
* Have your weather taken into consideration during playlist creation
* Create your own account and save your playlists
* Follow other users and like their playlists. Feel free to leave a comment on them too!
* Connect to your Spotify account and export any playlist to your own Spotify account.
* Search for other users and playlists


## Getting Started
**This project will not function without the .env configuration holding the necessary API keys. This file and the API keys have not been shared for security reasons.**

## Notes
* If multiple people are viewing/marking the application, all images from other users and their playlists will not be viewable as only the image url is stored in the database.
* We are aware that it will sometimes fail to create a playlist, this is due to limitations with text-davinci-003. If we were to fine tune the model it would always give the correct output and fail less, however it would cost alot more. We have tried our best to make sure that inputs will always lead to some sort of output, but can only do so much with the model we are using.

Created by:
- Arielle Bautista
- Rafael Buck
- Reuben Ford
- Melissa McFadzien
- Mikayla Piercy
- Seo Joon Yoon
