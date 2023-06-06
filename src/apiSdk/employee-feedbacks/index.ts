import axios from 'axios';
import queryString from 'query-string';
import { EmployeeFeedbackInterface } from 'interfaces/employee-feedback';
import { GetQueryInterface } from '../../interfaces';

export const getEmployeeFeedbacks = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/employee-feedbacks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmployeeFeedback = async (employeeFeedback: EmployeeFeedbackInterface) => {
  const response = await axios.post('/api/employee-feedbacks', employeeFeedback);
  return response.data;
};

export const updateEmployeeFeedbackById = async (id: string, employeeFeedback: EmployeeFeedbackInterface) => {
  const response = await axios.put(`/api/employee-feedbacks/${id}`, employeeFeedback);
  return response.data;
};

export const getEmployeeFeedbackById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/employee-feedbacks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmployeeFeedbackById = async (id: string) => {
  const response = await axios.delete(`/api/employee-feedbacks/${id}`);
  return response.data;
};
