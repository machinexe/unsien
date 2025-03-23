import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";
import axios from "axios";
import { allUsers } from "../utils/APIRoutes";
import { userRoleStatue } from "../utils/APIRoutes"
import NaviAdmin from "../components/NaviAdmin";
import { faXmark, faMagnifyingGlass, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export function Admin() {
    // const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    // const [currentSelected, setCurrentSelected] = useState(undefined);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

    // fetch request
    const fetchUsers = async () => {
        try {
          const response = await axios.get(`${allUsers}/${currentUser._id}?status=pending`,
            {
              params: {
                action: 'fetchPendingUsers',
              },
            });

            setUsers(response.data);
            console.log(response.data);

            // Store contacts in local storage
            localStorage.setItem('requests', JSON.stringify(response.data));

        } catch (error) { console.error('Error fetching requests:', error); }
    };

    // -------------- use effect ---------- //
    useEffect(() => {
        // Check if user is logged in
        if (!localStorage.getItem('unsien-user')) {
            navigate('/login');
        } else {
            setCurrentUser(JSON.parse(localStorage.getItem('unsien-user')))
        }
    }, []);

    useEffect(() => {
        // fetchRequest 
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleApproveRequest = (user) => {
        if (user) {
            axios.put(`${userRoleStatue}/${user._id}`, { action: 'approve' })
                .then((response) => {
                    // Update the user's role in localStorage or your application state
                    user.role = response.data.user.role;
                    fetchUsers();
                })
                .catch((error) => {
                    console.error('Error updating user role:', error);
                });
        } else {
            console.error('User object is undefined');
        }
    };

    const handleRejectRequest = (user) => {
        if (user) {
            axios.put(`${userRoleStatue}/${user._id}`, { action: 'reject' })
                .then(() => {
                    // Update the user list
                    fetchUsers();
                })
                .catch((error) => {
                    console.error('Error rejecting user:', error);
                });
        } else {
            console.error('User object is undefined');
        }
    };

  const [showRequest, setShowRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const clickRequest = (index, request) => {
    setCurrentSelected(index);
    setSelectedRequest(request);
    setShowRequest(true); // Show the form

  };

    return (
        <>
        <NaviAdmin/> 
            <Container>
          <div className="chat-content">
          
            <div className="content-sidebar">
              <div className="content-sidebar-titel"> 
                <h1> Admin Only </h1> <br />
              Current Pending Users </div>
              
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


                    {users.length > 0 && (
                      <React.Fragment>
                        {searchQuery.trim() !== '' ? (
                          <div>
                            {users.filter(user =>
                              user.username.toLowerCase().startsWith(searchQuery.trim())
                            ).map((user, index) => (
                              <div
                                key={user._id}
                                className={`contact ${index === currentSelected ? "selected" : ""}`}
                                onClick={() => clickRequest(index, user)}
                              >
                                <div className="user-details">
                                  <p> {user.username}</p>

                                  <p> {user.email}</p>

                                  <button className="accept-button"
                                    onClick={() => handleApproveRequest(user)}
                                  >  <FontAwesomeIcon icon={faCheck} /> </button>

                                  <button className="reject-button"
                                    onClick={() => handleRejectRequest(user)}
                                  >  <FontAwesomeIcon icon={faXmark} /> </button>

                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                            users.map((user, index) => (
                              <div
                                key={user._id}
                                className={`contact ${index === currentSelected ? "selected" : ""}`}
                                onClick={() => clickRequest(index, user)}
                              >
                                <div className="user-details">
                                  <p> {user.username}</p>

                                  <p> {user.email}</p>
                                </div>
                                
                                <div className="button-container">

                                  <button className="accept-button"
                                    onClick={() => handleApproveRequest(user)}
                                  >  <FontAwesomeIcon icon={faCheck} /> </button>

                                  <button className="reject-button"
                                    onClick={() => handleRejectRequest(user)}
                                  >  <FontAwesomeIcon icon={faXmark} /> </button>
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

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-container button {

}


.accept-button {

}

.reject-button {

}



`;