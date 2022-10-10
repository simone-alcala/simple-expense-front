import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

type Props = {
  children: JSX.Element;
}

function AuthRoute({ children }: Props) {  

  const { getToken } = useAuth();

  const token = getToken();
  
  return ( token ? <Navigate to='/' replace={true} /> : children );
}

export default AuthRoute;