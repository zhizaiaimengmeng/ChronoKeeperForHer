const app = getApp();
Page({
    data: {
        buttonList: [ {
            bimg: app.getImgSrc('轮播图.png'),
            btap: "toLoopPic",
            url:"loopPic/loopPic",
            btip: "轮播图"
        },{
            bimg: app.getImgSrc('消费记录1.png'),
            btap: "toCostNew",
            url:"toCostNew/toCostNew",
            btip: "消费记录"
        },{
            bimg: app.getImgSrc('睡觉.png'),
            btap: "toSleep",
            url:"sleepClock/sleepClock",
            btip: "睡觉打卡"
        },{
            bimg: app.getImgSrc('纪念日.png'),
            btap: "toAnniversaryDay",
            url:"anniversaryDay/anniversaryDay",
            btip: "纪念日"
        },{
            bimg: app.getImgSrc('生理期助手.png'),
            btap: "toPhysiologicalPeriod",
            url:"physiologicalPeriodPage/physiologicalPeriodPage",
            btip: "宝贝辛苦日"
        }, {
            bimg: app.getImgSrc('许愿树1.png'),
            btap: "toWishTree",
            url:"wishTreePage/wishTreePage",
            btip: "许愿树"
        }, {
            bimg: app.getImgSrc('标签.png'),
            btap: "toType",
            url:"typePage/typePage",
            btip: "查看标签"
        }, {
            bimg: app.getImgSrc('消费.png'),
            btap: "toCost",
            url:"costPage/costPage",
            btip: "查看消费"
        }, {
          bimg: app.getImgSrc('菜单管理.png'),
          btap: "menuManager",
          url:"menuManager/menuManager",
          btip: "菜单管理"
      },{
        bimg: app.getImgSrc('点餐.png'),
        btap: "orderMeal",
        url:"orderMeal/orderMeal",
        btip: "点餐"
    },{
      bimg: app.getImgSrc('订单信息.png'),
      btap: "adminOrders",
      url:"adminOrders/adminOrders",
      btip: "订单信息"
  },{
            bimg: app.getImgSrc('电影.png'),
            btap: "toFilm",
            url:"filmPage/filmPage",
            btip: "观影清单"
        }, {
            bimg: app.getImgSrc('密码1.png'),
            btap: "passwordBox",
            url:"passwordBox/passwordBox",
            btip: "密码柜"
        }, {
            bimg: app.getImgSrc('打卡.png'),
            btap: "toDo",
            url:"todo",
            btip: "打卡清单"
        }, {
            bimg: app.getImgSrc('留言1.png'),
            btap: "",
            url:"todo",
            btip: "留言板"
        },  {
            bimg: app.getImgSrc('敬请期待.png'),
            btap: "",
            url:"todo",
            btip: "敬请期待"
        } ],
        hiddenmodalput: !1,
        tip: "登录",
        tpassword: "",
        originImgUrls:[],
        images: [],
        rotation: 0,
        angleStep: 0
    },
    startRotation() {
      setInterval(() => {
        this.setData({
          rotation: (this.data.rotation + 1) % 360
        });
      }, 100);
    },
  //获取上传的图片
  getImgList: function(){
    app.callFunctiom('getMyType','myLoopImg').then(res => {
      const imgList = res.result.data;
      this.setData({
        originImgUrls:imgList
      })
    
      const numImages = this.data.originImgUrls.length;
        const angleStep = 360 / numImages;
        this.setData({ angleStep });
    
        this.startRotation();
    }).catch(err=>{
      console.log('err',err);
    });
  },
    inputUsername: function(t) {
        this.setData({
            username: t.detail.value
        });
    },
    inputPassword: function(t) {
        var o = "", i = t.detail.value.length, a = t.detail.value, e = this.data.tpassword, n = e.length;
        n > i ? e = e.substr(0, i) : e += a.substr(n, i - n);
        for (var d = 0; d < i; d++) o += "*";
        this.setData({
            password: o,
            tpassword: e
        });
    },
    confirm: function(t) {
        console.log("onLoad",app.getUserConfig());
        const users = app.getUserConfig();
        let o = this.data.username, i = this.data.tpassword;
        let role=this.data.role;

        users[o] != undefined && users[o].password == i ? (wx.setStorage({
            key: "username",
            data: o
        }),wx.setStorage({
          key: "role",
          data: users[o].role
      }), wx.showToast({
            title: "欢迎" + users[o].nickName,
            icon: "success"
        }), wx.showTabBar({
            animation: !0
        }), this.setData({
            hiddenmodalput: !0
        }),
        // 调用云函数获取OpenID
      wx.cloud.callFunction({
        name: 'getOpenId',
        data: {},
        success: res => {
          const openid = res.result.openid;
          console.log('获取到的OpenID:', openid);
          if(o==='刘志'){
            wx.setStorageSync('adminOpenId', openid); // 存储OpenID
            wx.setStorageSync('openid', openid);
          }else{
            wx.setStorageSync('openid', openid); // 存储OpenID
          }
          
        },
        fail: err => {
          console.error('获取OpenID失败:', err);
        }
      })) : wx.showToast({
            title: "登录失败",
            icon: "none"
        });
    },
    onLoad: function(t) {
        var o = this;
        this.getImgList();
        this.playMusic();
        wx.getStorage({
            key: "username",
            success: function(t) {
                console.log(t.data), o.setData({
                    hiddenmodalput: !0
                });
            },
            fail: function(t) {
                console.log(t), o.setData({
                    hiddenmodalput: !1
                }), wx.hideTabBar({
                    animation: !0,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {}
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        this.getImgList();
    },
    onHide: function() {},
    onUnload: function() {
        wx.removeStorage({
            key: "usename",
            success: function(t) {
                console.log(t);
            }
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    toUrl(e){
        console.log(e);
        let url = e.target.dataset.url;
        if(url == 'todo'){
            wx.showToast({
              icon: 'none',
              title: '敬请期待',
            })
            return;
        }
        wx.navigateTo({
            url: url
        });
    },
    //播放音乐
    playMusic(){
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = '首尔第一深情'; // 可自定义
    backgroundAudioManager.epname = '专辑名'; // 可自定义
    // backgroundAudioManager.singer = '空壳'; // 可自定义
    // backgroundAudioManager.coverImgUrl = '封面图片url'; // 仅安卓生效, 可自定义
    backgroundAudioManager.src = 'cloud://rockjimmy-6gcbj7xz0cc3574c.726f-rockjimmy-6gcbj7xz0cc3574c-1334778864/背景音乐/空壳-首尔第一深情.mp3'; // 设置音频源
    backgroundAudioManager.loop = true; // 设置为循环播放
    
    // 监听音乐自然结束事件，虽然设置了loop=true，但监听这个事件可以处理一些特殊情况
    backgroundAudioManager.onEnded((res) => {
      console.log('音乐播放完毕');
      // this.playMusic();
    });

    // 开始播放
    backgroundAudioManager.play();
    }
});