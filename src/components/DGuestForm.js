import React, { useState, useEffect, useRef } from 'react';
import useForm from './useForm';
import { Backdrop, Box, Button, CircularProgress, collapseClasses, Fade, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField, withStyles } from '@material-ui/core';
import { DatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../actions/dGuest';
import { useToasts } from 'react-toast-notifications';
import { Title } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'date-fns';

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            minWidth: '550px'
        },
        '& .MuiFormGroup-root': {
            flexDirection: 'row'
        },
        '& .MuiInput-root': {
            width: '180px'
        },
        '& .MuiTable-root': {
            border: '1px solid rgba(224, 224, 224, 1)',
            marginTop: '20px'
        },
        '& .MuiTableCell-head': {
            fontSize: '17px',
            fontWeight: 'bold'
        },
        '& .MuiTableCell-root': {
            textAlign: 'center',
            padding: '10px',
            border: '1px solid rgba(224, 224, 224, 1)',
        }
    },
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px'
    },
    subTitle: {
        fontSize: '15px',
        fontWeight: '500',
        textAlign: 'center',
        padding: '10px'
    },
    paper: {
        margin: '30px'
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalForm: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '50px 30px',
        outline: 'none'
    },
    modalTextField: {
        width: '400px'
    },
    radio: {
        paddingLeft: '20px !important',
        paddingBottom: '30px !important',
        marginTop: '-5px !important'
    },
    radioNationality: {
        margin: '5px 0px !important'
    },
    buttonContainer: {
        margin: '25px 15px'
    },
    button: {
        marginRight: '15px !important'
    },
    labelQuestion: {
        width: '550px',
        fontSize: '17px',
        fontWeight: 'bold',
        color: '#000',
        paddingTop: '20px'
    },
    tableQuestion: {
        textAlign: 'left !important',
        color: '#000'
    },
    boxLoading: {
        position: 'absolute',
        top: '40%',
        left: '48%',
        outline: 'none'
    }
})

const initialFieldValues = {
    idCard: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    addressInVietNam: '',
    phone: '',
    email: '',
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: ''
}

