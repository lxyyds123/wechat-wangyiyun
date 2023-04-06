// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotlist:[1,2,3,4,5,6],
    newlist:[1,2,3,4,5,6],
    hotsum:6,
    newsum:6

  },
  
  //热门歌手
  getHotMusic:function (sum) {
    var hotlist=this.data.hotlist
    var that=this
    wx.request({
      url: 'http://music.163.com/api/artist/list',
      success: (result) => {
        var result=result.data.artists
        if(sum>result.length){
          console.log(12)
          wx.showLoading({
            title: '数据已加载完毕',
          })
          setTimeout(function () {
            wx.hideLoading()
          },1000)
          return
        }
        for(var i=0;i<sum;i++){
          hotlist[i]=result[i]
        }
        that.setData({
          hotlist:hotlist
        })
      },
    })
    
  },
  //热门专辑
  getNewMusic:function (sum) {
    var newlist=this.data.newlist
    var that=this
    wx.request({
      url: 'http://music.163.com/api/artist/albums/3684',
      success: (result) => {
        // console.log(result.data.hotAlbums)
        var result=result.data.hotAlbums
        if(sum>result.length){
          wx.showLoading({
            title: '数据已加载完毕',
          })
          setTimeout(function () {
            wx.hideLoading()
          },1000)
          return
        }
        for(var i=0;i<sum;i++){
          newlist[i]=result[i]
        }
        that.setData({
          newlist:newlist
        })
      },
    })
    
  },
  //当点击更多按钮时
  changehot:function () {
    var sum=this.data.hotsum
    sum+=3
    //覆盖数据
    this.setData({
      hotsum:sum
    })
    this.getHotMusic(sum)
    
  },
   //当点击更多按钮时
   changeNew:function () {
    var sum=this.data.newsum
    sum+=3
    //覆盖数据
    this.setData({
      newsum:sum
    })
    this.getNewMusic(sum)
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var sum=this.data.hotsum
    this.getHotMusic(sum)
    var newsum=this.data.hotsum
    this.getNewMusic(newsum)

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