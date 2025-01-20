// pages/index/adminOrders/adminOrders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchOrders();
  },
  fetchOrders() {
    wx.cloud.callFunction({
      name: 'getAllOrders',
      success: res => {
        if (res.result.success) {
          this.setData({
            orders: res.result.data
          });
        } else {
          console.error('获取订单失败:', res.result.errMsg);
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
      }
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