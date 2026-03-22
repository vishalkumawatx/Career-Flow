# CareerFlow

A full-stack job application tracker helping users manage job and internship applications in one centralized platform.

## Features

- 🔐 **Secure Authentication** - User registration and login with JWT-based authentication
- 📝 **Application Management** - Create, view, update, and track job applications
- 👤 **User Profiles** - Customize and manage user information
- 💾 **Data Persistence** - MongoDB database for reliable data storage
- 🎨 **Responsive UI** - Modern, mobile-friendly interface built with React and Tailwind CSS
- 📊 **Dashboard** - Overview of all applications at a glance

## Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareerFlow
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

   This will install dependencies for the root, backend, and frontend workspaces.

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careerflow
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Project

### Development Mode

Start both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- **Backend** server on `http://localhost:5000`
- **Frontend** development server on `http://localhost:3000`

### Build

To build both frontend and backend:

```bash
npm run build-all
```

## Project Structure

```
CareerFlow/
├── backend/                    # Node.js/Express backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── server.js              # Entry point
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
└── package.json               # Root package configuration
```

## Usage

1. **Register/Login** - Create a new account or log in with existing credentials
2. **Add Applications** - Start tracking new job applications
3. **View Dashboard** - See overview of all applications
4. **Manage Applications** - Update application status and details
5. **View Profile** - Manage your user information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub.

---

**Happy job hunting! 🚀**
