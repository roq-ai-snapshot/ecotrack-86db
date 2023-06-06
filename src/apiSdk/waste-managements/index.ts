import axios from 'axios';
import queryString from 'query-string';
import { WasteManagementInterface } from 'interfaces/waste-management';
import { GetQueryInterface } from '../../interfaces';

export const getWasteManagements = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waste-managements${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWasteManagement = async (wasteManagement: WasteManagementInterface) => {
  const response = await axios.post('/api/waste-managements', wasteManagement);
  return response.data;
};

export const updateWasteManagementById = async (id: string, wasteManagement: WasteManagementInterface) => {
  const response = await axios.put(`/api/waste-managements/${id}`, wasteManagement);
  return response.data;
};

export const getWasteManagementById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waste-managements/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWasteManagementById = async (id: string) => {
  const response = await axios.delete(`/api/waste-managements/${id}`);
  return response.data;
};
