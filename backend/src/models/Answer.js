const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  // 用户标识
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 问题
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  // 选择的选项
  selectedOptions: [{
    type: String,
    required: true
  }],
  // 文本答案（针对文本类型问题）
  textAnswer: {
    type: String,
    default: null
  },
  // 答案得分
  score: {
    type: Number,
    default: 0
  },
  // 答题时间
  answeredAt: {
    type: Date,
    default: Date.now
  },
  // 测试会话标识
  testSession: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

// 创建复合索引，提高查询性能
AnswerSchema.index({ user: 1, testSession: 1 });

module.exports = mongoose.model('Answer', AnswerSchema); 