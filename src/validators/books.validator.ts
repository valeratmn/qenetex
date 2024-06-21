import { body } from "express-validator";

export const createBookValidator = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("author").isString().notEmpty().withMessage("Author is required"),
  body("publicationDate")
    .isISO8601()
    .toDate()
    .withMessage("Invalid publication date"),
  body("genres").isArray().withMessage("Genres must be an array"),
];
