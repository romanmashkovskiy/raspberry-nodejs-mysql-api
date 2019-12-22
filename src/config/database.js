import env from './env';

export default {
    development: {
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        host: env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: true,
        }
    },
    test: {
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        host: env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: true,
        }
    },
    production: {
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        host: env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: true,
        }
    }
};