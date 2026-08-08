# 🎓 CampusSphere

CampusSphere is a full-stack university social networking platform designed to help students, freshers, and alumni connect, communicate, and share opportunities within their campus community.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes
- Logout functionality

### 📰 Social Feed
- Create posts
- View campus posts
- Like and unlike posts
- Comment on posts
- Delete your own posts
- Delete your own comments
- Share post links

### 👥 Network
- Browse registered users
- Search users
- Follow and unfollow users
- View user profiles
- Connect with alumni and students

### 💬 Messaging
- User-to-user messaging
- Conversation interface
- Protected messaging functionality

### 🎓 Profiles
- View profiles
- Edit profile information
- University and role information
- Bio
- Followers and following

### 🔥 Trending
- Automatically detect hashtags from posts
- Display trending hashtags
- Show post counts
- Click hashtags to filter feed posts

### 🎓 Alumni
- Display alumni from the community
- Click alumni profiles to view their information

### 📅 Events
- Upcoming campus events
- Dedicated events page
- Event information and locations

### ⚙️ Settings
- Account information
- Dark mode
- Profile visibility option
- Account deletion
- Logout

### 📱 Responsive UI
- Desktop-friendly dashboard
- Responsive layout
- Sidebar navigation
- Feed layout
- Right-side information panels

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API
- Local Storage

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- bcryptjs
- Protected API routes

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Nodemon

---

## 📂 Project Structure

```text
CodeAlpha_SocialMediaPlatform/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── feed.js
│   │   ├── network.js
│   │   ├── messages.js
│   │   ├── profile.js
│   │   └── settings.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── network.html
│   ├── messages.html
│   ├── settings.html
│   └── events.html
│
└── README.md
