# 🚀 Supabase Setup for SkyEthio Travels

## 📋 Prerequisites
- Node.js installed
- Supabase account (free at https://supabase.com)

## 🛠️ Step-by-Step Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Choose organization
5. Enter project name: `skyethio-travels`
6. Enter database password (save it!)
7. Choose region (closest to your users)
8. Click "Create new project"

### 2. Get Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-schema.sql`
3. Paste and run the SQL commands
4. This creates:
   - `bookings` table
   - `visa_applications` table
   - `contact_inquiries` table
   - Proper indexes and policies

### 4. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 5. Test the Setup
1. Start your development server: `npm run dev`
2. Visit `/book-ticket` to test booking form
3. Visit `/visa-application` to test visa form
4. Visit `/admin` to see the admin dashboard

## 📊 Database Schema Overview

### Bookings Table
- Customer information (name, email, phone)
- Travel details (destination, dates, passengers)
- Financial info (total amount, payment status)
- Status tracking (pending, confirmed, cancelled)

### Visa Applications Table
- Customer information
- Visa details (type, destination, travel date)
- Document links
- Status tracking (pending, approved, rejected)

### Contact Inquiries Table
- Basic contact information
- Message content
- Status tracking

## 🔐 Security Notes
- Row Level Security (RLS) is enabled
- All operations are allowed for admin dashboard
- In production, add proper authentication

## 🚀 Features Implemented

### ✅ User Features
- **Booking Form**: Submit flight booking requests
- **Visa Form**: Submit visa applications
- **Form Validation**: Required fields and data validation
- **Success Notifications**: Toast notifications on submission

### ✅ Admin Features
- **Dashboard Overview**: Summary cards with key metrics
- **Booking Management**: View and update booking status
- **Visa Management**: View and update visa application status
- **Revenue Tracking**: Total revenue calculation
- **Real-time Updates**: Automatic refresh after status changes

### ✅ Technical Features
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Loading indicators during operations

## 🎯 Next Steps (Optional)

### 1. Add Authentication
```bash
npm install @supabase/auth-helpers-nextjs
```

### 2. Add File Upload
- Configure Supabase Storage
- Add file upload for visa documents

### 3. Add Email Notifications
- Use Supabase Edge Functions
- Send confirmation emails

### 4. Add Payment Integration
- Integrate Stripe or PayPal
- Update payment status automatically

## 🐛 Troubleshooting

### Common Issues:
1. **"Invalid API key"**: Check your `.env.local` file
2. **"Table doesn't exist"**: Run the SQL schema first
3. **"RLS policy violation"**: Check database policies in Supabase

### Debug Mode:
Add this to see detailed logs:
```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## 📞 Support
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Check the GitHub repository

---

**🎉 Your travel agency is now powered by Supabase!**
