import React, { useState, useEffect, useRef, useContext, Component } from "react";
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";
import axios from "axios";
import Welcome from "../components/Welcome";
import OpenChat from "../components/OpenChat";
import ChatContainer from "../components/ChatContainer";
import { getUserContact, host } from "../utils/APIRoutes"
import { io } from "socket.io-client";
import NavigationBar from "../components/NavigationBar";
import { createSignalProtocolManager, SignalServerStore } from "../SignalProtocol/SignalProtocolManager"
import { SignalProtocolContext } from "./signalProtocolContext";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            currentChat: undefined,
            currentUser: undefined,
            currentUserName: undefined,
            socket: null,
        };
        this.navigate = this.props.navigate;
        this.handleChatChange = this.handleChatChange.bind(this);
    }

    componentDidMount() {
        console.log(" Chat componentDidMount");

        // Check if user is logged in
        if (!localStorage.getItem('unsien-user')) {
            this.props.navigate('/login')
            } else {
            this.setState({ currentUser: JSON.parse(localStorage.getItem('unsien-user')) }, () => {
                this.setState({ socket: io(host) }, () => {
                    this.state.socket.emit("add-user", this.state.currentUser._id);

                    axios.get(`${getUserContact}/${this.state.currentUser._id}`)
                        .then(response => {
                            this.setState({ contacts: response.data, currentUserName: this.state.currentUser.username });
                        })
                        .catch(error => {
                            console.error('Error fetching contacts:', error);
                        });
                });
            });
        }
    }
    componentWillUnmount() {
        console.log("Close Socket...")
        if (this.state.socket) {
            this.state.socket.disconnect();
        }
    }

    handleChatChange = (chat) => {
        this.setState({ currentChat: chat });
        console.log("Chat changed", this.props.signalProtocolManagerUser)
    };

    render() {
        return (
            <Container>
                <NavigationBar />

                <div className="container">
                    <OpenChat
                        currentUserName={this.state.currentUserName}
                        contacts={this.state.contacts}
                        changeChat={this.handleChatChange}
                    />
                    {this.state.currentChat === undefined ? (
                        <Welcome username={this.state.currentUserName} />
                    ) : (
                        <ChatContainer
                            currentChat={this.state.currentChat}
                            currentUser={this.state.currentUser}
                            socket={this.state.socket}
                            signalProtocolManagerUser={this.props.signalProtocolManagerUser} // Update this line
                        />
                    )}
                </div>
            </Container>
        );
    }
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #38B6FF;

.container {
    height: 100vh;
    width: 100vw;
    background-color: #ffff;
    display: grid;
    @media screen and (min-width: 720px) and (max-width: 1080px){
         grid-template-columns: 35% 65%;

    }
}
`;
    
export default Chat;
