import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     description: Returns a list of all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 */
router.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Get all questions',
    data: []
  });
});

// 其他路由...

export default router; // 确保有这个导出