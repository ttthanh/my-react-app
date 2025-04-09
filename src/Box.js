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
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}