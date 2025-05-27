import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  wechatOpenId?: string;
  role: 'user' | 'admin';
  profile: {
    nickname?: string;
    avatar?: string;
    bio?: string;
  };
  testHistory: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  // 用户名
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  // 电子邮件
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的电子邮件地址']
  },
  // 密码（加密存储）
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // 微信OpenID（用于微信登录）
  wechatOpenId: {
    type: String,
    default: null
  },
  // 用户角色
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // 个人资料
  profile: {
    nickname: String,
    avatar: String,
    bio: String
  },
  // 测试历史
  testHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSession'
  }]
}, {
  timestamps: true
});

// 密码加密中间件
UserSchema.pre<IUser>('save', async function(next) {
  // 只在密码修改时加密
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error : any) {
    next(error);
  }
});

// 密码验证方法
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);