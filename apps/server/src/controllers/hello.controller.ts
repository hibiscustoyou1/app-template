import { Request, Response } from 'express';
import { ApiResponse, HelloData } from '@repo/shared';

export const getHello = async (req: Request, res: Response<ApiResponse<HelloData>>) => {
  try {
    res.json({
      success: true,
      data: {
        message: "Hello, World from Monorepo!",
        timestamp: Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '服务器错误'
    });
  }
};
