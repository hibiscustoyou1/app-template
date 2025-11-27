// server/src/routes/wageRoutes.ts
import { Router } from 'express';
import { getHello } from '../controllers/helloController'; 

const router = Router();

// 定义 GET /wages 路由
router.get('/hello', getHello);

export default router;
