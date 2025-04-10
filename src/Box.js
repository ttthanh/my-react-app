import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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
                        {message.text} {message.index}
                    </div> : null
                ))}
                <div ref={messagesEndRef} />
            </div>
        
    );
}