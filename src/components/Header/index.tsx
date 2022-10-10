import React, { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Box, Menu, MenuItem, Typography } from '@mui/material';
import CurrencyExchangeTwoToneIcon from '@mui/icons-material/CurrencyExchangeTwoTone';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '../../contexts/AuthProvider';

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
  },
  logo: {
    width: '100%',
    height: '90px',
    display: 'flex', 
    alignItems: 'center', 
    color: '#4F4E4E',
    backgroundColor: '#FFF',
  },
  icon: {
    fontSize: '40px',
    marginRight: '10px',
  },
}

type Props = {
  children?: JSX.Element
}

function Header(props: Props) {

  const navigate = useNavigate();
  const { logout, getName } = useAuth();

  const userName = `Hello, ${getName()}!`;

  const [items, setItems] = useState<null | HTMLElement>(null);

  const open = Boolean(items);

  function handleClick (event: MouseEvent<HTMLButtonElement>) {
    setItems(event.currentTarget);
  };

  function handleClose() {
    setItems(null);
  };

  function redirect(link: string) {
    handleClose();
    navigate(`/${link}`);
  }

  function logoutAndRedirect() {
    logout();
    navigate('/sign-in');
  }

  return (
    <Box sx={ styles.container } component='header'>  

      <Box sx={ styles.logo } >
        <CurrencyExchangeTwoToneIcon sx={ styles.icon }/>
        <Typography variant='h5' component='h5'> 
          SIMPLE EXPENSE
        </Typography>
      </Box>

      <Box>
        <Typography variant='h6' component='h6'> 
           {userName}
        </Typography>
      </Box>
      
      <Box>
  
        <div>
          <Button
            id='button'
            aria-controls={open ? 'menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ color: '#4F4E4E' }}
          >
            <MenuIcon sx={ styles.icon }/>
          </Button>
          
          <Menu 
            id='menu'
            anchorEl={items}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'button' }}
            elevation={0}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={()=>redirect('expenses')}> Expenses  </MenuItem>
            <MenuItem onClick={()=>redirect('requests')}> Requests  </MenuItem>
            <MenuItem onClick={()=>redirect('approvals')}>Approvals </MenuItem>
            <MenuItem onClick={()=>redirect('users')}>    Users     </MenuItem>
            <MenuItem onClick={logoutAndRedirect}>        Logout    </MenuItem>
          </Menu>

        </div>

      </Box>
    </Box>
  );
}

export default Header;