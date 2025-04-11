import React, { useState, useEffect, useRef } from 'react';
import './App.css';


// Function to convert text with URLs to React elements with clickable links
const formatTextWithLinks = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/)?([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[a-zA-Z0-9]{2,}(\/[-a-zA-Z0-9%_.~#?&=]*)?/g;
    
    if (!urlRegex.test(text)) {
      return text;
    }
    
    urlRegex.lastIndex = 0;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = urlRegex.exec(text)) !== null) {
        // Add text before the URL
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.substring(lastIndex, match.index)
          });
        }
        
        // Prepare the URL - add https:// if missing
        const urlText = match[0];
        const fullUrl = urlText.startsWith('http') ? urlText : `https://${urlText}`;
        
        // Add the URL
        parts.push({
          type: 'link',
          url: fullUrl,
          content: urlText // Display original text
        });
        
        lastIndex = match.index + match[0].length;
      }
    
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return <span key={`text-${index}`}>{part.content}</span>;
      } else {
        return (
          <a
            key={`link-${index}`}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {part.content}
          </a>
        );
      }
    });
  };

export default function Box({ messages }) {

    const messagesEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Runs whenever messages change

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        
            <div className="messages-container">
                {messages.map((message, index) => (
                    // filter blank messages respone from chat-bot
                    message && message.text ? 
                    <div key={index} className={`message ${message.sender}`}>
                        {formatTextWithLinks(message.text)}
                    </div> : null
                ))}
                <div ref={messagesEndRef} />
            </div>
        
    );
}