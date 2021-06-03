import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { store } from './actions/store';
import { Provider } from 'react-redux';
import DGuests from './components/DGuests';
import { Box, CircularProgress, Container, Menu, MenuItem, Modal } from '@material-ui/core';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router, Rout, Link, Switch, Route, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AdminLogin from './components/AdminLogin';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ToastContainer } from 'react-toastify';
import { faHeadSideMask, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  boxLoading: {
    position: 'absolute',
    top: '35%',
    left: '48%',
    outline: 'none'
  },
  footer: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '15px'
  }
}));


function App() {

  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState(sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : '');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoading(true)
    setAnchorEl(null);

    setTimeout(() => {
      setIsLoading(false)
      setUserName('')
      sessionStorage.removeItem("userName");
    }, 2000);
  }

  return (
    <Router>
      <Provider store={store}>
        <ToastProvider autoDismiss={true}>
          <Modal open={isLoading} onClose={!isLoading}>
            <Box className={classes.boxLoading}>
              <CircularProgress style={{ color: "#a10000" }}/>
            </Box>
          </Modal>
          <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss={true}
              draggable={true}
              pauseOnHover={true}
          />
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Link to="/">
                <Typography className={classes.title} variant="h6">
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <FontAwesomeIcon icon={faFileMedical} />
                      <span style={{ paddingLeft: '10px', fontSize: '18px' }}>Health Declaration App</span>
                    </div>
                </Typography>
              </Link>
              <div style={{ width: '70%' }}></div>
                {
                  userName == '' ?
                  <Link to="/AdminLogin">
                    <Button color="inherit">Đăng nhập</Button>
                  </Link>
                  :
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: '500' }}>
                    <Button
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircleIcon style={{ fontSize: '30px',paddingRight: '10px' }}/>
                      {userName}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem style={{ width: '120px' }} onClick={handleClose}>Tài khoản</MenuItem>
                      <MenuItem style={{ width: '120px' }} onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Menu>
                  </div>
                }
            </Toolbar>
          </AppBar>
          <Container>
            <Switch>
              <Route exact path="/" component={() => <DGuests {...({ userName, setUserName })}/>}/>
              <Route
                exact path="/AdminLogin" component={() => userName !== '' ? <DGuests {...({ userName, setUserName })}/> : <AdminLogin {...({ userName, setUserName })}/>}
              />
            </Switch>
          </Container>
        </ToastProvider>
        <div className={classes.footer}>&copy; Copyright 2021 - Nguyễn Chí Thành</div>
      </Provider>
    </Router>
  );
}

export default App;
