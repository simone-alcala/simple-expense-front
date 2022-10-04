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

type createRequest = { description: string };

export async function create(data: createRequest, token: string) :  Promise<AxiosResponse<{requestId: number}>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.post('/requests', data, bearer);
}

export async function findAll(token: string) : Promise<AxiosResponse<listRequests[]>> {
  const bearer = getBearerToken(token);
  return await axiosConfig.get('/requests', bearer);
}

