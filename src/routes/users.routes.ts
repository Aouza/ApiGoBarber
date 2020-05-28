import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';

import UpdateAvatarUserService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const uploadFile = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        delete user.password;

        return response.json(user);
    } catch (err) {
        return response.status(400).json({
            error: err.message,
        });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    uploadFile.single('avatar'),
    async (request, response) => {
        const { id } = request.user;
        const { filename } = request.file;
        const updateAvatarUser = new UpdateAvatarUserService();

        const user = await updateAvatarUser.execute({
            user_id: id,
            avatarFileName: filename,
        });

        delete user.password;
        return response.json(user);
    },
);

export default usersRouter;
