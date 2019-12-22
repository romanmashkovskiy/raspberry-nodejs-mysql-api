#!/usr/bin/env node

import 'babel-polyfill';
import models from '../models';
import seed from './seed';

models
    .sequelize
    .sync({force: true})
    .then(async () => {
        await seed();
        console.log('SUCCESS: Sync and seed completed.');
        process.exit();
    })
    .catch((error) => {
        console.log('ERROR: Sync and seed, aborted.', error);
        process.exit();
    });