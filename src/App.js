import './App.css';
import {useState, useEffect} from "react"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserinput] = useState('')
  const [spinner, setSpinner] = useState(false)
  
  const searchResults = () => {
    fetch("https://hn.algolia.com/api/v1/search?query=" + userInput)
    .then((res) => res.json())
    .then((res) => {
      setArticles(res.hits)
      setSpinner(false)
    })
  }
  const handleSearch = (event) => {
    event.preventDefault()
    searchResults()
    setUserinput('')
  }
  useEffect(() => {
    setSpinner(true)
    searchResults()
  }, [])
  
  // Get the user input
  const updateUserInput = (e) => {
    setUserinput(e.target.value)
  }

  // Define the function for the form
  // invoke search results function
  // empty the input field


  return (
    <div className="App">
    <div className='filterbar'>Hacker News new | past | comments | ask | show | jobs | submit</div>
    <form onSubmit={handleSearch}>
      <input 
        type="text"
        onChange={updateUserInput}
        value={userInput}
        placeholder='Search for ...'
      />
      <button type="submit">Search news</button>
    </form>
    <div className='articles'>
      <ol>
      {articles
      .map((article) => 
        <li key={article.objectID}>{article.title}</li>
      )}
      </ol>
    </div>
    </div>
  );
}

export default App;
