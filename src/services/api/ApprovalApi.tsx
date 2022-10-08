import { axiosConfig, getBearerToken } from './Api';

type createRequest = { 
  comment: string,
  status: 'APPROVED' | 'REJECTED' | 'REVIEW'
};

export async function create(data: createRequest, requestId: string, token: string) {
  const bearer = getBearerToken(token);
  return await axiosConfig.post(`/approvals/${requestId}`, data, bearer);
}


