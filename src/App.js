import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')
  const [hitsPerPage, setHitsPerPage] = useState(12)
  const [activePage, setActivePage] = useState(0)

  // Initial fetch
  useEffect(() => {
    setTimeout(() => {
      fetch(`https://hn.algolia.com/api/v1/search?query=${userInput}&hitsPerPage=${hitsPerPage}&page=${activePage}`)
      .then((res) => {
        if(res.ok) {
          return res.json()
        } else {
          throw new Error(res.status)
        }
      })
      .then((res) => setArticles(res.hits))
    }, 1000)
  }, [activePage])

  const getResults = () => {
    fetch(`https://hn.algolia.com/api/v1/search?query=${userInput}&hitsPerPage=${hitsPerPage}&page=${activePage}`)
    .then((res) => {
      if(res.ok) {
        return res.json()
      } else {
        throw new Error(res.status)
      }
    })
    .then((res) => setArticles(res.hits))
    .catch((error) => console.log(error.message))
  }

  const getUserInput = (e) => {
    e.preventDefault()
    // console.log(e.target.value)
    setUserInput(e.target.value)
  }

  const getSearchResults = (e) => {
    e.preventDefault()
    getResults()
    setUserInput('')
  }

  const changePage = (ind) => {
    setActivePage(ind)
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
          name="userquery"
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
      <Pagination activePageIndex={activePage} changePage={changePage}/>
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
      <li key={a.objectID}>{a.title}</li>
      )}
    </div>
  )
}

function Pagination({ activePageIndex, changePage }) {
  return (
    <>
      {[...Array(10)].map((p, i) => {
        const ind = activePageIndex > 5 ? activePageIndex - 5 + i : i;
        return (
          <button
            onClick={() => changePage(ind)}
            className={`page ${ind === activePageIndex ? 'active' : ''}`}
          >
            {ind}
          </button>
        );
      })}
    </>
  );
}
