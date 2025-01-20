// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { docId } = event;
  const db = cloud.database();

  try {
    const result = await db.collection('mealPlans').doc(docId).get();
    return result;
  } catch (err) {
    console.error("获取点餐计划失败", err);
    return { error: err };
  }
  }