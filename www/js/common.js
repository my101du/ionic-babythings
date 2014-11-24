var pictureSource;   // picture source
var destinationType; // sets the format of returned value


var babyThingsApp = {

    initialize: function(){
      this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    //只有真机才会有效果，模拟器没有
    onDeviceReady: function() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;

        try{
            if (window.device.version.substr(0,1) === '7') {
                //$('body').addClass('ios7');
            }
        }catch(e){};

        babyThingsApp.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

    },

    //添加local notification
    addNotification: function(remindId, title, message, timestamp){


        //注意避免浏览器测试的 cannot read property ”xxxxx" of undefined错误
        if( window.plugin && window.plugin.notification && window.plugin.notification.local ){
            window.plugin.notification.local.promptForPermission();

            window.plugin.notification.local.hasPermission(function (granted) {
                console.log('Permission has been granted: ' + granted);


                //先判断是否需要删除
//            window.plugin.notification.local.isScheduled(remindId, function (isScheduled) {
//                // console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
//                window.plugin.notification.local.cancel(remindId);
//            });

                window.plugin.notification.local.add({
                    id:      remindId,
                    title:   title,
                    message: message,
                    //repeat:  'weekly',
                    date:    new Date(timestamp)
                });

            });
        }

    },

    //删除某个local notification
    cancelNotification: function(remindId){
        if( window.plugin && window.plugin.notification && window.plugin.notification.local ) {
            window.plugin.notification.local.isScheduled(remindId, function (isScheduled) {
                // console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
                window.plugin.notification.local.cancel(remindId);
            });
        }
    },

    //删除所有调度
    cancelAllNotification: function(){
        if( window.plugin && window.plugin.notification && window.plugin.notification.local ) {
            window.plugin.notification.local.cancelAll();
        }
    },

    //正在被调度的提醒
    getScheduledIds: function(){
        if( window.plugin && window.plugin.notification && window.plugin.notification.local ) {
            window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                alert('Scheduled IDs: ' + scheduledIds.join(' ,'));
            });
        }
    },

    //拍照
    capturePhoto: function(){
        if( navigator.camera  && navigator.camera.getPicture ) {
            navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { quality: 50,
                destinationType: destinationType.DATA_URL });
        }
    },

    //从图库选取
    getPhotoFromLibrary: function(){
        if( navigator.camera  && navigator.camera.getPicture ) {
            navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, { quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: pictureSource.PHOTOLIBRARY });
        }
    },

    //从相册选取
    getPhotoFromAlbum: function(){
        if( navigator.camera  && navigator.camera.getPicture ) {
            navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, { quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: pictureSource.SAVEDPHOTOALBUM });
        }
    },

    //拍照成功回调
    onPhotoDataSuccess: function(imageData){
        var smallImage = document.getElementById('smallImage');

        smallImage.style.display = 'block';

        smallImage.src = "data:image/jpeg;base64," + imageData;
    },

    //选取图片成功回调(保存字符串) 因为这个函数是“异步”的（在controller里测试，会在图片地址未取得前，即可alert出一个pics空值）
    onPhotoURISuccess: function(imageURI){
        //this.pics.push(imageURI);//这里无法在controller里读取返回值，只能在本回调函数里修改DOM
        var imgElement = document.getElementById('thingPic');
        imgElement.src=imageURI;
    },

    //拍照失败回调
    onFail: function(message){
        var alertPopup = $ionicPopup.alert({
            title: '获取图片失败',
            template: ""
        });
        alertPopup.then(function(res) {
            console.log('close image error');
        });
    }

};