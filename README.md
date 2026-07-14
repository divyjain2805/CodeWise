# CodeWise

CodeWise is a modern, comprehensive platform for mastering algorithms, preparing for technical interviews, and leveling up your coding skills. Featuring a robust online code execution engine, real-time feedback, and an integrated AI assistant, it provides a complete ecosystem for developers to practice, learn, and grow.

## 🚀 Features
- **Extensive Problem Library**: Browse and solve algorithmic problems across different difficulty levels (Easy, Medium, Hard).
- **Online Code Editor**: Write and test code directly in the browser with an integrated Monaco editor (VS Code style).
- **Multi-Language Support**: Supports compiling and executing code in languages like JavaScript, Python, C++, etc. (Powered by JDoodle).
- **AI Assistant Integration**: Get hints, debug assistance, and explanations for complex logic using the built-in AI (Powered by Gemini).
- **User Progress Tracking**: Track your solved problems, attempt history, and view your personal acceptance rate.
- **Problem of the Day**: Tackle a daily challenge to keep your skills sharp.
- **Admin Dashboard**: Manage users and create, edit, or delete algorithmic problems securely.

## 🛠️ Tech Stack
**Frontend:**
- React (v19)
- Vite
- TailwindCSS v4 & DaisyUI
- React Router v8
- Monaco Editor
- Axios

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Redis (Upstash) for caching
- Cloudinary (for media uploads/video solutions)
- JDoodle Compiler API
- Google Gemini API

## ⚙️ Environment Variables
To run this project locally, you will need to add the following environment variables to a `.env` file in the `codewise-backend` folder. You can use the provided `.env.example` as a template.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REDIS_URL=your_redis_connection_string

GEMINI_API_KEY=your_gemini_api_key

JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
```

## 💻 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/codewise.git
cd codewise
```

### 2. Setup the Backend
```bash
cd codewise-backend
npm install
# Ensure you have your .env file configured
npm start # or npm run dev for nodemon
```

### 3. Setup the Frontend
```bash
cd codewise-frontend
npm install
npm run dev
```
The frontend should now be running on `http://localhost:5173` and backend on `http://localhost:3000`.

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile and stats

### Problems
- `GET /api/prob/problems` - Fetch list of problems (with pagination, filter, cache)
- `GET /api/prob/problems/:slug` - Get details of a specific problem
- `GET /api/prob/problem-of-the-day` - Fetch the daily challenge
- `POST /api/prob/problems-create` - Admin route to create a problem
- `PUT /api/prob/problems/:slug` - Admin route to update a problem
- `DELETE /api/prob/problems/:slug` - Admin route to delete a problem

### Submissions
- `POST /api/sub/submit/:slug` - Submit code for execution
- `GET /api/sub/my-submissions` - Get logged-in user's submissions
- `GET /api/sub/problem/:slug` - Get user's submissions for a specific problem

### AI Assistance
- `POST /api/ai/ask` - Submit a question/code snippet to the Gemini AI


## 🌍 Live Demo

[Live Application URL](https://code-wise-tawny.vercel.app)

## 🚀 Future Improvements
- [ ] Support for community discussions and comments on problems
- [ ] Add peer-to-peer mock interviews with live shared editors
- [ ] Expand the problem categories (SQL, Shell scripting, etc.)
- [ ] Implement leaderboards and global ranking
- [ ] Add support for OAuth login (Google, GitHub)
