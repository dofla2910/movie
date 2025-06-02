import { useState } from 'react'
import SearchBar from './components/SearchBar'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movie</span> You'll Enjoy Without the Hassel
          </h1>
        </header>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <h1 className='text-white text-3xl'>{searchTerm}</h1>
      </div>
    </main>
  )
}

export default App
