import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { axiosConfig, getBearerToken } from './Api';

type requestItem = {
  id: number;
  requestId: number;
  expenseId: number;
  amount: number;
  date: string;
  observation?: string;
  receipt?: string;
}

type requestItems = {
  id: number;
  expense: string;
  amount: number;
  date: string;
  observation?: string;
  receipt?: string;
}

type createRequest = Omit<requestItem,'id' | 'requestId'>;

export async function create(data: createRequest, requestId: number, token: string) : 
    Promise<AxiosResponse<{requestItemId: number}>> {
  const bearer = getBearerToken(token);
  data = {
    ...data,
    expenseId: Number(data.expenseId),
    amount: Number(data.amount),
    date: data.date.split('/').reverse().join('-')
  }
  console.log(data);
  return await axiosConfig.post(`/request-items/${requestId}`, data, bearer);
}

export async function findByIdAll(id: number, token: string) : Promise<AxiosResponse<requestItem[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get(`/request-items/item/${id}`, bearer);
}

export async function findByRequestIdAll(requestId: number, token: string) : Promise<AxiosResponse<requestItems[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get(`/request-items/items/${requestId}`, bearer);
}

