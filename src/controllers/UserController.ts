import { Logger } from '../loaders/logger';
import IUser from '../interfaces/IUser';
import IUserService from '../services/interfaces/IUserService';
import UserService from '../services/UserService';
import autoBind = require('auto-bind');

export default class UserController {
    private logger: Logger;
    private userService: IUserService;

    constructor() {
        this.logger = Logger.getInstance();
        this.userService = UserService.getInstance();
        autoBind(this);
    }

    public async createUser(req: any, res: any): Promise<void> {
        this.logger.info('UserController - createUser()');

        if (req.body) {
            const user: IUser = req.body;
            await this.userService.createUser(user)
                .then(data => {
                    res.status(201).send(data);
                })
                .catch(error => {
                    this.logger.error(error.message);
                    res.status(500).send({ err: error.message });
                });
        } else {
            this.logger.error('No request body.');
            res.status(400).send({ err: 'No request body' });
        }
    }

    public async getAllUsers(req: any, res: any): Promise<void> {
        this.logger.info('UserController - getAllUsers()');

        await this.userService.getAllUsers()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
    }

    public async getUserById(req: any, res:any) {
        this.logger.info('UserController - getUserById()');

        const id = req.params.id;

        await this.userService.getUserById(id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
    }

    public async updateUser(req: any, res: any) {
        this.logger.info('UserController - updateUser()');

        const id = req.params.id;

        if (req.body) {
            const user: IUser = req.body;

            await this.userService.updateUser(id, user)
                .then(() => {
                    res.status(204).send();
                })
                .catch(error => {
                    this.logger.error(error.message);
                    res.status(500).send({ err: error.message });
                });
        } else {
            this.logger.error('No request body.');
            res.status(400).send({ err: 'No request body' });
        }
    }

    public async deleteUser(req: any, res: any) {
        this.logger.info('UserController - deleteUser()');

        const id = req.params.id;

        await this.userService.deleteUser(id)
            .then(data => {
                res.status(204).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
    }

}
