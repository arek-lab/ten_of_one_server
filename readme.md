# RAG Demo API Server

Professional API server demonstrating **Retrieval-Augmented Generation (RAG)** capabilities. Built with Node.js, Express, and integrated with **HuggingFace SentenceTransformer** and **Qdrant vector database** for semantic search and intelligent document retrieval.

---

## 🎯 Purpose

This server showcases the power of RAG architecture by providing:

- **Semantic document search** through vector embeddings
- **Intelligent information retrieval** using similarity matching
- **Real-time embedding generation** via HuggingFace API
- **Scalable vector storage** with Qdrant database
- **User authentication** and session management

Perfect for demonstrating AI-powered search capabilities to clients and stakeholders.

---

## 🚀 Features

### Core RAG Functionality

- **Document Embedding** – Convert text to vector representations using HuggingFace SentenceTransformer
- **Semantic Search** – Find relevant content using vector similarity
- **Vector Database** – Efficient storage and retrieval with Qdrant
- **Real-time Processing** – Dynamic embedding generation and search

### Authentication & Security

- **User Registration & Login** – Secure account management
- **JWT Authentication** – Token-based session handling
- **Google OAuth Integration** – Social login support
- **Role-based Access Control** – Protected endpoints
- **CORS Configuration** – Secure cross-origin requests

### API Features

- **RESTful Design** – Clean, predictable endpoint structure
- **Error Handling** – Comprehensive error responses
- **Input Validation** – Request data sanitization
- **Environment Configuration** – Flexible deployment settings

---

## 🛠️ Technology Stack

- **Node.js** – Server runtime environment
- **Express.js** – Web application framework
- **MongoDB + Mongoose** – User data and session storage
- **Qdrant** – Vector database for embeddings
- **HuggingFace API** – SentenceTransformer embeddings on FASTAPI
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing
- **dotenv** – Environment management

---

## 🏗️ Architecture

### RAG Pipeline

```
User Query → Embedding API → Vector Search → Relevant Results → Response
     ↓              ↓              ↓              ↓
Text Input → HF Transform → Qdrant Query → Similarity Match → JSON Output
```

### External Integrations

- **HuggingFace API**: `https://arekpawlak-st-api.hf.space/docs`
- **Qdrant Vector DB**: Local or cloud instance
- **MongoDB**: User and session data

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Qdrant instance (local or cloud)
- HuggingFace API access

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/arek-lab/ten_of_one_server.git
cd ten_of_one_server
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment Configuration:**

Configure your `.env` file:

```env
# MongoDB
MONGO_URL=

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_LIFETIME=24h

# CORS
FRONTEND_ORIGIN=

# Email Service (optional)
NODE_MAILER_API_KEY=your_mailgun_api_key
NODE_MAILER_DOMAIN=your_domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# HuggingFace API
SENTENCE_TRANSFORMER_TOKEN=
SENTENCE_TRANSFORMER_API=

# Qdrant Configuration
QDRANT_API_KEY=
QDRANT_URL=
COLLECTION_NAME=

# Open AI config
OPENAI_API_KEY=
```

## 📚 API Documentation

### Authentication Endpoints

| Endpoint                | Method | Description       |
| ----------------------- | ------ | ----------------- |
| `/auth/register`        | POST   | User registration |
| `/auth/login`           | POST   | User login        |
| `/auth/logout`          | DELETE | User logout       |
| `/auth/forgot-password` | GET    | Forgot password   |
| `/auth/reset-password`  | GET    | Reset password    |
| `/auth/refresh-token`   | GET    | Refresh token     |

### RAG & Search Endpoints

| Endpoint      | Method | Description            |
| ------------- | ------ | ---------------------- |
| `/api/search` | POST   | Semantic vector search |

---

## 🏗️ Project Structure

```
ten_of_one_server/
├── .vscode/                    # VS Code workspace settings
├── controllers/                # Route controllers
│   ├── authController.js      # Authentication logic
│   ├── getOpinionController.js # Opinion retrieval endpoints
│   └── userController.js      # User management endpoints
├── db/                        # Database related files
├── errors/                    # Error handling utilities
├── middleware/                # Express middleware functions
├── models/                    # Data models and schemas
├── node_modules/              # npm dependencies
├── routes/                    # API route definitions
├── utils/                     # Utility functions and helpers
│   ├── checkPermissions.js    # Permission validation
│   ├── contextFormatter.js   # Response formatting
│   ├── create-hash.js        # Hash generation utilities
│   ├── createTokenUser.js    # Token user creation
│   ├── index.js              # Utility exports
│   ├── jwt.js                # JWT token handling
│   ├── nodemailerConfig.js   # Email configuration
│   ├── openai.js             # OpenAI API integration
│   ├── profanityChecker.js   # Content moderation
│   ├── qdrant_client.js      # Vector database client
│   ├── sendEmail.js          # Email sending utilities
│   ├── sendResetPassword.js  # Password reset emails
│   └── sendVerificationEmail.js # Verification emails
├── .env                       # Environment variables
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── app.js                    # Main application file
├── package-lock.json         # npm lock file
├── package.json              # Project dependencies and scripts
├── Profile                   # Deployment profile
└── readme.md                 # Project documentation
```

---

## 🔒 Security Features

- **JWT Token Authentication** – Secure session management
- **Password Hashing** – bcrypt encryption
- **Input Validation** – Mongoose schema validation
- **Rate Limiting** – API abuse protection
- **CORS Configuration** – Cross-origin security
- **Environment Variables** – Secure configuration
- **Error Sanitization** – No sensitive data exposure

---

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/rag-enhancement`
3. Commit changes: `git commit -m 'Add RAG enhancement'`
4. Push to branch: `git push origin feature/rag-enhancement`
5. Create Pull Request

---

## 📈 Roadmap

- [ ] Real-time embedding updates
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Performance analytics dashboard
- [ ] Batch processing capabilities
- [ ] Integration with more LLM providers

---

## 📄 License

## This project is licensed under the MIT License.

## 📧 Support & Contact

**Arek Lab** - AI Engineer & RAG Solutions Specialist

- **Email**: arkadiusz.pawlak01@gmail.com
- **GitHub**: [@arek-lab](https://github.com/arek-lab)
- **LinkedIn**: [arek-lab](https://linkedin.com/in/arek-lab)

For technical questions or demo requests, please create an issue or contact directly.

---

**Built with ❤️ to demonstrate the power of RAG architecture**
