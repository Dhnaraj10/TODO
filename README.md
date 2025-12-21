# TODO Web Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) TODO application with user authentication and CRUD operations.

![Demo](https://todo-dhanraj-singhs-projects.vercel.app/)

## Features

- User Authentication (Sign Up / Sign In)
- Create, Read, Update, and Delete Tasks
- Responsive UI Design
- User Profile Management
- Persistent Data Storage with MongoDB

## Tech Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Redux Toolkit** - State management
- **React Router** - Declarative routing for React
- **Axios** - Promise based HTTP client
- **React Icons** - Popular icons as React components
- **React Toastify** - Notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Bcrypt.js** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **Cors** - Cross-Origin Resource Sharing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud like MongoDB Atlas)

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd todo
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
PORT=5000
```

5. Start the development server:
```bash
# From the root directory
npm start
```

This will start both the backend server and frontend development server concurrently.

## Deployment

Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

The recommended approach is to:
1. Deploy the backend to Render
2. Deploy the frontend to Vercel
3. Use MongoDB Atlas for the database

## Project Structure

```
.
├── backend
│   ├── connection  # Database connection
│   ├── models      # Mongoose models
│   ├── routes      # API routes
│   └── ...         # Other backend files
├── frontend
│   ├── public      # Static assets
│   └── src
│       ├── components  # React components
│       ├── redux       # Redux store and slices
│       └── ...         # Other frontend files
└── ...
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Task Routes
- `POST /api/task/addTask` - Add a new task
- `GET /api/task/getAllTask/:id` - Get all tasks for a user
- `PUT /api/task/updateTask/:id` - Update a task
- `DELETE /api/task/deleteTask/:id` - Delete a task
- `PUT /api/task/completeTask/:id` - Mark task as complete/incomplete

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details if available.

## Live Demo

Check out the live demo: [https://todo-dhanraj-singhs-projects.vercel.app/](https://todo-dhanraj-singhs-projects.vercel.app/)