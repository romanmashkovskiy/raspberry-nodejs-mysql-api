import models from '../models';

const { User } = models;

const seed = () => {
    return Promise.all([
        User.create({
            id: '0c683b6e-32d5-445d-bd1a-589ea455106b',
            userName: 'User1',
            email: 'user1@email.com',
            password: 'asdfasdf',
            isConfirmed: true

        }),
        User.create({
            id: 'ad912e3f-432c-4723-8245-2eb3a665b0b0',
            userName: 'User2',
            email: 'user2@email.com',
            password: 'asdfasdf',
            isConfirmed: true
        })
    ])
        .catch(error => console.log(error));
};

export default seed;