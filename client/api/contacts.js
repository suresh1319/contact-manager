import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://contact-manager-6hpy.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const fetchContacts = async (params = {}) => {
  const response = await apiClient.get('/contacts', { params });
  return response.data;
};

export const createContact = async (payload) => {
  const response = await apiClient.post('/contacts', payload);
  return response.data;
};

export const updateContact = async (id, payload) => {
  const response = await apiClient.put(`/contacts/${id}`, payload);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await apiClient.delete(`/contacts/${id}`);
  return response.data;
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  const data = error?.response?.data;
  return data?.error || data?.message || error?.message || fallback;
};

export const getApiErrorFields = (error) => {
  const data = error?.response?.data;
  return data?.errors || null;
};
