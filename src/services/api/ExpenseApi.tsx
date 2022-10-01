import { AxiosResponse } from 'axios';
import { axiosConfig, getBearerToken } from './Api';

type listExpenses = {
  id: number;
  description: string;
  type: string;
}

type createExpense = Omit<listExpenses,'id'>;

export async function create(data: createExpense, token: string) {
  const bearer = getBearerToken(token);
  return await axiosConfig.post('/expenses', data, bearer);
}

export async function findAll(token: string) : Promise<AxiosResponse<listExpenses[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get('/expenses', bearer);
}

