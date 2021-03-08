export const identity = (i) => i;

export const getTitle = (i) => i.title;

export const getFirstItemProp = (prop) => (list) =>
  list && list.length > 0 ? list[0][prop] : '';

export const getFirstItemTitle = getFirstItemProp('title');

export const hasAtLeastOneItem = (arr) => arr && arr.length > 0;
