import { ACTION_TYPES } from '../actions/actionAdmin';

const initialState = {
    listAdmin: []
}

export const reducerAdmin = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ADMIN:
            return {
                ...state,
                listAdmin: [...action.payload]
            }
        
        default:
            return state;
    }
}