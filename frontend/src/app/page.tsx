'use client';
import * as React from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './page.module.css';
import Board from './board';
import { grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      black: string;
      white: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      black?: string;
      white: string;
    };
  }
}

const theme = createTheme({
  status: {
    black: grey[900],
    white: grey[50],
  },
});

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.status.black,
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.status.white,
  fontFamily: 'Roboto',
  fontSize: 13,
  color: theme.status.black,
  backgroundColor: theme.status.white,
  fontWeight: 600,
  padding: '3px 10px',
  '&.Mui-selected': {
    backgroundColor: '#00000030',
  },
}));

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'white',
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

export default function Home() {
  const [strategy, setStrategy] = React.useState('page');

  const handleStrategy = (event: unknown, value: string) => {
    if (value) setStrategy(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        sx={{
          display: 'grid',
          gridTemplateRows: '64px 1fr',
          height: '100vh',
        }}
      >
        <CustomAppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Board
            </Typography>
            <CustomToggleButtonGroup
              value={strategy}
              exclusive
              onChange={handleStrategy}
              aria-label="text alignment"
              size="small"
            >
              <CustomToggleButton value="page">PAGE</CustomToggleButton>
              <CustomToggleButton value="scroll">SCROLL</CustomToggleButton>
            </CustomToggleButtonGroup>
          </Toolbar>
        </CustomAppBar>
        <Box className={styles.bg}>
          <Board strategy={strategy} />
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
