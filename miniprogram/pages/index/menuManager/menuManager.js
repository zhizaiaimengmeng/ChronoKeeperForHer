// pages/index/menuManager/menuManager.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
    ],
    isAddModalVisible: false,
    isEditModalVisible:false,
    newMealName: '',
    uploadedImageUrl: '',
    uploadMenueId: ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 加载已有菜品数据
    this.loadMenus();

  },

  loadMenus() {
    // 示例：模拟从服务器加载菜单数据
    
    wx.cloud.database().collection('menus').get({
      success: res => {
        this.setData({ menus: res.data });
      }
    });
    
  },

  showAddModal() {
    this.setData({ isAddModalVisible: true });
  },

  hideAddModal() {
    this.setData({ isAddModalVisible: false, newMealName: '', newImageUrl: '' });
  },
  hideEditModal() {
    this.setData({ isEditModalVisible: false, newMealName: '', newImageUrl: '' });
  },

  onNewMealNameChange(e) {
    this.setData({ newMealName: e.detail.value });
  },

  onNewImageUrlChange(e) {
    this.setData({ newImageUrl: e.detail.value });
  },

  



  deleteMenu(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该菜品吗？',
      success: (res) => {
        if (res.confirm) {
          const newMenus = this.data.menus.filter(menu => menu._id !== id);
          this.setData({ menus: newMenus });
          console.log('已删除菜单 ID:', id);
          // 同步删除数据库中的记录
          
          wx.cloud.database().collection('menus').doc(id).remove({
            success: res => {
              console.log("删除成功", res);
              // 更新前端数据列表
              this.setData({
                menus: this.data.menus.filter(menu => menu._id !== id)
              });
            },
            fail: err => {
              console.error("删除失败", err);
            }
          });
        }
      }
    });
  },

  showAddModal() {
    this.setData({ isAddModalVisible: true });
  },
  showEditModal(e) {
    this.setData({ uploadMenueId: e.currentTarget.dataset.item._id });
    this.setData({ newMealName: e.currentTarget.dataset.item.mealName });
    this.setData({ uploadedImageUrl: e.currentTarget.dataset.item.imageUrl });
    // 这里可以跳转到编辑页面或显示编辑弹窗等操作
    this.setData({ isEditModalVisible: true });
  },

  hideAddModal() {
    this.setData({ isAddModalVisible: false, newMealName: '', uploadedImageUrl: '' });
  },

  onNewMealNameChange(e) {
    this.setData({ newMealName: e.detail.value });
  },

  uploadImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;

        // const filePath = res.tempFilePaths[0]
        const timestamp = (new Date()).valueOf();//新建日期对象并变成时间戳
        const imgPath = "menueImg_"+timestamp+".jpg"; // 上传至云端的路径
        wx.showLoading({
          title: '上传中',
        })
        // 可以在这里上传图片到服务器
        wx.cloud.uploadFile({
          cloudPath: '菜单/'+imgPath, // 替换为你的服务器地址
          filePath: tempFilePaths[0], //临时文件目录
          success(res) {
            const url = res.fileID;
              console.log('图片上传成功:', url);
              that.setData({ uploadedImageUrl: url});
            
          },
          fail(err) {
            console.error('图片上传失败:', err);
            wx.showToast({
              title: '图片上传失败，请重试',
              icon: 'none'
            });
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    });
  },

  addMenu() {
    
    if (!this.data.newMealName || !this.data.uploadedImageUrl) {
      wx.showToast({
        title: '请输入菜品名称并上传图片',
        icon: 'none'
      });
      return;
    }
    const newMenu = {
      menueId: this.data.menus.length > 0 ? Math.max(...this.data.menus.map(item => item.menueId)) + 1 : 1,
      mealName: this.data.newMealName,
      imageUrl: this.data.uploadedImageUrl
    };

    this.setData({
      menus: [...this.data.menus, newMenu],
      isAddModalVisible: false,
      newMealName: '',
      uploadedImageUrl: ''
    });

    // 同步添加到数据库
    
    wx.cloud.database().collection('menus').add({
      data: newMenu,
      success: res => {
        console.log("添加成功", res)
      },
      fail: err => {
        console.error("添加失败", err)
      }
    });
  
  },
  handlePreviewImage(e) {
    debugger
    const item= e.currentTarget.dataset.item;
    wx.previewImage({
      current: item.imageUrl, // 当前显示图片的http链接
      urls: [item.imageUrl], // 需要预览的图片http链接列表
    });
  },
  editMenu(e) {
    // 调用示例：假设你知道具体的菜单ID和要更新的新数据
      const menuId = this.data.uploadMenueId; // 替换为实际的菜单ID
      const newData = {
        mealName: this.data.newMealName,
        imageUrl: this.data.uploadedImageUrl
      };

      wx.cloud.callFunction({
        name: 'updateMenu',
        data: {
                id: menuId,
                updatedData: newData
              },
        
        success: res => {
          if (res.result.success) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000,
            });
      
            this.setData({ isEditModalVisible: false });
            this.loadMenus();
          } else {
            wx.showToast({
              title: '修改失败，请重试',
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