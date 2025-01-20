// pages/index/orderMeal/orderMeal.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    menus:[],
    menuItems: [
      // { name: '茶叶蛋', price: 0.9, quantity: 1, image: '/path/to/tea-egg.jpg' },
      // { name: '汤圆', price: 0.1, quantity: 1, image: '/path/to/tangyuan.jpg' },
      // { name: '牛肉锅贴', price: 1.9, quantity: 1, image: '/path/to/beef-sticker.jpg' },
      // { name: '茴香小油条', price: 0.9, quantity: 1, image: '/path/to/fennel-fried-dough.jpg' }
    ],
    totalQuantity: 0,
    totalPrice: 0,
    isCartExpanded: false // 新增状态变量
  },
  onLoad: function () {
    this.fetchMenus();
    this.updateTotalQuantity();
    this.updateTotalPrice();
  },
  async fetchMenus() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getMenus'
      });
      this.setData({
        menus: res.result.data
      });
      this.data.menus.forEach(item => {
        item.quantity=0
      });
      this.setData({
        menuItems: this.data.menus
      });
      
    } catch (err) {
      console.error("获取菜单失败", err);
    }
  },

  updateTotalQuantity: function () {
    let total = 0;
    this.data.menuItems.forEach(item => {
      total += item.quantity;
    });
    this.setData({ totalQuantity: total }, () => {
      if (this.data.totalQuantity === 0) {
        this.closeCart(); // 如果总数量为0，关闭购物车视图
      }
    });
  },

  updateTotalPrice: function () {
    let total = 0;
    this.data.menuItems.forEach(item => {
      total += item.price * item.quantity;
    });
    this.setData({ totalPrice: total });
  },

  increaseQuantity: function (event) {
    const index = event.currentTarget.dataset.index;
    const items = this.data.menuItems;
    if (items[index].quantity < 10) { // 假设最大数量为10
      items[index].quantity++;
      this.setData({ menuItems: items });
      this.updateTotalQuantity();
      this.updateTotalPrice();
    }
  },

  decreaseQuantity: function (event) {
    const index = event.currentTarget.dataset.index;
    const items = this.data.menuItems;
    if (items[index].quantity > 0) {
      items[index].quantity--;
      this.setData({ menuItems: items });
      this.updateTotalQuantity(); // 更新总数后检查是否需要关闭购物车
      this.updateTotalPrice();
    }
  },

  toggleCartView: function () {
    // 切换购物车视图的显示状态
    this.setData({ isCartExpanded: !this.data.isCartExpanded });
  },

  clearCart: function () {
    this.setData({
      menuItems: this.data.menuItems.map(item => ({ ...item, quantity: 0 })),
      totalQuantity: 0,
      totalPrice: 0
    }, () => {
      this.closeCart(); // 清空购物车后关闭购物车视图
    });
  },

  closeCart: function () {
    this.setData({ isCartExpanded: false });
  },

  placeOrder: function () {
  const _this=this;
    wx.requestSubscribeMessage({
      tmplIds: ['h9nqNdRkJyUVESaXAcPmPgAH9_n5lI1UO1ijkkmHPnM'], // 替换为你的模板ID
      success(res) {
        console.log('用户同意接收订阅消息', res);
        const filteredMenuItems = _this.data.menuItems.filter(item => item.quantity > 0);
    
    // 下单逻辑
    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        openId: wx.getStorageSync('openid'), // 或者通过其他方式获取用户的OpenID
        adminOpenId: wx.getStorageSync('adminOpenId'),
        products: filteredMenuItems,
        totalPrice: 0,
        userId: wx.getStorageSync('username')
        
      },
      
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '下单成功',
            icon: 'success',
            duration: 2000,
          });
    //给管理员推送消息
    
          // 在订单创建成功后调用notifyAdmin函数
          
          // _this.notifyAdmin(res.result); // 假设result包含订单信息
        } else {
          wx.showToast({
            title: '下单失败，请重试',
            icon: 'none',
            duration: 2000,
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败', err);
        wx.showToast({
          title: '系统错误，请稍后再试',
          icon: 'none',
          duration: 2000,
        });
      }
    });
      },
      fail(err) {
        console.error('用户拒绝接收订阅消息', err);
      }
    });
  },


// 在订单创建成功的回调中
async notifyAdmin (orderInfo) {
  const adminOpenId = wx.getStorageSync('adminOpenId'); // 从数据库或其他持久化存储中读取管理员的OpenID
  await wx.cloud.callFunction({
    name: 'notifyAdmin',
    data: {
      adminOpenId: adminOpenId,
      orderInfo: orderInfo
    }
  }).then(res => {
    if (res.result.success) {
      console.log("管理员通知成功");
    } else {
      console.error("管理员通知失败", res.result);
    }
  }).catch(err => {
    console.error("调用云函数失败", err);
  })
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