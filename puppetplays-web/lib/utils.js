import queryString from 'query-string';
import cookie from 'cookie';

export const identity = (i) => i;

export const getProperty = (property) => (i) => i[property];
export const getTitle = (i) => i.title;

export const getFirstItemProp = (prop) => (list) =>
  list && list.length > 0 ? list[0][prop] : '';

export const getFirstItemTitle = getFirstItemProp('title');

export const hasAtLeastOneItem = (arr) => arr && arr.length > 0;

export const stringifyQuery = (value) => {
  return queryString.stringify(value, {
    arrayFormat: 'comma',
    skipNull: true,
  });
};

export const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const formatBirthDeathDates = (birthDate, deathDate) => {
  if (!birthDate && !deathDate) {
    return null;
  }

  const formater = (date) => (date ? date : '…');

  return `${formater(birthDate)} – ${formater(deathDate)}`;
};
