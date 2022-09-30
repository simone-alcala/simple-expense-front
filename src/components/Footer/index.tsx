import React from 'react';
import { Box, Typography } from '@mui/material';

const styles = {
  container: {
    width: '100%',
    height: '30px',
    marginInline: 'auto',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    color: '#4F4E4E',
    backgroundColor: '#FFF',
  },
}

function Footer() {
  return (
    <Box sx={ styles.container } component='footer'>     
      <Typography variant='caption' component='caption'> 
        Testando footer 
      </Typography> 
    </Box>
  );
}

export default Footer;