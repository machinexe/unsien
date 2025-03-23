import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import { clearChat1Side } from "../utils/APIRoutes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteMessage } from "../utils/APIRoutes";

// import { fetchPreKeyBundle, storePreKeyBundle } from "../utils/APIRoutes";


import { faTrashAlt, faBroom, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ChatContainer({ currentChat, currentUser, socket, signalProtocolManagerUser }) {
  // const signalProtocolManager = useContext(SignalProtocolContext);

  // const signalProtocolManager = useContext(SignalProtocolContext);
  // console.log("signalProtocolManager in chat", signalProtocolManager)

  // console.log(currentUser, signalProtocolManagerUser)
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate();
  const [messageId, setMessageId] = useState('');

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (currentChat) { 
          
        const response = await axios.post(recieveMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });

          // Get decrypted messages from local storage
          const storedDecryptedMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};

          // Update decrypted messages based on fetched messages
          const updatedDecryptedMessages = { ...storedDecryptedMessages };

          response.data.forEach((msg, index) => {
            // Check if the message content indicates it has been deleted
            if (msg.message === "Message has been deleted.") {
              console.log(updatedDecryptedMessages[index])
              updatedDecryptedMessages[index].message = "Message has been deleted.";

             
                // console.log(updatedDecryptedMessages[index])
        
            }
          });


          const updatedMessagesArray = Object.values(updatedDecryptedMessages);
          setMessages(updatedMessagesArray);
          // // Update local storage with the updated decrypted messages
          // localStorage.setItem('chatMessages', JSON.stringify(updatedDecryptedMessages));

        }

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChat) {
      fetchData();

    }

  }, [currentChat, currentUser._id]);

  // Load messages from local storage on component mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);
  }, []);

  // Store messages in local storage whenever messages state changes
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  
    const handleSendMsg = async (msg) => {

      // Encrypt the message using the SignalProtocolManager
      const encryptedMessage = await signalProtocolManagerUser.encryptMessageAsync(currentChat._id, msg);
     
      const stringifyEncryptedMessage = JSON.stringify(encryptedMessage);
      const response = await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: stringifyEncryptedMessage,
        });

      // Store the messageId in the component's state
      setMessageId(response.data.messageId);

      console.log("send msg:", stringifyEncryptedMessage);
      if (socket) {
        socket.emit("send-msg", {
          from: currentUser._id,
          to: currentChat._id,   
          msg: stringifyEncryptedMessage,
        });
      } else {
        console.error("Socket is not connected");
      }

      // console.log('msg in frondend: ', response.data.messageId);

      // Update messages state with sent message
      const newMessage = { _id: response.data.messageId, fromSelf: true, message: msg, createdAt: new Date().toISOString() };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      
    };


  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", async (msg) => {
        console.log("Received message from:", msg.from);
        // Check if the message is from a different user
        if (msg.from !== currentUser._id) {
          try {
            // Decrypt the message using the sender's ID
            let decryptedMessage = await signalProtocolManagerUser.decryptMessageAsync(msg.from, JSON.parse(msg.msg));
            // Update UI with decrypted message
            setArrivalMessage({ fromSelf: false, message: decryptedMessage, createdAt: new Date().toISOString() });
          } catch (error) {
            console.error("Error decrypting message:", error);
          }
        } else {
          console.log("Received message from self, skipping decryption.");
        }
      });
    }
  }, []);

  
  // Update messages state when a new arrival message is received
  useEffect(() => {
    arrivalMessage && setMessages(prevMessages => [...prevMessages, arrivalMessage]);
  }, [arrivalMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChatClick = async () => {
    try {
      // Make a delete request to the back-end
      await axios.post(clearChat1Side, {
        from: currentUser._id,
        to: currentChat._id,
      } );

      // Update the local messages state to remove the deleted messages
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleBackClick = () => {
    navigate('/'); // Navigate to the '/previous-page' route
  };

  const handleDeleteClick = async (message, index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].message = "Message has been deleted.";
    setMessages(updatedMessages);

    try {
        await axios.delete(deleteMessage, {
        data: message
      });

      // Message was successfully deleted
      // console.log('Message deleted');
 
    } catch (error) {
      // Error deleting the message
      console.error('Error deleting message:', error.response ? error.response.status : error);
    }
    setShowRequest(false); // Show the form

  };

  const [showRequest, setShowRequest] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const clickRequest = (message, index) => {
    setCurrentSelected(index);
    setSelectedMessage(message);
    setShowRequest(true); // Show the form

  };



    return (
        <Container>
          <div className="chat-header">
          <button className="backBtn" onClick={handleBackClick}> <FontAwesomeIcon icon={faArrowLeft} /> </button>

            <div className="user-details">

              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
          <button className="clearBtn" onClick={handleClearChatClick}> <FontAwesomeIcon icon={faBroom} /></button>

          </div>

          <div className="chat-messages"> 
            {messages.map((message, index) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${message.fromSelf ? "sended" : "recieved"
                      }`}
                   
                  >
                    <div className="content ">
                      <p>{message.message}</p>
                     <div className="message-timestamp">

                        <span className="timestamp">
                        
                          {new Date(message.createdAt).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </span>
                        {/* Check if the message was sent by the current user */}
                        {(message.message !== "Message has been deleted.") && message.fromSelf && (
                          <button className="deleteCurrentMsgBtn" onClick={() => clickRequest(message, index)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        )}

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          {showRequest && (
            <div className="popup" id="popup">
              <div className="xMark" onClick={() => setShowRequest(false)}><FontAwesomeIcon icon={faXmark} /></div>
                  <p> Do u want to delete this message? </p>
              <button className="accept-button"
                onClick={() => handleDeleteClick(selectedMessage, currentSelected)} > Yes </button>

              <button className="reject-button"
                onClick={() => setShowRequest(false)} > No </button>

            </div>
          )}

          </div>

            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
  display: grid;
  background-color: whitesmoke;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 75% 15%;
    position: relative;
  }

  @media screen and (max-width: 720px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    grid-template-rows: 10% 83% 7%;
    z-index: 1000;
  }

   .chat-header {
    display: flex;
    flex-direction: row;
    background-color: #c7c3c4 ;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #1C191A;
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
    .clearBtn {
      margin-left: auto;
      background-color: transparent;
      border: none;
      font-size: 23px;
      color: #1C191A;
    }
    .clearBtn:active {
      color: white;
      background-color:#38B6FF;
    }
    .backBtn {
      margin-right: auto;
      background-color: transparent;
      border: none;
      font-size: 23px;
      color: #1C191A;
    }
    .backBtn:active {
      color: #38B6FF;
    }
  }
  .chat-messages {
    padding: 0.2rem 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
  
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #c7c3c4;
        
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      
     
      .content {
        max-width: 70%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 0.3rem;
        color: black; // This is the color of the messages
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
      .message-timestamp {
        font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.4); /* Black color with 70% opacity */
        }
    }
    .sended {
      justify-content: flex-end;
      
      .content {
        background-color: #38B6FF;
      }

    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #928d8e;
      }

    }
  }
`;


