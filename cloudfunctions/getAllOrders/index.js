const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
});

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await db.collection('orders').get(); // 假设订单存储在 'orders' 集合中
    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    };
  }
}