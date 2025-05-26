db = db.getSiblingDB('questionnaire');

// 创建数据库用户
db.createUser({
  user: 'questionnaire_user',
  pwd: 'questionnaire_password',
  roles: [
    {
      role: 'readWrite',
      db: 'questionnaire'
    }
  ]
});

// 创建初始集合
db.createCollection('questions');
db.createCollection('users');
db.createCollection('responses');

// 创建索引
db.questions.createIndex({ "order": 1 });
db.users.createIndex({ "email": 1 }, { unique: true });
db.responses.createIndex({ "userId": 1, "createdAt": -1 }); 