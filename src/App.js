import './App.css';
import {useState, useEffect} from "react"
import Loader from "./components/Loader"

function App() {
  const [articles, setArticles] = useState([])
  const [userInput, setUserInput] = useState('tesla')
  const [isLoading, setIsLoading] = useState(false)
  const [hitsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Initial fetch
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      fetch(`https://hn.algolia.com/api/v1/search?query=${userInput}&hitsPerPage=${hitsPerPage}&page=${activePage}`)
      .then((res) => {
        if(res.ok) {
          return res.json()
        } else {
          throw new Error(res.status)
        }
      })
      .then((res) => {
        setArticles(res.hits)
        //console.log(res.nbHits)
        setTotalPages(res.nbPages)
        // console.log(res.nbPages)
        setIsLoading(false)
      })
    }, 1000)
  }, [activePage, userInput, hitsPerPage, totalPages])

  // const getResults = () => {
  //   setIsLoading(true)
  //   fetch(`https://hn.algolia.com/api/v1/search?query=${userInput}&hitsPerPage=${hitsPerPage}`)
  //   .then((res) => {
  //     if(res.ok) {
  //       return res.json()
  //     } else {
  //       throw new Error(res.status)
  //     }
  //   })
  //   .then((res) => {
  //     setArticles(res.hits)
  //     setIsLoading(false)
  //   })
  //   .catch((error) => console.log(error.message))
  // }

  // const getUserInput = (e) => {
  //   e.preventDefault()
  //   // console.log(e.target.value)
  //   setUserInput(e.target.value)
  // }

  // const getSearchResults = (e) => {
  //   e.preventDefault()
  //   getResults()
  //   setUserInput('')
  // }

  const changePage = (ind) => {
    setActivePage(ind)
    window.scrollTo(0,0)
  }

  return (
    <div className="App">
    <div className="hn-header">
      <h3>Hackernews</h3>
      <Search getQuery={(userInput) => setUserInput(userInput)} setActivePage={setActivePage} />
    </div>
    <main>
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
      .map((a) => 
        <article key={a.objectID} className='article'>
          <li key={a.objectID}><a href={a.url} alt={a.title}>{a.title || a.story_title}</a></li>
        </article>
      )}
      </div> 
    )}
    </div>
      <Pagination 
      activePageIndex={activePage} 
      changePage={changePage} 
      setActivePageIndex={setActivePage} 
      setTotalPages={totalPages} 
      />
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
      // console.log(searchTerm)
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

// function Articles({articles}) {
//   return (
//     <div className="articles">
//       <article>
//       {articles
//       .map((a) => 
//         <li key={a.objectID}><a href={a.url} alt={a.title}>{a.title}</a></li>
//       )}
//       </article>
//     </div>
//   )
// }

function Pagination({ activePageIndex, changePage, setActivePageIndex, setTotalPages }) {
  // nbHits

  return (
    <>
    <div className="pagination">
    <p>Total pages: {setTotalPages}</p>
      {activePageIndex === 0 ? (
        <button className="page disabled">&#5176;</button>
      ) : (
        <button onClick={() => setActivePageIndex(activePageIndex - 1)} className="page arrow">&#5176;</button>
      )} 
      {[...Array(10)].map((p, i) => {
        /* Offset on pagination*/
        const ind = activePageIndex > 5 ? activePageIndex - 5 + i : i;
        return (
            <button
              onClick={() => changePage(ind)}
              className={`page ${ind === activePageIndex ? 'active' : ''}`}
              key={i}
            >
              {ind + 1}
            </button>
        );
      })}
      {activePageIndex === activePageIndex.length - 1 ? (
        <button className="page disabled">&#5171;</button>
      ) : (
        <button onClick={() => setActivePageIndex(activePageIndex + 1)} className="page arrow">&#5171;</button>
      ) }
    </div>
    </>
  );
}
