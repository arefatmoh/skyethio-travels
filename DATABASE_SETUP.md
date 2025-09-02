# Database Setup Guide

## 🚀 **Step 1: Update Your Supabase Database**

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run the migration script**: Copy and paste the contents of `database-migration.sql` into the SQL editor and run it

This will:
- ✅ Drop old tables
- ✅ Create new tables with correct schema
- ✅ Add sample data for testing
- ✅ Set up proper indexes and security policies

## 🔧 **Step 2: Verify Your Environment Variables**

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 **Step 3: Test the Forms**

1. **Start your development server**: `npm run dev`
2. **Test Booking Form** (`/book-ticket`):
   - Fill out the form
   - Submit - data should save to `bookings` table
   - Check Supabase dashboard to see the new record

3. **Test Visa Form** (`/visa-application`):
   - Fill out the form
   - Submit - data should save to `visa_applications` table
   - Check Supabase dashboard to see the new record

## 📊 **Step 4: Check Admin Dashboard**

Visit `/admin` to see:
- ✅ All submitted bookings
- ✅ All visa applications
- ✅ Real-time data from your database

## 🔍 **Troubleshooting**

If forms don't save:
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Check Supabase dashboard for table structure
4. Ensure RLS policies allow insert operations

## 📱 **What's Now Working**

- ✅ **Booking Form**: Saves to `bookings` table
- ✅ **Visa Form**: Saves to `visa_applications` table
- ✅ **Real-time Updates**: Admin dashboard shows live data
- ✅ **Toast Notifications**: Success/error messages
- ✅ **Form Validation**: Client-side validation before submission
- ✅ **Data Persistence**: Form data saved to localStorage until submitted

## 🎯 **Next Steps**

1. **Customize the forms** further if needed
2. **Add file upload functionality** for documents
3. **Implement email notifications** when forms are submitted
4. **Add payment integration** for bookings
5. **Set up automated workflows** for visa processing

Your forms are now fully integrated with Supabase! 🎉
