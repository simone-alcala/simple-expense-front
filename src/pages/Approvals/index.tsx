import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { useAuth } from '../../contexts/AuthProvider';
import { findByStatus } from '../../services/api/RequestApi';
import { create } from '../../services/api/ApprovalApi';

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
  id: number;
  description: string;
  amount: number;
  createdDate: string;
  status: string;
  requesterId: number;
  requesterName: string;
  requestItems: {
    id: number;
    amount: number;
    date: string;
    observation: string,
    receipt: string,
    expenseId: number,
    expenseDesc: string,
  }[],
}

type approval = {
  requestId: string;
  comment: string;
}

function Approvals() {

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken() || '';

  const [open, setOpen] = useState<any>({});
  const [requestList, setRequestList] = useState<requestListType[]>([]);

  function redirectHome(){
    navigate('/');
  }

  function approveRequest(){
    const dataApproval = getSelected();
    dataApproval?.map(data => data.comment === '' ? data.comment = 'Default comment: OK' : data.comment = data.comment);
    if (dataApproval) {
      sendToApproval(dataApproval,'APPROVED');
    }
  }

  function rejectRequest(){
    const dataApproval = getSelected();
    if (dataApproval) {
      for (let item of dataApproval) {
        if (item.comment === '' || item.comment === null) {
          alert('Comment is mandatory to reject request(s)');
          return;
        }
      }
      sendToApproval(dataApproval,'REJECTED');
    }
  }

  function reviewRequest(){
    const dataApproval = getSelected();
    if (dataApproval) {
      for (let item of dataApproval) {
        if (item.comment === '' || item.comment === null) {
          alert('Comment is mandatory to review request(s)');
          return;
        }
      }
      sendToApproval(dataApproval,'REVIEW');
    }
  }

  function showReceipt(receipt: string) {
    const newTab = window.open();
    if (newTab !== null) {
      newTab.document.body.innerHTML = `<img src=${receipt} style="height: 100%;">`;
    } else {
      alert('Receipt is unavailable');
    }
  }

  function getSelected() {
    const dataApproval: approval[] = [];

    const selecteds = document.querySelectorAll('input:checked');

    selecteds.forEach(selected => {
      const requestId = selected.getAttribute('value') as string;
      const commentId = document.getElementsByClassName(requestId);
      const comment = commentId[0].value;
      dataApproval.push({ requestId, comment })
    })

    if (dataApproval.length === 0 ) {
      alert('Select at least one request');
      return;
    }
    return dataApproval;
  }

  async function sendToApproval(dataApproval: approval[], status: 'APPROVED' | 'REJECTED' | 'REVIEW') {
    const errors : string[]= [];
    for (let item of dataApproval) {
      try {
        const data = {
          comment: item.comment,
          status
        }
        await create(data, item.requestId, token);
      } catch (err) {
        errors.push(item.requestId);
        console.log(err);
      }
    }
    if (errors.length > 0) {
      alert(`Requests ${errors.join(', ')} could not be sent`);
    }
    getRequests();
  }

  useEffect(() => {
    getRequests();
  }, []) 

  function getRequests() {
    const promise = findByStatus('sent', token);
    promise.then((res) => {
      const info : any = {};
      setRequestList([...res.data]);
      res.data.map(request => {
        info[request.id] = false ;
      });
      setOpen({...info});
    });
    promise.catch((err) => console.log(err));
  }

  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Approve requests
        </Typography>
        
        <TableContainer component={Paper}>

          <Table>
          
            <TableHead>

              <TableRow>
                <TableCell align='center'>Select      </TableCell>
                <TableCell align='center'>ID          </TableCell>
                <TableCell>               Date        </TableCell>
                <TableCell align='right'> Amount      </TableCell>
                <TableCell>               Requester   </TableCell>
                <TableCell>               Description </TableCell>
                <TableCell align='center'>Items       </TableCell>
                <TableCell>               Comment     </TableCell>

              </TableRow>

            </TableHead>
          
            <TableBody> 
              {requestList?.map((request) => (
                <>
                  <TableRow key={request.id + request.createdDate} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                    <TableCell align='center'> 
                      <input type='checkbox' id={request.id.toString()} value={request.id}/> 
                    </TableCell>
                    <TableCell align='center'> {request.id}           </TableCell>
                    <TableCell >               {request.createdDate}  </TableCell>
                    <TableCell align='right'>  {request.amount}       </TableCell>
                    <TableCell >               {request.requesterName}</TableCell>
                    <TableCell >               {request.description}  </TableCell>
                    <TableCell align='center'>
                      <IconButton size='small' onClick={() => setOpen({...open, [request.id]: !open[request.id] } ) } >
                        {open[request.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell > 
                      <textarea className={request.id.toString()} cols={12} rows={2}></textarea> 
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={open[request.id]} timeout='auto' unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant='h6' gutterBottom component='div'>
                            Items
                          </Typography>
                          <Table size='small'>
                            <TableHead>
                              <TableRow>
                                <TableCell>               Date       </TableCell>
                                <TableCell>               Expense    </TableCell>
                                <TableCell align='right'> Amount     </TableCell>
                                <TableCell>               Observation</TableCell>
                                <TableCell align='center'>Receipt    </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {request.requestItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell> {item.date}       </TableCell>
                                  <TableCell> {item.expenseDesc}</TableCell>
                                  <TableCell align='right'> {item.amount}     </TableCell>
                                  <TableCell> {item.observation}</TableCell>
                                  <TableCell align='center'> {
                                    item.receipt === '' || item.receipt === null ? 
                                      <ImageNotSupportedOutlinedIcon/> : 
                                      <ImageSearchIcon sx={{ cursor:  'pointer' }} onClick={() => showReceipt(item.receipt)}/>
                                    }   
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
  
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

          <Button sx={styles.button} variant='contained' color='warning' component='label'onClick={reviewRequest}>
            REVIEW
          </Button>

          <Button sx={styles.button} variant='contained' color='error' component='label'onClick={rejectRequest}>
            REJECT
          </Button>

          <Button sx={styles.button} variant='contained' color='success' component='label'onClick={approveRequest}>
            APPROVE
          </Button>


        </Box>

      </Main>

      <Footer />

    </Layout>    

  );
  
}

export default Approvals;