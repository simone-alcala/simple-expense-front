import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { useAuth } from '../../contexts/AuthProvider';
import { findAll } from '../../services/api/UserApi';

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

type listUsers = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}


function Users() {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [userList, setUserList] = useState<listUsers[]>([]);

  function redirectHome(){
    navigate('/');
  }

  function editUser(id: number){
    navigate(`/users/${id}`);
  }

  useEffect(() => {
    const token = getToken() || '';
    const promise = findAll(token);
    promise.then((res) => setUserList([...res.data]));

  }, [userList])
 
  return (
    <Layout>

      <Header />

      <Main defaultHeight={true} align='start'>

        <Typography variant='h4' component='h4' textAlign={'center'}>
          Users
        </Typography>

        <TableContainer component={Paper}>

          <Table>
          
            <TableHead>

              <TableRow>
                <TableCell>               Full Name</TableCell>
                <TableCell>               Email     </TableCell>
                <TableCell>               Type     </TableCell>
                <TableCell align='center'>Edit     </TableCell>
              </TableRow>

            </TableHead>
          
            <TableBody> 
              
              {userList?.map((item) => ( 

                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                  <TableCell >{item.firstName} {item.lastName}</TableCell>
                  <TableCell >{item.email}                    </TableCell>
                  <TableCell >{item.type}                     </TableCell>

                  <TableCell align='center'>
                    <EditOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => editUser(item.id)}/>
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

        </Box>

      </Main>

      <Footer />

    </Layout>    

  );
}

export default Users;