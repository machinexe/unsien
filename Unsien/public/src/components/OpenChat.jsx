import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../assests/logo.svg"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock, faMagnifyingGlass, faLockOpen, faHand, faXmark, faAddressBook, faRightFromBracket, faArrowLeft, faArrowUp,
  faHouse
} from "@fortawesome/free-solid-svg-icons";

export default function OpenChat({ currentUserName, contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const navigate = useNavigate();


  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const render = () => {

    return filteredContacts.some((contact) => contact.id === contacts.id)
      ? <FontAwesomeIcon icon={faLockOpen} />
      : <FontAwesomeIcon icon={faLock} />
  };



  return (
    <>
      <Container>

          <div className="chat-content">
            <div className="content-sidebar">
              <div className="content-sidebar-titel"> Chats</div>
              
              

            <form action="" className="content-sidebar-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                className="content-sidebar-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              />
              <button type="submit" className="content-sidebar-submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            
              <div className="content-messages">
                <div className="content-messages-list">


                {contacts.length > 0 && (
                  <React.Fragment>
                    {searchQuery.trim() !== '' ? (
                      <div>
                        {contacts.filter(contact =>
                          contact.username.toLowerCase().startsWith(searchQuery.trim())
                        ).map((contact, index) => (
                          <div
                            key={contact._id}
                            className={`contact ${index === currentSelected ? "selected" : ""}`}
                            onClick={() => changeCurrentChat(index, contact)}
                          >
                            <div className="info">
                              <div className="username">
                                <p>{contact.username}</p>
                              </div>
                              <div className="email">
                                <p>{contact.email}</p>
                              </div>
                            </div>
                         </div>
                        ))}
                      </div>
                    ) : (
                      contacts.map((contact, index) => (
                        <div
                          key={contact._id}
                          className={`contact ${index === currentSelected ? "selected" : ""}`}
                          onClick={() => changeCurrentChat(index, contact)}
                        >
                          <div className="info">
                            <div className="username">
                              <p>{contact.username}</p>
                            </div>
                            <div className="email">
                              <p>{contact.email}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </React.Fragment>
                )}
              

                </div>
              </div>
            </div>
          </div>

          <div className="current-user">
            <div className="username">
              Current user logged in:
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>

    </>
  );
}

const Container = styled.div`
max-width: 100vw;
height: 100vh;
display: flex;
flex-direction: column;
background-color: #DDDADB;

 .current-user {
  position: relative;
  
  padding-left: 100px;
 }
`
;