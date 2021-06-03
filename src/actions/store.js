import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { allReducers } from '../reducers';

export const store = createStore(
    allReducers,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
)