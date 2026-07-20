import multer from "multer";
import type { NextFunction, Request, Response } from "express";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadRestaurantImage = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  upload.single("image")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller"
        : error instanceof Error
          ? error.message
          : "Invalid image upload";
    res.status(400).json({ message });
  });
};
