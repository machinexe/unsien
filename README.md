# UNSIEN Project
![Your GIF](https://i.imgur.com/BuPRC4m.gif)

## Introduction
**UNSIEN** is a secure messaging app designed to prioritize information security with end-to-end encryption and exclusive access for authenticated users. It emphasizes control over government or organizational communication, ensuring confidentiality and privacy.

## Features
- **End-to-end encryption** using Signal Protocol
- **Exclusive user access** (request-based chat system)
- **Admin authentication** for managing user access
- **Dedicated request-based communication** for secure interactions
- **Real-time messaging** with **Socket.io**

## Tools
- **React** for frontend development
- **Socket.io** for real-time communication
- **MongoDB** for database management
- **Axios** for HTTP requests
- **Express.js** for backend server handling

## Solution Overview
UNSIEN provides:
1. **Exclusive downloads and access control**
2. **Signal Protocol Manager** initialized upon login for secure messaging
3. **Request-based chat** (users can only chat after accepting requests)
4. **End-to-end encryption** via Signal Protocol

## Results
### User Pages:
- **Register**
- **Login**
- **Chat**
- **Request**
- **Contact**

### Admin Pages:
- **Pending users**
- **Active users**

## Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/unsien.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
## How to Run

### Prerequisites
- **MongoDB**: Make sure MongoDB is installed and running locally. You can download it from [MongoDB's official website](https://www.mongodb.com/try/download/community).

### Backend (Server)
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running locally (you can use `mongod` to start the MongoDB server if it's not running).
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend (Public)
1. Navigate to the `public` folder:
   ```bash
   cd public
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the frontend:
   ```bash
   yarn start
   ```

### Registering Users and Adjusting Roles
- **User Registration**: Once the backend and frontend are running, you can register users via the app's registration page.
- **Adjusting User Roles**: After registering a user, you will need to manually change their role to "active" in MongoDB for them to have full access to the app.

The frontend will be available at `http://localhost:3000`, and the backend will be running at `http://localhost:5000`.

## License
MIT License

## Contact
For any inquiries, please contact me via [Email](fayTariq@hotmail.com).
