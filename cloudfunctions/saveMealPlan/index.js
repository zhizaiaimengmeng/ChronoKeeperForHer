// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { date, meals, userId } = event;
  const docId = `${userId}_${date}`;
const db = cloud.database();
  return await db.collection('mealPlans').doc(docId).set({
    data: {
      userId: userId,
      date: date,
      meals: meals,
      updatedAt: new Date()
    }
  });
}