import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { seedDefaultStaffUsers } from './seed/defaultUsers.js';

dotenv.config();

const port = Number(process.env.PORT || 5000);

connectDb()
  .then(() => {
    return seedDefaultStaffUsers();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
