import { combineReducers } from 'redux';
import { dGuest } from './dGuest';
import { reducerAdmin } from './reducerAdmin'

export const allReducers = combineReducers({
    dGuest: dGuest,
    reducerAdmin: reducerAdmin
})