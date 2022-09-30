import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

import { signIn } from '../../services/api/AuthApi';

import Layout from '../../components/Layout';
import Main   from '../../components/Main';
import Form   from '../../components/Form';

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
  password: string,
}

function SignIn() {

  const navigate = useNavigate();

  const [disableButton, setDisableButton] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({ 
    email: '',
    password: '',
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function redirectSignUp(){
    navigate('/sign-up');
  }

  async function handleSubmit(event: FormEvent) {
    setDisableButton(true);
    event.preventDefault();
    await sendInfo();
  }

  async function sendInfo() {
    const { email, password } = formData;
    try {
      await signIn({ email, password }); 
      navigate('/');  
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
            Sign in
          </Typography>

          <TextField sx={styles.input} id='email' 
            name='email' 
            label='Email' 
            value={formData.email} 
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

          <Box sx={styles.buttons}>
            <Typography sx={styles.link} 
              variant='overline' 
              component='h6' 
              onClick={redirectSignUp}
            >
              Create account
            </Typography>

            <Button sx={styles.button} 
              variant='contained' 
              color='primary' 
              type='submit' 
              disabled={disableButton}
            >
              Login
            </Button>
          </Box>

        </Form>

      </Main>

    </Layout>    

  );
}

export default SignIn;