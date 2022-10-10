import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';


import { useAuth } from '../../contexts/AuthProvider';
import { findById, updateUser } from '../../services/api/UserApi';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main   from '../../components/Main';
import Form   from '../../components/Form';
import Footer from '../../components/Footer';

const styles = {
  input: { 
    marginTop: 1, 
    backgroundColor: '#FFF',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,  
  },
  button: {
    width: '150px',
    marginTop: 1, 
  },
  link: {
    width: '150px',
    marginTop: 1, 
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}

type userInfoType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

function User() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [userInfo, setUserInfo] = useState<userInfoType>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    type: '',
  });

  const [userType, setUserType] = useState('');

  function redirectListUser(){
    navigate('/users');
  }

  useEffect(() => {
    const promise = findById(id as string, token);
    promise.then((res) => setUserInfo({ ...res.data }));
  }, [])

  function handleSelectChange(event: SelectChangeEvent) {
    setUserType(event.target.value);

    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await sendInfo();
  }

  async function sendInfo() {
    
    try {
      await updateUser(id as string, userType, token);
      redirectListUser();
    } catch (err: any) {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    }
  }
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Edit user
        </Typography>

        { userInfo ? 

          <Form onSubmit={handleSubmit} justify='center'>

            <Typography variant='h4' component='h4' textAlign={'center'}>
              Create request item
            </Typography>

            <TextField sx={styles.input} id='firstName' label='First name' value={userInfo?.firstName} disabled/>

            <TextField sx={styles.input} id='lastName' label='last name' value={userInfo?.lastName} disabled/>

            <TextField sx={styles.input} id='email' label='email' value={userInfo?.email} disabled />

            <FormControl sx={styles.input} variant='outlined' required>

              <InputLabel id='userType' variant='outlined'> Type </InputLabel>

              <Select name='type' labelId='userType' value={ userInfo?.type } onChange={handleSelectChange}>
                <MenuItem key={1} value={'ADMIN'}>    ADMIN   </MenuItem> 
                <MenuItem key={2} value={'APPROVER'}> APPROVER</MenuItem> 
                <MenuItem key={3} value={'USER'}>     USER    </MenuItem> 
              </Select>

            </FormControl>

            <Box sx={styles.buttons}>
              <Typography sx={styles.link} 
                variant='overline' 
                component='h6' 
                onClick={redirectListUser}
              >
                List users
              </Typography>

              <Button sx={styles.button} 
                variant='contained' 
                color='primary' 
                type='submit' 
              >
                Save
              </Button>
            </Box>

          </Form> 

        : <></>
      }

      </Main>

      <Footer />

    </Layout>    

  );
}

export default User;