import PromiseRouter from 'express-promise-router';
import { authController, raspberryController } from '../controllers';
import APIError from '../utils/APIError';
import { errorResponse } from '../utils/response';
import { loginGuard, accessGuard, resetPasswordGuard } from '../middlewares';
import { pick } from 'lodash';

const Router = PromiseRouter();

/*Auth*/
Router.post('/auth/register', authController.register);
Router.post('/auth/login', loginGuard(), authController.login);
Router.get('/auth/me', accessGuard(), authController.getMe);
Router.post('/auth/email-confirm', accessGuard(), authController.confirmEmail);
Router.post('/auth/password-reset', resetPasswordGuard(), authController.resetPassword);
Router.post('/auth/password-restore', resetPasswordGuard(), authController.restorePassword);
Router.post('/auth/send-confirm-code', accessGuard(), authController.sendConfirmEmailCode);

/*Raspberry*/
Router.post('/blink', accessGuard(), raspberryController.blink);

/* Not found handler */
Router.use((req, res, next) => next(new APIError(`${ req.url } - Not Found`, 404)));

/* Error handler */
Router.use((err, req, res, next) => {
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

export default Router;