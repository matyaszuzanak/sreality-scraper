import React, { useState, useEffect } from 'react';
import './App.css';

const ITEMS_PER_PAGE = 50;

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:5001/api/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("There was an error fetching data", error));
  }, []);

  useEffect(()=>{
    window.scrollTo({top: 0});
  },[currentPage])

  const endIndex = currentPage * ITEMS_PER_PAGE;
  const startIndex = endIndex - ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, endIndex);

  const renderSquare = (data) => {
    return (
        <div key={data.title} className="square-box">
          <div className="square-title">
            <div className="col-12 inline-block">
              <span>{data.title}</span>
            </div>
          </div>

          <img src={data.image_url}/>
        </div>
    );
  };

  const renderGridContainer = (data) => {
    return (
        renderSquare(data)
    );
  };

  return (
    <>
      <div className="grid-container">
        {currentItems && currentItems.map((item, index) => (renderGridContainer(item)))}
      </div>

      <div className="col-12">
        <nav aria-label="navigation" className="navigation">
          <ul className="pagination">
            {[...Array(Math.ceil(data.length / ITEMS_PER_PAGE)).keys()].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default App;

