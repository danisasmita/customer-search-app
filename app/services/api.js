import { useEffect } from 'react';

const BASE_URL = 'http://localhost:8080';

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Promise<Object>} 
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user and store auth token
 * @param {Object} credentials 
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('authToken', data.token);
      document.cookie = `authToken=${data.token}; path=/; max-age=86400; SameSite=Strict`;
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Initialize auth token from localStorage (call on app init)
 */
let authToken = null;

export const initializeAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      authToken = token;
    }
  }
};

export const logout = () => {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};


/**
 * Search customers by account number, email, or name
 * @param {string} identifier -
 * @param {string} [identifierType] 
 * @returns {Promise<Object>} 
 */
export const searchCustomers = async (identifier, identifierType) => {
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    if (!identifierType) {
      if (identifier.includes('@')) {
        identifierType = 'email';
      } else if (/^\d+$/.test(identifier)) {
        identifierType = 'account_number';
      } else {
        identifierType = 'name';
      }
    }
    
    try {
      const response = await fetch(`${BASE_URL}/customers?${identifierType}=${encodeURIComponent(identifier)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch customer data');
      }
      
      return data;
    } catch (error) {
      console.error('Customer search error:', error);
      throw error;
    }
  };