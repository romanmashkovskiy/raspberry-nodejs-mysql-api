import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pick } from 'lodash';
import 'babel-polyfill';
import models from './models';
import { apiRouter } from './routes';
import { passport } from './core';
import { errorResponse } from './utils/response';

const app = express();
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


app.listen(4001, (err) => {
    if (!err) {
        console.log('Server is waiting for connection at localhost: 4001');
    } else {
        console.log(err);
    }
});



