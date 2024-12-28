import { Request, Response, NextFunction } from "express";

/**
  A higher-order function to wrap asynchronous route handlers
 and automatically handle errors by passing them to the next middleware.
 requestHandler - The asynchronous route handler function to be wrapped.
 A new function that wraps the requestHandler and catches errors.
 */
const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  // Return a new function that takes req, res, and next as arguments
  return (req: Request, res: Response, next: NextFunction) => {
    // Use Promise.resolve to handle the requestHandler's asynchronous nature
    Promise.resolve(requestHandler(req, res, next))
      // If there's an error, catch it and pass it to the next middleware
      .catch((err) => next(err));
  };
};

export { asyncHandler };
