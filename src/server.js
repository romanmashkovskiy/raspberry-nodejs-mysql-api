import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pick } from 'lodash';
import 'babel-polyfill';
import models from './models';
import { apiRouter } from './routes';
import { passport } from './core';
import { errorResponse } from './utils/response';
import socket from './utils/socket';
import env from './config/env';

const { PORT = 4001 } = env;

const app = express();

const server = http.Server(app);
const io = socket(server);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(passport.initialize());

app.use('/api', apiRouter);

app.use((req, res, next) => res.status(404).send(`${ req.url } - Not Found`));

app.use((err, req, res, next) => {
    switch (err.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            const errors = err.errors.map(error => pick(error,
                ['message', 'path', 'value', 'type', 'validatorKey']
            ));
            console.log(`${ err.name }: `, errors);
            return errorResponse(res, {
                name: err.name,
                status: 422,
                errors: errors
            });

        default: {
            console.error(`${ err.name }: `, err);
            return errorResponse(res, err);
        }
    }
});

models.sequelize.sync()
    .then(() => {
        console.log('Nice! Database looks fine')
    })
    .catch(function (err) {
        console.log(err, 'Something went wrong with the Database Update!')
    });


server.listen(Number(PORT), (err) => {
    if (!err) {
        console.log(`Server is waiting for connection at localhost: ${ PORT }`);
    } else {
        console.log(err);
    }
});



