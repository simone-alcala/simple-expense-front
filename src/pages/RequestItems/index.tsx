import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { useAuth } from '../../contexts/AuthProvider';
import { findById } from '../../services/api/RequestApi';
import { findByRequestIdAll, sendRequestToApproval, deleteByItemId } from '../../services/api/RequestItemApi';

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
  receipt: string,
  status: string,
}

function RequestItems() {
  
  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [requestItemList, setRequestItemList] = useState<requestItemListType[]>([]);
  const [status, setStatus] = useState('');

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

  function showReceipt(receipt: string) {
    const newTab = window.open();
    if (newTab !== null) {
      newTab.document.body.innerHTML = `<img src=${receipt} style="height: 100%;">`;
    } else {
      alert('Receipt is unavailable');
    }
  }

  function redirectItemEdit(itemId: number) {
    navigate(`/requests/${requestId}/items/${itemId}/edit`, { replace: true } );
  }

  useEffect(() => {
    getItemsInfo();
    getRequestInfo();
  }, []);

  function getItemsInfo() {
    const promise = findByRequestIdAll(Number(requestId), token);
    promise.then((res) => setRequestItemList([...res.data]));
    promise.catch((err) => console.log(err));
  }

  function getRequestInfo() {
    if (requestId) {
      const promise = findById(requestId, token);
      promise.then((res) => setStatus(res.data.status));
      promise.catch((err) => console.log(err));
    }
  }

  function deleteItem(id: number) {
    
    const promise = deleteByItemId(requestId as string, id.toString(), token);
    promise.then((res) => {
      getItemsInfo();
      getRequestInfo();
    });
    promise.catch((err) => {
      console.log(err);
      alert(`${err.response.data || err.message}`);
    });    
  }
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Request items
        </Typography>

        <TableContainer component={Paper}>

          <Table>
          
            <TableHead>

              <TableRow>
                <TableCell> Request: {requestId} </TableCell>
                <TableCell> Status: {status} </TableCell>
                
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>

              </TableRow>

              <TableRow>

                <TableCell>               Date       </TableCell>
                <TableCell>               Expense    </TableCell>
                <TableCell align='right'> Amount     </TableCell>
                <TableCell>               Observation</TableCell>
                <TableCell align='center'>Receipt    </TableCell>
                <TableCell align='center'>Edit       </TableCell>
                <TableCell align='center'>Delete     </TableCell>

              </TableRow>

            </TableHead>
          
            <TableBody> 

              {requestItemList?.map((item) => ( 

                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell >                {item.date}        </TableCell>
                  <TableCell >                {item.expense}     </TableCell>
                  <TableCell align='right'>   {item.amount}      </TableCell>
                  <TableCell >                {item.observation} </TableCell>

                  <TableCell align='center'> {
                    item.receipt === '' || item.receipt === null ? 
                      <ImageNotSupportedOutlinedIcon/> : 
                      <ImageSearchIcon sx={{ cursor:  'pointer' }} onClick={() => showReceipt(item.receipt)}/>
                    }   
                  </TableCell>

                  <TableCell align='center'> {
                    (status !== 'OPEN' && status !== 'REVIEW') ? 
                      <EditOffOutlinedIcon/> : 
                      <EditOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => redirectItemEdit(item.id)}/>
                    }   
                  </TableCell>

                  <TableCell align='center'> {
                    (status !== 'OPEN' && status !== 'REVIEW') ? 
                      <EditOffOutlinedIcon/> : 
                      <RemoveCircleOutlineIcon sx={{ cursor: 'pointer' }} onClick={() => deleteItem(item.id)}/>
                    }   
                  </TableCell>

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
            disabled={ status !== 'OPEN' }
          >
            New item
          </Button>
        </Box>

        <Button sx={styles.send} 
          variant='contained' 
          color='success' 
          component='label'
          onClick={sendToApproval}
          disabled={ !(status === 'OPEN' || status === 'REVIEW') }
        >
          Send to approval
        </Button>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default RequestItems;