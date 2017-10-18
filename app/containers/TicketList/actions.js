import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import * as actions from '../AttendeesList/actions';

import { DevSummitAxios, getAccessToken } from '../../helpers';

import {
  FETCH_USER_TICKET,
  IS_FETCHING_USER_TICKET,
  FETCHING_USER_TICKET_STATUS,
  UPDATE_INPUT_FIELDS,
  IS_TRANSFER_TICKET
} from './constants';

import ticketList from '../../services/ticketList';

/*
 * Get user ticket data
 */
export function isFetchingUserTicket(status) {
  return {
    type: IS_FETCHING_USER_TICKET,
    status
  };
}

export function fetchUserTicketStatus(status) {
  return {
    type: FETCHING_USER_TICKET_STATUS,
    status
  };
}

export function updateInputFields(fields, value) {
  return {
    type: UPDATE_INPUT_FIELDS,
    fields,
    value
  };
}

export function isTransferTicket(status) {
  return {
    type: IS_TRANSFER_TICKET,
    status
  };
}

export function fetchUserTicket() {
  return (dispatch) => {
    dispatch(isFetchingUserTicket(true));

    ticketList.get()
      .then((response) => {
        if ('data' in response.data) {
          if (!('message' in response.data.data)) {
            if (response.data.data.length === 0) {
              dispatch(fetchUserTicketStatus(false));
            } else {
              dispatch(fetchUserTicketStatus(response.data.meta.success));
            }
          }
          dispatch(isFetchingUserTicket(false));
          dispatch(actions.isTransferringTicket(false));
          dispatch({
            type: FETCH_USER_TICKET,
            payloads: response.data.data
          });
        }
      })
      .catch((error) => {
        dispatch(actions.isTransferringTicket(false));
        console.log(error.response);
      });
  };
}

export function transferTicket(receiver, id, password, callback) {
  return (dispatch) => {
    dispatch(isFetchingUserTicket(true));
    const payloads = {
      receiver,
      user_ticket_id: id,
      password
    };
    ticketList.post(payloads)
      .then((res) => {
        if (res.data.meta.success) {
          Toast.show(res.data.meta.message, Toast.LONG);
          callback();
          dispatch(isFetchingUserTicket(false));
          dispatch(fetchUserTicket());
        } else {
          Alert.alert(
            'Information',
            res.data.meta.message,
            [
              { text: 'OK', onPress: () => dispatch(fetchUserTicket()) }
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        dispatch(isFetchingUserTicket(false));
        console.log('ERROR', err);
      });
  };
}
