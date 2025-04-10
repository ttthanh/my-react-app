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
            <Box messages={messagesData}/>
            <div className="text-chat-box">
                <input disabled={loading} type="text" value={message} onChange={(e) => setMessage(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}/>
                <button disabled={loading} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}