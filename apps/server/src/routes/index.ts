import { Router } from 'express';

import { helloRouter } from './hello.routes';

const routes = Router();

routes.use('/api', helloRouter);

export default routes;
