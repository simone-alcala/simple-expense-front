import React, { FormEvent } from 'react';
import { Box } from '@mui/material';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex', 
    flexDirection: 'column',
  }, 
}

type Props = {
  onSubmit?: (e: FormEvent) => Promise<void>,
  children?: JSX.Element[],
  align?: 'center' | 'left',
  justify?: 'center' | 'top',
}

function Form(props: Props) {

  const { onSubmit: handleSubmit, children, align, justify } = props;


  return (
    <Box 
      sx={ styles.container } 
      justifyContent={ justify } 
      alignItems={ align }
      component='form' 
      onSubmit={ handleSubmit } >
      { children }
    </Box>
  );
}

export default Form;