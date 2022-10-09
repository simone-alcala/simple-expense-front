import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
  },
  items: {
    cursor: 'pointer',
  }
}

type requestListType = { 
  id: number,
  createdDate: string,
  amount: number,
  status: string,
  description: string,
  requesterId: number,
  approverComment: string,
}

function Requests() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [requestList, setRequestList] = useState<requestListType[]>([]);

  function redirectHome(){
    navigate('/');
  }

  function openItems(requestId: number){
    navigate(`/requests/${requestId}/items`);
  }

  function addRequest(){
    navigate('/requests/add');
  }

  useEffect(() => {
    const token = getToken() || '';
    const promise = findAll(token);
    promise.then((res) => setRequestList([...res.data]));
    promise.catch((err) => console.log(err));

  }, [])
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Requests
        </Typography>

        <TableContainer component={Paper}>

          <Table>
          
            <TableHead>

              <TableRow>
                <TableCell align='center'>ID          </TableCell>
                <TableCell>               Date        </TableCell>
                <TableCell>               Description </TableCell>
                <TableCell align='right'> Amount      </TableCell>
                <TableCell>               Status      </TableCell>
                <TableCell>               Approver Comment      </TableCell>
                <TableCell align='center'>Items       </TableCell>
              </TableRow>

            </TableHead>
          
            <TableBody> 
              {requestList?.map((item) => ( 

                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell align='center'>{item.id}         </TableCell>
                  <TableCell >              {item.createdDate}</TableCell>
                  <TableCell >              {item.description}</TableCell>
                  <TableCell align='right'> {item.amount}     </TableCell>
                  <TableCell >              {item.status}     </TableCell>
                  <TableCell >              {item.approverComment}     </TableCell>
                  <TableCell align='center'>              
                    <KeyboardArrowRightIcon sx={ styles.items } onClick={()=>openItems(item.id)}/>     
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