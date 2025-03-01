import { userModel } from "../DB/models/index.js";
import {
  AppError,
  asyncHandler,
  tokenTypes,
  verifyToken,
} from "../utilities/index.js";

export const decodeToken = async ({ authorization, tokenType }) => {
  const [prefix, token] = authorization?.split(" ") || [];

  if (!prefix || !token) {
    throw new AppError("Token not found", 401);
  }

  let access_signature = undefined;
  let refresh_signature = undefined;

  if (prefix === process.env.PREFIX_ADMIN) {
    // Admin signatures
    access_signature = process.env.SIGNATURE_ACCESS_ADMIN;
    refresh_signature = process.env.SIGNATURE_REFRESH_ADMIN;
  }
  // User signatures
  else if (prefix === process.env.PREFIX_USER) {
    access_signature = process.env.SIGNATURE_ACCESS_USER;
    refresh_signature = process.env.SIGNATURE_REFRESH_USER;
  }
  // No prefix
  else {
    throw new AppError("Invalid token prefix", 401);
  }

  const decodedToken = await verifyToken({
    token,
    SIGNATURE:
      tokenType === tokenTypes.access ? access_signature : refresh_signature,
  });

  if (!decodedToken?.id) {
    throw new AppError("Invalid token payload", 403);
  }

  const user = await userModel.findOne({
    _id: decodedToken.id,
    deletedAt: { $exists: false },
    bannedAt: { $exists: false },
    isConfirmed: true,
  });

  if (!user) {
    throw new AppError("User not found or banned", 404);
  }

  if (
    user.changeCredentialTime &&
    user.changeCredentialTime.getTime() / 1000 > decodedToken.iat
  ) {
    throw new AppError("Token expired", 401);
  }

  return user;
};

export const authentication = (tokenType = tokenTypes.access) => {
  return asyncHandler(async (req, res, next) => {
    req.user = await decodeToken({
      authorization: req.headers.authorization,
      tokenType,
    });

    next();
  });
};

export const authSocket = async ({ socket }) => {
  const { authorization } = socket.handshake?.auth;
  
  const user = await decodeToken({
    authorization,
    tokenType: tokenTypes.access,
  });

  return { user, statusCode: 200 };
};

export const authGraphql = async (authorization) => {
  const user = await decodeToken({
    authorization,
    tokenType: tokenTypes.access,
  });

  return user;
};
