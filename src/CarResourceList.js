import { useState, useEffect } from 'react';
import './CarResourceList.css'; // Import the CSS file

export default function CarResourceList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/s3-list');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.body);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-title">Error loading data</p>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-container">
        No data available
      </div>
    );
  }

  return (
    <div className="resource-container">
      <h1 className="page-title">Car Resource Directory</h1>
      
      <div className="resource-grid">
        <div className="resource-card">
          <div className="card-header autotrader-header">
            <h2 className="card-title">Autotrader</h2>
          </div>
          <div className="card-content">
            {data.autotrader && data.autotrader.map((categoryData, index) => (
              <div key={index} className="category">
                <h3 className="category-title">
                  {categoryData.category}
                </h3>
                <ul className="link-list">
                  {categoryData.list_article.map((link, linkIndex) => (
                    <li key={linkIndex} className="link-item">
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

  
        <div className="resource-card">
          <div className="card-header kbb-header">
            <h2 className="card-title">Kelly Blue Book</h2>
          </div>
          <div className="card-content">
            {data.kbb && data.kbb.map((categoryData, index) => (
              <div key={index} className="category">
                <h3 className="category-title">
                  {categoryData.category.replace('kbb_', '')}
                </h3>
                <ul className="link-list">
                  {categoryData.list_article.map((link, linkIndex) => (
                    <li key={linkIndex} className="link-item">
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}