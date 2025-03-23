import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assests/logo.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

export function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState( {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const toastOption = {
        position: "bottom-right",
        autoClose: 10000,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
        style: {
            fontSize: "0.8rem" // Adjust the font size as needed
        }
    };

    useEffect(() => {
        if (localStorage.getItem('unsien-user')) {
            const userData = localStorage.getItem('unsien-user');
            const user = JSON.parse(userData);
            if (user.role === 'admin') {
                // If the role is admin, navigate to the admin page
                navigate('/admin');

            } else if (user.role === 'active') {
                // If the role is admin, navigate to the admin page
                navigate('/');
            }
            else {
                // If the role is not admin, navigate to the default page
                toast.info("Your information is being processed, please wait for admin approval.", toastOption);
            }
        }
    }, []);

    
    const handleSubmit = async (event) => { 
        event.preventDefault();
        if(handleValidation()) {
            // Calling API
            const { username, email, password} = values;
            const {data} = await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            if(data.status === false) {
                toast.error(data.msg, toastOption)
            }
            if (data.status === true ) {
            toast.info("Registeration completed. Your information is being processed, please wait for admin approval.", toastOption);
            }
        }
    };

const handleValidation =() => {
    
    const { username, email, password, confirmPassword} = values;

    if (username.length === 0) {
        toast.error("Username is required", toastOption); return false;
    } else if (username.length < 3) {
        toast.error("Username should be more than 3 characters", toastOption); return false;
    }   else if (email.length === 0) {
        toast.error("Email is required", toastOption); return false;
    } else if (password.length === 0) {
        toast.error("Password is required", toastOption); return false;
    } else if (password.length < 8 || !(/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_-]/.test(password))) {
        toast.error("Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.", toastOption); return false;
    } else if (password !== confirmPassword) {
        toast.error("Password and Confirmed passowrd should be the same", toastOption); return false;
    }
    return true;
}

const handleChange = (event) => {
    setValues({...values, [event.target.name]:event.target.value})};
    return (
    <>
        <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)} method="POST">
                <div className="brand">
                    <img src={logo} alt="logo" />
                    <h1> Unsien </h1>
                </div>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={ (e)=> handleChange(e)}
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    autoComplete="new-password" // Add autocomplete attribute
                    onChange={(e) => handleChange(e)}
                />
                    <button type="submit">Create User</button>
                    <span>Already have an account? <Link to="/login"> Loign </Link></span>
                
            </form>
        </FormContainer>
        <ToastContainer/>
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

export default Register;
