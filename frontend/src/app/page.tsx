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
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './page.module.css';
import Board from './board';
import { blue, grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      dark: string;
      white: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      dark?: string;
      white: string;
    };
  }
}

const theme = createTheme({
  status: {
    dark: blue[900],
    white: grey[50],
  },
});

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.status.dark,
}));

const MyToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.status.white,
  fontFamily: 'Roboto',
  fontSize: 14,
  color: theme.status.white,
  fontWeight: 600,
  padding: '5px 20px',
  '&.Mui-selected': {
    color: theme.status.white,
    backgroundColor: '#FFFFFF60',
  },
}));

export default function Home() {
  const [strategy, setStrategy] = React.useState('page');

  const handleStrategy = (event: unknown, value: string) => {
    setStrategy(value);
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
            <ToggleButtonGroup
              value={strategy}
              exclusive
              onChange={handleStrategy}
              aria-label="text alignment"
              size="small"
            >
              <MyToggleButton value="page">PAGE</MyToggleButton>
              <MyToggleButton value="scroll">SCROLL</MyToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
        </CustomAppBar>
        <Box className={styles.bg}>
          <Board strategy={strategy} />
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
