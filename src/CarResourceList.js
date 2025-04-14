import { useState, useEffect } from "react";
import "./CarResourceList.css";

export default function CarResourceList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/s3-list"
        );
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
    return <div className="empty-container">No data available</div>;
  }

  // Utility to format section titles
  const formatTitle = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Utility to convert link slugs to human-readable titles
  const getTitleFromURL = (link) => {
    try {
      const urlPath = new URL(link).pathname;
      const slugPart = urlPath.split("/").filter(Boolean).pop();
      return slugPart
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch {
      return link; // fallback in case URL parsing fails
    }
  };

  return (
    <div className="resource-container">
      <h1 className="page-title">Car Resource Directory</h1>
      <div className="resource-grid">
        {Object.entries(data).map(([key, sections], idx) => (
          <div className="resource-card" key={idx}>
            <div className={`card-header ${key}-header`}>
              <h2 className="card-title">{formatTitle(key)}</h2>
            </div>
            <div className="card-content">
              {sections.map((categoryData, index) => (
                <div key={index} className="category">
                  <h3 className="category-title">
                    {categoryData.category.replace(`${key}_`, "")}
                  </h3>
                  <ul className="link-list">
                    {categoryData.list_article.map((link, linkIndex) => (
                      <li key={linkIndex} className="link-item">
                        <a href={link}>{getTitleFromURL(link)}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
