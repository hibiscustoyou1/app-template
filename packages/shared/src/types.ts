// 定义通用的 API 响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 定义 Hello 接口的具体返回数据
export interface HelloData {
  message: string;
  timestamp: number;
}
