import React from 'react';
import './App.css';

const formatValue = (value) => {
  if (value === null || value === "null") {
    return <span className="text-gray-400 italic">Not specified</span>;
  }
  if (Array.isArray(value)) {
    return value.join(', ') || <span className="text-gray-400 italic">None</span>;
  }
  return value;
};

export default function SearchParameters({ searchParams }) {
  if (!searchParams || typeof searchParams !== 'object') return null;

  return (
    <div className="search-container">
      <h3 className="search-title">Search Parameters</h3>

      <div className="search-grid">
        <div className="search-card">
          <h4 className="section-title">Location</h4>
          <div className="section-content">
            <div>
              <span className="label">ZIP Code</span>
              <div className="value">{formatValue(searchParams.zipCode)}</div>
            </div>
            <div>
              <span className="label">Search Radius</span>
              <div className="value">
                {formatValue(searchParams.searchRadiuse)} miles
              </div>
            </div>
          </div>
        </div>

        <div className="search-card">
          <h4 className="section-title">Vehicle Details</h4>
          <div className="section-content">
            <div>
              <span className="label">Make</span>
              <div className="value">{formatValue(searchParams.make)}</div>
            </div>
            <div>
              <span className="label">Model</span>
              <div className="value">{formatValue(searchParams.model)}</div>
            </div>
            <div>
              <span className="label">Trim</span>
              <div className="value">{formatValue(searchParams.trim)}</div>
            </div>
            <div>
              <span className="label">Class Series</span>
              <div className="value">{formatValue(searchParams.classSeries)}</div>
            </div>
          </div>
        </div>

        <div className="search-card full-width">
          <h4 className="section-title">Listing Preferences</h4>
          <div className="section-grid">
            <div>
              <span className="label">Listing Types</span>
              <div className="value">{formatValue(searchParams.listingTypes)}</div>
            </div>
            <div>
              <span className="label">Drive Groups</span>
              <div className="value">{formatValue(searchParams.driveGroups)}</div>
            </div>
            <div>
              <span className="label">Price Ranges</span>
              <div className="value">{formatValue(searchParams.priceRanges)}</div>
            </div>
            <div>
              <span className="label">Deal Types</span>
              <div className="value">{formatValue(searchParams.dealTypes)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
