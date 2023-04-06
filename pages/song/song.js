// pages/song/song.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['http://p1.music.126.net/Sevs60nRGz0PCKq6iM5umg==/109951168267742401.jpg?imageView&quality=89', 'http://p1.music.126.net/xdK46YZW1eI__3OjGXsucw==/109951168267964406.jpg?imageView&quality=89', 'https://tse4-mm.cn.bing.net/th/id/OIP-C.fSQcvpq5OeOxrJiaN_mgJgHaC0?pid=ImgDet&rs=1','http://p1.music.126.net/bUJgEB0D525bqltcxa62Ag==/109951168267524424.jpg?imageView&quality=89','https://wkstudy.github.io/smallplugs/Carousel-wangyiyun/imgs/1.jpg','https://tse4-mm.cn.bing.net/th/id/OIP-C.btn6wjBF_VZDexoxnhKvRAHaDa?pid=ImgDet&rs=1'],
    //歌曲列表数据
    musiclist:[],
    //word表示输入框的值
    word:"",
    //封面的url的列表  
    ImgUrl_list:[],
    //歌曲id列表
    Idlist:[],
    //歌曲数量
    musicSum:10
  },
  //evens wxml中携带的数据
  play:function(evens){
    // console.log(evens.currentTarget.dataset.id)
    // console.log(this.data.Idlist)
    var idlist=this.data.Idlist
    var mid = evens.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/play/play?id='+mid+'&idlist='+idlist,
    })
  },
  keychange:function(result){
    // console.log(result)
    //当本方法触发就进行数据的修改
    var w=result.detail.value
    //data的数据修改
    this.setData({
      word:w
    })
  },
  //触发搜索按钮执行的方法
  search:function(){
    // console.log(this.data.word)
    var w=this.data.word
    var musicSum=this.data.musicSum
    var url="https://music.163.com/api/search/get?s="+w+"&type=1&limit="+musicSum
    var that=this
    // console.log(url)
    //定义存储id的列表
    var Idlist=[]
    wx.request({
      url: url,
      success: function(result){
        var songs=result.data.result.songs
        // console.log(songs)
        //音乐进行存储
        that.setData({
          musiclist:songs
        })
        for(var i=0;i<songs.length;i++){
          Idlist.push(songs[i].id)
          that.setData({
            Idlist:Idlist
          })
        }
        //进行数组的清空防止下次搜索还是显示之前的老数据
        that.setData({
          ImgUrl_list:[]
        })
        that.getMusicImage(Idlist,0,Idlist.length)
      },
    })
  },
//通过id获取封面的方法
getMusicImage:function(Idlist,i,length){
  var ImgUrl_list=this.data.ImgUrl_list
  var that=this
  var url="https://music.163.com/api/song/detail/?id=1359595520&ids=["+Idlist[i]+"]"
  wx.request({
    url: url,
    success: function(result){
      // console.log(result)
      // console.log(result.data.songs[0].album.blurPicUrl)
      var img=result.data.songs[0].album.blurPicUrl
      ImgUrl_list.push(img)
      that.setData({
        ImgUrl_list:ImgUrl_list
      })
      //跳出递归的条件
      if(++i<length){
        that.getMusicImage(Idlist,i,length)
      }
    },
  })
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    //加载更多歌曲
    
    var word=this.data.word
    var that=this
    //搜索
    //判断输入框不能为空
    if(word!=""){
      var musicsum=this.data.musicSum
      //每次新增
      musicsum+=5
      this.setData({
        musicSum:musicsum
      })
      var url="https://music.163.com/api/search/get?s="+word+"&type=1&limit="+musicsum
      var Idlist=[]
      //增加loding的效果
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: url,
        success: (result) => {
          var songs=result.data.result.songs
          // console.log(songs)
          //音乐进行存储
          that.setData({
            musiclist:songs
          })
          for(var i=0;i<songs.length;i++){
            Idlist.push(songs[i].id)
            that.setData({
              Idlist:Idlist
            })
          }
          //进行数组的清空防止下次搜索还是显示之前的老数据
          that.setData({
            ImgUrl_list:[]
          })
          that.getMusicImage(Idlist,0,Idlist.length)
        },
      })
      setTimeout(function () {
        //结束loading
      wx.hideLoading()
      },1000)
      
    }else{
      console.log()
    }
    

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    

  }
})