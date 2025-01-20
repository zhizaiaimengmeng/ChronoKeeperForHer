// 云函数入口文件：updateMenu.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { id, updatedData } = event; // 接收需要更新的menuId和数据

  try {
    // 更新指定菜单项
    await db.collection('menus').doc(id).update({
      data: {
        ...updatedData, // 扩展运算符用于合并对象
        updateTime: db.serverDate() // 可选：记录最后更新时间
      }
    });
    return { success: true };
  } catch (err) {
    console.error('更新菜单失败:', err);
    return { success: false, errMsg: err.message };
  }
};