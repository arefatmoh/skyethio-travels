# File Upload & Download Implementation Guide

## 🚀 **Current Status**

The admin dashboard now shows **placeholder passport and document previews** with download buttons. These are currently showing toast messages since the actual file upload functionality needs to be implemented.

## 🔧 **What's Already Working**

- ✅ **Document Preview Sections**: Shows where documents will appear
- ✅ **Download Buttons**: Ready for file download functionality
- ✅ **Professional UI**: Clean, organized document display
- ✅ **Toast Notifications**: User feedback for actions

## 📁 **Files to Update for Full Functionality**

### **1. Update Database Schema**

Add file storage fields to your tables:

```sql
-- Add to visa_applications table
ALTER TABLE visa_applications ADD COLUMN passport_file_url TEXT;
ALTER TABLE visa_applications ADD COLUMN bank_statement_url TEXT;

-- Add to bookings table  
ALTER TABLE bookings ADD COLUMN passport_file_url TEXT;
```

### **2. Update Form Components**

Modify `app/visa-application/page.tsx` and `app/book-ticket/page.tsx` to:
- Upload files to Supabase Storage
- Save file URLs to database
- Handle file validation and preview

### **3. Update Admin Dashboard**

Modify `app/admin/page.tsx` to:
- Display actual uploaded files
- Enable real file downloads
- Show file previews (images/PDFs)

## 🎯 **Implementation Steps**

### **Step 1: Supabase Storage Setup**
1. Create storage buckets in Supabase
2. Set up storage policies
3. Configure file upload limits

### **Step 2: File Upload in Forms**
1. Add file input handling
2. Upload to Supabase Storage
3. Save file URLs to database
4. Add file validation

### **Step 3: File Display in Admin**
1. Fetch file URLs from database
2. Display actual file previews
3. Implement file download functionality
4. Add file type detection

## 💡 **Recommended Features**

- **File Type Validation**: Only allow images and PDFs
- **File Size Limits**: Prevent large uploads
- **Image Preview**: Show thumbnails for images
- **PDF Preview**: Embed PDF viewer
- **Download Tracking**: Log who downloaded what
- **File Security**: Secure file access

## 🔒 **Security Considerations**

- **File Access Control**: Only admins can download
- **File Validation**: Prevent malicious uploads
- **Storage Policies**: Secure bucket access
- **User Permissions**: Role-based access control

## 📱 **Current User Experience**

Users can now:
- ✅ See where documents will appear
- ✅ Understand the document structure
- ✅ Access download buttons (with placeholder functionality)
- ✅ Get feedback via toast notifications

## 🚀 **Next Steps**

1. **Implement Supabase Storage**
2. **Add file upload to forms**
3. **Connect real files to admin dashboard**
4. **Test file download functionality**
5. **Add file preview capabilities**

The foundation is now perfect for adding real file functionality! 🎉
