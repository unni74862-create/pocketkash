// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


export const authApi = {
  // Signup
  signup: async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      // Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Login
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      // Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get all users (for testing)
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      return data;
    } catch (error) {
      console.error('Fetch users error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Save user profile (onboarding)
  saveProfile: async (userId: string, profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...profileData }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save profile');
      }
      return data;
    } catch (error) {
      console.error('Save profile error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Forgot password - request password reset
  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process password reset request');
      }
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password - reset password with token
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      // Store token if returned
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.id) {
        throw new Error('User not found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },
};
