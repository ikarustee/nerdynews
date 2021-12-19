import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')

  // Initial fetch
  useEffect(() => {
    fetch(`http://hn.algolia.com/api/v1/search_by_date?query=`)
    .then((res) => res.json())
    .then((res) => setArticles(res.hits))
  }, [])

  const getUserInput = (e) => {
    e.preventDefault()
    setUserInput(e.target.value)
  }

  const getSearchResults = (e) => {
    e.preventDefault()
  }

  return (
    <div className="App">
    <div className="hn-header">
      <h3>Hackernews</h3>
      <div className="searchform">
        <form onSubmit={getSearchResults} >
          <input
          onChange={getUserInput}
          value={userInput}
          type="text"
          placeholder="Search ..."
          />
          <button type="submit">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4.36289" cy="4.36289" r="3.86289" stroke="currentColor"></circle>
                <rect width="1.09072" height="5.21053" rx="0.545362" transform="matrix(0.707106 -0.707108 0.707106 0.707108 6.54434 7.31555)" fill="currentColor"></rect>
              </svg>
          </button>
        </form>
      </div>
      <Articles articles={articles} />
    </div>
    </div>
  );
}

export default App; 

function Articles({articles}) {
  return (
    <div className="articles">
      {articles
      .map((a) => 
      <li key={a.objectID}>{a.story_title}</li>
      )}
    </div>
  )
}