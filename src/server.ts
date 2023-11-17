import app from './index';
import  { logger } from './helper/logger';
import { connect } from 'mongoose';

const PORT = process.env.PORT || 4040;
const isLocal = process.env.NODE_ENV === 'Develop';
const url = isLocal ? 'mongodb://127.0.0.1:27017/FUBA' : process.env.MONGO_URI || '';

const connectDB = async (): Promise<void> => {
    const connectionMessage: string = isLocal ? 'Local 🛠️🛠️' : 'Prod🌐🚀';
    try {
      await connect(url);
      logger.info(`Connected to MongoDB ${connectionMessage}`);
    } catch (err: any) {
      logger.error(`Error connecting to mongodb ${err.message}`);
      process.exit(1);
    }
  };

app.listen(PORT, () => {
  logger.info(`Local server running on: http://localhost:${PORT}`);
  connectDB();
});