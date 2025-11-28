# How to Test Run the Application

## Prerequisites

1. **Node.js** (v14 or higher) - Check with: `node --version`
2. **MySQL** (v5.7 or higher) - Must be running on localhost:3306
3. **npm** - Usually comes with Node.js

## Step-by-Step Test Run Guide

### 1. Check MySQL is Running

Make sure MySQL is running with these credentials:
- **Host**: localhost
- **Port**: 3306
- **User**: root
- **Password**: Th@1land

You can test the connection with:
```bash
mysql -u root -p
# Enter password: Th@1land
```

### 2. Create Environment File

If you don't have a `.env` file, create one in the root directory:

```bash
# Copy from example
copy env.example .env
```

Or create `.env` manually with:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Th@1land
DB_NAME=SynnexInvoiceExtractor_cursor
JWT_SECRET=your-secret-key-change-in-production-use-random-string
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Install Dependencies

If you haven't installed dependencies yet:

```bash
npm run install-all
```

This installs both root and client dependencies.

### 4. Start the Application

#### Option A: Run Both Backend and Frontend Together (Recommended)

```bash
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5000
- **Frontend App**: http://localhost:3000

#### Option B: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### 5. Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. Login with default admin credentials:
   - **Email**: admin@synnex.com
   - **Password**: admin123

### 6. Test the Application

#### Basic Tests:

1. **Login Test**
   - Go to http://localhost:3000
   - Login with admin credentials
   - Should redirect to Dashboard

2. **Database Connection Test**
   - If database doesn't exist, it will be created automatically
   - Tables will be created on first run
   - Default admin user will be created

3. **Upload Invoice Test**
   - Navigate to "Upload Invoice" page
   - Upload an image file (JPEG, PNG, GIF) or PDF
   - AI will extract invoice data automatically

4. **API Endpoint Test**
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/health
   - Test endpoint: http://localhost:5000/api/dashboard/stats (requires auth)

### 7. Verify Everything is Working

Check these indicators:

✅ **Backend Running**: 
- Terminal shows: "Server running on port 5000"
- No database connection errors

✅ **Frontend Running**:
- Browser opens to http://localhost:3000
- Login page loads without errors

✅ **Database Connected**:
- No MySQL connection errors in backend terminal
- Can login successfully

✅ **File Uploads**:
- Files are saved to `server/uploads/`
- No permission errors

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or change port in `.env`:**
```env
PORT=5001  # Change to available port
```

### MySQL Connection Error

1. Check MySQL is running:
   ```bash
   # Windows
   net start MySQL
   ```

2. Verify credentials in `.env` match your MySQL setup

3. Test connection manually:
   ```bash
   mysql -u root -p
   ```

### Dependencies Not Installed

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Frontend Build Issues

If you need to rebuild the frontend:

```bash
cd client
npm run build
cd ..
```

## Quick Test Commands

```bash
# Test backend only (no frontend)
npm run server

# Test frontend only (requires backend running separately)
npm run client

# Test both together
npm run dev

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

## Expected Output

When running `npm run dev`, you should see:

```
[0] Server running on port 5000
[0] Database connected successfully
[1] Compiled successfully!
[1] webpack compiled with 0 warnings
```

## Next Steps After Test Run

1. ✅ Change default admin password
2. ✅ Test invoice upload functionality
3. ✅ Test user registration and approval workflow
4. ✅ Test invoice review and approval process
5. ✅ Check JSON/XML export files in `server/exports/`

---

**Note**: The application will automatically create the database and tables on first run if they don't exist.

