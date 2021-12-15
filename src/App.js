import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"
function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Create a function to get the API
  const searchResults = () => {
    // setIsLoading(true)
    setTimeout(() => {
      fetch('http://hn.algolia.com/api/v1/search?query=' + userInput)
      .then((res) => res.json())
      .then((res) => {
        setArticles(res.hits);
        setIsLoading(false)
      });
    }, 2000)
  }
  
  // Get the user input from the input field
  const getUserInput = (e) => {
    e.preventDefault()
    setUserInput(e.target.value)
  }

  // When the user presses 'Enter' or clicks the search button the searchResults() function will be called
  const getSearchResults = (e) => {
    e.preventDefault()
    setIsLoading(true)
    searchResults()
    setUserInput('')
  }
  
  // Loads results initially 
  useEffect(() => {
    setIsLoading(false)
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
    {isLoading ? (
      <div className="searchresults"><Loader /></div>
    ) : (
      <div className="searchresults">
      {articles
      .map((a) => 
        <article key={a.objectID} className='article'>
          <a href={a.url}>{a.title}</a>
        </article>
      )}
      </div>
    )}

    </div>
  );
}

export default App;
