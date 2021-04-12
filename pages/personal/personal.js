import request from '../../utils/request'

// pages/personal/personal.js
let statrY = 0; //手指起始的坐标
let moveY = 0;  //手指移动的坐标
let moveDistance = 0;  //手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coveTransition: '',
    userInfo: {},  //用户信息
    recenetPlayList:[]  // 用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // 获取用户播放记录
    }
  },

  // 获取用户播放记录的功能函数
  getUserRecentPlayList(userId){
    request('/user/record', {})
  },

  handleTouchStart(event){
    this.setData({
      coveTransition: ''
    })
    // 获取手指起始坐标
    statrY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - statrY; //获取移动的距离

    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 90) {
      moveDistance = 90;
    }
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 0.3s linear'
    })
  },

  // 跳转到登录login页面的回调
  toLogin(){
    wx.reLaunch({
      url: '/pages/login/login'
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})