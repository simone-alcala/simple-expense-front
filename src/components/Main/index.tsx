import React from 'react';
import { Box } from '@mui/material';

const styles = {
  container: {
    width: '100%',
    marginInline: 'auto',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    color: '#4F4E4E',
    padding: '10px',
    flexDirection: 'column',
  },
}

type Props = {
  children?: JSX.Element | JSX.Element[],
  defaultHeight?: boolean,
}

function Main(props: Props) {
  const { children, defaultHeight } = props;
  const height = defaultHeight ? 'calc(100vh - 120px)' : '100vh';
  return (
    <Box sx={ styles.container } component='main' height={height}>     
      {children}
    </Box>
  );
}

export default Main;