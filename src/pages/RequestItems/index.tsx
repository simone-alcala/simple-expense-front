import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthProvider';
import { findByRequestIdAll, sendRequestToApproval } from '../../services/api/RequestItemApi';

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
  ,send: {
    width: '100%',
    marginTop: 1, 
  },

}

type requestItemListType = { 
  id: number,
  date: string, 
  expense: string,
  amount: number,
  observation: string,
  receipt: 'sim' | 'não',
}

function RequestItems() {
  
  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [requestItemList, setRequestItemList] = useState<requestItemListType[]>([]);

  function redirectRequests() {
    navigate('/requests');
  }

  function addRequestItem(){
    navigate(`/requests/${requestId}/items/add`);
  }

  function sendToApproval(){
    const promise = sendRequestToApproval(requestId as string, token);
    promise.then((res) => redirectRequests());
    promise.catch((err) => {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    });
  }

  useEffect(() => {
    const promise = findByRequestIdAll(Number(requestId), token);
    promise.then((res) => {
      const info: any[] = [];
      const { data } = res;
      data.map( item => {
        info.push({
          id: item.id,
          date: item.date,
          expense: item.expense,
          amount: item.amount,
          observation: item.observation,
          receipt: item.receipt ? 'sim' : 'não',
        })
      });
      
      setRequestItemList([...info])
    
    });
    
  }, [])
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Request items
        </Typography>

        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 300 }} aria-label="simple table">
          
            <TableHead>

              <TableRow>
                <TableCell>Date       </TableCell>
                <TableCell>Expense    </TableCell>
                <TableCell>Amount     </TableCell>
                <TableCell>Observation</TableCell>
                <TableCell>Receipt    </TableCell>
              </TableRow>

            </TableHead>
          
            <TableBody> 
              {requestItemList?.map((item) => ( 

                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell > {item.date}        </TableCell>
                  <TableCell > {item.expense}     </TableCell>
                  <TableCell > {item.amount}      </TableCell>
                  <TableCell > {item.observation} </TableCell>
                  <TableCell>  {item.receipt}     </TableCell>

                </TableRow>

              ))}

            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={styles.buttons}>
          <Typography sx={styles.link} 
            variant='overline' 
            component='h6' 
            onClick={redirectRequests}
          >
            List requests
          </Typography>

          <Button sx={styles.button} 
            variant='contained' 
            color='primary' 
            component='label'
            onClick={addRequestItem}
          >
            New item
          </Button>
        </Box>

        <Button sx={styles.send} 
            variant='contained' 
            color='success' 
            component='label'
            onClick={sendToApproval}
          >
            Send to approval
          </Button>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default RequestItems;