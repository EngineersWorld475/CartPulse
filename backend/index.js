const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authRoutes');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

dbConnect();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', authRouter);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
