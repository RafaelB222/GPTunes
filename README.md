## **Disclaimer** I was not the only person contributing to this project. I was responsible for handling anything to do with Spotify account integraton, playlist creation, playlist export to Spotify, and session management in the backend. 

# project-group-heavenly-herons
CS732/SE750 group repository for the Heavenly Herons
<br>
# **GPT**unes
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
To get GPTunes running, we need to run a few commands to add the necessary dependencies and scripts:
Run the following command in BOTH the Client folder and Server folder

```npm install```

To also get the relevant API keys and URLs for the app to fetch properly, we need to create an env file. We must create an env file in both the Client side and Server side.

Create an .env file by Right-clicking client, adding a new file and naming it ".env". In the front end we want to add the following:

```sh
VITE_API_BASE_URL = http://localhost:3001
VITE_IMAGE_BASE_URL = http://localhost:3001/
```

This will serve as the URL for the server/backend and is necessary for fetching, routing and database related code.

Now create a second .env file in the Server side, naming it ".env". In the backend we want to add the following

Note: removed for privacy

**We understand that it is crucial that these keys are kept secret and not shared, however for the purpose of this assignment, we are publishing it here as the repo is private.**

OpenAI API uses API keys for authentication. You can use your own API keys if you would like, however we have provided our one (under Free Trial).

https://platform.openai.com/docs/api-reference

After navigating to 'api-keys', you will need to generate an API key and insert the key into the .env file above. 

<br>

To run GPTunes, run the following commands in the command line:
Alternatively, if you are running npmscripts, click the following buttons:
**Client side:**

```
npm run dev
```

**Server side:**

```
npm start
```

Once you have the application up and running and have created or logged into an account, you can connect to a Spotify profile by clicking the 'Edit your account' button from your dashboard and selecting 'Connect to Spotify'.


**Connecting to Spotify:** *Spotify has a rule where it will review applications for deployment and this process can take up to 6 weeks. These apps are generally ready-to-deploy and commercial. For the purpose of this assignment, we kept the WebApp within the Spotify-For-Developers environment, which only allows you to connect your Spotify to this WebApp if you have specific permissions.*

*Therefore, please connect the application to Spotify using this account for test purposes. If you are already logged into Spotify on your own computer, you will need to log out.*

  ```
  Spotify Account
  Email: heavenlyherons@gmail.com
  Password: project732
  ```
<b>DISCLAIMER: IF THE PERSON MARKING OR REVIEWING THIS PROJECT HAS ALREADY CONNECTED TO SPOTIFY, YOU WILL SEE THAT IT HAS ALREADY BEEN CONNECTED.</b>

## Existing Users
Here are some existing users and playlists you can view/search for:
* Ash Ketchum
* Professor Oak
* Brock
* Rocket Jessie
* Rocket James
* Misty




## Notes
* If multiple people are viewing/marking the application, all images from other users and their playlists will not be viewable as only the image url is stored in the database.
* We are aware that it will sometimes fail to create a playlist, this is due to limitations with text-davinci-003. If we were to fine tune the model it would always give the correct output and fail less, however it would cost alot more. We have tried our best to make sure that inputs will always lead to some sort of output, but can only do so much with the model we are using.

Created by: Heavonly Herons
- Arielle Bautista
- Rafael Buck
- Reuben Ford
- Melissa McFadzien
- Mikayla Piercy
- Seo Joon Yoon
