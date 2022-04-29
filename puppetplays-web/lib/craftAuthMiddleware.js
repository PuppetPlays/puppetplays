const craftAuthMiddleware = (req, res, locale) => {
  // if (
  //   process.env.NODE_ENV !== 'development' &&
  //   (!req.cookies.CraftSessionId ||
  //     Object.keys(req.cookies).every((key) => !key.endsWith('_identity')))
  // ) {
  //   const redirectUrl = locale === 'fr' ? '/wip' : `/${locale}/wip`;
  //   res.setHeader('Location', redirectUrl);
  //   res.statusCode = 302;
  //   return res.end();
  // }
};

export default craftAuthMiddleware;
