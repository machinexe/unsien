import React, { useState, useEffect, createContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assests/logo.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import { createSignalProtocolManager, SignalServerStore } from "../SignalProtocol/SignalProtocolManager"
import { SignalProtocolContext } from './signalProtocolContext.js';


export function Login({ setLoggedinUser }) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const toastOption = {
        position: "bottom-right",
        autoClose: 10000,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
    };
    useEffect(() => {
        if (localStorage.getItem('unsien-user')) {
            const userData = localStorage.getItem('unsien-user');
            const user = JSON.parse(userData);
            if (user.role === 'admin') {
                // If the role is admin, navigate to the admin page
                navigate('/admin');
            } else if (user.role === 'active') {
                // If the role is active user, navigate to the admin page
                // initializeSignalProtocolManager(user._id);
                console.log(" useEffect handleSubmit");

                navigate('/')


            } 
        }
    }, [navigate, setLoggedinUser]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            // Calling API
            const {email, password } = values;

            /**
             * When you call res.json() in your backend code,
             * it sends a JSON response back to the client.
             * In the frontend code you provided, the response
             * from the server is received by the Axios request's
             * .then() method.
             */
            const { data } = await axios.post(loginRoute, {
                email,
                password,
            });

            if (data.status === false) {
                toast.error(data.msg, toastOption);
            };

            if (data.status === true) {
                // setCurrentUser(data._id);

                if (data.user.role === 'admin') {
                    localStorage.setItem('unsien-user', JSON.stringify(data.user)); // Store the user data as a JSON string
                    navigate('/admin');
                }
                if (data.user.role === 'active') {
                    localStorage.setItem('unsien-user', JSON.stringify(data.user)); // Store the user data as a JSON string
                    // console.log(data.user._id)
                    setLoggedinUser(data.user);
                    // await initializeSignalProtocolManager(data.user._id);
                    console.log("handleSubmit");
                    navigate('/')
                }
                if (data.user.role === 'null') {
                    toast.info("Your information is being processed, please wait for admin approval.", toastOption);
                }
            
            }
        }
    };

    const handleValidation = () => {

        const {email, password} = values;
        if (email === "") {
            toast.error("Email is required", toastOption); return false;
        } else if (password === "") {
            toast.error("Password is required", toastOption); return false;
        };
        return true;
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    };


    //----------------SIGNAL PROTOCOL MANAGING-------------------------//
    // const [signalProtocolManager, setSignalProtocolManager] = useState(null);

    // const initializeSignalProtocolManager = async (userId) => {
    //     const dummy = { SignalServer: new SignalServerStore() };
    //     try {
    //         const manager = await createSignalProtocolManager(
    //             userId,
    //             dummy.SignalServer
    //         );
    //         console.log(manager)
    //         setSignalProtocolManager(manager);
    //     } catch (error) {
    //         console.error("Error initializing Signal Protocol Manager:", error);
    //     }
    // };

    //-----------------------------------------------------------------//


    return (
        <>

            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)} method="POST">
                    <div className="brand">
                        <img src={logo} alt="logo" />
                        <h1> Unsien </h1>
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="new-password" // Add autocomplete attribute
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Login In</button>
                    <span> Don't have an account? <Link to="/register"> Sign Up </Link></span>

                </form>
            </FormContainer>

            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`

height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #1C191A;
@media (max-width: 768px) {

        form {
            padding: 4rem 3rem; 
        }
    }
.brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
        height: 5rem;
        margin-left: -10px;
    }
    h1 {
        color: white;
        text-transform: uppercase;
        font-size: 50px;
    }
}

form {
        display: flex;
        flex-direction: column;
        gap: 2rem; /** space between white boxes */
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #38B6FF;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus{
                border: 0.1rem solid #5CE1E6; 
                outline: none;
            }
        }
    }
button {
    background-color: #38B6FF;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    border-radius: 0.9rem;
    &:hover {
        background-color: #2277A8;
    }
}

span{
    color:white;
    text-transform: uppercase;
    a {
        color:#5CE1E6;
        text-decoration: none;
        font-weight: bolder;
    }
}

`;

export default Login;
