# Supabase Migration Guide

This guide will help you migrate from MySQL to Supabase (PostgreSQL) for the Synnex Invoice Extractor application.

## Prerequisites

- Supabase account and project created
- Supabase project URL and API key
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Create a new project
3. Note down your:
   - Project URL (e.g., `https://gmhzouyrfbdasvestkvu.supabase.co`)
   - Anon/Public API Key (found in Settings > API)

## Step 2: Run Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase_schema.sql`
4. Click **Run** to execute the SQL
5. Verify tables are created: `users`, `invoices`, `prompts`

## Step 3: Update Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   JWT_SECRET=your-secret-key-change-in-production-use-random-string
   OPENAI_API_KEY=your-openai-api-key-here
   ```

## Step 4: Install Dependencies

Remove MySQL and ensure Supabase is installed:

```bash
npm uninstall mysql2
npm install @supabase/supabase-js
```

Or reinstall all dependencies:

```bash
npm install
```

## Step 5: Verify Database Connection

Start the server:

```bash
npm run dev
```

Check the console for:
- ✅ "Database initialized successfully"
- ❌ Any connection errors

## Step 6: Create Default Admin User

The application will automatically create a default admin user on first run:
- **Email**: kasem_u@synnex.co.th
- **Password**: admin123

**Important**: Change this password after first login!

## Step 7: Test the Application

1. Start the application: `npm run dev`
2. Open http://localhost:3000
3. Login with admin credentials
4. Test key features:
   - User registration
   - Invoice upload
   - Invoice list
   - Dashboard statistics

## Key Changes from MySQL to Supabase

### Database Structure

- **UUIDs instead of INT**: All IDs are now UUIDs (Universally Unique Identifiers)
- **JSONB instead of JSON**: Better performance for JSON data in PostgreSQL
- **BYTEA instead of LONGBLOB**: Binary data storage for file_data
- **TIMESTAMP WITH TIME ZONE**: Better timezone handling

### Query Changes

- **No more SQL strings**: Using Supabase client methods instead
- **Different join syntax**: Using Supabase's foreign key relationships
- **Pagination**: Using `.range()` instead of `LIMIT/OFFSET` in SQL

### File Storage

- Files are still stored locally in `server/uploads/`
- File data is stored as BYTEA in PostgreSQL
- Consider migrating to Supabase Storage for better scalability

## Troubleshooting

### Connection Errors

**Error**: "Missing Supabase configuration"
- **Solution**: Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in `.env`

**Error**: "Invalid API key"
- **Solution**: Verify your Supabase Anon Key is correct in `.env`

### Table Not Found Errors

**Error**: "relation 'users' does not exist"
- **Solution**: Run the SQL schema from `supabase_schema.sql` in Supabase SQL Editor

### Foreign Key Errors

**Error**: "foreign key constraint fails"
- **Solution**: Ensure tables are created in order (users first, then invoices)

### UUID Format Errors

**Error**: "invalid input syntax for type uuid"
- **Solution**: Make sure you're using UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

## Migration from Existing MySQL Data

If you have existing MySQL data to migrate:

1. **Export MySQL data**:
   ```bash
   mysqldump -u root -p SynnexInvoiceExtractor_cursor > backup.sql
   ```

2. **Convert data format**:
   - Convert INT IDs to UUIDs
   - Update JSON fields to JSONB format
   - Convert LONGBLOB to BYTEA

3. **Import to Supabase**:
   - Use Supabase SQL Editor or create a migration script
   - Or use Supabase's import tools

## Performance Considerations

- **Indexes**: Already created in the schema for optimal performance
- **Connection Pooling**: Supabase handles this automatically
- **Row Level Security**: Enabled but policies allow service role access

## Next Steps

1. ✅ Set up Supabase Storage for file uploads (optional)
2. ✅ Configure Row Level Security policies (if needed)
3. ✅ Set up database backups in Supabase
4. ✅ Monitor usage in Supabase dashboard

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Check GitHub repository

---

**Note**: The migration is complete. All MySQL queries have been replaced with Supabase client methods. The application should work identically to before, but now using Supabase as the database backend.

