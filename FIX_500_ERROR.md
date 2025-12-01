# 🔧 Fix 500 Internal Server Error

## Problem
Getting "500 Internal Server Error" when creating or updating invoices.

## Root Cause
The manual entry route was using `computedHasSignatures` variable before it was defined, and missing `received_by_signature` and `delivered_by_signature` fields from request body.

## ✅ Fix Applied

Updated the manual entry route to:
1. Extract `received_by_signature` and `delivered_by_signature` from request body
2. Compute `has_signatures` before using it
3. Properly handle all signature fields

---

## What Was Fixed

### Before (Broken):
```javascript
const { ..., has_signatures } = req.body;
// ... later ...
has_signatures: computedHasSignatures || null, // ❌ computedHasSignatures not defined!
```

### After (Fixed):
```javascript
const { ..., received_by_signature, delivered_by_signature, has_signatures } = req.body;

// Compute has_signatures
let computedHasSignatures = has_signatures;
if (!computedHasSignatures) {
  if (received_by_signature === "Yes" || delivered_by_signature === "Yes") {
    computedHasSignatures = "Yes";
  } else {
    computedHasSignatures = "No";
  }
}
// ... later ...
has_signatures: computedHasSignatures || null, // ✅ Now defined!
```

---

## Files Updated

- ✅ `server/routes/invoices.js` - Fixed manual entry route

---

## Next Steps

1. ✅ **Restart server**: `npm run dev`
2. ✅ **Test manual entry** - should work now
3. ✅ **Test invoice upload** - should work now

---

## If Still Getting 500 Error

Check server console logs for the actual error message. Common issues:

1. **Database columns missing** - Run `update_signature_fields.sql`
2. **Database constraint** - Run `remove_invoice_number_unique.sql`
3. **Missing environment variables** - Check `.env` file

---

**The 500 error should be fixed now!** 🎉
