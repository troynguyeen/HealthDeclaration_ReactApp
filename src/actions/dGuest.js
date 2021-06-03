import api from './api';

export const ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DETELE: 'DETELE',
    FETCH_ALL: 'FETCH_ALL'
}

export const fetchAll = () => dispatch => {
    api.dGuest().fetchAll()
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL,
                payload: response.data
            })
        })
        .catch(err => console.log(err))
}

export const create = (data, onSuccess, onFailure) => dispatch => {
    api.dGuest().create(data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.CREATE,
                payload: response.data
            })

            onSuccess()
        })
        .catch(err => {
            console.log(err)
            onFailure()
        })
}

export const update = (idCard, data, onSuccess) => dispatch => {
    api.dGuest().update(idCard, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.UPDATE,
                payload: {idCard, ...response.data}
            })

            onSuccess()
        })
        .catch(err => console.log(err))
}

export const Delete = (idCard, onSuccess) => dispatch => {
    api.dGuest().delete(idCard)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.DETELE,
                payload: idCard
            })

            onSuccess()
        })
        .catch(err => console.log(err))
}