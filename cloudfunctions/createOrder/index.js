// cloudfunctions/createOrder/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { openId, products, totalPrice ,userId,adminOpenId } = event;
  try {
    // 插入订单信息到数据库
    const result = await db.collection('orders').add({
      data: {
        openId,
        products,
        totalPrice,
        userId,
        username : userId,
        statusCode: 0,
        statusValue: '待处理',
        createdAt: new Date()
      },
    });

    console.log("订单保存成功:", result);

    // 在这里调用发送订阅消息的函数
    await sendSubscriptionMessage(openId, result._id,userId,adminOpenId);

    return {
      success: true,
      orderId: result._id,
    };
  } catch (error) {
    console.error("订单保存失败:", error);
    return {
      success: false,
      message: '订单创建失败',
    };
  }
};

async function sendSubscriptionMessage(openId, orderId,username,adminOpenId) {
  const templateId = 'h9nqNdRkJyUVESaXAcPmPgAH9_n5lI1UO1ijkkmHPnM'; // 替换为你的模板ID
  let utcTimeString = new Date().toISOString(); // 获取当前时间的ISO字符串
  
// 创建一个Date对象
  let date = new Date(utcTimeString);

  // 将日期转换为本地时间字符串
  let localTimeString = date.toLocaleString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 使用24小时制
  });

  const msgData = {
    touser: openId,
    page: `/pages/index/orderDetail/orderDetail?id=${orderId}`, // 点击消息跳转的小程序页面路径
    templateId: templateId,
    data: {
      character_string1: {
        value: `${orderId}`
      },
      thing2: {
        value: '点餐服务' // 示例服务名称
      },
      thing3: {
        value: username // 示例用户昵称
      },
      time4: {
        value: localTimeString
      },
    },
  };
  const msgDataForAdmin = {
    touser: adminOpenId,
    page: `/pages/index/orderDetail/orderDetail?id=${orderId}`, // 点击消息跳转的小程序页面路径
    templateId: templateId,
    data: {
      character_string1: {
        value: `${orderId}`
      },
      thing2: {
        value: '点餐服务' // 示例服务名称
      },
      thing3: {
        value: username // 示例用户昵称
      },
      time4: {
        value: localTimeString
      },
    },
  };
  

  try {
    const result = await cloud.openapi.subscribeMessage.send(msgData);
    console.log("消息发送结果:", result);
  } catch (err) {
    console.error("消息发送失败:", err);
  }
  if(adminOpenId !=openId){
//给管理员推送消息
    try {
      const result = await cloud.openapi.subscribeMessage.send(msgDataForAdmin);
      console.log("消息发送结果:", result);
    } catch (err) {
      console.error("消息发送失败:", err);
    }
  }

}