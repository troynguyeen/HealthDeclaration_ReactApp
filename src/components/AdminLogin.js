import { Box, Button, CircularProgress, Fade, FormHelperText, Grid, Modal, Paper, TextField, Tooltip } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actionAdmin';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { useHistory } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    paper: {
        margin: '50px 250px',
        padding: '20px 50px'
    },
    header: {
        textAlign: 'center',
        paddingBottom: '20px',
        paddingTop: '40px',
        fontSize: '25px',
        fontWeight: 'bold'
    },
    textField: {
        padding: '15px',
        width: '500px'
    },
    button: {
        padding: '10px 15px !important',
        margin: '20px 0 !important'
    },
    boxLoading: {
        position: 'absolute',
        top: '35%',
        left: '49%',
        outline: 'none'
    }

}));

const initialFieldValues = {
    userName: '',
    password: ''
}

const AdminLogin = ({...props}) => {

    const location = useHistory();
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const validateLogin = (fieldValues = value) => {
        let tempErrors = {}
        tempErrors.userName = fieldValues.userName ? '' : 'Tên đăng nhập là bắt buộc.'
        tempErrors.password = fieldValues.password ? '' : 'Mật khẩu là bắt buộc.'

        if(fieldValues.userName && fieldValues.password) {
            const verify =  props.adminListAccount.filter(acc => acc.userName == fieldValues.userName && acc.password == fieldValues.password)
            tempErrors.verify = verify.length > 0 ? '' : 'Sai tên đăng nhập hoặc mật khẩu.'
        }
        
        setErrors({...tempErrors})

        if(fieldValues === value) {
            return Object.values(tempErrors).every(value => value == "")
        }
    }
    
    const handleLogin = e => {
        e.preventDefault()
        if(validateLogin()) {
            setIsLoading(true)
            sessionStorage.setItem("userName", value.userName);

            setTimeout(() => {
               setIsLoading(false)
               props.setUserName(value.userName)
               toast('🚀 Welcome ' + value.userName + ' !')
               location.goBack()
            }, 3000);
        }
    }

    useEffect(() => {
        props.fetchAdminList()
        
    }, [])

    return (  
        <Paper className={classes.paper} elevation={5}>
            <form onSubmit={handleLogin}>
                <Modal
                    open={isLoading}
                    onClose={!isLoading}
                >
                    <Box className={classes.boxLoading}>
                        <CircularProgress style={{ color: "#a10000" }}/>
                    </Box>
                </Modal>
                <div className={classes.header}>Tài khoản Admin</div>
                <Grid className={classes.root} container>
                    <Grid className={classes.textField} item xs={12}>
                        <TextField
                            style={{ width: '100%' }}
                            name="username"
                            variant="outlined"
                            type="text"
                            label="Tên đăng nhập"
                            value={value.userName}
                            onChange={(e) => setValue({ ...value, userName: e.target.value })}
                            {...(errors.userName && {error: true, helperText: errors.userName})}
                            {...(errors.verify && {error: true, helperText: errors.verify})}
                        />
                    </Grid>
                    <Grid className={classes.textField} item xs={12}>
                        <TextField
                            style={{ width: '100%' }}
                            name="password"
                            variant="outlined"
                            type="password"
                            label="Mật khẩu"
                            value={value.password}
                            onChange={(e) => setValue({ ...value, password: e.target.value })}
                            {...(errors.password && {error: true, helperText: errors.password})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button className={classes.button} variant="contained" color="primary" type="submit">Đăng nhập</Button>
                    </Grid>
                </Grid>
                <div style={{ textAlign: 'end' }}>
                    <Tooltip title="(username: admin, password: 123456)" placement="top-end">
                        <InfoIcon />
                    </Tooltip>
                </div>
            </form>
        </Paper>
    );
}

const mapStateToProps = state => ({
    adminListAccount: state.reducerAdmin.listAdmin
})

const mapActionToProps = {
    fetchAdminList: actions.fetchAdmin
}
 
export default connect(mapStateToProps, mapActionToProps)(AdminLogin);