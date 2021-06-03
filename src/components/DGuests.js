import { Button, ButtonGroup, Grid, Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, withStyles } from '@material-ui/core';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/dGuest';
import DGuestForm from './DGuestForm';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        '& .MuiGrid-root': {
            
        },
        '& .MuiTable-root': {
            width: '100%'
        },
        '& .MuiTableCell-head': {
            fontSize: '17px'
        }
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
})

const headCells = [
    { id: 'idCard', align: 'center', disablePadding: false, label: 'Số căn cước', width: '150px' },
    { id: 'fullName', align: 'left', disablePadding: false, label: 'Họ tên', width: '150px' },
    { id: 'dateOfBirth', align: 'left', disablePadding: false, label: 'Ngày sinh', width: '120px' },
    { id: 'gender', align: 'left', disablePadding: false, label: 'Giới tính', width: '100px' },
    { id: 'nationality', align: 'left', disablePadding: false, label: 'Quốc tịch', width: '100px' },
    { id: 'addressInVietNam', align: 'left', disablePadding: false, label: 'Địa chỉ ở Việt Nam', width: '200px' },    
];

const DGuests = ({classes, ...props}) => {

    const { addToast } = useToasts();
    const [currentId, setCurrentId] = useState(0);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('idCard');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.dGuestList.length - page * rowsPerPage);

    const deleteSelectedId = id => {
        const onDeleteSuccess = () => {
            addToast("Đã xóa số #" + id +" thành công.", { appearance: 'info' })
        }
        if(window.confirm("Bạn có chắc chắn muốn xóa ?")) {
            props.deleteDGuest(id, onDeleteSuccess)
            setCurrentId(0)
            setPage(rowsPerPage - emptyRows == 1 ? 0 : page)
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function EnhancedTableHead(props) {
        const { order, orderBy, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
      
        return (
          <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell width="100px"></TableCell>
            </TableRow>
          </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    useEffect(() => {
        props.fetchAllGuests()
        
    }, [])
    
    return (
        <React.Fragment>
            <DGuestForm {...({ currentId, setCurrentId })}/>
            <Paper style={{ marginBottom: '50px'}} elevation={3}>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Table>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={props.dGuestList.length}
                            />
                            <TableBody>
                                {stableSort(props.dGuestList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((record, index) => {

                                    const birthDate = moment(record.dateOfBirth).format("DD/MM/YYYY").toString()
                                    return (
                                        <TableRow>
                                            <TableCell align="center">
                                                {props.userName !== '' ? record.idCard : '*'.repeat(record.idCard.length - 2) + record.idCard.slice(-2)}
                                            </TableCell>
                                            <TableCell align="left">{record.fullName}</TableCell>
                                            <TableCell align="left">{birthDate}</TableCell>
                                            <TableCell align="left">{record.gender}</TableCell>
                                            <TableCell align="left">{record.nationality}</TableCell>
                                            <TableCell align="left">{record.addressInVietNam}</TableCell>
                                            <TableCell align="center">
                                            {
                                                props.userName !== '' ?
                                                <ButtonGroup variant="text">
                                                    <Button onClick={() => setCurrentId(record.idCard)}><EditIcon color="primary"/></Button>
                                                    <Button onClick={() => deleteSelectedId(record.idCard)}><DeleteIcon color="secondary" /></Button>
                                                </ButtonGroup>
                                                :
                                                ''
                                            }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (69) * emptyRows }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.dGuestList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    dGuestList: state.dGuest.list
})

const mapActionToProps = {
    fetchAllGuests: actions.fetchAll,
    deleteDGuest: actions.Delete
}
 
export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DGuests));