import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen,  faRightFromBracket, } from "@fortawesome/free-solid-svg-icons";
import unsienLogoLight from '../assests/logo.svg'
import '../design/appCSS.css'

const NaviAdmib = () => {

    function handleLogout() {
        // Clear the local storage
        localStorage.clear();

        // Redirect the user to the login page or any other desired location
        window.location.href = '/login';
    }


    return (
        <aside className='chat-sidebar'>
            <ul className="chat-sidebar-menu">
               
                <div>
                    <Link to="/admin"  >
                        <FontAwesomeIcon icon={faLock} />
                    </Link>
                </div>

                <div>
                    <Link to="/adminActiveUser"  >
                        <FontAwesomeIcon icon={faLockOpen} />
                    </Link>
                </div>


                
                <li className="chat-sidebar-profil">
                    <button type="button" className="chat-sidebar-profil-toggle" onClick={handleLogout}>
                        <img src={unsienLogoLight} alt="" />
                        <ul className="chat-sidebar-profil-dropdown">
                            <li><a href="#"><FontAwesomeIcon icon={faRightFromBracket} className="chat-sidebar-profil-image" />Logout</a></li>
                        </ul>
                    </button>

                </li>
            </ul>
        </aside>
    );
};

export default NaviAdmib;
