import React from 'react';

export default function SearchParametersJSON({ data }) {
    if (!data) return null;
  
    return (
      <div className="bg-gray-900 text-green-300 p-4 rounded-lg text-sm font-mono shadow-lg overflow-x-auto max-h-96">
        <h3 className="text-lg text-white font-bold mb-2">API Response</h3>
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }
  
