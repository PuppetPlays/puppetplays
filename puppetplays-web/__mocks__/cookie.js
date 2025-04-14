module.exports = {
  parse: jest.fn(cookieStr => {
    if (!cookieStr) return {};
    return cookieStr
      .split(';')
      .map(cookie => cookie.trim().split('='))
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value,
        }),
        {},
      );
  }),
  serialize: jest.fn((name, value, options = {}) => {
    let cookieStr = `${name}=${value}`;
    if (options.expires)
      cookieStr += `; expires=${options.expires.toUTCString()}`;
    if (options.path) cookieStr += `; path=${options.path}`;
    if (options.domain) cookieStr += `; domain=${options.domain}`;
    if (options.secure) cookieStr += `; secure`;
    if (options.httpOnly) cookieStr += `; httpOnly`;
    return cookieStr;
  }),
};
