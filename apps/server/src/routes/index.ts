import { Router } from 'express';

import { helloRouter } from './hello.routes';

const routes = Router();

routes.use('/hello', helloRouter);

// ✅ 3. 导出总路由
export default routes;
