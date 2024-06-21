import { Router } from 'express';
import { auth } from '../middleware/auth';
import { createBookValidator } from '../validators/books.validator';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/books.controller';

const router = Router();

router.post('/', createBookValidator, auth.admin, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', auth.admin, updateBook);
router.delete('/:id', auth.admin, deleteBook);

export default router;