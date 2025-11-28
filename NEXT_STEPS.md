# Next Steps - Supabase Migration Checklist

Follow these steps to complete the migration and get your application running with Supabase:

## ✅ Step 1: Create .env File

Copy the example environment file:

```bash
copy env.example .env
```

Or manually create `.env` with these values (already configured in env.example):

```env
PORT=5000
SUPABASE_URL=https://gmhzouyrfbdasvestkvu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw
JWT_SECRET=your-secret-key-change-in-production-use-random-string
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: Update `OPENAI_API_KEY` with your actual OpenAI API key if you haven't already.

---

## ✅ Step 2: Set Up Supabase Database Schema

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Open SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create new query**: Click "New query"
4. **Copy and paste** the entire contents of `supabase_schema.sql`
5. **Run the query**: Click "Run" or press `Ctrl+Enter`
6. **Verify tables created**: Go to "Table Editor" and confirm you see:
   - `users` table
   - `invoices` table
   - `prompts` table

---

## ✅ Step 3: Remove MySQL Dependency (if still installed)

Check if mysql2 is still installed:

```bash
npm list mysql2
```

If it shows mysql2, remove it:

```bash
npm uninstall mysql2
```

---

## ✅ Step 4: Verify Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

This will ensure `@supabase/supabase-js` is properly installed.

---

## ✅ Step 5: Test the Application

Start the development server:

```bash
npm run dev
```

**Expected output:**
- ✅ "Database initialized successfully"
- ✅ Server running on port 5000
- ✅ Frontend running on port 3000

**If you see errors:**
- ❌ "Missing Supabase configuration" → Check `.env` file exists and has correct values
- ❌ "Invalid API key" → Verify `SUPABASE_ANON_KEY` in `.env`
- ❌ "relation 'users' does not exist" → Run `supabase_schema.sql` in Supabase SQL Editor

---

## ✅ Step 6: Test Login

1. Open browser: http://localhost:3000
2. Login with default admin:
   - **Email**: kasem_u@synnex.co.th
   - **Password**: admin123
3. **Change admin password** after first login!

---

## ✅ Step 7: Verify Key Features

Test these features to ensure everything works:

- [ ] **User Registration**: Register a new user
- [ ] **User Approval**: Approve pending users (Admin only)
- [ ] **Invoice Upload**: Upload an invoice image
- [ ] **Invoice List**: View list of invoices
- [ ] **Dashboard**: Check dashboard statistics
- [ ] **Manual Entry**: Create invoice manually
- [ ] **Review/Approve**: Review and approve invoices (Supervisor/Admin)

---

## 🔧 Troubleshooting

### Database Connection Issues

**Error**: "Missing Supabase configuration"
- **Solution**: Create `.env` file from `env.example`

**Error**: "Invalid API key" or "Invalid URL"
- **Solution**: Double-check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes

### Table Not Found Errors

**Error**: "relation 'users' does not exist"
- **Solution**: Run `supabase_schema.sql` in Supabase SQL Editor
- Verify tables exist in Supabase Table Editor

### Foreign Key Errors

**Error**: "foreign key constraint fails"
- **Solution**: Ensure tables are created in order (users → invoices → prompts)
- Re-run the entire `supabase_schema.sql` script

### UUID Format Errors

**Error**: "invalid input syntax for type uuid"
- **Solution**: This shouldn't happen with auto-generated UUIDs
- If migrating data, ensure IDs are converted to UUID format

---

## 📝 Additional Notes

1. **File Storage**: Files are still stored locally in `server/uploads/`. Consider migrating to Supabase Storage later for better scalability.

2. **Row Level Security**: RLS is enabled but policies allow service role access. Adjust policies in Supabase if needed.

3. **Backups**: Set up automatic backups in Supabase dashboard (Settings → Database → Backups)

4. **Monitoring**: Monitor your Supabase usage in the dashboard to stay within free tier limits.

---

## 🎉 Success Criteria

You're done when:
- ✅ Application starts without errors
- ✅ Can login with admin account
- ✅ Can upload invoices
- ✅ Can view invoice list
- ✅ Dashboard shows statistics
- ✅ All CRUD operations work

---

## 📚 Need Help?

- Check `SUPABASE_MIGRATION.md` for detailed migration guide
- Supabase Docs: https://supabase.com/docs
- Check console logs for specific error messages

---

**Current Status**: Migration code is complete. Follow steps above to set up database and test!

