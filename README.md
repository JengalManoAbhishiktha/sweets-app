🍬 Sweetshop WebApp
===================

A full-stack **MERN (MongoDB, Express, React, Node.js)** web application for managing and browsing sweetshop products.\
This project includes **secure image storage with AWS S3**, **Google Authentication for users**, and an **Admin Dashboard** to manage sweets.

* * * * *

🚀 Features
-----------

-   🔐 **User Authentication** with Google OAuth

-   🖼️ **AWS S3 Integration** for storing sweet images

-   👨‍💼 **Admin Dashboard** for managing sweets (CRUD operations)

-   🌐 Public users can **view sweets** without login

-   📱 Responsive frontend with React

* * * * *

🛠️ Tech Stack
--------------

**Frontend:** React, SCSS/CSS\
**Backend:** Node.js, Express.js\
**Database:** MongoDB (Mongoose)\
**Authentication:** Google OAuth + JWT\
**Storage:** AWS S3\
**Hosting:** https://sweetshopmain.netlify.app

* * * * *

🔑 Demo Credentials
-------------------

### Admin Login

-   **Email:** `shasankgavini16@gmail.com`

-   **Password:** `Shasank@123`

*(Only admins can add/edit/remove sweets)*

### User Login

-   Sign in with **Google Authentication**

* * * * *



⚙️ Installation
---------------

Clone the repository:

`git clone https://github.com/your-username/sweetshop-webapp.git
cd sweetshop-webapp`

### Backend Setup

`cd backend
npm install`

Create a `.env` file in the backend folder with:

`MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret`

Run the backend:

`node main.js`

### Frontend Setup

`cd frontend
npm install
npm run dev`

* * * * *

📡 Deployment
-------------

-   **Frontend:** Netlify

-   **Backend:** Render

-   **Database:** MongoDB Atlas

-   **Images:** AWS S3

* * * * *
