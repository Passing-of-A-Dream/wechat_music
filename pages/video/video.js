import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],  // 导航栏标签数据
    navId: '',  // 导航的标识
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getViderGroupListData();
    this.getVideoList(this.data.navId)
  },

  // 获取导航数据
  getViderGroupListData(){
    request('/video/group/list').then((res)=>{
      this.setData({
        videoGroupList: res.data.slice(0, 14),
        navId: res.data[0].id
      })
    })
  },

  // 点击切换导航的回调
  changeNav(event){
    let navId = event.currentTarget.id;  //通过id向event传值的时候如果传的是number会自动转成string
    // let navId = event.currentTarget.dataset.id;
    this.setData({
      navId: navId>>>0
    })
  },

  // 获取视频列表数据
  getVideoList(navId){
    request('/video/group', {id: navId}).then((res)=>{
      this.setData({
        videoList: res.datas
      })
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