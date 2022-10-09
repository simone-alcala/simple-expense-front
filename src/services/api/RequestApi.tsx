import { AxiosResponse } from 'axios';
import { axiosConfig, getBearerToken } from './Api';

type listRequests = {
  id: number;
  description: string;
  createdDate: string;
  status: string;
  amount: number;
  requesterId: number;
  approverComment: string;
}

type requestByStatus = {
  id: number;
  description: string;
  amount: number;
  createdDate: string;
  status: string;
  requesterId: number;
  requesterName: string;
  requestItems: {
    id: number;
    amount: number;
    date: string;
    observation: string,
    receipt: string,
    expenseId: number,
    expenseDesc: string,
  }[];
}

type requestType = {
  id: number;
  description: string;
  amount: number;
  createdDate: string;
  status: string;
  requesterId: number;
}

type createRequest = { description: string };

export async function create(data: createRequest, token: string) :  Promise<AxiosResponse<{requestId: number}>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.post('/requests', data, bearer);
}

export async function findAll(token: string) : Promise<AxiosResponse<listRequests[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get('/requests', bearer);
}

export async function findByStatus(status: string, token: string) : Promise<AxiosResponse<requestByStatus[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get(`/requests/status/${status}`, bearer);
}

export async function findById(requestId: string, token: string) : Promise<AxiosResponse<requestType>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get(`/requests/${requestId}`, bearer);
}
