/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  LOAD_GENERAL_SETTINGS_SUCCESS,
  LOAD_GENERAL_SETTINGS,
  LOAD_GENERAL_SETTINGS_ERROR,
  CHANGE_APP_NAME,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,

  name: false ,
  description: false,
  version: false,
});

function appReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case LOAD_GENERAL_SETTINGS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('name', false)
        .set('description', false)
        .set('version', false);
    case LOAD_GENERAL_SETTINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('name', action.data.name)
        .set('description', action.data.description)
        .set('version', action.data.version);
    case LOAD_GENERAL_SETTINGS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case CHANGE_APP_NAME:
      return state
        .set('name', action.name);
    default:
      return state;
  }
}

export default appReducer;
