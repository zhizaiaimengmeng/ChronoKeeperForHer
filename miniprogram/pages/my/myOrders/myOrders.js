// pages/my/myOrders/myOrders.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  onLoad() {
    this.getOrders();
  },

  getOrders() {
    const userId = wx.getStorageSync('username'); // 假设用户ID保存在本地缓存中
    console.log('Fetching orders for user:', userId);
    db.collection('orders')
      .where({
        userId: userId // 使用正确的字段名
      })
      .get()
      .then(res => {
        
         // 对每个订单格式化createdAt字段
    const formattedOrders = res.data.map(order => {
      const date = new Date(order.createdAt);
      return {
        ...order,
        formattedCreatedAt: date.toLocaleString('zh-CN', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // 使用24小时制
        })
      };
    });
    // 更新页面数据
    this.setData({
      orders: formattedOrders
    });
      })
      .catch(err => {
        console.error('获取订单失败', err);
      });
  },
  showDetail(e) {
    const index = e.currentTarget.dataset.index;
    const orderId = this.data.orders[index]._id;
    wx.navigateTo({
      url: `/pages/index/orderDetail/orderDetail?orderId=${orderId}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})