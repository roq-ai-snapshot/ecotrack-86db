import axios from 'axios';
import queryString from 'query-string';
import { SustainabilityGoalInterface } from 'interfaces/sustainability-goal';
import { GetQueryInterface } from '../../interfaces';

export const getSustainabilityGoals = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/sustainability-goals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSustainabilityGoal = async (sustainabilityGoal: SustainabilityGoalInterface) => {
  const response = await axios.post('/api/sustainability-goals', sustainabilityGoal);
  return response.data;
};

export const updateSustainabilityGoalById = async (id: string, sustainabilityGoal: SustainabilityGoalInterface) => {
  const response = await axios.put(`/api/sustainability-goals/${id}`, sustainabilityGoal);
  return response.data;
};

export const getSustainabilityGoalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/sustainability-goals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSustainabilityGoalById = async (id: string) => {
  const response = await axios.delete(`/api/sustainability-goals/${id}`);
  return response.data;
};
