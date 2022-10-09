import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

import { useAuth } from '../../contexts/AuthProvider';
import { findByRequestIdAndItemId, updateItem } from '../../services/api/RequestItemApi';
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
  id: number | null,
  requestId: number | null,
  expenseId: number | null | string,
  amount: number | null | string,
  date: string | null,
  observation: string,
  receipt: string,
  status: string
}

type listExpenses = {
  id: number;
  description: string;
  type: string;
}

function RequestItemEdit() {

  const { id: requestId, itemId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [date, setDate] = useState<Dayjs | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<listExpenses[]>([]);
  const [disableButton, setDisableButton] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({ 
    id: null,
    expenseId: null,
    requestId: null,
    amount: null,
    date: null,
    observation: '',
    receipt: '',
    status: ''
  });
  const [defaultExpense, setDefaultExpense] = useState<string >('');

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
      await updateItem({
        expenseId: Number(expenseId), 
        amount: Number(amount), 
        date: date as string, 
        observation, 
        receipt 
      },
      requestId as string, itemId as string, token);  
      listRequestItems();
    } catch (err: any) {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    }
    setDisableButton(false);
  }

  useEffect(() => {
    getItemsInfo();
    getExpenses();
  },[]);

  function getItemsInfo() {
    if (itemId && requestId) {
      const promise = findByRequestIdAndItemId(itemId, requestId, token);
      promise.then(res => {
        setFormData({ ...res.data })
        setDate(dayjs(res.data.date));
        setDefaultExpense(res.data.expenseId?.toString());
        if (res.data.receipt !== '') {
          setFileName('receipt.png');
        }
      });
      promise.catch(err => console.log(err));
    }
  }

  function getExpenses() {
    const promise = findAll(token);
    promise.then(res => setExpenses([...res.data]));
    promise.catch(err => console.log(err));
  }

  if (formData.amount) {

    return (
      <Layout>

        <Header />

        <Main defaultHeight={true}>

          <Form onSubmit={handleSubmit} justify='center'>

            <Typography variant='h4' component='h4' textAlign={'center'}>
              Edit request item
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
                defaultValue={defaultExpense}
              >              
                {expenses?.map( (expense, index) => 
                  <MenuItem key={index} value={expense.id.toString()} > {expense.description} </MenuItem> 
                )}

              </Select>
            </FormControl>

            <TextField sx={styles.input} id='amount' 
              name='amount' 
              label='Amount' 
              value={formData.amount} 
              onChange={handleInputChange} 
              type='number' 
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
                Save
              </Button>
            </Box>

          </Form>

        </Main>

        <Footer />
        
      </Layout>    

    ) 

  } else {

    <Layout>
      <Header />
      <Main defaultHeight={true}>
      </Main>
      <Footer />
    </Layout>    

  }
}

export default RequestItemEdit;
