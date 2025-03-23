import React, { useState, useEffect, Component } from "react";
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";
import axios from "axios";
import { allUsersRoute } from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { requestHandling } from "../utils/APIRoutes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faLock, faMagnifyingGlass, faLockOpen, faHand, faAddressBook, faRightFromBracket, faArrowLeft, faArrowUp, faHouse } from "@fortawesome/free-solid-svg-icons";
import '../design/appCSS.css'
import Welcome from "../components/Welcome";
import NavigationBar from "../components/NavigationBar";


export function Contact() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);


  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('unsien-user')) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('unsien-user')))
    }
  }, []);

  useEffect(() => {
    // Fetch contacts when currentUser is set
    if (currentUser) {
      const fetchContacts = async () => {
        try {
          const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(response.data.users);
          setFilteredContacts(response.data.openchatUsers)
          // Store contacts in local storage
          localStorage.setItem('contacts', JSON.stringify(response.data.users));

        } catch (error) { console.error('Error fetching contacts:', error); }
      }; 
      fetchContacts();
    }
    else {
    }
  }, [currentUser]);




  // -----------------    Form request handling: -----------------------------------
  const toastOption = {
    position: "bottom-right",
    autoClose: 10000,
    pauseOnHover: true,
    draggable: false,
    theme: "dark",
  };

  const [values, setValues] = useState({
    title: "",
    description: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {

      try {
        const { title, description } = values;
        const selectedContactId = selectedContact._id;
        const userNow = currentUser._id;
        console.log(currentUser._id);

        const { data } = await axios.post(requestHandling, {
          username: currentUser.username,
          userFromID: userNow,
          userToID: selectedContactId,
          title,
          description
        });

        if (data.error) {
          toast.error(data.error, toastOption);
        } 
      } catch (error) {
        console.error('Error submitting request:', error);
        toast.error('Please select a user to submit a request.', toastOption);
      }
    }
    toast.success('Your request  has been sent.', toastOption);

    setShowForm(false);
  };

  const handleValidation = () => {

    const { title, description } = values;
    if (title === "") {
      toast.info("title is required", toastOption); return false;
    } else if (description === "") {
      toast.info("description is required", toastOption); return false;
    };
    return true;
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  };

  useEffect(() => {
    render();
  }, [currentUser]);

  const render = () => {

    return filteredContacts.some((contact) => contact.id === contacts.id)
      ? <FontAwesomeIcon icon={faLockOpen} />
      : <FontAwesomeIcon icon={faLock} />
  };

  const [showForm, setShowForm] = useState(false);

  const clickRequest = (index, contact) => {
    setCurrentSelected(index);
    setSelectedContact(contact);
    setShowForm(true); // Show the form

  };

  // --------------------------------------------------------- //
  return (
    <>
      <Container>
        <NavigationBar />
        <div className="chat-content">
          <div className="content-sidebar">
            <div className="content-sidebar-titel">Contacts</div>
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
                              onClick={() => {
                                if (filteredContacts.some((c) => c._id === contact._id)) {
                                  // Check if the contact has the "FalockOpen" icon
                                  navigate(`/chat/`);

                                } else {
                                  clickRequest(index, contact);
                                }
                              }}
                            >
                              <div className="info" >
                                <div className="email">
                                  <p>{contact.email}</p>
                                </div>
                                <div className="username">
                                  <p>{contact.username}</p>
                                </div>
                              </div>
                              <div className="request">
                                <button
                                  className="button"
                                  onClick={() => {
                                    if (filteredContacts.some((c) => c._id === contact._id)) {
                                      // Check if the contact has the "FalockOpen" icon
                                      navigate(`/chat/`);
                                    } else {
                                      clickRequest(index, contact);
                                    }
                                  }}
                                >
                                  {filteredContacts.some((c) => c._id === contact._id) ? (
                                    <FontAwesomeIcon icon={faLockOpen} />
                                  ) : (
                                    <FontAwesomeIcon icon={faLock} />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        contacts.map((contact, index) => (
                          <div
                            key={contact._id}
                            className={`contact ${index === currentSelected ? "selected" : ""}`}
                            onClick={() => {
                              if (filteredContacts.some((c) => c._id === contact._id)) {
                                // Check if the contact has the "FalockOpen" icon
                                navigate(`/chat/`);

                              } else {
                                clickRequest(index, contact);
                              }
                            }}
                          >
                            <div className="info">
                              <div className="email">
                                <p>{contact.email}</p>
                              </div>
                              <div className="username">
                                <p>{contact.username}</p>
                              </div>
                            </div>

                            <div className="request">
                              <button
                                className="button"
                                onClick={() => {
                                  if (filteredContacts.some((c) => c._id === contact._id)) {
                                    // Check if the contact has the "FalockOpen" icon
                                    navigate(`/chat/`);
                                  } else {
                                    clickRequest(index, contact);
                                  }
                                }}
                              >
                                {filteredContacts.some((c) => c._id === contact._id) ? (
                                  <FontAwesomeIcon icon={faLockOpen} />
                                ) : (
                                  <FontAwesomeIcon icon={faLock} />
                                )}
                              </button>
                            </div>

                          </div>
                        ))
                      )}
                    </React.Fragment>
                  )}

                  {showForm && (
                    <form onSubmit={(event) => handleSubmit(event)} method="POST" className="form-container" id="form-container">
                      <div className="xMark" onClick={() => setShowForm(false)}><FontAwesomeIcon icon={faXmark} /></div>
                      <p> {selectedContact.username} </p>
                      <input type="text" placeholder="Title" name="title" onChange={(e) => handleChange(e)} className="input-field" />
                      <textarea placeholder="Description" name="description" autoComplete="new-password" onChange={(e) => handleChange(e)} className="input-field description-input" ></textarea>
                    <button type="submit" className="submit-btn" onClick={(e) => handleSubmit(e)}>Submit</button>
                    </form>
                  )}
                  
              </div>
            </div>
          </div>
        </div>

      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
max-width: 100vw;
height: 100vh;
display: flex;
flex-direction: column;
background-color: #DDDADB;

`;

export default Contact;