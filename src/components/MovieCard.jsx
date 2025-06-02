import React from 'react'

const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }) => {
  return (
    <div className='movie-card'>
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : './no-movie.png'}
        alt={title}
        className='movie-poster'
      />

      <div className='mt-4 text-white'>
        <h3>{title}</h3>

        <div className='content'>
          <div className='rating'>
            <img src='star.svg' alt='Star icon' />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>&bull;</span>
          <div className='lang'>
            <p>{original_language ? original_language.toUpperCase() : 'N/A'}</p>
          </div>
          <span>&bull;</span>
          <div className='year'>
            <p>{release_date ? new Date(release_date).getFullYear() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
