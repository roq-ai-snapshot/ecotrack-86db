import axios from 'axios';
import queryString from 'query-string';
import { SustainabilityInitiativeInterface } from 'interfaces/sustainability-initiative';
import { GetQueryInterface } from '../../interfaces';

export const getSustainabilityInitiatives = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/sustainability-initiatives${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSustainabilityInitiative = async (sustainabilityInitiative: SustainabilityInitiativeInterface) => {
  const response = await axios.post('/api/sustainability-initiatives', sustainabilityInitiative);
  return response.data;
};

export const updateSustainabilityInitiativeById = async (
  id: string,
  sustainabilityInitiative: SustainabilityInitiativeInterface,
) => {
  const response = await axios.put(`/api/sustainability-initiatives/${id}`, sustainabilityInitiative);
  return response.data;
};

export const getSustainabilityInitiativeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/sustainability-initiatives/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteSustainabilityInitiativeById = async (id: string) => {
  const response = await axios.delete(`/api/sustainability-initiatives/${id}`);
  return response.data;
};
