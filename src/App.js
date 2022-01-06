import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from 'react-bootstrap/Pagination';
import logo from './n-logo.jpg'

const API_URL = 'https://hn.algolia.com/api/v1/search?'

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hitsPerPage] = useState(8)
  const [activePage, setActivePage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Initial fetch
  useEffect(() => {
    setIsLoading(true)

    const url = userInput 
    ? `${API_URL}query=${userInput}&hitsPerPage=${hitsPerPage}&page=${activePage}`
    : `${API_URL}tags=front_page&hitsPerPage=${hitsPerPage}&page=${activePage}`
    setTimeout(() => {
      fetch(url)
      .then((res) => {
        if(res.ok) {
          return res.json()
        } else {
          throw new Error(res.status)
        }
      })
      .then((res) => {
        setArticles(res.hits)
        setTotalPages(res.nbPages)
        setIsLoading(false)
      })
      .catch((error) => console.log(error))
    }, 1000)
  }, [activePage, userInput, hitsPerPage, totalPages])

  const changePage = (index) => {
    setActivePage(index)
    window.scrollTo(0,0)
  }

  return (
    <div className="App">
    <div className="hn-header">
    <a href="/" className="home" alt="home logo">
      <img src={logo} alt="logo"></img>
      <h3>Nerdynews</h3>
    </a>
      <Search getQuery={(userInput) => setUserInput(userInput)} setActivePage={setActivePage} />
    </div>
    <main>
      <Articles articles={articles} isLoading={isLoading} activePage={activePage} hitsPerPage={hitsPerPage} />
      <Pagination className="custom-pn">
        <Pagination.First onClick={() => setActivePage(0)} disabled={activePage === 0 ? true : false}/>
        <Pagination.Prev onClick={() => setActivePage(activePage - 1)} disabled={activePage === 0 ? true : false} />
        {[...Array(9)].map((_, index) => {
          const offset = activePage > 4 ? activePage - 4 + index : index 
          if(offset >= totalPages) return null

          return (
            <Pagination.Item 
            onClick={() => changePage(offset)}
            key={index + 1}
            active={offset === activePage}
            >
            {offset + 1}
            </Pagination.Item>
          )
        })
}
        <Pagination.Next onClick={() => setActivePage(activePage + 1)} disabled={activePage === totalPages - 1 ? true : false}/>
        <Pagination.Last onClick={() => setActivePage(totalPages - 1)} disabled={activePage === totalPages - 1 ? true : false}/>
      </Pagination>
    </main>
    </div>
  );
}

export default App; 

function Search({getQuery, setActivePage}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const searchTerm = e.target.userquery.value
    if(searchTerm) {
      getQuery(searchTerm)
      e.target.userquery.value = ''
      setActivePage(0)
    } else {
      alert('Please enter a search term e.g. Obama')
    }
  }
  return (
    <div className="searchform">
    <form onSubmit={handleSubmit} >
      <input
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
  )
}

function Articles({articles, isLoading, activePage, hitsPerPage}) {
  return (
    <div className="articles">
    {isLoading ? (
      <div className="searchresults"><Loader /></div>
    ) : articles.length === 0 ? (
      <div className="searchresults">
        <h4>Oooops. No results found. Try again.</h4>
      </div>
    ) : (
      <div className="searchresults">
      {articles
      .map((a, index) => 
        <div key={a.objectID} className='article'>
          <span className="rank">
            {activePage === 0 ? index + 1 + '. ' : index + 1 + activePage * hitsPerPage + '. ' }
          </span>
          <span className="article__info">
            <a href={a.url} alt={a.title} target="_blank" rel="noopener noreferrer">{a.title || a.story_title}</a><br/>
            <span className="subtext">{a.points} points by {a.author} hours ago</span>
          </span>
        </div>
      )}
      </div> 
    )}
    </div>
  )
}