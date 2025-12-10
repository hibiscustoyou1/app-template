import { Request, Response } from 'express';

export const getHello = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Hello, World!" });
    
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};
