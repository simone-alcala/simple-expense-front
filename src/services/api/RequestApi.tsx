import { AxiosResponse } from 'axios';
import { axiosConfig, getBearerToken } from './Api';

type listRequests = {
  id: number;
  description: string;
  createdDate: Date;
  status: string;
  amount: number;
  requesterId: number;
  requestItems: any[];
  approvals: any[];
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

