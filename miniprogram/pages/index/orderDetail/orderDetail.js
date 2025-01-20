// pages/index/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    statusOptions: ['待处理','已完成'], // 状态选项
    statusValues: [0, 1], // 对应的状态数值
    statusIndex: 0, // 默认选中的状态索引
    isAdmin: false, // 标记是否为管理员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.orderId) {
      this.fetchOrderDetail(options.orderId);
      this.checkUserRole();
    }
  },
  fetchOrderDetail(orderId) {
    const db = wx.cloud.database();
    db.collection('orders')
      .doc(orderId)
      .get()
      .then(res => {
        const orderStatus = res.data.statusCode;
        let index = this.data.statusValues.indexOf(orderStatus);
        index = index === -1 ? 0 : index; // 如果找不到对应状态，默认使用第一个选项
        this.setData({
          orderDetail: res.data,
          statusIndex: index
        });
      })
      .catch(err => {
        console.error('获取订单详情失败:', err);
      });
  },
  checkUserRole() {
    // 假设通过某种方式获取当前用户的角色信息
    // 这里简单示例，实际应用中应该从服务器端获取用户角色信息
    const currentUserRole = wx.getStorageSync('role'); // 应该替换为实际获取用户角色的逻辑
    this.setData({ isAdmin: currentUserRole === 'admin' });
  },
  onStatusChange(e) {
    if (this.data.isAdmin) {
      this.setData({ statusIndex: e.detail.value });
    } else {
      console.warn('非管理员无法更改订单状态');
    }
  },
  updateOrderStatus() {
    if (!this.data.isAdmin) {
      wx.showToast({
        title: '您没有权限修改订单状态',
        icon: 'none'
      });
      return;
    }
    const statusCode = this.data.statusValues[this.data.statusIndex];
    const statusValue = this.data.statusOptions[this.data.statusIndex];
    
    wx.cloud.callFunction({
      name: 'updateOrderStatus',
      data: {
        orderId: this.data.orderDetail._id,
        statusCode: statusCode,
        statusValue: statusValue

      }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
        this.fetchOrderDetail(this.data.orderDetail._id); // 刷新订单详情
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
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