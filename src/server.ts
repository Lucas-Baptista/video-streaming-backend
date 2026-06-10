import 'dotenv/config';
import 'reflect-metadata';
import app from './shared/infra/http/app';
import AppDataSource from './shared/infra/typeorm/data-source';

const PORT = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log('Server running');
    });
  })
  .catch ((error) => {
  console.error('Database connection error', error);
});

