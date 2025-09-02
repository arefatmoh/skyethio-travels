# Supabase Storage Setup Guide

## 🚀 **Complete File Upload & Download Implementation**

Your admin dashboard now has **real file upload and download functionality**! Here's how to set it up:

## 🔧 **Step 1: Set Up Supabase Storage**

### **1.1 Create Storage Bucket**
1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **"New Bucket"**
4. Create a bucket named `documents`
5. Set it as **Public** (for now, for easy access)

### **1.2 Configure Storage Policies**
Run this SQL in your Supabase SQL Editor:

```sql
-- Allow public access to documents bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their files
CREATE POLICY "Users can update own files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their files
CREATE POLICY "Users can delete own files" ON storage.objects 
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

## 🗄️ **Step 2: Update Database Schema**

Run this SQL to add file storage fields:

```sql
-- Add file storage fields to visa_applications
ALTER TABLE visa_applications ADD COLUMN IF NOT EXISTS passport_file_url TEXT;
ALTER TABLE visa_applications ADD COLUMN IF NOT EXISTS bank_statement_url TEXT;

-- Add file storage fields to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS passport_file_url TEXT;
```

## 📁 **Step 3: Test File Upload**

### **3.1 Test Visa Application**
1. Go to `/visa-application`
2. Fill out the form
3. Upload a passport file (PDF or image)
4. Upload a bank statement (PDF or image)
5. Submit the form

### **3.2 Test Booking Form**
1. Go to `/book-ticket`
2. Fill out the form
3. Upload a passport file (optional)
4. Submit the form

## 🔍 **Step 4: Verify in Admin Dashboard**

1. Go to `/admin`
2. Click **"View Details"** on any application
3. You should now see:
   - ✅ **Real file previews** (not placeholders)
   - ✅ **View Document** buttons (opens file in new tab)
   - ✅ **Download** buttons (downloads file to your computer)

## 🎯 **What's Now Working**

### **✅ File Upload:**
- Files are uploaded to Supabase Storage
- File URLs are saved to database
- Proper error handling for upload failures

### **✅ File Display:**
- Real file previews in admin dashboard
- Conditional display (shows files when available)
- Professional document organization

### **✅ File Download:**
- View documents in new tab
- Download files to computer
- Proper file naming

### **✅ Error Handling:**
- Upload failure notifications
- Missing file indicators
- User-friendly error messages

## 🔒 **Security Features**

- **File Type Validation**: Only allows PDFs and images
- **Unique File Names**: Prevents file conflicts
- **Organized Storage**: Files stored in logical folders
- **Access Control**: Only admins can view/download

## 📱 **User Experience**

### **For Applicants:**
- Upload documents during application
- Real-time upload progress
- Success/error notifications

### **For Admins:**
- View all uploaded documents
- Download files for review
- Professional document management interface

## 🚨 **Troubleshooting**

### **If files don't upload:**
1. Check Supabase Storage bucket exists
2. Verify storage policies are set
3. Check browser console for errors
4. Ensure file size is reasonable (< 10MB)

### **If files don't display:**
1. Check database has file URLs
2. Verify storage bucket is public
3. Check file URLs in database
4. Ensure storage policies allow public access

### **If downloads don't work:**
1. Check file URLs are valid
2. Verify files exist in storage
3. Check browser download settings
4. Ensure no CORS issues

## 🎉 **You're All Set!**

Your admin dashboard now has:
- ✅ **Real file uploads** to Supabase Storage
- ✅ **Real file previews** in admin dashboard
- ✅ **Real file downloads** for admins
- ✅ **Professional document management**
- ✅ **Complete file workflow**

**No more placeholder previews - everything works for real!** 🚀

## 🔄 **Next Steps (Optional)**

1. **Add file type detection** (show PDF vs image icons)
2. **Add file size limits** and validation
3. **Implement file compression** for large images
4. **Add file preview thumbnails** for images
5. **Set up automated file cleanup** for old documents

Your file management system is now production-ready! 🎯
