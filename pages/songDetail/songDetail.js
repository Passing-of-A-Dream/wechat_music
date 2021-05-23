import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'

// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,  // 音乐是否播放
    song: {},  // 歌曲详情对象
    musicId: '',  // 音乐Id
    musicLink: '',  // 音乐的链接
    currentTime: '00:00',  // 实时的时间
    durationTime: '00:00',  // 总时长
    currentWidth: 0,  // 实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 接收传过来的query参数
    // 原生小程序路由传参，对参数长度有限制，如果参数过长会自动截取
    // console.log(JSON.parse(options.song));

    let musicId = options.musicId;
    this.setData({
      musicId
    })
    // 获取音乐详情
    this.getMusicInfo(musicId)

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.isMusicId === musicId) {
      // 修改当前页面的音乐播放状态为true
      this.setData({
        isPlay:true
      })
    }

    // 创建控制音乐播放的实例
    this.BackgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐播放/暂停/停止
    this.BackgroundAudioManager.onPlay(()=>{
      // 播放
      this.changePlayState(true)
      // 修改全局音乐播放状态
      appInstance.globalData.isMusicId = musicId;
    });
    this.BackgroundAudioManager.onPause(()=>{
      // 暂停
      this.changePlayState(false)
    });
    this.BackgroundAudioManager.onStop(()=>{
      // 停止
      this.changePlayState(false)
    });
    // 监听音乐播放自然结束
    this.BackgroundAudioManager.onEnded(()=>{
      // 自动切换至下一首并自动播放
      PubSub.subscribe("musicId", (msg, musicId) => {
        // 取消订阅,避免多次重复
        PubSub.unsubscribe("musicId")
        //获取最新歌曲信息 
        this.getMusicInfo(musicId);
        // 关闭当前音乐
        this.BackgroundAudioManager.stop();
        // 自动播放最新音乐
        this.musicControl(true, musicId)
      })
      PubSub.publish('switchType', 'next')
      // 将实时进度切换为0
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    });

    // 监听音乐实时播放的进度
    this.BackgroundAudioManager.onTimeUpdate(()=>{
      // console.log(this.BackgroundAudioManager.duration);
      // console.log(this.BackgroundAudioManager.currentTime);
      // 格式化实时的播放时间
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    });
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay;
  },

  // 获取音乐详情的功能函数
  getMusicInfo(musicId){
    request('/song/detail', {ids: musicId}).then((res)=>{
      // res.songs[0].dt 单位：ms
      let durationTime = moment(res.songs[0].dt).format('mm:ss');
      this.setData({
        song: res.songs[0],
        durationTime
      })
      // 动态修改窗口标题
      wx.setNavigationBarTitle({
        title: this.data.song.name,
      });
    })
  },

  // 点击播放/暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // 修改是否播放的状态
    // this.setData({
    //   isPlay
    // })
    let {musicId,musicLink} = this.data
    this.musicControl(isPlay,musicId,musicLink);
  },

  // 控制音乐播放/暂停的功能函数
  musicControl(isPlay, musicId, musicLink){
    // this.BackgroundAudioManager = wx.getBackgroundAudioManager();
    if (isPlay) {   // 音乐播放
      if (!musicLink) {
          // 获取音乐播放链接
          request('/song/url', {id: musicId}).then((res)=>{
            musicLink = res.data[0].url
            this.setData({
              musicLink
            })
            // 创建一个音乐播放实例
            this.BackgroundAudioManager.src = musicLink;
            this.BackgroundAudioManager.title = this.data.song.name;
          })
      } else {
        this.BackgroundAudioManager.src = musicLink;
        this.BackgroundAudioManager.title = this.data.song.name;
      }
      
    } else {  //音乐暂停
      this.BackgroundAudioManager.pause();
    }
  },

  // 点击切歌的回调
  handleSwitch(event){
    // 获取切歌的类型
    let type = event.currentTarget.id;
    // 关闭当前播放的音乐
    this.BackgroundAudioManager.stop();
    // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId)=>{
      // 获取音乐的详情信息
      this.getMusicInfo(musicId);
      // 自动播放当前音乐
      this.musicControl(true,musicId);
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据给recommenSong页面
    PubSub.publish('switchType', type)
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