import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthProvider';
import { findAll } from '../../services/api/ExpenseApi';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main   from '../../components/Main';
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

type expenseListType = { 
  id: number,
  description: string,
  type: string,
}

function Expenses() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [expenseList, setExpenseList] = useState<expenseListType[]>([]);

  function redirectHome(){
    navigate('/');
  }

  function addExpense(){
    navigate('/expenses/add');
  }

  useEffect(() => {
    const token = getToken() || '';
    const promise = findAll(token);
    promise.then((res) => setExpenseList([...res.data]));

  }, [expenseList])
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Expenses
        </Typography>

        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 300 }} aria-label="simple table">
          
            <TableHead>

              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>

            </TableHead>
          
            <TableBody> 
              {expenseList.map((item) => ( 

                <TableRow key={item.description} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell component='th' scope='row'>  {item.description} </TableCell>
                  <TableCell >{item.type}</TableCell>

                </TableRow>

              ))}

            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={styles.buttons}>
          <Typography sx={styles.link} 
            variant='overline' 
            component='h6' 
            onClick={redirectHome}
          >
            Home
          </Typography>

          <Button sx={styles.button} 
            variant='contained' 
            color='primary' 
            component='label'
            onClick={addExpense}
          >
            New expense
          </Button>
        </Box>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default Expenses;