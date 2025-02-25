# Real-Time Quiz Game Backend

# Introduction -
A real-time quiz game app where two players compete against each other. Each player is presented with the same 4 questions in sequence, and they answer these questions independently. The player who scores the highest out of the 4 questions wins the game. The game needs to handle user authentication, real-time question delivery, answer validation, scoring, and state management.

## Tech Stack

- **Backend**: NodeJS
- **Database**: MongoDB
- **Real-Time Communication**: WebSockets
- **Authentication**: JWT for user authentication


## Requirements

1. **User Authentication**:
    - Implement endpoints for user registration and login
    - Securely hash passwords before storing them in MongoDB
2. **Game Session Setup:**
    - Create an endpoint to start a new game session and match two players
    - Once matched, initiate a game session and notify both players using socket [**`game:init`**]
3. **Question Management**:
    - Pre-store a set of 4 questions in MongoDB. Each question should have a question text, multiple choices, and a correct answer
4. **Real-Time Question Delivery**:
    - Use socket to send questions to each player as soon as they are ready to receive the next question [`question:send`]
5. **Answer Submission and Scoring**:
    - Allow players to submit their answers through socket [`answer:submit`]
6. **Result Calculation**:
    - At the end of the 4 questions, calculate the final scores and determine the winner
    - Send the result to both players and store the session results in MongoDB. [`game:end`]
7. **API Endpoints**:
    - **`POST /register`**: Registers a new user.
    - **`POST /login`**: Authenticates a user.
    - **`POST /game/start`**: Starts a new game session.


It supports **user authentication, game sessions, real-time quiz handling, and scoring.**

## **📌 Features**
- **User Authentication** (Register, Login, JWT Authentication)
- **Real-time Gameplay** using WebSockets
- **Question Management** Create and Fetch Questions
- **Game Sessions** (Matchmaking & Scoring)
- **MongoDB Storage** (User, Questions, Game Sessions)
- **Error Handling & Validation** (Ensuring data integrity)

---

## **🛠️ Components**
### **1️⃣ Backend Services**
| Component      | Description |
|---------------|------------|
| **auth.js** | Handles user authentication & management. |
| **game_manager.js** | Manages real-time gameplay using websockets, matchmaking, and scoring. |
| **question.js** | Stores & retrieves quiz questions. |
| **WebSocket Server** | Handles real-time communication. |
| **MongoDB Database** | Stores users, game sessions, and questions. |

### **2️⃣ Models**
| Model         | Description |
|--------------|------------|
| **User** | Stores user credentials, encrypted passwords, games played/won. |
| **Question** | Stores quiz questions, options, and correct answers. |
| **GameSession** | Stores match details between players and scores. |

---

## **🚀 Setup & Execution**
### **🔹 1. Prerequisites**
- **Node.js** (v16+)
- **MongoDB** (Running cloud instance)

### **🔹 2. Clone the Repository**
```sh
git clone https://github.com/vikashraghuwanshi/Quiz-Game-App.git

# To run the REST Server
cd rest_backend
npm install
npm start

# To run the websocket server
cd websocket_backend
npm install
npm start

# Run frontend
cd frontend
npm install
npm install

Register two players
Open two different browsers, login with players, join game and play.


# Testing with Postman
For Rest Server -
    Run the REST API collections for registering, login user, adding questions etc.

For Websocket APIs
    Use postman_websocket_messages.txt for message format


# Rest Server Render link
https://quiz-game-app-thxm.onrender.com


# Websocket Server Render link
https://quiz-websocket.onrender.com


# Frontend for testing 
https://quiz-game-2xg7.onrender.com

Open two different browser windows, register, login two or more players and then join game