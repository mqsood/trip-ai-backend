const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  let token;

  // check for token in authorization headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // get token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch user details from db and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // explicitly returning next()
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// export directly as an object containing protect
module.exports = { protect };