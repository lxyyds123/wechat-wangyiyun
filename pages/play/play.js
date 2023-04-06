// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      musicId:"12345",
      //播放状态
      action:{
        "method":"play"
      },
      date:"play",
      //歌名
      name:"",
      //封面图片
      imgurl:"",
      //存储歌词的数组
      lrcList:[],
      //当前播放歌词的下标
      index:-1,
      //top滚动条
      top:0,
      //播放模式
      mode:'loop',
      //id列表
      idlist:[],
      //当前播放时间
      playtime:"00:00",
      //总时长
      timelength:"",
      //进度条最大值
      max:0,
      //当前播放位置
      move:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    //通过options获取页面路由传递的音乐的id
      // console.log(options.idlist)
      var idliststr=options.idlist
      //拆分字符串为列表
      var idlist=idliststr.split(",")
      // console.log(idlist)
      var mid = options.id
      //更改data中的数据
      this.setData({
        musicId:mid,
        idlist:idlist
      })
      
      this.lrcShow()
      this.musicshow()

  },
  //歌曲详情
  musicshow:function () {
    var mid=this.data.musicId
    var that=this
      wx.request({
        url: 'https://music.163.com/api/song/detail/?id=1359595520&ids=['+mid+']',
        success: function(e){
          //获取歌名
            // console.log(e.data.songs[0].name)
            var name=e.data.songs[0].name 
            //获取歌曲图片
            // console.log(e.data.songs[0].album.blurPicUrl)
            var imgurl=e.data.songs[0].album.blurPicUrl
            that.setData({
              name:name,
              imgurl:imgurl
            })
        }
      })
    
  },
  //播放状态更改
  playdate:function(){
    console.log(this.data.action.method)
    var date=this.data.action.method
    if(date=="play"){
      this.setData({
        action:{
          "method":"pause"
        },
        date:"pause"
      })
      
    }else{
      this.setData({
        action:{
          "method":"play"
        },
        date:"play"
      })
    }
  },
  //歌词显示
  lrcShow:function(){
    //拿到歌曲的id
      var mid=this.data.musicId
      var that=this
      // console.log(mid)
      //src拼接
      var src = 'http://music.163.com/api/song/lyric?os=pc&id='+mid+'&lv=-1&tv=-1'
      wx.request({
        url:src,
        success:function(result){
          // console.log(result.data.lrc.lyric)
          var lrcStr=result.data.lrc.lyric
          var lrcstrList=lrcStr.split("\n")
          //存储最终数据的列表
          var lrctimeList=[]
          //设置正则
          var re=/\[\d{2}:\d{2}.\d{2,3}\]/
          // console.log(lrcstrList)
          for(var i=0;i<lrcstrList.length;i++){
            var date=lrcstrList[i].match(re)
            if(date!=null){
              var lrc=lrcstrList[i].replace(re,"")
              var timestr=date[0]
              if(timestr!=null){
                //清楚括号
                var timestr_slice=timestr.slice(1,-1)
                //时间和秒数的拆分
                var splitlist=timestr_slice.split(":")
                var f=splitlist[0]
                var m=splitlist[1]
                //计算秒数
                var time=parseFloat(f)*60+parseFloat(m)
                //列表追加数据
                lrctimeList.push([time,lrc])

              }
            }
          }
          //存储数组到data当中
          that.setData({
            lrcList:lrctimeList
          })
        }
      })
    },
    //播放进度触发
    timechange:function(result){
      // console.log(result.detail.currentTime)
      //当前播放时间
      var playtime=result.detail.currentTime
      //歌词列表
      var lrcList=this.data.lrcList
      //遍历二位数组
      for(var i=0;i<lrcList.length-1;i++){
        //歌词区间判断
        if(lrcList[i][0]<playtime&&playtime<lrcList[i+1][0]){
          // console.log(lrcList[i][1])
          //拿到当前的歌词下标
          this.setData({
            index:i
          })
        }
        //定位自动滚动
        //拿到刚刚的index
        var index=this.data.index
        if(index>5){
          this.setData({
            top:(index-5)*24
          })
          // console.log((index-5)*24)
        }
      }
      //进度条时间更新
      //总时长
      var timelength=result.detail.duration
      var sum_m=Math.floor(timelength/60)
      var sum_s=Math.floor(timelength%60)
      //个位数补齐0的操作
      if(sum_m<10){
        sum_m="0"+sum_m
      }
      if(sum_s<10){
        sum_s="0"+sum_s
      }
      //定义播放时间
      var play_m=Math.floor(playtime/60)
      var play_s=Math.floor(playtime%60)
      if(play_m<10){
        play_m="0"+play_m
      }
      if(play_s<10){
        play_s="0"+play_s
      }
      //数据更新
      this.setData({
        playtime:play_m+":"+play_s,
        timelength:sum_m+":"+sum_s,
        max:timelength,
        move:playtime
      })


    },
    //切换模式的方法
    changemode:function (params) {
      if(this.data.mode=='loop'){
        this.setData({
          mode:'single'
        })
      }else{
        this.setData({
          mode:'loop'
        })
      }
      
    },
    //歌曲执行完毕执行的方法
    changeMusic:function (params) {
     //判断当前的模式进行切换
     var mode=this.data.mode
    //  console.log(mode)
     //single 单曲 loop循环
     if(mode=='single'){
      this.setData({
        musicId:this.data.musicId
      })
      //刷新播放状态
      this.setData({
        action:{
          method:"play"
        }
      })
     }else{
       //调用下一曲方法
       this.nextSong()

     }
    },
    //循环下一首方法
    nextSong:function (params) {
      //拿到当前歌曲的id
      var id=this.data.musicId
      var idlist=this.data.idlist
      //下标
      var index=-1
      //去idlist列表里边进行检索
      for(var i=0;i<idlist.length;i++){
        if(id==idlist[i]){
          index=i
          break
        }
      }
      //判断当前歌曲是否是最后一首
      if(index==idlist.length-1){
        this.setData({
          musicId:idlist[0]
        })
      }else{
        this.setData({
          musicId:idlist[index+1]
        })
      }
      //更新播放
      this.setData({
        action:{
          method:"play"
        }
      })
      //更新歌词和歌曲详情
      this.musicshow()
      this.lrcShow()
    },

    //上一曲
    prevSong:function (params) {
      //拿到当前歌曲的id
      var id=this.data.musicId
      var idlist=this.data.idlist
      //下标
      var index=-1
      //去idlist列表里边进行检索
      for(var i=0;i<idlist.length;i++){
        if(id==idlist[i]){
          index=i
          break
        }
      }
      //判断当前歌曲是否是最后一首
      if(index==0){
        this.setData({
          musicId:idlist[idlist.length-1]
        })
      }else{
        this.setData({
          musicId:idlist[index-1]
        })
      }
      //更新播放
      this.setData({
        action:{
          method:"play"
        }
      })
      //更新歌词和歌曲详情
      this.musicshow()
      this.lrcShow()
    },
    //拖动进度条方法
    sliderchaneg:function (e) {
      console.log(e.detail.value)
      //当前拖动值
      var v=e.detail.value
      //进行move值的修改
      // this.setData({
      //   move:v
      // })
      //修改当前播放时间
      this.setData({
        action:{
          method:'setCurrentTime',
          data:v
        }
      })
      //更新播放状态
      this.setData({
        action:{
          method:'play',
          data:v
        }
      })
    }
})