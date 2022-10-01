import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthProvider';
import { create } from '../../services/api/ExpenseApi';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main   from '../../components/Main';
import Form   from '../../components/Form';
import Footer from '../../components/Footer';

const expenseTypes = [
  'ACCOMMODATION',
  'CLEANING',
  'OFFICE',
  'MEAL',
  'TRANSPORT',
  'OTHER' 
];

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
  type: string,
}

function Expense() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [disableButton, setDisableButton] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({ 
    description: '',
    type: '',
  });

  function listExpenses(){
    navigate('/expenses');
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
    const { description, type } = formData;
    try {
      const token = getToken() || '';
      await create({ description, type }, token);    
      listExpenses();
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
            Create expense
          </Typography>

          <TextField sx={styles.input} id='description' 
            name='description' 
            label='Description' 
            value={formData.description} 
            onChange={handleInputChange}   
            required
          />

          <TextField sx={styles.input} id='type'
            select
            name='type' 
            label='Type'
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            {expenseTypes.map((expenseType) => (
              <MenuItem key={expenseType} value={expenseType}>
                {expenseType}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={styles.buttons}>
            <Typography sx={styles.link} 
              variant='overline' 
              component='h6' 
              onClick={listExpenses}
            >
              List expenses
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

export default Expense;