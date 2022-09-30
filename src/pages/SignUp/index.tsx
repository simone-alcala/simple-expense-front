import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

import { signUp } from '../../services/api/AuthApi';

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

type FormDataType = {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string
}

function SignUp() {

  const navigate = useNavigate();

  const [disableButton, setDisableButton] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({ 
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function redirectSignIn(){
    navigate('/sign-in');
  }

  async function handleSubmit(event: FormEvent) {
    setDisableButton(true);
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Password and confirm password do not match');
      setDisableButton(false);
      return;
    }
    await sendInfo();
  }

  async function sendInfo() {
    const { email, password, firstName, lastName } = formData;
    try {
      await signUp({ email, password, firstName, lastName });    
      redirectSignIn();
    } catch (err: any) {
      console.log(err);
      alert(`${err.response.data || err.message}`);
      setDisableButton(false);
    }
  }

  return (
    <Layout>

      <Main>

        <Form onSubmit={handleSubmit} justify='center'>

          <Typography variant='h4' component='h4' textAlign={'center'}>
            Create account
          </Typography>

          <TextField sx={styles.input} id='email' 
            name='email' 
            label='Email' 
            value={formData.email} 
            onChange={handleInputChange}   
            required
          />
        
          <TextField sx={styles.input} id='firstName' 
            name='firstName' 
            label='First name' 
            value={formData.firstName} 
            onChange={handleInputChange}   
            required
          />

          <TextField sx={styles.input} id='lastName' 
            name='lastName' 
            label='Last name' 
            value={formData.lastName} 
            onChange={handleInputChange}   
            required
          />
        
          <TextField sx={styles.input} id='password' 
            name='password' 
            label='Password' 
            value={formData.password} 
            onChange={handleInputChange}   
            type="password"
            required
          />

          <TextField sx={styles.input} id='confirmPassword' 
            name='confirmPassword' 
            label='Confirm password' 
            value={formData.confirmPassword} 
            onChange={handleInputChange}  
            type="password"
            required 
          />

          <Box sx={styles.buttons}>
            <Typography sx={styles.link} 
              variant='overline' 
              component='h6' 
              onClick={redirectSignIn}
            >
              Sign in instead
            </Typography>

            <Button sx={styles.button} 
              variant='contained' 
              color='primary' 
              type='submit' 
              disabled={disableButton}
            >
              Sign up
            </Button>
          </Box>

        </Form>

      </Main>

    </Layout>    

  );
}

export default SignUp;