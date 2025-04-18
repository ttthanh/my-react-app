import React, { useState, useEffect, useRef } from 'react';
import './App.css';


// Function to convert text with URLs to React elements with clickable links
const formatTextWithLinks = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    const linkPattern = /(.+):\s*<(https?:\/\/[^>]+)>/;
    const listItemPattern = /^- (.+):\s*<(https?:\/\/[^>]+)>$/;
    const bracketedUrlPattern = /^<(https?:\/\/[^>]+)>$/;
    
    // Handle list items with links
    if (listItemPattern.test(line)) {
      const match = listItemPattern.exec(line);
      const [_, description, url] = match;
      
      return (
        <div key={`line-${lineIndex}`} className="link-list-item">
          <span>- {description}: </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {url}
          </a>
        </div>
      );
    }
    // Handle regular description: <url> patterns
    else if (linkPattern.test(line)) {
      const match = linkPattern.exec(line);
      const [_, description, url] = match;
      
      return (
        <div key={`line-${lineIndex}`}>
          <span>{description}: </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {url}
          </a>
        </div>
      );
    }
    // Handle URLs that are just <url> by themselves
    else if (bracketedUrlPattern.test(line)) {
      const match = bracketedUrlPattern.exec(line);
      const url = match[1];
      
      return (
        <div key={`line-${lineIndex}`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {url}
          </a>
        </div>
      );
    }
    // Process lines with embedded URLs
    else {
      // Look for standalone URLs or URLs in angle brackets within text
      const combinedRegex = /<(https?:\/\/[^>]+)>|(https?:\/\/[^\s<]+)/g;
      if (!combinedRegex.test(line)) {
        return <div key={`line-${lineIndex}`}>{line}</div>;
      }
      
      combinedRegex.lastIndex = 0;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = combinedRegex.exec(line)) !== null) {
      
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        
        const url = match[1] || match[2];
        
        parts.push({
          type: 'link',
          url: url,
          text: match[0] 
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text after the last URL
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      // Render all parts
      return (
        <div key={`line-${lineIndex}`}>
          {parts.map((part, partIndex) => 
            typeof part === 'string' ? 
              <span key={`part-${partIndex}`}>{part}</span> :
              <a
                key={`part-${partIndex}`}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {part.text}
              </a>
          )}
        </div>
      );
    }
  });
};


export default function Box({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // also scroll when loading changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


   // Render message content, handling text and nested object like body.data
   const renderMessageContent = (message) => {
    if (typeof message.text === 'string') {
      return message.text.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      ));
    }

    if (message.text && message.text.data) {
      return message.text.data.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      ));
    }

    return null;
  };


  return (
    <div className="messages-container">

      {/* Render messages */}
      {messages.map((msg, index) => {
        const messageContent = renderMessageContent(msg);
        return messageContent ? (
          <div key={index} className={`message ${msg.sender}`}>
            {messageContent}
          </div>
        ) : null;
      })}

      {loading && (
        <div className="message bot">
          <span className="typing-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}