# Real-Time Quiz Game Backend

This is a **real-time quiz game backend** built using **NodeJS, MongoDB, WebSockets, and JWT authentication**.  
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

Then Run the REST API collections for registering, login user, adding questions etc.

For Websocket APIs
use postman_websocket_messages.txt for message format