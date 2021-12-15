import './App.css';
import {useState, useEffect} from "react"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')

  // Create a function to get the API
  const searchResults = () => {
    fetch('http://hn.algolia.com/api/v1/search?query=' + userInput)
    .then((res) => res.json())
    .then((res) => setArticles(res.hits))
  }
  
  // Get the user input from the input field
  const getUserInput = (e) => {
    e.preventDefault()
    setUserInput(e.target.value)
  }

  // When the user presses 'Enter' or clicks the search button the searchResults() function will be called
  const getSearchResults = (e) => {
    e.preventDefault()
    searchResults()
    setUserInput('')
  }

  // Loads results initially 
  useEffect(() => {
    searchResults()
  }, [])
    
  return (
    <div className="App">
    <div className="hn-header">
      <h3>Hackernews</h3>
      <div className="searchform">
        <form onSubmit={getSearchResults}>
          <input
          onChange={getUserInput}
          value={userInput}
          type="text"
          placeholder="Search ..."
          />
          <button type="submit">Go!</button>
        </form>
      </div>
    </div>
    <div className="searchresults">
    {articles
    .map((a) => 
      <article key={a.objectID} className='article'>
        <a href={a.url}>{a.title}</a>
      </article>
    )}
    </div>
    </div>
  );
}

export default App;
