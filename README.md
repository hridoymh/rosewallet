# Token Reward System for Younger Sister

This is a simple Node.js-based project designed to help my younger sister develop an interest in good behavior and learn about e-wallets. The application allows me to reward her with tokens for any good deeds she does, which she can use to "buy" items that I add to the system.

---

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Token Rewards**: Reward tokens to the user for good deeds.
- **Item Management**: Admin can add items with attributes like name, price, and quantity.
- **E-Wallet System**: Users can view their token balance and use tokens to buy items.
- **Role-Based Access Control**: Only the admin (me) can add new items to the system.

---

## How It Works

1. **Good Behavior Rewards**:
   - When my sister does something good, I reward her with tokens via the app.

2. **Buying Items**:
   - She can use the tokens she has earned to "buy" items that I add to the system.

3. **Learning About E-Wallets**:
   - This system simulates the concept of e-wallets, teaching her how to manage virtual tokens responsibly.

---

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite (lightweight and standalone)
- **Authentication**: JWT (JSON Web Tokens)

---
## Installation Process

Follow these steps to set up and run the project on your local system:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- SQLite (pre-installed with most environments or downloadable [here](https://www.sqlite.org/download.html))

---

### Steps

1. **Clone the Repository**

   Use the following command to clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/token-reward-system.git
   
2. **Navigate to the Project Directory**
   
   Change the directory to the project folder:
   ```bash
   cd token-reward-system

3. **Install Dependencies**
   
   Install all the required packages:
   ```bash
   npm install

4. **Set Environment Variables**
   
   Create a .env file in the project root and configure the required environment variables:
   ```.env
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

5. **Start the Server**
   
   Launch the server using:
   ```bash
   node server.js


