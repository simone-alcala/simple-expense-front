import React from 'react';
import { Box, Typography } from '@mui/material';

const styles = {
  container: {
    width: '100%',
    height: '90px',
    marginInline: 'auto',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    color: '#4F4E4E',
    backgroundColor: '#FFF',
    paddingRight: '10px',
    paddingLeft: '10px',
  }
}

type Props = {
  children?: JSX.Element
}

function Header(props: Props) {
  return (
    <Box sx={ styles.container } component='header'>     
      <Typography variant='h5' component='h5'> 
        Testando header 
      </Typography>
    </Box>
  );
}

export default Header;