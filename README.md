# Synnex Invoice Extractor

A web application for extracting invoice data from images and PDFs using AI Vision (ChatGPT Vision API).

## Features

- **User Authentication**: Login and registration with email
- **Role-Based Access Control**: Admin, Supervisor, and User roles with admin approval
- **AI-Powered Extraction**: Uses OpenAI GPT-4 Vision API to extract invoice data
- **File Upload**: Support for images (JPEG, JPG, PNG, GIF) and PDFs
- **Data Management**: Manual entry, review, approval, edit, and cancel functionality
- **Dashboard**: Monitor statistics and recent invoices
- **Export**: Automatic JSON and XML file generation (named by invoice number)
- **Editable Prompts**: Manage AI extraction prompts in JSON format
- **Image Storage**: Invoice images stored in database

## Tech Stack

### Backend

- Node.js with Express
- Supabase (PostgreSQL) database with UTF-8 support for Thai fonts
- OpenAI API integration
- JWT authentication
- Multer for file uploads

### Frontend

- React with Material-UI
- React Router for navigation
- Axios for API calls
- Recharts for dashboard charts

## Installation

1. **Install dependencies:**

   ```bash
   npm run install-all
   ```

2. **Configure environment:**

   - Copy `env.example` to `.env` and update with your Supabase credentials
   - See `SUPABASE_MIGRATION.md` for setup instructions

3. **Start the application:**
   ```bash
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 3000)

## Database Setup

1. **Create Supabase Project**: Go to [Supabase](https://supabase.com) and create a new project
2. **Run Schema**: Execute `supabase_schema.sql` in Supabase SQL Editor
3. **Configure Environment**: Update `.env` with your Supabase URL and API key
4. **Start Application**: The app will automatically create default admin user:
   - Email: `kasem_u@synnex.co.th`
   - Password: `admin123`

See `SUPABASE_MIGRATION.md` for detailed migration guide.

## Default Admin Account

- **Email**: kasem_u@synnex.co.th
- **Password**: admin123

**Important**: Change the admin password after first login!

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Invoices

- `POST /api/invoices/upload` - Upload and extract invoice
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `POST /api/invoices/:id/review` - Review invoice (approve/reject)
- `POST /api/invoices/:id/cancel` - Cancel invoice

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/pending` - Get pending users
- `PUT /api/users/:id/role` - Update user role

### Prompts (Admin/Supervisor)

- `GET /api/prompts/active` - Get active prompt
- `GET /api/prompts` - Get all prompts
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update prompt

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
├── server/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   ├── invoices.js       # Invoice routes
│   │   ├── prompts.js        # Prompt management routes
│   │   └── dashboard.js      # Dashboard routes
│   ├── services/
│   │   ├── aiService.js      # OpenAI integration
│   │   └── xmlService.js    # XML generation
│   └── index.js             # Server entry point
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   └── pages/           # Page components
│   └── public/
└── exports/
    ├── json/                # Generated JSON files
    └── xml/                 # Generated XML files
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Admin Approval**: New users need admin approval to access the system
3. **Upload Invoice**: Upload an image or PDF of an invoice
4. **AI Extraction**: The system automatically extracts data using AI
5. **Review & Edit**: Review extracted data and make corrections if needed
6. **Approval**: Supervisors can approve or reject invoices
7. **Export**: JSON and XML files are automatically generated

## File Exports

- **JSON Files**: Stored in `server/exports/json/` named by invoice number
- **XML Files**: Stored in `server/exports/xml/` named by invoice number

## Notes

- The OpenAI API key is configured in `.env`
- Supabase database is used (PostgreSQL)
- Database schema must be created via `supabase_schema.sql` in Supabase SQL Editor
- All file uploads are stored in `server/uploads/`
- Invoice images are stored in the database as BYTEA (binary data)

## Security Considerations

- Change the JWT_SECRET in production
- Change the default admin password
- Use environment variables for sensitive data
- Implement rate limiting for production
- Add input validation and sanitization

## License

ISC




