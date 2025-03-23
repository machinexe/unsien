import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faFaceSmile, faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function ChatInput({ handleSendMsg }) {
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (
        <Container>
            <div className="button-container">

            {/* <div className="emoji" onClick={handleEmojiPickerhideShow} >
          
              <FontAwesomeIcon icon={faFaceSmile} />
                  {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
              </div> */}
            </div>
            
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <input
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit">
            <FontAwesomeIcon icon={faArrowUp} />
                    
                </button>
            </form>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color:  #c7c3c4;
  padding: 0 0.5rem;
 
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .input-container {
    width: 100%;
    height: 80%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    margin-left: auto;
     margin-bottom: 5px;
    gap: 0.3rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      padding-left: 10px;
      background-color: transparent;
      color: black;
      border: none;
      font-size: 10;

      &::selection {
        background-color: #1C191A;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.1rem 0.5rem;
      margin-right: 2px ;
      border-radius: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      color: #1C191A;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 0.1rem;
        }
      }
      svg {
        font-size: 2rem;
      }
    }
    button:active {
      background-color: #38B6FF;
      color: white;
    }
  }
`;