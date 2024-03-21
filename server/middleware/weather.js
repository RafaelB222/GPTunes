import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const apiKey = process.env.WEATHER_API_KEY

export const getWeatherDescription = async (userLocation) => {
  try {
    const searchOption = await getSearchOptions(userLocation)
    const currentWeatherData = await fetchWeatherData(searchOption)
    return currentWeatherData
  } catch (error) {
    console.error('Error getting Weather Data')
    return error
  }
}
const getSearchOptions = async (userSearchValue) => {
  try {
    let firstLocation
    await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${userSearchValue}&limit=5&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        firstLocation = data[0]
      })
    return firstLocation
  } catch (error) {
    console.error('Error getting Weather Data')
    return error
  }
}

const fetchWeatherData = async (userLocation) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}&units=metric&appid=${apiKey}`
    )
    const currentWeatherData = response.data.list[0].weather[0].description
    return currentWeatherData
  } catch (error) {
    console.error('Error getting Weather Data')
    return error
  }
}
