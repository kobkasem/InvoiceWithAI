# 🛠️ Technology Stack - Synnex Invoice Extractor

Complete overview of all technologies used in this application.

---

## 🎯 Architecture

**Full-Stack Web Application**
- **Backend**: Node.js/Express API Server
- **Frontend**: React Single Page Application (SPA)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Railway.app

---

## 🔧 Backend Technologies

### Core Runtime
- **Node.js** v20.x
  - JavaScript runtime environment
  - Server-side execution

### Web Framework
- **Express.js** v4.18.2
  - Web application framework
  - RESTful API server
  - Routing and middleware

### Database
- **Supabase** (PostgreSQL)
  - Cloud-hosted PostgreSQL database
  - Real-time capabilities
  - Row Level Security (RLS)
  - UTF-8 support for Thai fonts

### Authentication & Security
- **JWT (JSON Web Tokens)** v9.0.2
  - Token-based authentication
  - Secure user sessions
- **bcryptjs** v2.4.3
  - Password hashing
  - Secure password storage

### File Handling
- **Multer** v1.4.5-lts.1
  - File upload middleware
  - Handles multipart/form-data
- **Sharp** v0.32.6
  - Image processing library
  - Image optimization and resizing
- **pdf-parse** v1.1.1
  - PDF file parsing
  - Extract text from PDFs

### AI Integration
- **OpenAI API** v4.20.1
  - GPT-4 Vision API
  - AI-powered invoice data extraction
  - Image analysis

### Data Processing
- **xml2js** v0.6.2
  - XML file generation
  - Convert data to XML format

### Utilities
- **dotenv** v16.3.1
  - Environment variable management
  - Configuration management
- **cors** v2.8.5
  - Cross-Origin Resource Sharing
  - API access control

### Development Tools
- **nodemon** v3.0.2
  - Auto-restart server on changes
  - Development convenience
- **concurrently** v8.2.2
  - Run multiple commands simultaneously
  - Run frontend and backend together

---

## 🎨 Frontend Technologies

### Core Framework
- **React** v18.2.0
  - JavaScript UI library
  - Component-based architecture
  - Virtual DOM

### React Ecosystem
- **React DOM** v18.2.0
  - React rendering for web
- **React Router DOM** v6.20.0
  - Client-side routing
  - Navigation management
  - Protected routes

### UI Framework
- **Material-UI (MUI)** v5.14.20
  - React component library
  - Material Design components
  - Pre-built UI components
- **@mui/icons-material** v5.14.19
  - Material Design icons
  - Icon components
- **@emotion/react** v11.11.1
  - CSS-in-JS library
  - Styling solution for MUI
- **@emotion/styled** v11.11.0
  - Styled components
  - Component styling

### Data Visualization
- **Recharts** v2.10.3
  - Chart library for React
  - Dashboard charts and graphs
  - Data visualization

### HTTP Client
- **Axios** v1.6.2
  - HTTP client library
  - API requests
  - Promise-based

### File Upload
- **react-dropzone** v14.2.3
  - Drag-and-drop file upload
  - File selection interface

### Build Tools
- **react-scripts** v5.0.1
  - Create React App build tools
  - Webpack configuration
  - Development server
  - Production builds

---

## 🗄️ Database

### Database System
- **PostgreSQL** (via Supabase)
  - Relational database
  - ACID compliance
  - Advanced queries
  - JSON support

### Database Features Used
- **UUID** (Primary keys)
- **BYTEA** (Binary data storage for images)
- **JSONB** (JSON data storage)
- **Timestamps** (Created/Updated tracking)
- **Foreign Keys** (Relationships)
- **Indexes** (Performance optimization)

---

## ☁️ Cloud Services

### Database Hosting
- **Supabase**
  - PostgreSQL hosting
  - Authentication (not used, custom JWT)
  - Storage (not used, database storage)
  - Real-time subscriptions

### AI Service
- **OpenAI**
  - GPT-4 Vision API
  - Image analysis
  - Natural language processing

### Deployment Platform
- **Railway.app**
  - Application hosting
  - Automatic deployments
  - Environment variables
  - SSL/HTTPS

---

## 📦 Package Management

- **npm** (Node Package Manager)
  - Dependency management
  - Script execution
  - Package installation

---

## 🔐 Security Technologies

- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin security
- **Environment Variables** - Secure configuration
- **HTTPS/SSL** - Encrypted connections (Railway)

---

## 📊 Data Formats

- **JSON** - API communication, data storage
- **XML** - Export format for invoices
- **Multipart/Form-Data** - File uploads
- **BYTEA** - Binary image storage

---

## 🛠️ Development Tools

- **Git** - Version control
- **GitHub** - Code repository
- **VS Code / Cursor** - Code editor
- **ESLint** - Code linting
- **Nodemon** - Auto-reload development

---

## 📱 Supported File Types

### Images
- JPEG/JPG
- PNG
- GIF

### Documents
- PDF (with conversion to images)

---

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support
- Responsive design (Material-UI)

---

## 🚀 Deployment

- **Platform**: Railway.app
- **Runtime**: Node.js 20
- **Build**: npm scripts
- **Process Manager**: Railway's built-in process management
- **SSL**: Automatic HTTPS (Railway)

---

## 📋 Technology Summary

### Backend Stack
```
Node.js → Express → Supabase → OpenAI API
```

### Frontend Stack
```
React → Material-UI → Axios → Recharts
```

### Full Stack
```
React Frontend ↔ Express API ↔ Supabase Database
                      ↓
                 OpenAI API
```

---

## 🎓 Learning Resources

### Node.js & Express
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/)

### React
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)

### Material-UI
- [MUI Documentation](https://mui.com/)

### Supabase
- [Supabase Docs](https://supabase.com/docs)

### OpenAI
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 📊 Technology Versions

### Runtime
- **Node.js**: v20.x (required for Supabase v2.79.0)

### Backend Dependencies
- Express: ^4.18.2
- Supabase: ^2.79.0
- OpenAI: ^4.20.1
- JWT: ^9.0.2

### Frontend Dependencies
- React: ^18.2.0
- Material-UI: ^5.14.20
- React Router: ^6.20.0
- Axios: ^1.6.2

---

## 🔄 Data Flow

```
User Browser
    ↓
React Frontend (Port 3000 dev / Built static files)
    ↓
Express API Server (Port 5000)
    ↓
┌─────────────┬──────────────┐
│  Supabase   │   OpenAI API │
│  Database   │   (AI Vision)│
└─────────────┴──────────────┘
```

---

## ✅ Key Technologies at a Glance

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 20 |
| **Backend Framework** | Express.js |
| **Frontend Framework** | React 18 |
| **UI Library** | Material-UI 5 |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | JWT + bcryptjs |
| **AI Service** | OpenAI GPT-4 Vision |
| **File Upload** | Multer + react-dropzone |
| **Charts** | Recharts |
| **Deployment** | Railway.app |

---

**This is a modern, full-stack JavaScript application using React and Node.js!** 🚀

