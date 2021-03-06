const jwt = require('express-jwt');

const getTokenFromHeader = (req) => {
  if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
    || (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const jwtOptions = {
  secret: process.env.SECRET,
  userProperty: 'payload',
  getToken: getTokenFromHeader,
  algorithms: ['HS256'],
};

const required = jwt(jwtOptions);
const optional = jwt({ ...jwtOptions, credentialsRequired: false });

module.exports = { required, optional };
