// pages/map/map.js
Page({

  steps:[],

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map');
    this.getMapRoute();
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

  },
  regionchange: function () {
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude);
        var markers = [
        // {
        //   id: 0,
        //   longitude: res.longitude,
        //   latitude: res.latitude,
        //   iconPath: '/imgs/driver_icon_netcar.png',
        //   width: 27,
        //   height: 40
        // }, 
        {
          id: 0,
          longitude: 113.35148156501768,
          latitude: 23.094309557790773,
          iconPath: '/imgs/driver_icon_netcar.png',
          width: 27,
          height: 40,
          // rotate:12
        }];
        that.setData({
          markers: markers,
          polyline: that.polyline
        });
        setTimeout(function () {
          that.markerMoving(markers, 1);
        }, 2000);
      }
    })
  },

  markerMoving: function (markers, index) {
    if (index > this.steps.length-1) {
      return;
    }
    var that=this;
    // for (var i = 0; i < markers.length; i++) {
      // if (index > 0) {
        // markers[i].rotate = 180;
        // this.setData({
        //   markers: markers
        // });
        this.mapCtx.translateMarker({
          markerId: 0,
          autoRotate: true,
          destination: {
            latitude: this.steps[index].end_location.lat,
            longitude: this.steps[index].end_location.lng
            // latitude: 23.094309557790773,
            // longitude: 113.35148156501768 + 1
          },
          duration: 1000,
          animationEnd: () => {
            that.markerMoving(markers, ++index);
          }
        });
    // }
  },

  getMapRoute:function(){
    var that = this;
    wx.request({
      url: 'http://api.map.baidu.com/direction/v2/driving?origin=23.09430,113.35148&destination=23.10430,113.37148&coord_type=gcj02&ret_coordtype=gcj02&ak=kbIUCIpdrQ7eikx2n9a4cU33',
      success:function(res){
        that.steps = res.data.result.routes[0].steps;
        var arr = [];
        that.polyline={
          points:[],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        };
        for (var i = 0; i < that.steps.length;i++){
          // if (that.steps[i].distance>180){
          //   arr.push(that.steps[i]);
          // }

          that.polyline.points.push({
            longitude: that.steps[i].end_location.lng,
            latitude: that.steps[i].end_location.lat

          });
        }
        that.steps = arr;
      }
    });
  },

    // getMapRoute:function() {
    // var that = this;
    // wx.request({
    //   // url: 'http://apis.map.qq.com/ws/direction/v1/driving/?from=23.09430,113.35148&to=23.10430,113.37148&waypoints=39.111,116.112;39.112,116.113&output=json&key=73WBZ-Y52KF-7TLJN-N6QGO-LAJ7V-FEB32',
    //   url: 'http://apis.map.qq.com/ws/direction/v1/driving',
    //   data: {
    //     from: '23.09430,113.35148',
    //     to:'23.10430,113.37148',
    //     key: '73WBZ-Y52KF-7TLJN-N6QGO-LAJ7V-FEB32',
    //     output: 'json',
    //     callback: function (data) {
    //       console.log(data);
    //     }
    //   },
      // success: function (res) {
      //   that.steps = res.data.result.routes[0].steps;
      //   var arr = [];
      //   // for (var i = 0; i < that.steps.length;i++){
      //   //   if (that.steps[i].distance>180){
      //   //     arr.push(that.steps[i]);
      //   //   }
      //   // }
      //   that.steps = arr;
      // }
    // });
  // },

  getCoordinate:function(arr){
    var tempArr='';
    for(var i=0;i<arr.length;i++){
      tempArr.push(arr[i].latitude + ',' + arr[i].longtitude);
    }
    var that = this;
    wx.request({
      methon:'get',
      url: 'http://apis.map.qq.com/ws/coord/v1/translate',
      data:{
        locations:tempArr.join(';'),
        type:3,
        key: '73WBZ-Y52KF-7TLJN-N6QGO-LAJ7V-FEB32',
        output:'json',
        callback:function(data){
          console.log(data);
        }
      },
    });
  },

})