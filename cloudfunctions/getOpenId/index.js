const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext(); // 获取当前用户的OpenID

  return {
    openid: OPENID,
  };
};