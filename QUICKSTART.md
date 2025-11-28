# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

## 2. Start MySQL

Make sure MySQL is running on localhost:3306 with:

- User: root
- Password: Th@1land

## 3. Start the Application

```bash
npm run dev
```

This starts:

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 4. Login

Open http://localhost:3000 and login with:

- **Email**: kasem_u@synnex.co.th
- **Password**: admin123

## 5. First Actions

1. **Approve Users**: Go to "User Management" → Approve pending users
2. **Upload Invoice**: Go to "Upload Invoice" → Upload an image file
3. **View Results**: Check "Invoice List" to see extracted data
4. **Review**: Supervisors can review and approve/reject invoices

## Features Overview

- ✅ **Upload**: Drag & drop invoice images
- ✅ **AI Extraction**: Automatic data extraction using ChatGPT Vision
- ✅ **Manual Entry**: Enter invoice data manually
- ✅ **Review**: Supervisors approve/reject invoices
- ✅ **Edit**: Edit extracted data
- ✅ **Export**: JSON and XML files auto-generated
- ✅ **Dashboard**: View statistics and charts

## File Locations

- **Uploaded Files**: `server/uploads/`
- **JSON Exports**: `server/exports/json/`
- **XML Exports**: `server/exports/xml/`

## Default Admin

- Email: kasem_u@synnex.co.th
- Password: admin123
- **⚠️ Change this password after first login!**

## Need Help?

See SETUP.md for detailed setup instructions or README.md for full documentation.




