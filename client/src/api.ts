import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to inject Bearer token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/login', { email, password });
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || error.message || 'Login failed';
      if (error.response?.status === 429) {
        message = 'Too many attempts. Please wait 1 minute.';
      }
      return {
        success: false,
        message,
        status: error.response?.status || (error.code === 'ERR_NETWORK' ? 'Network Error' : 'Unknown')
      };
    }
  }

  async register(name: string, email: string, phone: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/register', {
        name, email, phone, password, password_confirmation
      });
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || error.message || 'Registration failed';

      if (error.response?.status === 429) {
        message = 'Too many attempts. Please wait 1 minute before trying again.';
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(' ');
      }

      return {
        success: false,
        message,
        status: error.response?.status || (error.code === 'ERR_NETWORK' ? 'Network Error' : 'Unknown')
      };
    }
  }

  async googleLogin(email?: string, name?: string) {
    try {
      if (!email || email.trim() === '') {
        toast.error("Please enter your Gmail address first!");
        return { success: false, message: 'Gmail required' };
      }

      const targetEmail = email.trim();
      const isAdmin = targetEmail === 'rahator44@gmail.com';

      // Derive a name from the email handle if none provided (e.g. "rifat" from "rifat@gmail.com")
      const emailHandle = targetEmail.split('@')[0];
      const derivedName = emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1);

      const mockGoogleUser = {
        name: name || (isAdmin ? 'Admin Rifat' : derivedName),
        email: targetEmail,
        provider_id: `google_${emailHandle}`,
      };

      // Send to backend to create/login user
      const response = await this.client.post('/api/social-login', mockGoogleUser);
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || error.message || 'Google Login failed';
      if (error.response?.status === 429) {
        message = 'Too many attempts. Please wait 1 minute.';
      }
      return {
        success: false,
        message,
        status: error.response?.status || (error.code === 'ERR_NETWORK' ? 'Network Error' : 'Unknown')
      };
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.post('/api/forgot-password', { email });
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset code',
        status: error.response?.status
      };
    }
  }

  async resetPassword(data: any) {
    try {
      const response = await this.client.post('/api/reset-password', data);
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        status: error.response?.status
      };
    }
  }

  // Handle common errors
  handleError(error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(`API Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      // Request was made, but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something went wrong while setting up the request
      console.error('API Error:', error.message);
    }

    toast.error(error.message || 'Something went wrong');
  }

  // --- Event Methods ---

  async getEvents() {
    try {
      const response = await this.client.get('/api/events');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'Failed to fetch events' };
    }
  }

  async bookEvent(eventId: number, paymentMethod: string, quantity: number = 1) {
    try {
      const response = await this.client.post('/api/bookings', {
        event_id: eventId,
        quantity,
        payment_method: paymentMethod
      });
      return { success: true, ...response.data };
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || error.message || 'Booking failed';
      if (error.response?.status === 401) {
        message = 'Please login to book this event';
      }
      return { success: false, message, status: error.response?.status };
    }
  }

  // --- Admin Methods ---

  async getAdminStats() {
    try {
      const response = await this.client.get('/api/admin/stats');
      return { success: true, data: response.data.stats };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'Failed to fetch stats' };
    }
  }

  async getAdminUsers() {
    try {
      const response = await this.client.get('/api/admin/users');
      return { success: true, data: response.data.users };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'Failed to fetch users' };
    }
  }

  async toggleUserStatus(userId: number) {
    try {
      const response = await this.client.post(`/api/admin/users/${userId}/toggle`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'Failed to update user' };
    }
  }

  async deleteUser(userId: number) {
    try {
      const response = await this.client.delete(`/api/admin/users/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: 'Failed to suspend user' };
    }
  }
}

export default ApiClient;
