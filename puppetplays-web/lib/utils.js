export const identity = (i) => i;

export const getTitle = (i) => i.title;

export const getFirstItemProp = (prop) => (list) =>
  list.length > 0 ? list[0][prop] : '';

export const getFirstItemTitle = getFirstItemProp('title');
