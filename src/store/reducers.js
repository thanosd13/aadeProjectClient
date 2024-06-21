import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import auth from '../reducers/auth';

const reducers = combineReducers({
  auth: auth
});

export default reducers;
