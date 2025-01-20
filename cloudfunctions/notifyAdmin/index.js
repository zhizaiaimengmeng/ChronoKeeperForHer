const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV, // 使用当前云环境
});

exports.main = async (event, context) => {
  const adminOpenId = event.adminOpenId; // 从前端或数据库传入的管理员OpenID
  const orderInfo = event.orderInfo; // 订单信息

  try {
    const result = await cloud.openapi.customerServiceMessage.send({
      touser: adminOpenId,
      msgtype: "miniprogram",
      miniprogram: {
        appid: 'wxb41ce778c6acae44', // 你的小程序AppID
        pagepath: `pages/index/orderDetail/orderDetail?id=${orderInfo.orderId}`, // 要跳转的小程序页面路径
      },
      text: {
        content: `老板，快来，朦妮儿下单了！订单号: ${orderInfo.orderId}, 总金额: ${orderInfo.totalPrice}`
      }
    });

    console.log("管理员通知结果:", result);
    return { success: true };
  } catch (err) {
    console.error("管理员通知失败:", err);
    return { success: false };
  }
};