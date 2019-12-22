import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import {upperFirst, camelCase} from 'lodash';
import dbSettings from '../config/database';
import env from '../config/env';

const config = dbSettings[env.NODE_ENV || 'development'];
const models = {};
const basename = path.basename(__filename);

const sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        models[upperFirst(camelCase(model.name))] = model;
    });

Object
    .keys(models)
    .forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;