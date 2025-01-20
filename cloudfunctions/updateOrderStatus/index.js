// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { orderId, statusCode,statusValue } = event;

  try {
    // 更新指定订单的状态
    await db.collection('orders').doc(orderId).update({
      data: {
        statusCode: parseInt(statusCode), // 确保新状态被解析为整数
        statusValue:statusValue,
        updateTime: db.serverDate() // 可选：记录最后更新时间
      }
    });
    return { success: true };
  } catch (err) {
    console.error('更新订单状态失败:', err);
    return { success: false, errMsg: err.message };
  }
}