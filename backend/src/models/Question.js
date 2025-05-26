const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  // 问题标题
  title: {
    type: String,
    required: true,
    trim: true
  },
  // 问题类型（单选、多选、文本）
  type: {
    type: String,
    enum: ['single', 'multiple', 'text'],
    required: true
  },
  // 问题选项
  options: [{
    id: String,
    text: String,
    // 分数或权重
    score: {
      type: Number,
      default: 0
    },
    // 可能的下一个问题
    nextQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }
  }],
  // 问题顺序
  order: {
    type: Number,
    default: 0
  },
  // 问题主题或分类
  category: {
    type: String,
    default: 'procrastination'
  },
  // 是否必答
  required: {
    type: Boolean,
    default: true
  },
  // 问题是否激活
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema); 