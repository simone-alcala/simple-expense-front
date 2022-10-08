import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthProvider';
import { create } from '../../services/api/RequestApi';

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
  description: string,  
}

function Request() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [disableButton, setDisableButton] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({ 
    description: '',
  });

  function listRequests(){
    navigate('/requests');
  }

  function redirectToRequestItem(requestId: number){
    navigate(`/requests/${requestId}/items/add`);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent) {
    setDisableButton(true);
    event.preventDefault();
    await sendInfo();
  }

  async function sendInfo() {
    const { description } = formData;
    try {
      const token = getToken() || '';
      const response = await create({ description }, token);  
      redirectToRequestItem(response.data.requestId);
    } catch (err: any) {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    }
    setDisableButton(false);
  }

  return (
    <Layout>

      <Header />

      <Main defaultHeight={true}>

        <Form onSubmit={handleSubmit} justify='center'>

          <Typography variant='h4' component='h4' textAlign={'center'}>
            Create request
          </Typography>

          <TextField sx={styles.input} id='description' 
            name='description' 
            label='Description' 
            value={formData.description} 
            onChange={handleInputChange}   
            required
          />

          <Box sx={styles.buttons}>
            <Typography sx={styles.link} 
              variant='overline' 
              component='h6' 
              onClick={listRequests}
            >
              List requests
            </Typography>

            <Button sx={styles.button} 
              variant='contained' 
              color='primary' 
              type='submit' 
              disabled={disableButton}
            >
              Add
            </Button>
          </Box>

        </Form>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default Request;