import { ACTION_TYPES } from '../actions/dGuest';

const initialState = {
    list: []
}

export const dGuest = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL:
            return {
                ...state,
                list: [...action.payload]
            }
        
        case ACTION_TYPES.CREATE:
            return {
                ...state,
                list: [action.payload, ...state.list]
            }

        case ACTION_TYPES.UPDATE:
            return {
                ...state,
                list: state.list.map(item => item.idCard == action.payload.idCard ? action.payload : item)
            }

        case ACTION_TYPES.DETELE:
            return {
                ...state,
                list: state.list.filter(item => item.idCard != action.payload)
            }
            
        default:
            return state;
    }
}