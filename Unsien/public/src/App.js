import React, { useState, Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import Chat  from "./pages/Chat";
import ChatContainer from "./components/ChatContainer";
import { Contact } from "./pages/Contact";
import { Request } from "./pages/Request";
import { Admin } from "./pages/Admin";
import { AdminActiveUser } from "./components/AdminActiveUser"
import { createSignalProtocolManager, SignalServerStore } from "./SignalProtocol/SignalProtocolManager"
import { SignalProtocolContext } from "./pages/signalProtocolContext"

export default class Unsien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            loggedInUserObj: {},
            dummySignalServer: new SignalServerStore(),
            signalProtocolManagerUser: undefined,
        };
        this.setLoggedinUser = this.setLoggedinUser.bind(this);
    }

    setLoggedinUser(loggedInUserObj) {
        this.setState({ isLoggedIn: true, loggedInUserObj: { ...loggedInUserObj } }, () => {
            // Create a new SignalProtocolManager instance for the logged-in user
            createSignalProtocolManager(loggedInUserObj._id, this.state.dummySignalServer)
                .then((signalProtocolManagerUser) => {
                    this.setState({ signalProtocolManagerUser: signalProtocolManagerUser });
                });
        });
    }

    render() {

        return (
            <BrowserRouter>
                <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/adminActiveUser" element={<AdminActiveUser />} />
                <Route path="/" element={<Navigate to="/chat" />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/chat" element={<Chat />} /> */}

                <Route
                path="/login"
                element={!this.state.isLoggedIn && <Login setLoggedinUser={this.setLoggedinUser} />}
                />
                    <Route
                        path="/chat"
                        element={
                            this.state.isLoggedIn && (
                                <Chat
                                    signalProtocolManagerUser={this.state.signalProtocolManagerUser} // Update this line to pass the user-specific SignalProtocolManager
                                    loggedInUserObj={this.state.loggedInUserObj}
                                />
                            )
                        }
                    />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/request" element={<Request />} />
                    </Routes>
            </BrowserRouter>
        )
    }
}