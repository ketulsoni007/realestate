import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserSession from '../models/UserSession.js';

dotenv.config();

export const verifyClientToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided or invalid format',
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userSession = await UserSession.findOne({ token,panel:'client' });

    if (!userSession) {
      return res.status(401).json({
        message: 'Invalid token, please log in again',
      });
    }

    const currentTime = new Date();
    const expirationTime = new Date(userSession.expired_at);

    if (currentTime > expirationTime) {
      // Token has expired, update the session to be inactive
      await UserSession.updateOne(
        { token },
        { $set: { is_active: false } }
      );
      return res.status(401).json({
        message: 'Token has expired, please log in again',
      });
    }

    // Attach user information to the request object
    req.userId = decoded._id;
    req.role = decoded.role;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired, please log in again',
      });
    }

    return res.status(500).json({
      message: 'Error checking user',
      error: error.message,
    });
  }
};
