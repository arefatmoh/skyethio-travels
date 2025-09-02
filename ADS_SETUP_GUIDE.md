# 🚀 Ads System Setup Guide

## 📋 **Prerequisites**

Before the ads system can work, you need to set up the database tables.

## 🗄️ **Step 1: Run Database Migration**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `database-migration.sql`**
4. **Click "Run" to execute the migration**

This will create:
- ✅ `ads` table
- ✅ `bookings` table  
- ✅ `visa_applications` table
- ✅ `contact_inquiries` table
- ✅ All necessary indexes and policies

## 🔧 **Step 2: Verify Environment Variables**

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 **Step 3: Test the System**

### **Test Ads Import:**
1. **Visit your website** → Ads should auto-import from JSON
2. **Check browser console** → Should see import success message
3. **Go to Admin Dashboard** → Click "Import Pre-made Ads" button

### **Test Ad Display:**
1. **Visit homepage** → Should see popup ad with progress bar
2. **Wait for auto-close** → Progress bar should decrease and ad closes
3. **Navigate to other pages** → Ads should appear again

## 🎯 **Step 4: Admin Management**

1. **Go to `/admin`**
2. **Login with:** `nuredin` / `nure1234`
3. **Click "Ads" tab**
4. **Manage your ads:**
   - ✅ Activate/Deactivate ads
   - ✅ Delete ads
   - ✅ Import pre-made ads
   - ✅ View analytics (impressions, clicks)

## 🎨 **Ad Types Available:**

### **1. Popup Ads**
- **Display**: Full-screen overlay
- **Auto-close**: 8 seconds
- **Progress**: Top progress bar
- **Close methods**: X button, backdrop click, Escape key

### **2. Slide-in Ads**
- **Display**: Slides from right side
- **Auto-close**: 6 seconds
- **Progress**: Top progress bar
- **Close methods**: X button

### **3. Floating Ads**
- **Display**: Small corner ad
- **Auto-close**: 10 seconds
- **Progress**: Top progress bar
- **Close methods**: X button

### **4. Notification Ads**
- **Display**: Toast-style notification
- **Auto-close**: 5 seconds
- **Progress**: Top progress bar
- **Close methods**: X button

### **5. Banner Ads**
- **Display**: Full-width banner
- **Auto-close**: 15 seconds
- **Progress**: Top progress bar
- **Close methods**: X button

## 📊 **Pre-made Ads Included:**

The system comes with **15 pre-made promotional ads**:

1. 🌞 **Summer Travel Special** (Popup)
2. 🛂 **Visa Success Guarantee** (Slide-in)
3. ⭐ **Trusted Travel Partner** (Banner)
4. 🌍 **New Destinations Added** (Floating)
5. 👥 **Group Booking Discount** (Notification)
6. 💼 **Business Travel Solutions** (Banner)
7. ⚡ **Last Minute Deals** (Popup)
8. 💬 **Customer Testimonial** (Slide-in)
9. 🛡️ **Travel Insurance Included** (Floating)
10. 📱 **New Mobile App Available** (Notification)
11. 🌙 **Ramadan Travel Special** (Banner)
12. 🎓 **Student Travel Discount** (Slide-in)
13. 🏆 **Join Our Loyalty Program** (Floating)
14. 🦠 **Safe Travel Guarantee** (Banner)
15. 🏖️ **Weekend Getaway Deals** (Notification)

## 🔧 **Troubleshooting**

### **Error: "Ads table not accessible"**
- **Solution**: Run the database migration first
- **Check**: Make sure Supabase connection is working

### **Error: "Error checking existing ads"**
- **Solution**: Verify your Supabase URL and API key
- **Check**: Make sure the `ads` table exists

### **Ads not showing:**
- **Check**: Browser console for errors
- **Verify**: Database migration was successful
- **Test**: Manual import from admin dashboard

### **Progress bar not working:**
- **Check**: Browser console for JavaScript errors
- **Verify**: Ad component is rendering properly

## 🎉 **Success Indicators**

✅ **Database migration completed**  
✅ **Ads auto-import on website load**  
✅ **Ads display with progress bars**  
✅ **Auto-close timers work**  
✅ **Manual close (X button) works**  
✅ **Admin dashboard shows ads**  
✅ **Import button works**  
✅ **Ads reappear on page navigation**  

## 📞 **Need Help?**

If you encounter any issues:

1. **Check browser console** for error messages
2. **Verify database migration** was successful
3. **Test Supabase connection** in admin dashboard
4. **Check environment variables** are correct

The ads system is now fully functional! 🚀
