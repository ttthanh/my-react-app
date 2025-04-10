import React, { useState, useEffect } from 'react';
import Box from './Box'

export default function ChatBox() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const [message, setMessage] = useState("");
    const [messagesData, setMessagesData] = useState([]);

    const callAiBedRock = async (dataInput) => {
        try {
            const dataRequest = {
                question: dataInput
            }
            const response = await fetch('https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/question-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRequest),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const body = JSON.parse(result.body);
          
            setMessagesData(prev => {
                return [...prev, 
                    { text: body["Answer"], sender: 'bot' },
                    { text: body["url"], sender: 'bot' }];
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/question-agent', {
    //                 method: 'POST',
    //                 headers: {
    //                   'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(formData),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const result = await response.json();
    //             const body = JSON.parse(result.body);
    //             console.log(body)
    //             setData(body["Answer"]);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []); // Empty dependency array means this runs once on mount

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (message.trim()) {
          setMessagesData([...messagesData, { text: message, sender: 'user' }]);
          setMessage('');
          setLoading(true);
          callAiBedRock(message);
          
          //setMessagesData([...messagesData, { text: formResponse, sender: 'sever' }]);
          // Simulate response (replace with your actual API call)
          /* setTimeout(() => {
            setMessages(prev => [...prev, { text: "This is a response", sender: 'bot' }]);
          }, 500); */
        }
    };

    

    return (
      <div className="greeting">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-title">AI ChatBot Assistant</div>
          </div>

          <Box messages={messagesData} />

          <div className="text-chat-box">
            <input
              className="message-input"
              disabled={loading}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a question or response here..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
            />

            <button disabled={loading} onClick={handleSendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M3.06452 8.99999L1.28108 15.6879C1.17086 16.1012 1.59689 16.4531 1.98198 16.2668L16.0698 9.45007C16.4461 9.26799 16.4461 8.73199 16.0698 8.54991L1.98198 1.73321C1.5969 1.54688 1.17086 1.89877 1.28108 2.31212L3.06452 8.99999ZM3.06452 8.99999H10.8065"
                  stroke="white"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
}