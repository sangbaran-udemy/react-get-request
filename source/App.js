import React, {useState, useEffect, useCallback, useRef} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies , setMovies] = useState([]);
  const [isLoading, setIsLoading] =  useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  /*const dummyMovies = [
    {
      id: 1,
      title: 'Some Dummy Movie',
      openingText: 'This is the opening text of the movie',
      releaseDate: '2021-05-18',
    },
    {
      id: 2,
      title: 'Some Dummy Movie 2',
      openingText: 'This is the second opening text of the movie',
      releaseDate: '2021-05-19',
    },
  ];*/  

  const fetchMoviesHandler = useCallback(async () =>  {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films');
      // The commented belopw request is giving a 401 due to the incorrect API Key..
      /*const response = await fetch('https://api.bing.microsoft.com/v7.0/search?' + new URLSearchParams({
        q: inputRef.current.value}),
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Ocp-Apim-Subscription-Key': '6038ad3f-5913-47c3-8a99-48aea979bf8b'
        }});*/
      
      if(!response.ok) {
        //console.log(inputRef.current.value);
        console.log(response.status, response.statusText);
        throw Error('Something went wrong..');
      }

      const data = await response.json();

      const transformedMovies = data.results.map(movieData => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            releaseDate: movieData.release_date,
            openingText: movieData.opening_crawl
          };        
        });
        setMovies(transformedMovies);        
    } catch(error) {
      setError(error.message);
    }
    setIsLoading(false);    
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <input type="search" ref={inputRef} placeholder='Ask about anything..' maxLength={1000}></input>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>        
      </section>
      <section>
        {isLoading && <p>Loading Movies...</p>}
        {!isLoading && error===null && movies.length === 0 && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;