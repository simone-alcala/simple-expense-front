import React from 'react';
import { Box } from '@mui/material';

const styles = {
  container: {
    width: '100%',
    height: 'calc(100vh - 120px)',
    marginInline: 'auto',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    color: '#4F4E4E',
    padding: '10px',
  },
}

type Props = {
  children?: JSX.Element | JSX.Element[]
}

function Main(props: Props) {
  return (
    <Box sx={ styles.container } component='main'>     
      {props.children}
    </Box>
  );
}

export default Main;