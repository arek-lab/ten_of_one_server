require('express-async-errors');
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
};
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    // max: 60,
    max: 1000,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
