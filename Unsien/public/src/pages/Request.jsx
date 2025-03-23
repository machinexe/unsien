import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";
import axios from "axios";
import { getUserRequests } from "../utils/APIRoutes";
import { requestStatus } from "../utils/APIRoutes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faHand, } from "@fortawesome/free-solid-svg-icons";
import '../design/appCSS.css'
import NavigationBar from "../components/NavigationBar";
import { ToastContainer, toast } from "react-toastify"

export function Request() {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const toastOption = {
    position: "bottom-right",
    autoClose: 10000,
    pauseOnHover: true,
    draggable: false,
    theme: "dark",
  };

  // fetch request
  const fetchRequest = async () => {
    try {
      const response = await axios.get(`${getUserRequests}/${currentUser._id}?status=pending`);

      setRequests(response.data);
      console.log("Requests...", response.data);

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

      fetchRequest();
    }
    else {
    }
  }, [currentUser]);


  const handleApproveRequest = (request) => {

    const payload = { status: 'approved' };
    if (request) {
      axios.put(`${requestStatus}/${request._id}`, payload)
        .then(() => {

          // Update the request status in localStorage
          request.status = 'approved';
          // update list
          fetchRequest();

        })

    } else {
      console.error('Request object is undefined');
    }
    toast.success("Your accepted the request. Chat now is open!", toastOption);
    setShowRequest(false);
  };

  const handleRejectRequest = (request) => {
    const payload = {
      status: 'rejected'
    };
    if (request) {
      axios.put(`${requestStatus}/${request._id}`, payload)
        .then(() => {

          // Update the request status in localStorage
          request.status = 'rejected';
          // update list
          fetchRequest();
        })

    } else {
      console.error('Request object is undefined');
    }
    toast.dark("Your rejected the request.", toastOption);
    setShowRequest(false);
  };


  const [showRequest, setShowRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(false);

  const clickRequest = (index, request) => {
    setCurrentSelected(index);
    setSelectedRequest(request);
    setShowRequest(true); // Show the form

  };

  return (
    <>
      <Container>
        <NavigationBar />
        <div className="chat-content">
          <div className="content-sidebar">
            <div className="content-sidebar-titel">Requests</div>

            <div className="content-messages">
              <div className="content-messages-list">
                {requests.map((request, index) => {
                  return (
                    <div
                      key={request._id}
                      className={`theRequest ${index === currentSelected ? "selected" : ""}`}
                      onClick={() => clickRequest(index, request)}
                    >
                      <div className="info">
                        <div className="username">
                          <p>{request.username}</p>
                        </div>
                      </div>
                      {<div className="request">
                        <button className="button" ><FontAwesomeIcon icon={faHand} /></button>
                      </div>}             
                    </div>
                  );
                })}

                {showRequest && (
                <div className="popup" id="popup">
                  <div className="xMark" onClick={() => setShowRequest(false)}><FontAwesomeIcon icon={faXmark} /></div>
                    <p className="username"> {selectedRequest.username} </p>
                    <p className="title"> {selectedRequest.title} </p>
                    <p className="description"> {selectedRequest.description} </p>
                  <button className="accept-button"
                      onClick={() => handleApproveRequest(selectedRequest)} > Accept </button>

                  <button className="reject-button"
                      onClick={() => handleRejectRequest(selectedRequest)} > Reject </button>

                </div>
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