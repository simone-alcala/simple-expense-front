import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

import { useAuth } from '../../contexts/AuthProvider';
import { create } from '../../services/api/RequestItemApi';
import { findAll } from '../../services/api/ExpenseApi';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main   from '../../components/Main';
import Form   from '../../components/Form';
import Footer from '../../components/Footer';
import InputDate from '../../components/InputDate';

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
  },
  upload: {
    width: '100%',
    marginTop: 1, 
  },
  icon: {
    marginRight: '10px',
  }
}

type FormDataType = {
  expenseId: number | null | string;
  amount: number | null;
  date: string | null;
  observation?: string;
  receipt?: string;
}

type listExpenses = {
  id: number;
  description: string;
  type: string;
}

function RequestItem() {

  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [date, setDate] = useState<Dayjs | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<listExpenses[]>([]);
  const [disableButton, setDisableButton] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({ 
    expenseId: null,
    amount: null,
    date: null,
    observation: '',
    receipt: ''
  });

  function listRequestItems(){
    navigate(`/requests/${requestId}/items`);
  }

  function handleInputDate(newValue: Dayjs | null) {
    setDate(newValue);
    setFormData({
      ...formData,
      date: dayjs(newValue).format('DD/MM/YYYY'),
    });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    
    setFormData({
      ...formData,
      receipt: '',
    });
    setFileName(null);
    
    const files = event.target.files as FileList; 
    const file = files[0];
    let fileSize = 0;
    let fileType = '';
    let base64: string | ArrayBuffer | null | undefined;

    if (files.length > 0) {

      setFileName(file.name);
      fileSize = file.size;
      fileType = file.type;

      if (fileSize / 1024 / 1024 > 1) {
        alert('File can not be larger than 1MB');
        return null;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (fileRead: ProgressEvent<FileReader>) {
        base64 = fileRead.target?.result;
        setFormData({
          ...formData,
          receipt: base64 as string,
        });
      }
    }
    
  }

  function handleSelectChange(event: SelectChangeEvent) {
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
    const { expenseId, amount, date, observation, receipt } = formData;
    try {
      await create({
        expenseId: Number(expenseId), 
        amount: Number(amount), 
        date: date as string, 
        observation, receipt 
      }, Number(requestId), token);  
      resetForm()
    } catch (err: any) {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    }
    setDisableButton(false);
  }

  function resetForm() {
    setFormData({
      ...formData,
      expenseId: null,
      amount: 0,
      date: null,
      observation: '',
      receipt: ''
    });
  
    setDate(null);
  }

  useEffect(() => {
    const promise = findAll(token);
    promise.then(res => setExpenses([...res.data]));
    promise.catch(err => console.log(err));
  },[])

  return (
    <Layout>

      <Header />

      <Main defaultHeight={true}>

        <Form onSubmit={handleSubmit} justify='center'>

          <Typography variant='h4' component='h4' textAlign={'center'}>
            Create request item
          </Typography>

          <InputDate id='date' 
            name='date' 
            label='Date' 
            value={date} 
            onChange={handleInputDate} 
          />

          <FormControl sx={styles.input} variant='outlined' required>

            <InputLabel id='expense' variant='outlined'>
              Expense
            </InputLabel>

            <Select name='expenseId' labelId='expense' 
              value={ formData.expenseId?.toString() } 
              onChange={handleSelectChange} 
              defaultValue={''}
            >
              <MenuItem value=''></MenuItem> 
              
              {expenses?.map( (expense, index) => 
                <MenuItem key={index} value={expense.id}>{expense.description}</MenuItem> 
              )}

            </Select>
          </FormControl>

          <TextField sx={styles.input} id='amount' 
            name='amount' 
            label='Amount' 
            value={formData.amount} 
            onChange={handleInputChange} 
            type="number"  
            required
          />

          <TextField sx={styles.input} id='observation' 
            name='observation' 
            label='Observation' 
            value={formData.observation} 
            onChange={handleInputChange}
          />

          <Box>
            <Button sx={styles.upload} variant='contained' component='label' color={fileName === null ? 'warning' : 'success'}>
              {fileName === null ?
                <> <PhotoCamera sx={styles.icon}/> Upload receipt </> :
                <> <PhotoCamera sx={styles.icon}/> {fileName} </>
              }
              <input type='file' hidden accept='image/*' id='receipt' name='receipt' onChange={handleFileChange}/>
            </Button>
          </Box>

          <Box sx={styles.buttons}>
            <Typography sx={styles.link} 
              variant='overline' 
              component='h6' 
              onClick={listRequestItems}
            >
              List request items
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

export default RequestItem;
