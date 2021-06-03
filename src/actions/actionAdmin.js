import api from './api';

export const ACTION_TYPES = {
    FETCH_ADMIN: 'FETCH_ADMIN'
}

export const fetchAdmin = () => dispatch => {
    api.Admin().fetchAdmin()
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_ADMIN,
                payload: response.data
            })
        })
        .catch(err => console.log(err))
}