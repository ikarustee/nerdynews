import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [paginationRange, setPaginationRange] = useState(8)
  const [error, setError] = useState('')

  useEffect(() => {
    searchResults()
  }, [currentPage])

  // Create a function to get the API
  const searchResults = () => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('http://hn.algolia.com/api/v1/search?query=' + userInput)
      .then((res) => {
        // console.log(res)
        if(res.ok) return res.json()
          throw new Error('Something went wrong.') 
      })
      .then((res) => {
        setArticles(res.hits);
        setIsLoading(false)
      })
      .catch((error) => setError(error.message));
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
          <button type="submit">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4.36289" cy="4.36289" r="3.86289" stroke="currentColor"></circle>
                <rect width="1.09072" height="5.21053" rx="0.545362" transform="matrix(0.707106 -0.707108 0.707106 0.707108 6.54434 7.31555)" fill="currentColor"></rect>
              </svg>
          </button>
        </form>
      </div>
    </div>
    {isLoading ? (
      <div className="searchresults"><Loader /></div>
    ) : articles.length === 0 ? (
      <div className="searchresults">
        <h4>Oooops. No results found. Try again.</h4>
      </div>
    ) : (
      <div className="searchresults">
      {articles
      .map((a) => 
        <article key={a.objectID} className='article'>
          <a href={a.url}>{a.title}</a>
        </article>
      )}
      {/* <Pagination currentPage={currentPage} /> */}
      </div>
    )}

    </div>
  );
}

export default App;

// function Pagination ({currentPage, setCurrentPage, paginationRange, }) {
//   const paginationArray = []

//   if(currentPage < paginationRange / 2) {
//     for (let i = 0; i < paginationArray; i++) {
//       paginationArray.push(0 + i)
//     }
//   } else {
//     for (let i = 0; i < paginationArray; i++) {
//       paginationArray.push(currentPage - paginationRange / 2 + i)
//     }
//   }

//   // console.log(paginationArray)

//   return (
//     <div className="pagination">
//       <p>Page {currentPage}</p>
//       {/* {paginationArray
//       .map(pages)
//       } */}
//     </div>
//   )
// }
