import { Schema, model } from 'mongoose';
import { IBook } from '../types';

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  genres: [String]
});

export const Book = model<IBook>('Book', bookSchema);