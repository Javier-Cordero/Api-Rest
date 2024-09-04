import { randomUUID } from 'crypto'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const movies = require('../movies.json')
export class MovieModel {
    static getAll = async ({ genre }) => {
        if (genre) return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return movies;
    }
    static getById = async ({ id }) => {
        const movie = movies.find(movie => movie.id === id);
        return movie
    }
    static create = async ({ input }) => {
        const newMovie = {
            id: randomUUID(),
            ...input
        }
        movies.push(newMovie)
        return newMovie
    }
    static update = async ({ id, input }) => {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false
        movies[movieIndex] = { ...movies[movieIndex], ...input }
        return movies[movieIndex]
    }
    static delete = async ({ id }) => {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false
        movies.splice(movieIndex, 1)
        return true
    }
}