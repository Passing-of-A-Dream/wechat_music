import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],  // 导航栏标签数据
    navId: '',  // 导航的标识
    videoList: [],  // 视频数据
    videoId: '',  // 视频id标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getViderGroupListData();
  },

  // 获取导航数据
  getViderGroupListData(){
    request('/video/group/list').then((res)=>{
      this.setData({
        videoGroupList: res.data.slice(0, 14),
        navId: res.data[0].id
      })
      // 获取视频列表数据
      this.getVideoList(this.data.navId);
    })
  },

  // 获取视频列表数据
  getVideoList(navId){
    if (!navId) {  // 判断navId为空串的情况
      return;
    }
    request('/video/group', {id: navId}).then((res)=>{
      // 关闭消息提示框
      wx.hideLoading();
      let index = 0;
      let videoList = res.datas.map(item => {
        item.id = index++;
        return item;
      })
      this.setData({
        videoList
      })
    })
  },

  // 点击切换导航的回调
  changeNav(event){
    let navId = event.currentTarget.id;  //通过id向event传值的时候如果传的是number会自动转成string
    // let navId = event.currentTarget.dataset.id;
    this.setData({
      navId: navId>>>0,
      videoList:[]
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载'
    });
    // 动态获取当前导航对应的数据
    this.getVideoList(this.data.navId);
  },

  handleplay(event){
    /**
     * 问题： 多个视频同时播放
     * 需求：
     *  1、在点击播放的事件中需要找到上一个播放的视频
     *  2、在播放新的视频之前关闭上一个正在播放的视频
     * 关键：
     *  1、如何找到上一个视频的实例对象
     *  2、如何确认点击播放的视频和正在播放的视频不是同一个视频
     * 单例模式：
     *  1、需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
     *    节省内存空间
     */

    let vid = event.currentTarget.id;
    // 停止播放上一个视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;

    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })

    // 创建控制video标签的实例对象
    this.videoContext =  wx.createVideoContext(vid);
    this.videoContext.play();
    // this.videoContext.stop();
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