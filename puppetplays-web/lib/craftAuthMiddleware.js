const craftAuthMiddleware = (req, res) => {
  if (
    process.env.NODE_ENV !== 'development' &&
    (!req.cookies.CraftSessionId ||
      Object.keys(req.cookies).every((key) => !key.endsWith('_identity')))
  ) {
    res.statusCode = 302;
    res.setHeader('Location', '/wip');
    res.end();
  }
};

export default craftAuthMiddleware;
