import { useState, useContext, useEffect } from 'react';
import axios from '../util/axiosConfig';
import DefaultLayout from '../components/layout/DefaultLayout';
import { AppContext } from '../AppContextProvider';
import { UserContext } from '../UserContextProvider';
import PlaylistResultCard from '../components/playlist-components/PlaylistResultCard';
import { OrangeButton, BlueButton } from '../components/reusables/NewButtons';
import LoadingComponent from '../components/reusables/LoadingComponent';

/**
 * Displays the page for creating a playlist and contains the options for playlist creation.
 * Once a playlist is created the result of this (PlaylistResultCard) is rendered below the
 * input area.
 */
const CreatePlaylistPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [addWeather, setWeather] = useState(false);
  const [addTopGenres, setAddTopGenres] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { BASE_URL, auth, refreshPlaylists, user } = useContext(AppContext);
  const { refreshUserPlaylists, likes } = useContext(UserContext);
  const userLocation = user.location;

  //user wants AI generated image?
  const handleImageChecked = () => {
    setAddImage(!addImage);
  };

  //user wants to include their top genres (uses top genres from playlists they have liked)?
  const handleTopGenresClicked = () => {
    setAddTopGenres(!addTopGenres);
  };

  //retrieves random prompt from 'FeelingLuckyGenerator'
  const handleFeelLucky = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/api/getRandomPrompt`, {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      setPrompt(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  //user wants to include their locations current weather forecast?
  const handleWeatherChecked = () => {
    setWeather(!addWeather);
  };

  //adds top genre information to input prompt
  const handleGenrePromptAddon = async () => {
    const topGenres = await axios
      .get(`${BASE_URL}/user/genres`, {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
        },
      })
      .catch((err) => {
        console.log(err);
      });
    const topGenreString = topGenres.data.join(', ');
    const genrePromptAddOn = `Here are the users top liked genres to take into consideration: ${topGenreString}`;
    return genrePromptAddOn;
  };

  //handles submission of prompts
  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let genreAddon = '';
      if (addTopGenres) {
        genreAddon = await handleGenrePromptAddon();
      }

      // check if the prompt is understandable
      const promptValidationResponse = await axios
        .post(
          `${BASE_URL}/playlist/understandable`,
          { prompt },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .catch((error) => {
          setLoading(false);
          setShowCard(false);
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          } else {
            setErrorMessage('Something went wrong when validating the prompt. Please try again.');
            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          }
        });

      if (!promptValidationResponse) {
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/playlist/create`,
        { prompt: `${prompt}. ${genreAddon}.`, addImage, userLocation, addWeather },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
            'Content-Type': 'application/json',
          },
        },
      );

      //refresh all information on page
      if (response.status === 201) {
        refreshPlaylists();
        refreshUserPlaylists();
        setResponse(response);
        setShowCard(true);
        setErrorMessage('');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setShowCard(false);
      setErrorMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  // ghost typing effect for the input field
  const [currentPrompt, setCurrentPrompt] = useState('');

  // example prompts for ghost typing
  const examplePrompts = [
    'Create a playlist for Andrew when he gives the Heavenly Herons an A+',
    'Create a playlist of songs that make me feel like a superhero',
    'Make a playlist for a zombie apocalypse survival',
    'Create a playlist to sing along in the shower',
    'Make a playlist for a time-traveling adventure',
    'Create a playlist for cooking a gourmet meal',
    'Make a playlist for a dance-off battle',
    'Create a playlist for an alien encounter',
    'Make a playlist for a chill day with my pet',
    'Create a playlist for a 90s themed party',
    'Make a playlist for a detective solving mysteries',
  ];

  const [index, setIndex] = useState(0);
  const [userFocused, setUserFocused] = useState(false);

  // so that it types out the entire prompt before moving on to the next one
  const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  useEffect(() => {
    if (userFocused) {
      setIndex(0);
      setCurrentPrompt('');
      return; // stop when focused in input
    }

    let isCancelled = false;

    const typePrompt = async (index, charIndex) => {
      if (isCancelled) return; // cancels when the user has text in the input

      const examplePrompt = examplePrompts[index];

      // timing for the typing effect
      if (charIndex < examplePrompt.length) {
        setCurrentPrompt(examplePrompt.slice(0, charIndex + 1));
        await wait(50);
        typePrompt(index, charIndex + 1);
      } else {
        await wait(2000);
        setCurrentPrompt('');
        setIndex((prevIndex) => (prevIndex + 1) % examplePrompts.length);
        typePrompt((index + 1) % examplePrompts.length, 0);
      }
    };

    typePrompt(index, 0);

    return () => {
      isCancelled = true;
    };
  }, [index, userFocused]);

  return (
    <DefaultLayout>
      <div className='bg-themeNavy pt-16 pb-16'>
        <div className='w-screen lg:p-40'>
          <div className='mx-4 px-4 py-8 bg-themePalePink rounded-lg max-w-3xl sm:container sm:mx-auto'>
            <h1 className='text-2xl text-themeNavy mb-4'>Playlist prompt:</h1>
            <form onSubmit={handleSubmitPrompt}>
              <div className='flex flex-col mb-4'>
                <input
                  id='prompt'
                  type='text'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setUserFocused(true)}
                  onBlur={() => setUserFocused(false)}
                  className='border-2 border-themeMidPink rounded-md py-2 px-3 w-full transition duration-300 ease-in-out hover:border-themeMidBlue opacity-80 hover:opacity-100 focus:opacity-100 bg-themePalePink text-themeNavy'
                  placeholder={currentPrompt}
                />
              </div>
              <div className='flex flex-col mb-10'>
                <div>
                  <input
                    id='imageOption'
                    type='checkbox'
                    value={addImage}
                    onChange={handleImageChecked}
                  />
                  <label className=' text-themeOrange ml-2' htmlFor='imageOption'>
                    Generate a playlist image?
                  </label>
                </div>
                <div>
                  <input
                    id='weatherOption'
                    type='checkbox'
                    value={addWeather}
                    onChange={handleWeatherChecked}
                    className='text-gray-950'
                  />
                  <label className='text-themeOrange ml-2' htmlFor='weatherOption'>
                    Add your current weather to your prompt?
                  </label>
                </div>
                <div>
                  {likes.length > 0 && (
                    <input
                      id='genreOption'
                      type='checkbox'
                      value={addTopGenres}
                      onChange={handleTopGenresClicked}
                      className='text-gray-950'
                    />
                  )}
                  {likes.length > 0 && (
                    <label className='text-themeOrange ml-2' htmlFor='genreOption'>
                      Take your top genres into consideration?
                    </label>
                  )}
                </div>
              </div>
              <div className='flex items-center'>
                <OrangeButton
                  type='submit'
                  disabled={loading}
                  onClick={handleSubmitPrompt}
                  className='bg-themeMidPink hover:bg-themePalePink text-white font-bold py-2 px-4 rounded mx-10'
                  style={{ minWidth: '120px' }}
                  buttonText={loading ? 'Please wait...' : 'Go'}
                />

                <div className='mx-10'>
                  <BlueButton buttonText='Feeling lucky?' action={handleFeelLucky} type='button' />
                </div>
              </div>
            </form>
            {errorMessage && (
              <div className=''>
                <p className='text-red-500'>{errorMessage}</p>
              </div>
            )}
          </div>
          {loading && (
            <div className='flex justify-center items-center h-full mt-4'>
              <LoadingComponent />
            </div>
          )}
          <div className='items-center'>
            {!loading && showCard && response && <PlaylistResultCard playlist={response.data} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreatePlaylistPage;