const DGuestForm = ({classes, ...props}) => {

    const { addToast } = useToasts();

    const [valueDate, setValueDate] = useState(null);
    const [valueNationality, setValueNationality] = useState('');
    const [isOtherNationality, setIsOtherNationality] = useState(false);
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [findByIdCard, setFindByIdCard] = useState('')

    //Question form
    const [isYes1, setIsYes1] = useState(false);
    const [valueAnswer1, setValueAnswer1] = useState('');
    const [isYes2, setIsYes2] = useState(false);
    const [valueAnswer2, setValueAnswer2] = useState('');

    //Question table
    const [selectedRow1, setSelectedRow1] = useState('');
    const [selectedRow2, setSelectedRow2] = useState('');
    const [selectedRow3, setSelectedRow3] = useState('');

    const validate = (fieldValues = values) => {
        const dateReg = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const idCardReg = /^[0-9]{10,12}$/

        let tempError = {}
        if('idCard' in fieldValues) {
            tempError.idCard = fieldValues.idCard ? '' : 'Số căn cước là bắt buộc.'
            if(tempError.idCard === '') {
                tempError.idCard = isNaN(fieldValues.idCard) ? 'Số căn cước không đúng định dạng.'
                : idCardReg.test(fieldValues.idCard) ? '' : 'Số căn cước phải có độ dài từ 10-12 chữ số.'
            }
        }

        if('fullName' in fieldValues)
            tempError.fullName = fieldValues.fullName ? '' : 'Họ tên là bắt buộc.'
        
        if('dateOfBirth' in fieldValues)
            tempError.dateOfBirth = dateReg.test(fieldValues.dateOfBirth) ? '' : 'Ngày sinh không đúng định dạng.'

        if('gender' in fieldValues)
            tempError.gender = fieldValues.gender ? '' : 'Giới tính là bắt buộc.'

        if('nationality' in fieldValues)
            tempError.nationality = fieldValues.nationality ? '' : 'Quốc tịch là bắt buộc.'
            if(fieldValues.nationality == "Khác")
                tempError.nationality1 = values.nationality1 ? '' : 'Quốc tịch là bắt buộc.'

        if('email' in fieldValues)
            tempError.email = emailReg.test(fieldValues.email) ? '' : 'Email không đúng định dạng.'

        if('phone' in fieldValues)
            tempError.phone = fieldValues.phone ? '' : 'Số điện thoại là bắt buộc.'

        if('addressInVietNam' in fieldValues)
            tempError.addressInVietNam = fieldValues.addressInVietNam ? '' : 'Địa chỉ là bắt buộc.'

        if('question1' in fieldValues)
            tempError.question1 = fieldValues.question1 ? '' : 'Vui lòng chọn câu trả lời.'
            if(fieldValues.question1 == "Có")
                tempError.field1 = fieldValues.field1 ? '' : 'Vui lòng nhập câu trả lời.'
        
        if('question2' in fieldValues)
            tempError.question2 = fieldValues.question2 ? '' : 'Vui lòng chọn câu trả lời.'
            if(fieldValues.question2 == "Có")
                tempError.field2 = fieldValues.field2 ? '' : 'Vui lòng nhập câu trả lời.'
        
        if('question3' in fieldValues)
            tempError.question3 = fieldValues.question3 ? '' : 'Vui lòng chọn câu trả lời.'

        if('question4' in fieldValues)
            tempError.question4 = fieldValues.question4 ? '' : 'Vui lòng chọn câu trả lời.'

        if('question5' in fieldValues)
            tempError.question5 = fieldValues.question5 ? '' : 'Vui lòng chọn câu trả lời.'

        setErrors({
            ...tempError
        })

        if(fieldValues === values) {
            return Object.values(tempError).every(value => value == "")
        }
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, validate, setValueDate, setValueNationality, setIsOtherNationality, 
    setIsYes1, setIsYes2, setValueAnswer1, setValueAnswer2, setSelectedRow1, setSelectedRow2, setSelectedRow3, props.setCurrentId)

    const handleSubmit = e => {
        e.preventDefault()

        if(validate()) {
            const onCreateSuccess = () => {
                addToast("Gửi thông tin thành công.", { appearance: 'success' })
                resetForm()
            }
            const onCreateFailure = () => {
                addToast("Số căn cước đã tồn tại.", { appearance: 'warning' })
            }
            const onUpdateSuccess = () => {
                addToast("Cập nhật thông tin thành công.", { appearance: 'success' })
                resetForm()
            }

            const data = {
                ...values,
                nationality: values.nationality != "Việt Nam" && values.nationality1 ? values.nationality1 : values.nationality,
                question1: values.question1 == "Có" && values.field1 ? values.field1 : values.question1,
                question2: values.question2 == "Có" && values.field2 ? values.field2 : values.question2,
                dateOfBirth: moment(values.dateOfBirth).format("YYYY-MM-DD")
            }
            delete data.nationality1

            if(props.currentId == 0) {
                props.createDGuest(data, onCreateSuccess, onCreateFailure)
            } 
            else {
                props.updateDGuest(props.currentId, data, onUpdateSuccess)
            }
        }
    }

    useEffect(() => {
        if(props.currentId != 0) {
            const currentGuest = props.dGuestList.find(val => val.idCard == props.currentId)

            if(currentGuest) {
                setValues({
                    ...currentGuest,
                    dateOfBirth: moment(currentGuest.dateOfBirth).format("MM-DD-YYYY")
                })
                setValueNationality(currentGuest.nationality != 'Việt Nam' ? currentGuest.nationality : '')
                setIsOtherNationality(currentGuest.nationality != 'Việt Nam' ? true : false)
                setValueDate(moment(currentGuest.dateOfBirth).format("MM-DD-YYYY"))
                
                //Question form
                setIsYes1(currentGuest.question1 != "Không" && currentGuest.question1 ? true : false)
                setValueAnswer1(currentGuest.question1 != "Không" && currentGuest.question1 ? currentGuest.question1 : '')
                setIsYes2(currentGuest.question2 != "Không" && currentGuest.question2 ? true : false)
                setValueAnswer2(currentGuest.question2 != "Không" && currentGuest.question2 ? currentGuest.question2 : '')

                //Question table
                setSelectedRow1(currentGuest.question3)
                setSelectedRow2(currentGuest.question4)
                setSelectedRow3(currentGuest.question5)

                if(isOpen) {
                    toast.success("Đã tìm thấy !");
                }
            }
            else {
                toast.error('Không tìm thấy thông tin phù hợp.');
                setFindByIdCard('')
                props.setCurrentId(0)
            }
        }
    }, [props.currentId])

    useEffect(() => {
        setUserName(sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : '')
    })

    const handleOpen = () => {
        setIsOpen(true);
    };
    
    const handleClose = () => {
        setIsOpen(false);
        setFindByIdCard('')
    };

    const handleFindId = () => {
        if(validateFindId(findByIdCard)) {
            setIsLoading(true)
            setTimeout(() => {
                props.setCurrentId(findByIdCard)
                setIsLoading(false);
                handleClose();
            }, 3000);
        }
    }

    const validateFindId = (id) => {
        let tempError = {}
        const idCardReg = /^[0-9]{10,12}$/
        
        tempError.findByIdCard = id ? '' : 'Vui lòng nhập số căn cước.'
        if(tempError.findByIdCard === '') {
            tempError.findByIdCard = isNaN(id) ? 'Số căn cước không đúng định dạng.'
            : idCardReg.test(id) ? '' : 'Số căn cước phải có độ dài từ 10-12 chữ số.'
        }
        setErrors({...tempError})

        return tempError.findByIdCard === '';
    }

    return (
        <Paper className={classes.paper} elevation={5}>
            <form noValidate className={classes.root} onSubmit={handleSubmit}>
                <div style={{ padding: '10px 20px' }}>
                    <div className={classes.title}>THÔNG TIN KHAI BÁO Y TẾ</div>
                    <div className={classes.subTitle}>( PHÒNG CHỐNG DỊCH COVID-19 )</div>
                    <div className={classes.subTitle} style={{ color: 'red' }}>
                        Khuyến cáo: Khai báo thông tin sai là vi phạm pháp luật Việt Nam và có thể xử lý hình sự
                    </div>
                    <div style={{ textAlign: 'end' }}>
                        {
                        userName === '' ?
                        <Button style={{ backgroundColor: '#009405' }} variant="contained" onClick={handleOpen}>Chỉnh sửa thông tin</Button>
                        : ''
                        }
                    </div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={isOpen}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={isOpen}>
                            <Paper className={classes.modalForm} elevation={20}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', paddingBottom: '30px' }}>Nhập số căn cước</div>
                                <Grid className={classes.grid} container>
                                    <TextField
                                        className={classes.modalTextField}
                                        name="findByIdCard"
                                        variant="outlined"
                                        label="Số căn cước"
                                        value={findByIdCard}
                                        onChange={(id) => {
                                            setErrors({})
                                            setFindByIdCard(id.target.value)
                                            validateFindId(id.target.value)
                                        }}
                                        {...(errors.findByIdCard && {error: true, helperText: errors.findByIdCard})}
                                    />
                                    <Button style={{ marginLeft: '20px', backgroundColor: '#009405' }} variant="contained" onClick={handleFindId}>Gửi yêu cầu</Button>
                                </Grid>
                            </Paper>
                        </Fade>
                    </Modal>
                    <Modal open={isLoading} onClose={!isLoading}>
                        <Box className={classes.boxLoading}>
                            <CircularProgress style={{ color: "#a10000" }}/>
                        </Box>
                    </Modal>
                </div>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField
                            name="idCard"
                            variant="outlined"
                            label="Số căn cước"
                            value={values.idCard}
                            onChange={handleInputChange}
                            InputProps={{
                                readOnly: props.currentId != 0 ? true : false
                            }}
                            {...(errors.idCard && {error: true, helperText: errors.idCard})}
                        />
                        <TextField
                            name="fullName"
                            variant="outlined"
                            label="Họ tên"
                            value={values.fullName}
                            onChange={handleInputChange}
                            {...(errors.fullName && {error: true, helperText: errors.fullName})}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                name="dateOfBirth"
                                variant="outlined"
                                label="Ngày sinh"
                                value={valueDate}
                                onChange={(newValue) => {
                                    setValueDate(newValue);
                                    handleInputChange({
                                        target: {
                                            name: 'dateOfBirth',
                                            value: moment(newValue).format("MM-DD-YYYY")
                                        }
                                    });
                                }}
                                renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    {...(errors.dateOfBirth && {error: true, helperText: errors.dateOfBirth})}
                                />}
                            />
                        </LocalizationProvider>
                        <FormControl className={classes.radio} variant="outlined" {...(errors.gender && {error: true})}>
                            <FormLabel>Giới tính</FormLabel>
                            <RadioGroup 
                                aria-label="gender" name="gender" 
                                value={values.gender} 
                                onChange={handleInputChange}
                            >
                                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                            </RadioGroup>
                            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                        </FormControl>
                        <Grid item xs={6}>
                            <FormControl className={classes.radio} variant="outlined" {...(errors.nationality && {error: true})} {...(errors.nationality1 && {error: true})}>
                                <FormLabel>Quốc tịch</FormLabel>
                                <RadioGroup aria-label="nationality" name="nationality" value={values.nationality} onChange={handleInputChange}>
                                    <FormControlLabel value="Việt Nam" control={<Radio onClick={() => {setIsOtherNationality(false)}}/>} label="Việt Nam"/>
                                    <FormControlLabel value="Khác" control={<Radio onClick={() => {setIsOtherNationality(true)}}/>} label="Khác" checked={isOtherNationality}/>
                                    {
                                        isOtherNationality ?
                                        <TextField
                                            className={classes.radioNationality}
                                            name="nationality1"
                                            variant="standard"
                                            label="Quốc tịch khác"
                                            type="text"
                                            value={valueNationality}
                                            onChange={(e) => {
                                                setValueNationality(e.target.value)
                                                handleInputChange(e)
                                            }}
                                            {...(errors.nationality1 && {error: true})}
                                        />
                                        : ''
                                    }
                                </RadioGroup>
                                {errors.nationality && <FormHelperText>{errors.nationality}</FormHelperText>}
                                {errors.nationality1 && <FormHelperText>{errors.nationality1}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="email"
                            variant="outlined"
                            label="Email"
                            value={values.email}
                            onChange={handleInputChange}
                            {...(errors.email && {error: true, helperText: errors.email})}
                        />
                        <TextField
                            name="phone"
                            variant="outlined"
                            label="Số điện thoại"
                            value={values.phone}
                            onChange={handleInputChange}
                            {...(errors.phone && {error: true, helperText: errors.phone})}
                        />
                        <TextField
                            name="addressInVietNam"
                            variant="outlined"
                            label="Địa chỉ ở Việt Nam"
                            value={values.addressInVietNam}
                            onChange={handleInputChange}
                            {...(errors.addressInVietNam && {error: true, helperText: errors.addressInVietNam})}
                        />
                        <FormControl className={classes.radio} variant="outlined" {...(errors.question1 && {error: true})} {...(errors.field1 && {error: true})}>
                            <div className={classes.labelQuestion}>Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào (Có thể đi qua nhiều nơi)</div>
                            <RadioGroup aria-label="question1" name="question1" value={values.question1} onChange={handleInputChange}>
                                <FormControlLabel value="Có" control={<Radio onClick={() => {setIsYes1(true)}}/>} label="Có" checked={isYes1}/>
                                <FormControlLabel value="Không" control={<Radio onClick={() => {setIsYes1(false)}}/>} label="Không"/>
                                {
                                    isYes1 ?
                                    <TextField
                                        className={classes.radioNationality}
                                        name="field1"
                                        variant="filled"
                                        label="Trả lời"
                                        type="text"
                                        value={valueAnswer1}
                                        onChange={(e) => {
                                            setValueAnswer1(e.target.value)
                                            handleInputChange(e)
                                        }}
                                        {...(errors.field1 && {error: true})}
                                    />
                                    : ''
                                }
                            </RadioGroup>
                            {errors.question1 && <FormHelperText>{errors.question1}</FormHelperText>}
                            {errors.field1 && <FormHelperText>{errors.field1}</FormHelperText>}
                        </FormControl>
                        <FormControl className={classes.radio} variant="outlined" {...(errors.question2 && {error: true})} {...(errors.field2 && {error: true})}>
                            <div className={classes.labelQuestion} style={{ paddingTop: '0px' }}>Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?</div>
                            <RadioGroup aria-label="question2" name="question2" value={values.question2} onChange={handleInputChange}>
                                <FormControlLabel value="Có" control={<Radio onClick={() => {setIsYes2(true)}}/>} label="Có" checked={isYes2}/>
                                <FormControlLabel value="Không" control={<Radio onClick={() => {setIsYes2(false)}}/>} label="Không"/>
                                {
                                    isYes2 ?
                                    <TextField
                                        className={classes.radioNationality}
                                        name="field2"
                                        variant="filled"
                                        label="Trả lời"
                                        type="text"
                                        value={valueAnswer2}
                                        onChange={(e) => {
                                            setValueAnswer2(e.target.value)
                                            handleInputChange(e)
                                        }}
                                        {...(errors.field2 && {error: true})}
                                    />
                                    : ''
                                }
                            </RadioGroup>
                            {errors.question2 && <FormHelperText>{errors.question2}</FormHelperText>}
                            {errors.field2 && <FormHelperText>{errors.field2}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ padding: '0px 20px 20px' }}>
                        <div className={classes.labelQuestion}>Trong vòng 14 ngày qua, Anh/Chị có tiếp xúc với</div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Có</TableCell>
                                    <TableCell>Không</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.tableQuestion}>
                                        Người bệnh hoặc nghi ngờ, mắc bệnh COVID-19
                                        {errors.question3 && <FormHelperText {...(errors.question3 && {error: true})}>{errors.question3}</FormHelperText>}
                                    </TableCell> 
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow1 === 'Có'}
                                            name="question3"
                                            value="Có"
                                            onChange={(e) => {
                                                setSelectedRow1(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow1 === 'Không'}
                                            name="question3"
                                            value="Không"
                                            onChange={(e) => {
                                                setSelectedRow1(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableQuestion}>
                                        Người từ nước có bệnh COVID-19
                                        {errors.question4 && <FormHelperText {...(errors.question4 && {error: true})}>{errors.question4}</FormHelperText>}
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow2 === 'Có'}
                                            name="question4"
                                            value="Có"
                                            onChange={(e) => {
                                                setSelectedRow2(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow2 === 'Không'}
                                            name="question4"
                                            value="Không"
                                            onChange={(e) => {
                                                setSelectedRow2(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableQuestion}>
                                        Người có biểu hiện (Sốt, ho, khó thở , Viêm phổi)
                                        {errors.question5 && <FormHelperText {...(errors.question5 && {error: true})}>{errors.question5}</FormHelperText>}
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow3 === 'Có'}
                                            name="question5"
                                            value="Có"
                                            onChange={(e) => {
                                                setSelectedRow3(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            checked={selectedRow3 === 'Không'}
                                            name="question5"
                                            value="Không"
                                            onChange={(e) => {
                                                setSelectedRow3(e.target.value)
                                                handleInputChange(e)
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ color: 'red', padding: '20px', paddingBottom: '10px'}}>
                            Dữ liệu bạn cung cấp hoàn toàn bảo mật và chỉ phục vụ cho việc phòng chống dịch, thuộc quản lý của Ban chỉ đạo quốc gia về Phòng chống dịch Covid-19. Khi bạn nhấn nút "Gửi" là bạn đã hiểu và đồng ý.
                        </div>
                        <div className={classes.buttonContainer} style={{ textAlign: 'center', paddingBottom: '20px' }}>
                            <Button className={classes.button} variant="contained" color="primary" type="submit">Gửi thông tin</Button>
                            <Button style={{ backgroundColor: '#DCDCDC', color: '#000' }} variant="contained" type="reset" onClick={resetForm}>Reset</Button>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

const mapStateToProps = state => ({
    dGuestList: state.dGuest.list
})

const mapActionToProps = {
    createDGuest: actions.create,
    updateDGuest: actions.update
}
 
export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DGuestForm));