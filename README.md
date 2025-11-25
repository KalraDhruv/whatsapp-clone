# 📱 whatsapp-clone

A local, functional clone of the popular messaging application, WhatsApp, built for demonstrative purposes. This project is designed to be run with **minimal setup** on a local environment, focusing on core real-time chat functionality.

-----

## 🚀 Overview

This repository provides a self-contained **client-server architecture** for a real-time messaging application. The setup allows users to experience the basic features of a chat application locally. The project structure clearly separates the front-end user interface from the back-end communication logic.

-----

## ✨ Key Features

  * **Local Real-Time Chat:** Enables instant message transmission and reception between local clients.
  * **Minimal Setup:** Designed to be easily run for demonstration or development purposes.
  * **Client-Server Architecture:** Clear separation of concerns between the user interface and the backend logic.

-----

## 💻 Technology Stack

  * **Package Manager:** **pnpm**
  * **Frontend (Client):** **JavaScript**, **HTML**, and **CSS** (for the user interface and handling real-time connections).
  * **Backend (Server):** **JavaScript** (likely running in a **Node.js** environment, handling connections and message routing).

-----

## 🛠️ Installation and Setup

Before running the application, you need to install dependencies in both the `server` and `client` directories.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/KalraDhruv/whatsapp-clone.git
    cd whatsapp-clone
    ```

2.  **Install Dependencies using pnpm:**
    You must run `pnpm install` in both the server and client folders.

    ```bash
    # 1. Install server dependencies
    cd server
    pnpm install

    # 2. Install client dependencies
    cd ../client
    pnpm install
    ```

-----

## ▶️ How to Run

The application requires the server to be running before the client can connect and function.

### 1\. Start the Server

From the `server` directory, run the start command (the specific command may vary, but typically runs the main Node.js file):

```bash
cd whatsapp-clone/server
pnpm start
```

### 2\. Start the Client

The client needs a specific Node.js option to be exported before starting, which resolves potential compatibility issues with newer Node.js versions.

From the `client` directory, export the necessary legacy option and then run the client:

**Linux/macOS:**

```bash
cd whatsapp-clone/client
export NODE_OPTIONS=--openssl-legacy-provider
pnpm start
```

**Windows (Command Prompt):**

```bash
cd whatsapp-clone\client
set NODE_OPTIONS=--openssl-legacy-provider
pnpm start
```

---
## Working Demonstration
https://drive.google.com/file/d/1LwxaSOxk4TCpSBxX7M7Uvezu-C6wFEKa/view?usp=sharing
