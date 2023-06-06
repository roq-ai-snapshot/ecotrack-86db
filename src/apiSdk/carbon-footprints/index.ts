import axios from 'axios';
import queryString from 'query-string';
import { CarbonFootprintInterface } from 'interfaces/carbon-footprint';
import { GetQueryInterface } from '../../interfaces';

export const getCarbonFootprints = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/carbon-footprints${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCarbonFootprint = async (carbonFootprint: CarbonFootprintInterface) => {
  const response = await axios.post('/api/carbon-footprints', carbonFootprint);
  return response.data;
};

export const updateCarbonFootprintById = async (id: string, carbonFootprint: CarbonFootprintInterface) => {
  const response = await axios.put(`/api/carbon-footprints/${id}`, carbonFootprint);
  return response.data;
};

export const getCarbonFootprintById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/carbon-footprints/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCarbonFootprintById = async (id: string) => {
  const response = await axios.delete(`/api/carbon-footprints/${id}`);
  return response.data;
};
