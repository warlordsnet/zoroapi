const express = require('express');
const morgan = require('morgan');
const corsConfig = require('./config/cors');
const ratelimit = require('./config/ratelimit');
const errorHandler = require('./config/errorHandler');
const notFoundHandler = require('./config/notFoundHandler');
const animeRouter = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(corsConfig);
app.use(ratelimit);

app.use(express.static(resolve(__dirname, '..', 'public')));
app.get('/health', (_, res) => res.sendStatus(200));
app.use('/anime', animeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
