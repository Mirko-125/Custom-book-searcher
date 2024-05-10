import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [indexValue, setIndexValue] = useState(0);
  const [fieldValue, setFieldValue] = useState('title');
  const [queryValue, setQueryValue] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const navigate = useNavigate();
  
  const handleIndex = () => {
    fetch('http://localhost:8080/index', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        setIndexValue(data.index);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const handleSearch = () => {
    const requestBody = {
      term: queryValue,
      field: fieldValue,
      page: pageNumber
    };

    fetch('http://localhost:8080/search', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const results = data;
        sessionStorage.setItem('results', JSON.stringify(results));
        navigate('/results');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>For search y'all</h1>
      <div className="card">
        <button onClick={handleIndex}>
          Index = {indexValue}
        </button>
      </div>
      <div>
        <div>
          <p className="read-the-docs">
            Search 🔎
          </p>
          <input type="text" placeholder="Search...📖" onChange={(e) => setQueryValue(e.target.value)} />
          <button onClick={handleSearch}>
            Search it!
          </button>
        </div>
        <div className="next-to-each-other">
          <p className="read-the-docs">Field</p>
          <select onChange={(e) => setFieldValue(e.target.value)}>
              <option value="title">title</option>
              <option value="body">body</option>
              <option value="modification_date">modification_date</option>
          </select>
        </div>
      </div>
      <p className="read-the-docs">
        Don't click on the Vite and React logos, they are not the main attraction now
      </p>
      <footer>
        Made with ❤ by Mirko
      </footer>
    </>
  )
}

export default App
