import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthProvider';
import { findAll } from '../../services/api/RequestApi';

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

type requestListType = { 
  id: number,
  date: string,
  amount: number,
  status: string,
}

function Requests() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [requestList, setRequestList] = useState<requestListType[]>([]);

  function redirectHome(){
    navigate('/');
  }

  function addRequest(){
    navigate('/requests/add');
  }

  useEffect(() => {
    const token = getToken() || '';
    const promise = findAll(token);
    promise.then((res) => {
      const info: any[] = [];
      const { data } = res;
      data.map( item => {
        info.push({
          id: item.id,
          date: item.createdDate,
          amount: item.amount,
          status: item.status,
        })
      });
      
      setRequestList([...info])
    });

  }, [])
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Requests
        </Typography>

        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 300 }} aria-label="simple table">
          
            <TableHead>

              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>

            </TableHead>
          
            <TableBody> 
              {requestList?.map((item) => ( 

                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell > {item.id}      </TableCell>
                  <TableCell > {item.date}    </TableCell>
                  <TableCell > {item.amount}  </TableCell>
                  <TableCell > {item.status}  </TableCell>

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
            onClick={addRequest}
          >
            New request
          </Button>
        </Box>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default Requests;