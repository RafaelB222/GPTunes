/* eslint-disable no-undef */
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../User.js'
import { PlaylistItem } from '../PlaylistItem'

let mongod

const users = [
  {
    _id: '000000000000000000000001',
    first_name: 'Mojo',
    last_name: 'Jojo',
    email: 'mojojojo@cartoonnetwork.com',
    password: 'evil',
    following: [],
    location: 'Townsville',
    spotify_refresh_token: '',
    spotify_id: '',
    image_url: 'image1.jpg',
  },
  {
    _id: '000000000000000000000002',
    first_name: 'Scooby',
    last_name: 'Doo',
    email: 'scoobydoo@snax.com',
    password: 'food',
    following: [],
    location: 'Crystal Cove',
    spotify_refresh_token: '',
    spotify_id: '',
    image_url: 'image2.jpg',
  },
]

const comments = [
  {
    _id: '000000000000000000000001',
    playlist: '000000000000000000000001',
    author: '000000000000000000000001',
    content: 'Such good songs!',
  },
  {
    _id: '000000000000000000000002',
    playlist: '000000000000000000000001',
    author: '000000000000000000000002',
    content: 'The second song is my favourite',
  },
]

const playlistItems = [
  {
    _id: '000000000000000000000001',
    playlist: '000000000000000000000001',
    title: 'Axel F',
    artist: 'Crazy Frog',
    album: 'Crazy Frog Album',
    released: '2002',
    genre: 'kids bop',
  },
  {
    _id: '000000000000000000000002',
    playlist: '000000000000000000000001',
    title: 'Goofy Goober Rock',
    artist: 'Spongebob Squarepants',
    album: 'Spongebob Greatest Hits',
    released: '2008',
    genre: 'kids bop',
  },
  {
    _id: '000000000000000000000003',
    playlist: '000000000000000000000001',
    title: 'Poi E',
    artist: 'Patea Maori Club',
    album: 'NZ Classics',
    released: '1900',
    genre: 'nz',
  },
]

const playlist = {
  _id: '000000000000000000000001',
  user: '000000000000000000000001',
  prompt: 'Songs for an evil genius',
  title: 'Taking over Townsville',
  description: 'Big brains build empires',
  likes: [],
  playlist_image: 'playimage.jpg',
  songs: [{ ...playlistItems }],
  comments: [{ ...comments }],
}

//prep db for test data
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const connectionUri = mongod.getUri()
  await mongoose.connect(connectionUri)
})

beforeEach(async () => {
  //clear all existing data
  await mongoose.connection.db.dropDatabase()

  // create user collection and insert user
  const userCollection = await mongoose.connection.db.createCollection(
    'users-test'
  )
  await userCollection.insertMany(users)

  //create playlist collection and insert playlist
  const playlistCollection = await mongoose.connection.db.createCollection(
    'playlists-test'
  )
  await playlistCollection.insertOne(playlist)

  //create playlistitems collection and insert playlist items
  const playlistItemCollection = await mongoose.connection.db.createCollection(
    'playlistitems-test'
  )
  await playlistItemCollection.insertMany(playlistItems)

  //create comments collection and insert comments
  const commentsCollection = await mongoose.connection.db.createCollection(
    'comments-test'
  )
  await commentsCollection.insertMany(comments)
})

/**
 * Test that User data can be obtained using User model
 */
it('retrieves all users', async () => {
  const dbUsers = await User.find()
  expect(dbUsers.length).toBe(2)

  //check properties match
  for (let i = 0; i < dbUsers.length; ++i) {
    expect(dbUsers[i]._id).toEqual(users[i]._id)
    expect(dbUsers[i].first_name).toEqual(users[i].first_name)
    expect(dbUsers[i].last_name).toEqual(users[i].last_name)
    expect(dbUsers[i].email).toEqual(users[i].email)
    expect(dbUsers[i].password).toEqual(users[i].password)
    expect(dbUsers[i].location).toEqual(users[i].location)
    expect(dbUsers[i].image_url).toEqual(users[i].image_url)
  }
})

/**
 * Test that PlaylistItem data can be obtained using PlaylistItem model
 */
it('retrieves all playlist items', async () => {
  const dbPlaylistItems = await PlaylistItem.find()
  expect(dbPlaylistItems.length).toBe(2)

  //check properties match
  for (let i = 0; i < dbPlaylistItems.length; ++i) {
    expect(dbPlaylistItems[i]._id).toEqual(playlistItems[i]._id)
    expect(dbPlaylistItems[i].playlist).toEqual(playlistItems[i].playlist)
    expect(dbPlaylistItems[i].title).toEqual(playlistItems[i].title)
    expect(dbPlaylistItems[i].artist).toEqual(playlistItems[i].artist)
    expect(dbPlaylistItems[i].album).toEqual(playlistItems[i].album)
    expect(dbPlaylistItems[i].released).toEqual(playlistItems[i].released)
    expect(dbPlaylistItems[i].genre).toEqual(playlistItems[i].genre)
  }
})

//after all, terminate in-memory db
afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})
