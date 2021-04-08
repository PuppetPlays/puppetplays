export const identity = (i) => i;

export const getProperty = (property) => (i) => i[property];
export const getTitle = (i) => i.title;

export const getFirstItemProp = (prop) => (list) =>
  list && list.length > 0 ? list[0][prop] : '';

export const getFirstItemTitle = getFirstItemProp('title');

export const hasAtLeastOneItem = (arr) => arr && arr.length > 0;

export const getApiUrl = (path) => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  }
  const { protocol, host } = window.location;
  return `${protocol}//api.${host}/${path}`;
};
