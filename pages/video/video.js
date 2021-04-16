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
    // videoUpdateTime: [], // 记录video的播放时长   负优化，没用
    isTriggered: false, //
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
        videoList,
        isTriggered: false  // 关闭下拉刷新
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

  // 点击播放/继续播放的回调
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
    this.vid !== vid && this.videoContext && this.videoContext.stop();
    this.vid = vid;

    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })

    // 创建控制video标签的实例对象
    this.videoContext =  wx.createVideoContext(vid);
    // 判断当前的视频之前是否播放过，是否有播放记录，如果有，跳转至上次播放位置
    // let {videoUpdateTime} = this.data;
    // let videoItem = videoUpdateTime.find(item => item.id === vid);
    // if (videoItem) {
    //   this.videoContext.seek(videoItem.currentTime)
    // }
    this.videoContext.play();
    // this.videoContext.stop();
  },

  /*监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    
    //  思路：判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
    //    1、如果有，在原有的播放记录中修改播放时间为当前的播放时间
    //    2、如果没有，需要在数组中添加当前视频的播放对象
     
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) {  // 之前有
      videoItem.currentTime = event.detail.currentTime
    }else {  // 之前没有
      videoUpdateTime.push(videoTimeObj)
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },

  视频播放结束调用的回调
  handleEnded(event){
    // 移除记录播放时长数组中当前视频的对象
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdateTime
    })
  },*/

  // 自定义下拉刷新的回调：scroll-view
  handleFefresher(){

    // 再次发请求，获取列表数据
    this.getVideoList(this.data.navId);
  },

  // 自定义上拉触底的回调：scroll-view
  handleToLower(){
    // 数据分页：1、后端分页，2、前端分页
    // console.log('发送请求 || 在前端截取最新的数据 追加到视频列表的后方');
    // console.log('网易云音乐暂时没有提供分页的api');
    // 模拟数据
    let newVideoList = [
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_EB82F87F8A5C59B54CF86F3D504D6505",
                  "coverUrl": "https://p2.music.126.net/7vTepyZfS0nNAv3Yo2vu7Q==/109951163574290181.jpg",
                  "height": 720,
                  "width": 1136,
                  "title": "14年前王心凌翻唱了这首歌后爆红，终于找到了原版！",
                  "description": "14年前王心凌翻唱了这首歌后爆红，终于找到了原版，掀起回忆杀！",
                  "commentCount": 386,
                  "shareCount": 463,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 25070389
                      },
                      {
                          "resolution": 480,
                          "size": 42761674
                      },
                      {
                          "resolution": 720,
                          "size": 55585789
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 1000000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/VPGeeVnQ0jLp4hK9kj0EPg==/18897306347016806.jpg",
                      "accountStatus": 0,
                      "gender": 0,
                      "city": 1002400,
                      "birthday": -2209017600000,
                      "userId": 449979212,
                      "userType": 0,
                      "nickname": "全球潮音乐",
                      "signature": "有时候音乐是陪我熬过那些夜晚的唯一朋友。",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 18897306347016810,
                      "backgroundImgId": 18987466300481468,
                      "backgroundUrl": "http://p1.music.126.net/qx6U5-1LCeMT9t7RLV7r1A==/18987466300481468.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "音乐视频达人",
                          "2": "华语音乐|欧美音乐资讯达人"
                      },
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "18987466300481468",
                      "avatarImgIdStr": "18897306347016806"
                  },
                  "urlInfo": {
                      "id": "EB82F87F8A5C59B54CF86F3D504D6505",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/NuGwXO4b_1950067805_shd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=bGNBXvBfQdepreNzSEABTtQDsKlPHBcv&sign=07941890a3d1182e415ca0b3e2da7b69&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4RwraneCFsab3viQBsSfuvMZ",
                      "size": 55585789,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": -8008,
                          "name": "#10W+播放#",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57107,
                          "name": "韩语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "EB82F87F8A5C59B54CF86F3D504D6505",
                  "durationms": 166070,
                  "playTime": 680364,
                  "praisedCount": 2249,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_0038C230DA690D5C2415B938948FC466",
                  "coverUrl": "https://p2.music.126.net/5ZfAA2IeqadlWBebeaxHqg==/109951163974418858.jpg",
                  "height": 1080,
                  "width": 1920,
                  "title": "滨崎步《Beloved》曾火遍全球，来感受一下现场 中日字幕",
                  "description": "滨崎步 Moments 2011音乐力量演唱会 \n滨崎步《BELOVED》现场版，孤独中坚强，自卑里骄傲，喧嚣质疑中坚定，永远保持一颗爱的心。你的声音教会了我~ ",
                  "commentCount": 311,
                  "shareCount": 936,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 27438880
                      },
                      {
                          "resolution": 480,
                          "size": 49457681
                      },
                      {
                          "resolution": 720,
                          "size": 71247117
                      },
                      {
                          "resolution": 1080,
                          "size": 116318580
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 330000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/-MZDEHaFdvQtdIdY2fDgyw==/109951164877618139.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 330100,
                      "birthday": 841507200000,
                      "userId": 268678989,
                      "userType": 200,
                      "nickname": "随身音乐厅",
                      "signature": "音乐的魅力，在于人的精神与音乐的共鸣。",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164877618140,
                      "backgroundImgId": 109951165866068220,
                      "backgroundUrl": "http://p1.music.126.net/Msq8ASEUsD0nrXiDROSdmQ==/109951165866068231.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": [
                          "华语"
                      ],
                      "experts": {
                          "1": "音乐视频达人",
                          "2": "生活图文达人"
                      },
                      "djStatus": 10,
                      "vipType": 11,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951165866068231",
                      "avatarImgIdStr": "109951164877618139"
                  },
                  "urlInfo": {
                      "id": "0038C230DA690D5C2415B938948FC466",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/SWTfG70Z_2422777726_uhd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=YlRinpVKlZCMVFxUdyRgefYSYZrloDVQ&sign=c870567be7513c151ba2dd1cff041c58&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4Rz7oWkCrdb%2F%2FQwL3e6rs%2B1%2B",
                      "size": 116318580,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 1080
                  },
                  "videoGroup": [
                      {
                          "id": 60101,
                          "name": "日语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 16238,
                          "name": "浪漫",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 12100,
                          "name": "流行",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "beloved",
                          "id": 22737380,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 16405,
                                  "name": "浜崎あゆみ",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [],
                          "pop": 90,
                          "st": 0,
                          "rt": "",
                          "fee": 8,
                          "v": 17,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 2087804,
                              "name": "FIVE",
                              "picUrl": "http://p4.music.126.net/Z4j2pK3NWym1J13Sd6h73w==/18594940650727777.jpg",
                              "tns": [],
                              "pic_str": "18594940650727777",
                              "pic": 18594940650727776
                          },
                          "dt": 316631,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 12668387,
                              "vd": -35100
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 7601049,
                              "vd": -32600
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 5067381,
                              "vd": -30900
                          },
                          "a": null,
                          "cd": "1",
                          "no": 4,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 2,
                          "s_id": 0,
                          "mst": 9,
                          "cp": 457010,
                          "mv": 5442424,
                          "rtype": 0,
                          "rurl": null,
                          "publishTime": 1314720000007,
                          "tns": [
                              "挚爱"
                          ],
                          "privilege": {
                              "id": 22737380,
                              "fee": 8,
                              "payed": 0,
                              "st": 0,
                              "pl": 128000,
                              "dl": 0,
                              "sp": 7,
                              "cp": 1,
                              "subp": 1,
                              "cs": false,
                              "maxbr": 999000,
                              "fl": 128000,
                              "toast": false,
                              "flag": 69,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "0038C230DA690D5C2415B938948FC466",
                  "durationms": 319919,
                  "playTime": 424496,
                  "praisedCount": 2594,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_3B505315D25867ABBB4F3C54431B18A9",
                  "coverUrl": "https://p2.music.126.net/BInj9vT3zhDVVNRmSfpNMg==/109951163845674377.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "站在高岗上(2014年中央电视台春节联欢晚会现场)",
                  "description": null,
                  "commentCount": 48,
                  "shareCount": 104,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 9802827
                      },
                      {
                          "resolution": 480,
                          "size": 15271714
                      },
                      {
                          "resolution": 720,
                          "size": 20625217
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 440000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/1CUpeEfmuT2Cs-XeoGOnWA==/109951164483976176.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 440100,
                      "birthday": 788371200000,
                      "userId": 1599979756,
                      "userType": 0,
                      "nickname": "公子凤梧",
                      "signature": "我仲有野输咩？唔紧要啦 ！",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164483976180,
                      "backgroundImgId": 109951165395733630,
                      "backgroundUrl": "http://p1.music.126.net/JoV68ORMXbVRqYMDNp28GA==/109951165395733633.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951165395733633",
                      "avatarImgIdStr": "109951164483976176"
                  },
                  "urlInfo": {
                      "id": "3B505315D25867ABBB4F3C54431B18A9",
                      "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/gNPy3SOu_2302845777_shd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=wrMWlSdIxoFwCXksbEMsCJCNifqvZoql&sign=a2dbcc686d7672dc04736ee1ad431c79&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4Rz7oWkCrdb%2F%2FQwL3e6rs%2B1%2B",
                      "size": 20625217,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": -8008,
                          "name": "#10W+播放#",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "3B505315D25867ABBB4F3C54431B18A9",
                  "durationms": 62927,
                  "playTime": 556498,
                  "praisedCount": 694,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_1DCCD023968360E9D0030BED7E757C90",
                  "coverUrl": "https://p2.music.126.net/48DvBvewrRBmwloj2kzTYQ==/109951163620907247.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "林俊杰深情演绎《爱要怎么说出口》",
                  "description": null,
                  "commentCount": 321,
                  "shareCount": 1202,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 21572490
                      },
                      {
                          "resolution": 480,
                          "size": 38575244
                      },
                      {
                          "resolution": 720,
                          "size": 50946446
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 440000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/fEAcwn-wwf3-4BohUx1qlA==/109951164653409386.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 440100,
                      "birthday": -2209017600000,
                      "userId": 1454559602,
                      "userType": 0,
                      "nickname": "阿童木表业",
                      "signature": "",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164653409390,
                      "backgroundImgId": 109951164683515200,
                      "backgroundUrl": "http://p1.music.126.net/9mjQS0x3YI_eJn8scTUW7A==/109951164683515198.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951164683515198",
                      "avatarImgIdStr": "109951164653409386"
                  },
                  "urlInfo": {
                      "id": "1DCCD023968360E9D0030BED7E757C90",
                      "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/Azjs7rvJ_2069052775_shd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=IOnTOzesibFTBuIRKYMyXuQiVclqIymq&sign=f5626dd82e935f4b9bcf08f435ad3637&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4Rz7oWkCrdb%2F%2FQwL3e6rs%2B1%2B",
                      "size": 50946446,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 11110,
                          "name": "林俊杰",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "爱要怎么说出口 (Live)",
                          "id": 400162546,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 6463,
                                  "name": "赵传",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [],
                          "pop": 100,
                          "st": 0,
                          "rt": null,
                          "fee": 8,
                          "v": 21,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 34429065,
                              "name": "我是歌手第四季 第1期",
                              "picUrl": "http://p4.music.126.net/_xStDO-yKQkcuVn0bYptKg==/3275445147404351.jpg",
                              "tns": [],
                              "pic": 3275445147404351
                          },
                          "dt": 284858,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 11396745,
                              "vd": -17700
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 6838064,
                              "vd": -15100
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 4558723,
                              "vd": -13500
                          },
                          "a": null,
                          "cd": "1",
                          "no": 5,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 2,
                          "s_id": 0,
                          "mst": 9,
                          "cp": 404023,
                          "mv": 0,
                          "rtype": 0,
                          "rurl": null,
                          "publishTime": 1452787200007,
                          "privilege": {
                              "id": 400162546,
                              "fee": 8,
                              "payed": 0,
                              "st": 0,
                              "pl": 128000,
                              "dl": 0,
                              "sp": 7,
                              "cp": 1,
                              "subp": 1,
                              "cs": false,
                              "maxbr": 999000,
                              "fl": 128000,
                              "toast": false,
                              "flag": 0,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "1DCCD023968360E9D0030BED7E757C90",
                  "durationms": 244018,
                  "playTime": 935153,
                  "praisedCount": 4815,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_684B94C08CE6D8482191D26A8FAB32F8",
                  "coverUrl": "https://p2.music.126.net/LUEBw5SuN9WbLl-tvQ2qGw==/109951163661437105.jpg",
                  "height": 540,
                  "width": 1050,
                  "title": "风靡全球的一首英文歌，终于找到这现场版，真的太美了！",
                  "description": null,
                  "commentCount": 592,
                  "shareCount": 1012,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 15007830
                      },
                      {
                          "resolution": 480,
                          "size": 27046426
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 110000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/yWQieIcccog6GW9W65N6VQ==/109951164162893023.jpg",
                      "accountStatus": 0,
                      "gender": 0,
                      "city": 110101,
                      "birthday": -2209017600000,
                      "userId": 1471220191,
                      "userType": 0,
                      "nickname": "耳朵听了会怀孕啊",
                      "signature": "",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164162893020,
                      "backgroundImgId": 109951162868126480,
                      "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "泛生活视频达人"
                      },
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951162868126486",
                      "avatarImgIdStr": "109951164162893023"
                  },
                  "urlInfo": {
                      "id": "684B94C08CE6D8482191D26A8FAB32F8",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/AIewvQZp_2115130284_hd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=ypBUEXqehLGnEuiDrNghkttRwDNIbUZa&sign=20cc5425f83656953c61d005ac2a0666&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4RwraneCFsab3viQBsSfuvMZ",
                      "size": 27046426,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 480
                  },
                  "videoGroup": [
                      {
                          "id": -8013,
                          "name": "#人气飙升榜#",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57106,
                          "name": "欧美现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "Same Old Love",
                          "id": 34578250,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 140196,
                                  "name": "Selena Gomez",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [],
                          "pop": 95,
                          "st": 0,
                          "rt": null,
                          "fee": 1,
                          "v": 43,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 3287551,
                              "name": "Revival (Deluxe Edition)",
                              "picUrl": "http://p4.music.126.net/vT4-o2BvsVMKrLn3dvC5FA==/109951164217009840.jpg",
                              "tns": [],
                              "pic_str": "109951164217009840",
                              "pic": 109951164217009840
                          },
                          "dt": 229080,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 9165889,
                              "vd": -69148
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 5499551,
                              "vd": -66556
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 3666382,
                              "vd": -64854
                          },
                          "a": null,
                          "cd": "1",
                          "no": 4,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 2,
                          "s_id": 0,
                          "mst": 9,
                          "cp": 7003,
                          "mv": 479064,
                          "rtype": 0,
                          "rurl": null,
                          "publishTime": 1444320000007,
                          "privilege": {
                              "id": 34578250,
                              "fee": 1,
                              "payed": 0,
                              "st": 0,
                              "pl": 0,
                              "dl": 0,
                              "sp": 0,
                              "cp": 0,
                              "subp": 0,
                              "cs": false,
                              "maxbr": 999000,
                              "fl": 0,
                              "toast": false,
                              "flag": 1028,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "684B94C08CE6D8482191D26A8FAB32F8",
                  "durationms": 214613,
                  "playTime": 2454410,
                  "praisedCount": 10652,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_63859FD8ACBE31B884607F8BBC7A95A5",
                  "coverUrl": "https://p2.music.126.net/cUR25OC_li3MA9_GqAobEA==/109951163828286848.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "blackpink lisa 莎姐这嘴炮可以",
                  "description": null,
                  "commentCount": 125,
                  "shareCount": 301,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 1916869
                      },
                      {
                          "resolution": 480,
                          "size": 3233903
                      },
                      {
                          "resolution": 720,
                          "size": 4882212
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 330000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/J5cmHMDOVNaQMuNES4MPQA==/109951164501912244.jpg",
                      "accountStatus": 0,
                      "gender": 2,
                      "city": 330100,
                      "birthday": 755712000000,
                      "userId": 1289603861,
                      "userType": 204,
                      "nickname": "音乐观察员",
                      "signature": "流行、经典、民谣音乐爱好者~",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164501912240,
                      "backgroundImgId": 109951164677064240,
                      "backgroundUrl": "http://p1.music.126.net/Cce9JhhHmkGuVTJtP8HbsQ==/109951164677064241.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "视频达人(华语、音乐现场)",
                          "2": "音乐图文达人"
                      },
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951164677064241",
                      "avatarImgIdStr": "109951164501912244"
                  },
                  "urlInfo": {
                      "id": "63859FD8ACBE31B884607F8BBC7A95A5",
                      "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/y4Ly5M0n_2288246685_shd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=KriyPeDEDEmUSOgTpVrWncfBojIOSXoS&sign=cc8212063503934210ace19348a8fef0&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4RwraneCFsab3viQBsSfuvMZ",
                      "size": 4882212,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 92105,
                          "name": "BLACKPINK",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57107,
                          "name": "韩语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57110,
                          "name": "饭拍现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1101,
                          "name": "舞蹈",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "63859FD8ACBE31B884607F8BBC7A95A5",
                  "durationms": 15000,
                  "playTime": 1261721,
                  "praisedCount": 6409,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_E6F02907016D9810B8C9048DA2F6626C",
                  "coverUrl": "https://p2.music.126.net/FneGRgg8PqgLJIyUJKUm1g==/109951164807920801.jpg",
                  "height": 720,
                  "width": 1270,
                  "title": "纯音乐版的《美丽的神话》听这简直就是如痴如醉。",
                  "description": null,
                  "commentCount": 6,
                  "shareCount": 28,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 18826622
                      },
                      {
                          "resolution": 480,
                          "size": 33403942
                      },
                      {
                          "resolution": 720,
                          "size": 37151942
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 320000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/9WrkP2XVMTc39q1PFMCk4A==/109951164176051278.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 320100,
                      "birthday": 819909419187,
                      "userId": 365496497,
                      "userType": 204,
                      "nickname": "斌斌先生哟",
                      "signature": "心若向阳，次第花开。",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164176051280,
                      "backgroundImgId": 109951164176046500,
                      "backgroundUrl": "http://p1.music.126.net/0Xk3U0dinSi5PZjsOxRsxA==/109951164176046497.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 10,
                      "vipType": 11,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951164176046497",
                      "avatarImgIdStr": "109951164176051278"
                  },
                  "urlInfo": {
                      "id": "E6F02907016D9810B8C9048DA2F6626C",
                      "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/YBCTJIxt_2940305317_shd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=kYKCOvlfZpxfFgdtnJXpDbRcZsMKDAlN&sign=7b87e9397952794f52b0b3846b45531a&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4Rz7oWkCrdb%2F%2FQwL3e6rs%2B1%2B",
                      "size": 37151942,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 4103,
                          "name": "演奏",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "E6F02907016D9810B8C9048DA2F6626C",
                  "durationms": 271047,
                  "playTime": 12085,
                  "praisedCount": 105,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_7FFF32B1DBC0AEB9D499E13C37795D6D",
                  "coverUrl": "https://p2.music.126.net/0NROhmp86ZUCK9n6RiyV6A==/109951164759312845.jpg",
                  "height": 1080,
                  "width": 1920,
                  "title": "周华健齐豫时隔21年再度合作《神雕侠侣》主题曲 《天下有情人》",
                  "description": "周华健齐豫时隔21年再度合作《神雕侠侣》主题曲 《天下有情人》",
                  "commentCount": 24,
                  "shareCount": 19,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 20166160
                      },
                      {
                          "resolution": 480,
                          "size": 36301590
                      },
                      {
                          "resolution": 720,
                          "size": 57721943
                      },
                      {
                          "resolution": 1080,
                          "size": 131077039
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 1000000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/y_s8l4j7aHKD6-EBYKQ5Dw==/109951164307529725.jpg",
                      "accountStatus": 0,
                      "gender": 2,
                      "city": 1000400,
                      "birthday": -1559808000000,
                      "userId": 1897059915,
                      "userType": 204,
                      "nickname": "Elsa唐糖",
                      "signature": "亲爱的糖宝们：经过本糖的慎重考虑，决定做完10月份直播后就退出主播这个行业了。感谢你们一路的辛勤陪伴和支持！希望在未来的岁月里，你们都能快乐常伴左右！爱你们的唐糖，么么哒……（大家可以订阅我的电台哦！以后会不定期更新的。）",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164307529730,
                      "backgroundImgId": 109951164301963070,
                      "backgroundUrl": "http://p1.music.126.net/AFYYX25hhz4z62XUkXY0aA==/109951164301963067.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 10,
                      "vipType": 0,
                      "remarkName": null,
                      "backgroundImgIdStr": "109951164301963067",
                      "avatarImgIdStr": "109951164307529725"
                  },
                  "urlInfo": {
                      "id": "7FFF32B1DBC0AEB9D499E13C37795D6D",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/TxuZNY7u_2921462243_uhd.mp4?ts=1618580421&rid=C5703A8C18415D4889A4B7687650677D&rl=3&rs=URMTCPlYUErfFzRqTzZrPbkFjIktLXiO&sign=fde9ef3a4d6d4338377c91d6c2466df3&ext=1gIk42MFyNle%2BoPN54MFoz4YIln1dXMPynEUdmqwrczjrGUd067xyW7sFuj2xlRRkRWCRYts5YCGxXyYGt9LigIOC3CStYZdBAJOVXiZu%2FCg%2B4Xakt7fPN3bAqQBaNzDjH%2BCNnwh6Iwa6Q9EHouSWPIEJEcPIw8LUbIOT%2Bmq%2BefWsFAv0dOoWGVl2D7rLafcwDr200h3JMbdf%2BVX9q%2FmP%2FWAVHB2AsZ%2BRnPb0aVZ4Rz7oWkCrdb%2F%2FQwL3e6rs%2B1%2B",
                      "size": 131077039,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 1080
                  },
                  "videoGroup": [
                      {
                          "id": 96102,
                          "name": "周华健",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 254120,
                          "name": "滚石唱片行",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": "groupTagRank"
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": "groupTagRank"
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "天下有情人",
                          "id": 186583,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 6456,
                                  "name": "周华健",
                                  "tns": [],
                                  "alias": []
                              },
                              {
                                  "id": 9167,
                                  "name": "齐豫",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [
                              "1995年TVB版电视剧《神雕侠侣》主题曲国语版"
                          ],
                          "pop": 100,
                          "st": 0,
                          "rt": "600902000007994035",
                          "fee": 8,
                          "v": 171,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 18948,
                              "name": "周华健 & Friends",
                              "picUrl": "http://p3.music.126.net/07oExbcDVpGTbU-U0m4diQ==/109951163219237717.jpg",
                              "tns": [],
                              "pic_str": "109951163219237717",
                              "pic": 109951163219237710
                          },
                          "dt": 297252,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 11893072,
                              "vd": -2500
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 7135861,
                              "vd": -2
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 4757255,
                              "vd": -2
                          },
                          "a": null,
                          "cd": "1",
                          "no": 6,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 2,
                          "s_id": 0,
                          "mst": 9,
                          "cp": 684010,
                          "mv": 10929835,
                          "rtype": 0,
                          "rurl": null,
                          "publishTime": 1007136000000,
                          "privilege": {
                              "id": 186583,
                              "fee": 8,
                              "payed": 0,
                              "st": 0,
                              "pl": 128000,
                              "dl": 0,
                              "sp": 7,
                              "cp": 1,
                              "subp": 1,
                              "cs": false,
                              "maxbr": 999000,
                              "fl": 128000,
                              "toast": false,
                              "flag": 256,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "7FFF32B1DBC0AEB9D499E13C37795D6D",
                  "durationms": 162040,
                  "playTime": 66564,
                  "praisedCount": 272,
                  "praised": false,
                  "subscribed": false
              }
          }
      ]
    let videoList = this.data.videoList;
    // 将视频最新的数据更新到原有的列表数据中
    videoList.push(...newVideoList);
    this.setData({
      videoList
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
    return{
      title: 'A梦音乐',
      page: '/pages/video/video',
      imageUrl: '/static/images/hanhan.jpg'
    }
  }
})