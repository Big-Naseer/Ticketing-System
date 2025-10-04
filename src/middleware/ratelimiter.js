import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts
  message: "Too many login attempts, please try again later"
});

export const scanLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 5, // 5 scans per 5 seconds
  message: "Too many scans, slow down"
});
