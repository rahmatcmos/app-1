import FormData from 'FormData';
import { Platform } from 'react-native';

import {
  FETCH_FEEDS,
  IS_FETCHING_FEEDS,
  IS_POST_FEEDS,
  UPDATE_IMAGE,
  UPDATE_TEXT,
  UPDATE_FEEDS,
  CLEAR_TEXT_FIELD,
  CLEAR_IMAGE,
  UPDATE_CURRENT_PAGE
} from './constants';

import {
  DevSummitAxios,
  getAccessToken
} from '../../helpers';

/**
 * Receiver callback from container and send it to reducer
 * for updating feeds
 */
export function updateFeeds(payload) {
  const data = JSON.parse(payload);
  const payloads = data.data;
  if (payloads) {
    return { type: UPDATE_FEEDS, payloads };
  }
}

export function updateCurrentPage(value) {
  return {
    type: UPDATE_CURRENT_PAGE,
    value
  };
}

export function isFetchingFeeds(status) {
  return {
    type: IS_FETCHING_FEEDS,
    status
  };
}

export function fetchFeeds(currentpage) {
  return (dispatch) => {
    dispatch(isFetchingFeeds(true));

    getAccessToken()
      .then((token) => {
        DevSummitAxios.get(`/api/v1/feeds?page=${currentpage}`, { headers: { Authorization: token } })
          .then((response) => {
            const payloads = response.data.data[0];

            console.log("PAYLOADS", payloads)

            dispatch({ type: FETCH_FEEDS, payloads });

            dispatch(updateCurrentPage(currentpage + 1));

            dispatch(isFetchingFeeds(false));
          })
          .catch((err) => {
            console.log(err);
            dispatch(isFetchingFeeds(false));
          });
      });
  };
}

export function isPostFeeds(status) {
  return {
    type: IS_POST_FEEDS,
    status
  };
}

export function postFeeds(image, text) {
  return (dispatch) => {
    dispatch(isPostFeeds(true));
    getAccessToken()
      .then((token) => {
        const form = new FormData();

        if (Platform.OS === 'ios' && image.sourceURL) {
          form.append('attachment', {
            uri: image.sourceURL,
            type: image.mime,
            name: image.filename
          });
        }

        if (image.path) {
          form.append('attachment', {
            uri: image.path,
            type: image.mime,
            name: 'image.jpg'
          });
        }
        form.append('message', text);

        const headers = { Authorization: token };

        DevSummitAxios.post('api/v1/feeds', form, { headers })
          .then((res) => {

            dispatch({ type: CLEAR_TEXT_FIELD, res });
            dispatch({ type: CLEAR_IMAGE, res });
            dispatch(isPostFeeds(false));
          })
          .catch((err) => {
            dispatch({ type: CLEAR_IMAGE, err });
            dispatch({ type: CLEAR_TEXT_FIELD, err });
            dispatch(isPostFeeds(false));
            console.log(err)
          });
      });
  };
}

export function updateImage(image) {
  return {
    type: UPDATE_IMAGE,
    image
  };
}

export function updateText(value) {
  return {
    type: UPDATE_TEXT,
    value
  };
}
