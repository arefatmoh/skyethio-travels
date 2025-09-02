'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function VisaForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    destination: '',
    visa_type: '',
    travel_date: '',
    documents_url: '',
    additional_info: ''
  });

  const destinations = [
    'Dubai, UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 
    'United States', 'Canada', 'Thailand', 'Kenya', 'Uganda'
  ];

  const visaTypes = [
    { value: 'tourist', label: 'Tourist Visa' },
    { value: 'business', label: 'Business Visa' },
    { value: 'student', label: 'Student Visa' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('visa_applications')
        .insert([{
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          destination: formData.destination,
          visa_type: formData.visa_type,
          travel_date: formData.travel_date,
          documents_url: formData.documents_url,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Visa application submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        destination: '',
        visa_type: '',
        travel_date: '',
        documents_url: '',
        additional_info: ''
      });

    } catch (error) {
      console.error('Error submitting visa application:', error);
      toast.error('Failed to submit visa application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Visa Application
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                required
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone">Phone Number *</Label>
            <Input
              id="customer_phone"
              type="tel"
              required
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Visa Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) => handleInputChange('destination', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visa_type">Visa Type *</Label>
              <Select
                value={formData.visa_type}
                onValueChange={(value) => handleInputChange('visa_type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {visaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travel_date">Planned Travel Date *</Label>
            <Input
              id="travel_date"
              type="date"
              required
              value={formData.travel_date}
              onChange={(e) => handleInputChange('travel_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents_url">Documents (Optional)</Label>
            <Input
              id="documents_url"
              type="text"
              value={formData.documents_url}
              onChange={(e) => handleInputChange('documents_url', e.target.value)}
              placeholder="Link to your documents (Google Drive, Dropbox, etc.)"
            />
            <p className="text-sm text-gray-500">
              You can upload your passport, photos, and other required documents to a cloud service and share the link here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => handleInputChange('additional_info', e.target.value)}
              placeholder="Any additional information about your visa application..."
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Visa Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
