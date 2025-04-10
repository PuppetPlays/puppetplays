import queryString from 'query-string';

const cookie = require('cookie');

export const identity = i => i;

export const stopEventPropagation = evt => {
  evt.stopPropagation();
};

export const getProperty = property => i => i[property];
export const getTitle = i => i.title;

export const getFirstItemProp = prop => list =>
  list && list.length > 0 ? list[0][prop] : '';

export const getFirstItemTitle = getFirstItemProp('title');

export const hasAtLeastOneItem = arr => arr && arr.length > 0;

export const stringifyQuery = value => {
  return queryString.stringify(value, {
    arrayFormat: 'comma',
    skipNull: true,
  });
};

export const getRandom = (arr, n) => {
  let len = arr.length;
  let nMin = n > len ? len : n;
  const result = new Array(nMin);
  const taken = new Array(len);

  while (nMin--) {
    var x = Math.floor(Math.random() * len);
    result[nMin] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
