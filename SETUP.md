# Setup Instructions

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MySQL** (v5.7 or higher) running on localhost:3306
3. **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### 2. Configure Environment

Copy the `env.example` file to `.env`:

```bash
# On Windows PowerShell
Copy-Item env.example .env

# On Linux/Mac
cp env.example .env
```

The `.env` file is already configured with:

- Database: localhost:3306, user: root, password: Th@1land
- Database name: SynnexInvoiceExtractor_cursor
- OpenAI API key (already set)

### 3. Start MySQL

Make sure MySQL is running on your system:

```bash
# Check if MySQL is running
# Windows: Check Services
# Linux: sudo systemctl status mysql
# Mac: brew services list
```

### 4. Start the Application

```bash
# Start both backend and frontend
npm run dev
```

This will:

- Start backend server on http://localhost:5000
- Start frontend React app on http://localhost:3000
- Automatically create database and tables on first run

### 5. Access the Application

1. Open your browser and go to: http://localhost:3000
2. Login with default admin account:
   - **Email**: kasem_u@synnex.co.th
   - **Password**: admin123

### 6. First Steps

1. **Change Admin Password**: After first login, consider changing the admin password
2. **Approve Users**: Go to User Management to approve pending registrations
3. **Upload Invoice**: Try uploading an invoice image to test AI extraction
4. **Configure Prompt**: Go to Prompt Management to edit the AI extraction prompt

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify MySQL is running
2. Check credentials in `.env` file
3. Ensure MySQL user has proper permissions
4. Try creating the database manually:
   ```sql
   CREATE DATABASE SynnexInvoiceExtractor_cursor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change PORT in `.env` file
2. Or stop the service using those ports

### Module Not Found Errors

If you get module not found errors:

```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm run install-all
```

### PDF Upload Issues

PDF files need to be converted to images for AI processing. The system will show an error message suggesting:

- Convert PDF to image (PNG/JPEG) before uploading
- Or use Manual Entry instead

## Development

### Running Backend Only

```bash
npm run server
```

### Running Frontend Only

```bash
cd client
npm start
```

### Database Schema

The database schema is automatically created on first run. Tables include:

- `users` - User accounts and roles
- `invoices` - Invoice data and files
- `prompts` - AI extraction prompts

## Production Deployment

For production:

1. Change `JWT_SECRET` to a strong random string
2. Update database credentials
3. Set `NODE_ENV=production`
4. Build frontend: `cd client && npm run build`
5. Use a process manager like PM2
6. Configure reverse proxy (nginx)
7. Enable HTTPS

## Support

For issues or questions, check the README.md file or contact the development team.




