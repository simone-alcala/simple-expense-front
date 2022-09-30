import React from 'react';
import { Box } from '@mui/material';

const styles = {
  container: {
    maxWidth: '800px',
    minWidth: '300px',
    height: '100%',
    marginInline: 'auto',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexDirection: 'column',
    color: '#4F4E4E',
    backgroundColor: '#FFF',
  },
}

type Props = {
  children: JSX.Element | JSX.Element[]
}

function Layout(props: Props) {
  return (
    <Box sx={ styles.container } component='main'>     
      {props.children}
    </Box>
  );
}

export default Layout;