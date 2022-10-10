import { AxiosResponse } from 'axios';
import { axiosConfig, getBearerToken } from './Api';

type listUsers = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

export async function findAll(token: string) : Promise<AxiosResponse<listUsers[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get('/users', bearer);
}

export async function findById(id: string, token: string) : Promise<AxiosResponse<listUsers>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get(`/users/${id}`, bearer);
}

export async function updateUser(id: string, type: string, token: string) {
  const bearer = getBearerToken(token);
  return await axiosConfig.patch(`/users/${id}`, { type }, bearer);
}