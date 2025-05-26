const mongoose = require('mongoose');

const TestSessionSchema = new mongoose.Schema({
  // 用户
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 测试类型
  testType: {
    type: String,
    default: 'procrastination',
    enum: ['procrastination', 'personality', 'other']
  },
  // 总得分
  totalScore: {
    type: Number,
    default: 0
  },
  // 测试结果
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  // 答案集合
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  // 测试状态
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  // 开始时间
  startedAt: {
    type: Date,
    default: Date.now
  },
  // 结束时间
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// 创建索引提高查询性能
TestSessionSchema.index({ user: 1, testType: 1 });

module.exports = mongoose.model('TestSession', TestSessionSchema); 