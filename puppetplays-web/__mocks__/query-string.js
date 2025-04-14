module.exports = {
  stringify: jest.fn(obj => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }),
  parse: jest.fn(str => {
    if (!str) return {};
    return str
      .split('&')
      .map(param => param.split('='))
      .reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {});
  }),
};
