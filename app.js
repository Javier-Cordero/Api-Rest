const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./Schema/movies')
const app = express()
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234']
        if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true)
        if (!origin) return callback(null, true)
        return callback(new Error('Invalid origin'))
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.disable('x-powered-by')
app.get('/movies', async (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies)
    }
    res.json(movies)
})
app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})
app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})
app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(404).json({ error: 'Movie not found' })
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(404).json({ error: 'Movie not found' })
    movies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted successfully' })
})
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => console.log(`server listening on port http://localhost:${PORT}`))