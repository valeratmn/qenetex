import express from 'express';
import mongoose from 'mongoose';
import bookRoutes from './routes/books.route';
import userRoutes from './routes/users.route';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config';

dotenv.config();

export const app = express();
const PORT = process.env.APP_PORT || 3020;

app.use(express.json());
app.use(helmet());
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.dbHost).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
}