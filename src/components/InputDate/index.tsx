import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Stack, TextField } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type Props = {
  id: string,
  name: string,
  label: string,
  onChange: (newValue: Dayjs | null) => void,
  value: Dayjs | null,
}

const styles = {
  input: { 
    marginTop: 1, 
    backgroundColor: '#FFF',
  },
}

function InputDate(props: Props) {

  const { id, name, label, value, onChange } = props;
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label={label}
          inputFormat="DD/MM/YYYY"
          value={value}
          onChange={onChange}
          renderInput={(params) => 
            <TextField {...params} sx={styles.input} required name={name} />
          }
        />
      </Stack>
    </LocalizationProvider>
  );
}

export default InputDate;