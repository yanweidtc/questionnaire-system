import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT密钥，应从环境变量读取
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// 验证用户token
export const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: '未提供认证令牌' 
      });
    }

    // 验证token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        message: '用户不存在' 
      });
    }

    // 将用户信息附加到请求对象
    req.user = user;
    next();
  } catch (error : any) {
    res.status(401).json({ 
      message: '认证失败', 
      error: error.message 
    });
  }
};

// 需要管理员权限
export const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    // 先进行用户认证
    await authenticateUser(req, res, () => {
      // 检查用户角色
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: '需要管理员权限' 
        });
      }
      next();
    });
  } catch (error : any) {
    res.status(500).json({ 
      message: '权限验证失败', 
      error: error.message 
    });
  }
};

// 生成JWT
export const generateToken = (user: any) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { 
      expiresIn: '7d'  // 7天有效期
    }
  );
};