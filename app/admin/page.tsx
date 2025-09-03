'use client';

import { useState, useEffect } from 'react';
import { supabase, Ad } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdForm } from '@/components/ads/AdForm';
import { AdSystemGuide } from '@/components/ads/AdSystemGuide';
import { toast } from 'sonner';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  passport_number: string;
  departure_city: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  trip_type: 'round-trip' | 'one-way';
  passengers: number;
  travel_class: 'economy' | 'business' | 'first';
  preferred_airline: string | null;
  notes: string | null;
  passport_file_url: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
}

interface VisaApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  visa_type: string;
  duration: string;
  age: number;
  birth_year: number;
  passport_number: string;
  additional_notes: string | null;
  passport_file_url: string | null;
  bank_statement_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showVisaDetails, setShowVisaDetails] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [showAdGuide, setShowAdGuide] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportUrl, setPassportUrl] = useState<string | null>(null);
  const [adActionLoadingId, setAdActionLoadingId] = useState<string | null>(null);
  const [adActionType, setAdActionType] = useState<'toggle' | 'delete' | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (username === 'nuredin' && password === 'nure1234') {
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setBookings([]);
    setVisaApplications([]);
  };

  const fetchData = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch visa applications
      const { data: visaData, error: visaError } = await supabase
        .from('visa_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (visaError) throw visaError;

      // Fetch ads
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      setBookings(bookingsData || []);
      setVisaApplications(visaData || []);
      setAds(adsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const updateVisaStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('visa_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Visa application status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating visa application:', error);
      toast.error('Failed to update visa application status');
    }
  };

  const toggleAdStatus = async (id: string, isActive: boolean) => {
    try {
      setAdActionLoadingId(id);
      setAdActionType('toggle');
      const { error } = await supabase
        .from('ads')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Ad ${isActive ? 'activated' : 'deactivated'}`);
      // Optimistic local update
      setAds(prev => prev.map(a => (a.id === id ? { ...a, is_active: isActive } : a)));
      fetchData();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update ad status');
    } finally {
      setAdActionLoadingId(null);
      setAdActionType(null);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      setAdActionLoadingId(id);
      setAdActionType('delete');
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Ad deleted successfully');
      // Optimistic local removal
      setAds(prev => prev.filter(a => a.id !== id));
      fetchData();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
    } finally {
      setAdActionLoadingId(null);
      setAdActionType(null);
    }
  };

  const importPromotionalAds = async () => {
    try {
      const response = await fetch('/api/import-ads');
      if (response.ok) {
        toast.success('Promotional ads imported successfully');
        fetchData();
      } else {
        toast.error('Failed to import promotional ads');
      }
    } catch (error) {
      console.error('Error importing ads:', error);
      toast.error('Failed to import promotional ads');
    }
  };

  const testDatabaseConnection = async () => {
    try {
      // Test if ads table exists and is accessible
      const { data, error } = await supabase
        .from('ads')
        .select('id, title, ad_type')
        .limit(1);

      if (error) {
        console.error('Database connection test failed:', error);
        toast.error('Database connection failed. Please check your setup.');
        return false;
      }

      toast.success('Database connection is working!');
      return true;
    } catch (error) {
      console.error('Database test error:', error);
      toast.error('Database test failed');
      return false;
    }
  };

  const handleCreateAd = () => {
    setEditingAd(null);
    setShowAdForm(true);
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setShowAdForm(true);
  };

  const handleSaveAd = async (adData: Partial<Ad>) => {
    try {
      // Ensure all required fields are present
      const completeAdData = {
        ...adData,
        current_impressions: adData.current_impressions || 0,
        click_count: adData.click_count || 0,
        created_by: 'admin',
        updated_at: new Date().toISOString()
      };

      if (editingAd) {
        // Update existing ad
        const { error } = await supabase
          .from('ads')
          .update(completeAdData)
          .eq('id', editingAd.id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        toast.success('Ad updated successfully');
      } else {
        // Create new ad - ensure we have all required fields
        const newAdData = {
          ...completeAdData,
          id: crypto.randomUUID(), // Generate UUID for new ad
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('ads')
          .insert([newAdData]);

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        toast.success('Ad created successfully');
      }

      setShowAdForm(false);
      setEditingAd(null);
      fetchData();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast.error('Failed to save ad');
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900 font-semibold';
      case 'confirmed':
      case 'approved': return 'bg-green-500 text-green-900 font-semibold';
      case 'cancelled':
      case 'rejected': return 'bg-red-500 text-red-900 font-semibold';
      default: return 'bg-gray-500 text-gray-900 font-semibold';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter data based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVisaApplications = visaApplications.filter(visa => {
    const matchesSearch = 
      visa.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.visa_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || visa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Admin Login
            </CardTitle>
            <p className="text-gray-300 text-center">
              Enter your credentials to access the admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-white text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-white text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter password"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-300 text-sm text-center bg-red-500/20 p-2 rounded-lg">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl text-white">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20"
            >
              Logout
            </Button>
          </div>
          <p className="text-gray-300 text-lg">
            Manage bookings, visa applications, and track revenue
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">{bookings.length}</div>
              <div className="text-gray-300">Total Bookings</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">{visaApplications.length}</div>
              <div className="text-gray-300">Visa Applications</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">
                {bookings.filter(b => b.status === 'pending').length + visaApplications.filter(v => v.status === 'pending').length}
              </div>
              <div className="text-gray-300">Pending Applications</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="all" className="bg-slate-800 text-white">All Status</option>
              <option value="pending" className="bg-slate-800 text-white">Pending</option>
              <option value="confirmed" className="bg-slate-800 text-white">Confirmed</option>
              <option value="approved" className="bg-slate-800 text-white">Approved</option>
              <option value="cancelled" className="bg-slate-800 text-white">Cancelled</option>
              <option value="rejected" className="bg-slate-800 text-white">Rejected</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
            >
              Clear
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger 
              value="bookings" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
            >
              Bookings ({filteredBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="visa" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
            >
              Visa Applications ({filteredVisaApplications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="ads" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
            >
              Ads ({ads.length})
            </TabsTrigger>
            <TabsTrigger 
              value="guide" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
            >
              Ad Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No bookings found matching your criteria
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">{booking.customer_name}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Badge className="bg-blue-500 text-blue-900 font-semibold">
                              {booking.payment_status}
                            </Badge>
                          </div>
                          <div className="text-gray-300 text-sm space-y-1">
                            <div>📧 {booking.customer_email}</div>
                            <div>📞 {booking.customer_phone}</div>
                            <div>🛂 Passport: {booking.passport_number}</div>
                            <div>🛫 {booking.departure_city} → {booking.destination}</div>
                            <div>📅 {formatDate(booking.departure_date)} {booking.return_date && `- ${formatDate(booking.return_date)}`}</div>
                            <div>👥 {booking.passengers} passengers • {booking.travel_class} class</div>
                            <div>✈️ {booking.preferred_airline || 'Any airline'}</div>
                            {booking.notes && <div>📝 {booking.notes}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingDetails(true);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={booking.status === 'cancelled'}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visa" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Visa Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVisaApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No visa applications found matching your criteria
                    </div>
                  ) : (
                    filteredVisaApplications.map((visa) => (
                    <div key={visa.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">{visa.applicant_name}</h3>
                            <Badge className={getStatusColor(visa.status)}>
                              {visa.status}
                            </Badge>
                            <Badge className="bg-purple-500 text-purple-900 font-semibold">
                              {visa.visa_type}
                            </Badge>
                          </div>
                          <div className="text-gray-300 text-sm space-y-1">
                            <div>📧 {visa.applicant_email}</div>
                            <div>👤 Age: {visa.age} • Birth Year: {visa.birth_year}</div>
                            <div>📋 Passport: {visa.passport_number}</div>
                            <div>⏱️ Duration: {visa.duration}</div>
                            <div>📅 Applied: {formatDate(visa.application_date)}</div>
                            {visa.additional_notes && <div>📝 {visa.additional_notes}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVisa(visa);
                              setShowVisaDetails(true);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateVisaStatus(visa.id, 'approved')}
                            disabled={visa.status === 'approved'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateVisaStatus(visa.id, 'rejected')}
                            disabled={visa.status === 'rejected'}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Advertisements Management</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={importPromotionalAds}
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                    >
                      Import Pre-made Ads
                    </Button>
                    <Button
                      onClick={handleCreateAd}
                      className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
                    >
                      Create New Ad
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ads.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No ads found. Create your first advertisement!
                    </div>
                  ) : (
                    ads.map((ad) => (
                      <div key={ad.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">{ad.title}</h3>
                              <Badge className={ad.is_active ? 'bg-green-500 text-green-900' : 'bg-gray-500 text-gray-900'}>
                                {ad.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge className="bg-blue-500 text-blue-900">
                                {ad.ad_type}
                              </Badge>
                              <Badge className="bg-purple-500 text-purple-900">
                                {ad.content_type}
                              </Badge>
                            </div>
                            <div className="text-gray-300 text-sm space-y-1">
                              <div>📝 {ad.description}</div>
                              <div>🎯 Target: {ad.target_audience} • Priority: {ad.priority}</div>
                              <div>📊 Impressions: {ad.current_impressions} • Clicks: {ad.click_count}</div>
                              <div>🔗 CTA: {ad.cta_text} → {ad.cta_url}</div>
                              <div>📅 Created: {formatDate(ad.created_at)}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAd(ad)}
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleAdStatus(ad.id, !ad.is_active)}
                              className={ad.is_active ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}
                              disabled={adActionLoadingId === ad.id && adActionType === 'toggle'}
                            >
                              {adActionLoadingId === ad.id && adActionType === 'toggle' ? 'Working...' : ad.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteAd(ad.id)}
                              disabled={adActionLoadingId === ad.id && adActionType === 'delete'}
                            >
                              {adActionLoadingId === ad.id && adActionType === 'delete' ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="mt-6">
            <AdSystemGuide />
          </TabsContent>
        </Tabs>

        {/* Booking Details Modal */}
        {showBookingDetails && selectedBooking && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingDetails(false)}
          >
            <div 
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBookingDetails(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <p className="text-white font-medium">{selectedBooking.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium">{selectedBooking.customer_email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Phone</label>
                      <p className="text-white font-medium">{selectedBooking.customer_phone}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Passport Number</label>
                      <p className="text-white font-medium font-mono">{selectedBooking.passport_number}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Status</label>
                      <Badge className={getStatusColor(selectedBooking.status)}>
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Trip Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Route</label>
                      <p className="text-white font-medium">{selectedBooking.departure_city} → {selectedBooking.destination}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Trip Type</label>
                      <p className="text-white font-medium capitalize">{selectedBooking.trip_type}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Departure Date</label>
                      <p className="text-white font-medium">{formatDate(selectedBooking.departure_date)}</p>
                    </div>
                    {selectedBooking.return_date && (
                      <div>
                        <label className="text-gray-400 text-sm">Return Date</label>
                        <p className="text-white font-medium">{formatDate(selectedBooking.return_date)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-gray-400 text-sm">Passengers</label>
                      <p className="text-white font-medium">{selectedBooking.passengers}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Travel Class</label>
                      <p className="text-white font-medium capitalize">{selectedBooking.travel_class}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Preferred Airline</label>
                      <p className="text-white font-medium">{selectedBooking.preferred_airline || 'Any airline'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                      Additional Notes
                    </h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Passport Preview (if available) */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Passport Preview
                  </h3>
                  {selectedBooking.passport_file_url ? (
                    <div className="space-y-3">
                      {/* File Preview */}
                      <div className="flex justify-center">
                        <div className="bg-white/10 p-4 rounded-lg border border-white/20 max-w-md w-full">
                          {selectedBooking.passport_file_url.toLowerCase().includes('.pdf') ? (
                            <div className="text-center">
                              <div className="text-4xl mb-2">📄</div>
                              <p className="text-white/70 text-sm">PDF Document</p>
                              <p className="text-white/50 text-xs">Click view to preview</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <img 
                                src={selectedBooking.passport_file_url} 
                                alt="Passport Copy Preview" 
                                className="max-w-full h-32 object-contain rounded-md bg-white/5 mx-auto"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'block';
                                }}
                              />
                              <div className="text-center hidden">
                                <div className="text-4xl mb-2">🖼️</div>
                                <p className="text-white/70 text-sm">Image Document</p>
                                <p className="text-white/50 text-xs">Preview not available</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                          onClick={() => window.open(selectedBooking.passport_file_url!, '_blank')}
                        >
                          👁️ View Document
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                          onClick={async () => {
                            try {
                              const response = await fetch(selectedBooking.passport_file_url!);
                              const blob = await response.blob();
                              
                              // Get the original filename from the URL
                              const urlParts = selectedBooking.passport_file_url!.split('/');
                              const originalFilename = urlParts[urlParts.length - 1];
                              
                              // Create blob with proper MIME type
                              const newBlob = new Blob([blob], { type: blob.type });
                              const url = window.URL.createObjectURL(newBlob);
                              
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = originalFilename || 'passport_copy';
                              link.style.display = 'none';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Download failed:', error);
                              toast.error('Download failed. Please try again.');
                            }
                          }}
                        >
                          📥 Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="bg-white/10 p-6 rounded-lg border-2 border-dashed border-white/20">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-white/70 text-sm">No passport copy uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/20">
                  <Button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                    disabled={selectedBooking.status === 'confirmed'}
                    className="flex-1"
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                    disabled={selectedBooking.status === 'cancelled'}
                    className="flex-1"
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visa Application Details Modal */}
        {showVisaDetails && selectedVisa && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVisaDetails(false)}
          >
            <div 
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Visa Application Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVisaDetails(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Applicant Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <p className="text-white font-medium">{selectedVisa.applicant_name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium">{selectedVisa.applicant_email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Age</label>
                      <p className="text-white font-medium">{selectedVisa.age} years old</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Birth Year</label>
                      <p className="text-white font-medium">{selectedVisa.birth_year}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Status</label>
                      <Badge className={getStatusColor(selectedVisa.status)}>
                        {selectedVisa.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Visa Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Visa Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Visa Type</label>
                      <p className="text-white font-medium">{selectedVisa.visa_type}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Duration</label>
                      <p className="text-white font-medium">{selectedVisa.duration}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Passport Number</label>
                      <p className="text-white font-medium font-mono">{selectedVisa.passport_number}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Application Date</label>
                      <p className="text-white font-medium">{formatDate(selectedVisa.application_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedVisa.additional_notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                      Additional Notes
                    </h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg">{selectedVisa.additional_notes}</p>
                  </div>
                )}

                {/* Documents Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                    Documents Preview
                  </h3>
                  
                  {/* Bank Statement */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                    <div className="text-center text-gray-400 mb-3">
                      🏦 Bank Statement Preview
                    </div>
                    {selectedVisa.bank_statement_url ? (
                      <div className="space-y-3">
                        {/* File Preview */}
                        <div className="flex justify-center">
                          <div className="bg-white/10 p-4 rounded-lg border border-white/20 max-w-md w-full">
                            {selectedVisa.bank_statement_url.toLowerCase().includes('.pdf') ? (
                              <div className="text-center">
                                <div className="text-4xl mb-2">📄</div>
                                <p className="text-white/70 text-sm">PDF Document</p>
                                <p className="text-white/50 text-xs">Click view to preview</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <img 
                                  src={selectedVisa.bank_statement_url} 
                                  alt="Bank Statement Preview" 
                                  className="max-w-full h-32 object-contain rounded-md bg-white/5 mx-auto"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'block';
                                  }}
                                />
                                <div className="text-center hidden">
                                  <div className="text-4xl mb-2">🖼️</div>
                                  <p className="text-white/70 text-sm">Image Document</p>
                                  <p className="text-white/50 text-xs">Preview not available</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                            onClick={() => window.open(selectedVisa.bank_statement_url!, '_blank')}
                          >
                            👁️ View Document
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                            onClick={async () => {
                              try {
                                const response = await fetch(selectedVisa.bank_statement_url!);
                                const blob = await response.blob();
                                
                                // Get the original filename from the URL
                                const urlParts = selectedVisa.bank_statement_url!.split('/');
                                const originalFilename = urlParts[urlParts.length - 1];
                                
                                // Create blob with proper MIME type
                                const newBlob = new Blob([blob], { type: blob.type });
                                const url = window.URL.createObjectURL(newBlob);
                                
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = originalFilename || 'bank_statement';
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed:', error);
                                toast.error('Download failed. Please try again.');
                              }
                            }}
                          >
                            📥 Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="bg-white/10 p-6 rounded-lg border-2 border-dashed border-white/20">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-white/70 text-sm">No bank statement uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Passport Copy */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="text-center text-gray-400 mb-3">
                      🛂 Passport Copy Preview
                    </div>
                    {selectedVisa.passport_file_url ? (
                      <div className="space-y-3">
                        {/* File Preview */}
                        <div className="flex justify-center">
                          <div className="bg-white/10 p-4 rounded-lg border border-white/20 max-w-md w-full">
                            {selectedVisa.passport_file_url.toLowerCase().includes('.pdf') ? (
                              <div className="text-center">
                                <div className="text-4xl mb-2">📄</div>
                                <p className="text-white/70 text-sm">PDF Document</p>
                                <p className="text-white/50 text-xs">Click view to preview</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <img 
                                  src={selectedVisa.passport_file_url} 
                                  alt="Passport Copy Preview" 
                                  className="max-w-full h-32 object-contain rounded-md bg-white/5 mx-auto"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'block';
                                  }}
                                />
                                <div className="text-center hidden">
                                  <div className="text-4xl mb-2">🖼️</div>
                                  <p className="text-white/70 text-sm">Image Document</p>
                                  <p className="text-white/50 text-xs">Preview not available</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                            onClick={() => window.open(selectedVisa.passport_file_url!, '_blank')}
                          >
                            👁️ View Document
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                            onClick={async () => {
                              try {
                                const response = await fetch(selectedVisa.passport_file_url!);
                                const blob = await response.blob();
                                
                                // Get the original filename from the URL
                                const urlParts = selectedVisa.passport_file_url!.split('/');
                                const originalFilename = urlParts[urlParts.length - 1];
                                
                                // Create blob with proper MIME type
                                const newBlob = new Blob([blob], { type: blob.type });
                                const url = window.URL.createObjectURL(newBlob);
                                
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = originalFilename || 'passport_copy';
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed:', error);
                                toast.error('Download failed. Please try again.');
                              }
                            }}
                          >
                            📥 Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="bg-white/10 p-6 rounded-lg border-2 border-dashed border-white/20">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-white/70 text-sm">No passport copy uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/20">
                  <Button
                    onClick={() => updateVisaStatus(selectedVisa.id, 'approved')}
                    disabled={selectedVisa.status === 'approved'}
                    className="flex-1"
                  >
                    Approve Visa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateVisaStatus(selectedVisa.id, 'rejected')}
                    disabled={selectedVisa.status === 'rejected'}
                    className="flex-1"
                  >
                    Reject Visa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ad Form Modal */}
        {showAdForm && (
          <AdForm
            ad={editingAd}
            onClose={() => {
              setShowAdForm(false);
              setEditingAd(null);
            }}
            onSave={handleSaveAd}
            isEditing={!!editingAd}
          />
        )}
      </div>
    </div>
  );
}
