// cloudfunctions/getOrderDetail/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const db = cloud.database();
  try {
    return await db.collection('orders').doc(event.orderId).get();
  } catch (e) {
    console.error(e);
  }
};