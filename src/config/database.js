import env from './env';

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = env;

export default {
    development: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: 'mariadb',
        define: {
            timestamps: true,
        }
    },
    test: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: 'mariadb',
        define: {
            timestamps: true,
        }
    },
    production: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: 'mariadb',
        define: {
            timestamps: true,
        }
    }
};