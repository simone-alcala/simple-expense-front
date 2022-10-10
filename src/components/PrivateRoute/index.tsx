import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { axiosConfig } from '../../services/api/Api';

type Props = {
  children: JSX.Element;
}

function PrivateRoute({ children }: Props) {  
  const [authed, setAuthed] = useState(true);
  const { logout, getToken } = useAuth();
  
  useEffect(() => {
    const token = getToken();
    const promise = axiosConfig.post('/token', { token } );

    promise.then(() => setAuthed(true) );
    promise.catch(() => { 
      logout();
      setAuthed(false);
    });

  },[authed])
  
  return ( authed ? children : <Navigate to='/sign-in' replace={true} />);
}

export default PrivateRoute;