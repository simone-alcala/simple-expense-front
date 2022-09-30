import { axiosConfig } from './Api';

type SignUp = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

type SignIn = {
  email: string;
  password: string;
}

export async function signUp(data: SignUp) {
  return await axiosConfig.post('/sign-up', data);
}

export async function signIn(data: SignIn) {
  return await axiosConfig.post('/sign-in', data);
}