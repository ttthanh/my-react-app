import React, { useState, useEffect, useRef } from 'react';
import Box from './Box'
import { Bedrock } from '@lobehub/icons';
import SearchParameters from './SearchParameters';
import SearchParametersJSON from './SearchParametersJSON';

export default function ChatBox() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState("");
  const [messagesData, setMessagesData] = useState([]);

  const [sessionId, setSessionId] = useState("");
  const [searchParams, setSearchParams] = useState({});

  const inputRef = useRef(null);

  // Generate sessionId on mount
  useEffect(() => {
    setSessionId(Date.now().toString());
  }, []);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const callAiBedRock = async (dataInput) => {
    try {

      // const conversationContext = messagesData
      //   .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
      //   .join("\n");
  
      // const fullPrompt = `${conversationContext}\nUser: ${dataInput}`;
      
      // const dataRequest = {
      //   session_id: sessionId,
      //   question: fullPrompt,
      // };
  
      // const response = await fetch(
      //   "https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/question-agent-knowledge",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(dataRequest),
      //   }


      // );

      const response = await fetch(
        `https://38wy08u9o4.execute-api.us-east-1.amazonaws.com/main/buddy-bot?question=${dataInput}&sessionID=${sessionId}`
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      const body = result.body;
      // const body = JSON.parse(result.body);

      // setMessagesData((prev) => [
      //   ...prev,
      //   { text: body["Answer"], sender: "bot" },
      //   ...(body["url"] ? [{ text: body["url"], sender: "bot" }] : []),
      // ]);

      // setMessagesData((prev) => [
      //   ...prev,
      //   { text: body.data, sender: 'bot' },
      //   ...(body.data_extract
      //     ? [
      //         {
      //           text:
      //             typeof body.data_extract === 'string'
      //               ? JSON.parse(body.data_extract)
      //               : body.data_extract,
      //           sender: 'bot',
      //         },
      //       ]
      //     : []),
      // ]);

      const newMessages = [{ text: body.data, sender: 'bot' }];

      if (body.data_extract) {
        const parsedData =
          typeof body.data_extract === 'string'
            ? JSON.parse(body.data_extract)
            : body.data_extract;
  
        newMessages.push({ text: parsedData, sender: 'bot' });
  
        setSearchParams(parsedData);
      }
  
      setMessagesData((prev) => [...prev, ...newMessages]);

      
      console.log("messagesData", messagesData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

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
      setMessagesData([...messagesData, { text: message, sender: "user" }]);
      setMessage("");
      setLoading(true);
      callAiBedRock(message);

      //setMessagesData([...messagesData, { text: formResponse, sender: 'sever' }]);
      // Simulate response (replace with your actual API call)
      /* setTimeout(() => {
            setMessages(prev => [...prev, { text: "This is a response", sender: 'bot' }]);
          }, 500); */
    }
  };

  const handleReset = () => {
        setMessagesData([]);
        setLoading(false);
        setSessionId(Date.now().toString()); // Start a fresh session
      };

  
   // Format value function to handle arrays, null values, etc.
   const formatValue = (value) => {
    if (value === null || value === "null") {
      return <span className="text-gray-400 italic">Not specified</span>;
    }
    if (Array.isArray(value)) {
      return value.join(', ') || <span className="text-gray-400 italic">None</span>;
    }
    return value;
  };
      
  return (

    <div className="resource-container">
      
      <SearchParameters searchParams={searchParams} />

      <SearchParametersJSON data={messagesData} />

      <div className="greeting">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-title">ChatBot Assistant</div>
          </div>

          <div className="chat-header-info">
            <Bedrock size={180} />;
            <div className="header-line-1"> Welcome To </div>
            <div className="header-line-2"> Ask BedRock AI </div>
            <div className="header-line-3"> You name it, We Have it </div>
          </div>

          <Box messages={messagesData} loading={loading} />

          <div className="text-chat-box">
            <input
              ref={inputRef}
              className="message-input"
              disabled={loading}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a question or response here..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
            />

            <button onClick={handleReset} className="reset-btn">
              Reset
            </button>

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
                  strokeWidth="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


