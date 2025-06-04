import { useState, useEffect, lazy } from 'react'
import SearchBar from './components/SearchBar'
import Spinner from './components/Spinner'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const MovieCard = lazy(() => import('./components/MovieCard'))

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [movies, setMovies] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingError, setTrendingError] = useState('')
  const [trendingLoading, setTrendingLoading] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setErrorMsg('')

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setMovies(data.results || [])

      if (query && data.results.length > 0) {
        // Optionally, you can update the search count in your database here
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setErrorMsg('Failed to fetch movies. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const loadTrendingMovies = async () => {
    setTrendingLoading(true)
    setTrendingError('')

    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
      setTrendingError('Failed to fetch trending movies. Please try again later.')
    } finally {
      setTrendingLoading(false)
    }
  }

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movie</span> You'll Enjoy Without the Hassel
          </h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='mt-[20px]'>Trending Movies</h2>
            <ul>
              {trendingLoading ? (
                <Spinner />
              ) : trendingError ? (
                <p className='text-red-500'>{trendingError}</p>
              ) : trendingMovies.length > 0 ? (
                trendingMovies.map((movie, idx) => (
                  <li key={movie.id}>
                    <p>{idx + 1}</p>
                    <img src={movie.poster_url} alt='' />
                  </li>
                ))
              ) : (
                <p>No trending movies found.</p>
              )}
            </ul>
          </section>
        )}
        <div className='all-movies'>
          <h2>All Movies</h2>
          <div className='movies-list'>
            {loading ? (
              <Spinner />
            ) : errorMsg ? (
              <p className='text-red-500'>{errorMsg}</p>
            ) : movies.length > 0 ? (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
