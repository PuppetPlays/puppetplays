module.exports = {
  stringify: jest.fn((obj, options) => {
    return Object.entries(obj)
      .filter(([, value]) => (options?.skipNull ? value !== null : true))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  }),
  parse: jest.fn((str) => {
    if (!str) return {};
    return str
      .split('&')
      .map(param => param.split('='))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: decodeURIComponent(value),
      }), {});
  })
}; 