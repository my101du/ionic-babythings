angular.module('babyThings.controllers', [])

/**
 *类别列表
 */
    .controller('CategoriesCtrl', function ($scope, Categories) {
        $scope.categories = Categories.allCategories();

    })


/**
 *物品列表
 */
    .controller('ThingsCtrl', function ($scope, $stateParams, $state, Things, Categories) {
        var categoryId = $stateParams.categoryId;

        //获取当前类别信息
        $scope.categoryWithIndex = Categories.getCategoryWithIndex(categoryId);

        //获取当前类别下的物品
        $scope.categoryThings = Things.getCategoryThings(categoryId);

        //添加新物品（附带类别参数）
        $scope.addThing = function(categoryId){
            $state.go('tab.thing-detail', {categoryId:categoryId, thingId:0});
        }
    })


/**
 *物品详情
 */
    .controller('ThingDetailCtrl', function ($scope, $state, $stateParams, $ionicPopup, $timeout, Things, Categories) {
        $scope.DelButtonStatus = {show: false};
        $scope.title = '添加物品';
        $scope.categories = Categories.allCategories();

        //参数
        var thingId = parseInt($stateParams.thingId);
        var categoryId = parseInt($stateParams.categoryId);//从stateParams传来的字符串，要转成数字，可以用console.log打出$scope.thing来看

        var things = Things.getAllThings();
        var categories = $scope.categories;

        if (thingId > 0) {
            //编辑物品模式

            $scope.title = '物品详情';
            $scope.DelButtonShow = true;
            $scope.SellButtonShow = true;

            //获取物品详情(带索引)
            var thingWithIndex = Things.getThingWithIndex($stateParams.thingId);

            $scope.thing = thingWithIndex.thing;
            $scope.thingIndex = thingWithIndex.index;

            var imageURI = $scope.thing.pic;

            //A hack that you should include to catch bug on Android 4.4 (bug < Cordova 3.5):
            if (imageURI.substring(0,21)=="content://com.android") {
                var photo_split=imageURI.split("%3A");
                imageURI="content://media/external/images/media/"+photo_split[1];
            }

            if(window.resolveLocalFileSystemURI){
                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {

                    //If this doesn't work
                    $scope.thing.pic = fileEntry.nativeURL;

                    //Try this
                    //var image = document.getElementById('myImage');
                    //image.src = fileEntry.nativeURL;
                });
            }


        } else {
            //新建物品情况下，必须先创建一个空对象，且需要指定类别（否则添加的时候select会空）
            $scope.thing = Things.newThing(categoryId);
            $scope.thing.categoryId = categoryId;
        }

        //保存（包括编辑和添加）
        $scope.saveThing = function () {

            var totalAdd = 0;

            if (thingId > 0) {
                var editThing = $scope.thing;
                editThing.pic = document.getElementById('thingPic').getAttribute("src");
                things[$scope.thingIndex] = editThing;
            } else {
                var insertThing = $scope.thing;
                insertThing.thingId = Things.getLastThingId() + 1;//获取最后插入的id,增加1
                insertThing.pic = document.getElementById('thingPic').getAttribute("src");

                things.push(insertThing);

                Things.setLastThingId(insertThing.thingId);//存储最后插入id（加1后）

                totalAdd = 1;
            }

            Things.saveThings(things);

            Categories.updateCategoryCount($scope.thing.categoryId, Things.getCategoryThings($scope.thing.categoryId));

            $state.go('tab.things', { categoryId: $scope.thing.categoryId });
        }

        //删除物品(按索引值，而非thingId)
        $scope.delThingAtIndex = function (index) {

            var confirmPopup = $ionicPopup.confirm({
                title: '确认删除',
                template: '确定要删除这个物品吗?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('被删除物品的index为' + index);

                    var things = Things.getAllThings();
                    var gotoCategoryId = things[index].categoryId;

                    things.splice(index, 1);
                    Things.saveThings(things);

                    //注意这里因为splice后，index可能不再对应了，用临时变量gotoCategoryId
                    Categories.updateCategoryCount(gotoCategoryId, Things.getCategoryThings(gotoCategoryId));

                    $state.go('tab.things', { categoryId: gotoCategoryId});
                } else {
                    console.log('You are not sure');
                }
            });
        };

        //添加照片
        $scope.addPhotoFromLibrary = function(){
            babyThingsApp.getPhotoFromLibrary();
        }

    })


/**
 *转让
 */
    .controller('SellCtrl', function ($scope) {
    })


/**
 *商城
 */
    .controller('ShopCtrl', function ($scope, $http) {
//        $http.get('http://www.myprojects.com/demos/baby_things/index.php').then(function (response) {
//            $scope.goods = response.data;
//        });

        //var loginWindow = window.open(url,'_blank','toolbar=no,menubar=no,location=no');
        //var ref = window.open('http://shop103922384.m.taobao.com', '_blank', 'location=yes');
    })


/**
 *账本首页
 */
    .controller('RecordsCtrl', function ($scope, $state,$ionicPopup, Records) {
        $scope.records = Records.allRecords();

        $scope.addRecord = function () {
            $state.go('tab.record-detail', {});
        }

        $scope.recordCount = function(){
            var totalMoney = 0;
            for(i=0; i<$scope.records.length; i++){
                totalMoney += parseInt($scope.records[i].price);
            }

            var alertPopup = $ionicPopup.alert({
                title: '统计',
                template: "共计" + totalMoney + "元"
            });
            alertPopup.then(function(res) {
                console.log('close tongji');
            });
        }
    })


/**
 *账本详情
 */
    .controller('RecordDetailCtrl', function ($scope, $state, $stateParams, Records) {

        $scope.DelButtonShow = false;

        //获取记录详情
        var recordId = $stateParams.recordId;
        var records = Records.allRecords();

        //根据recordId值，判断是编辑还是添加
        if (recordId) {

            $scope.record = records[recordId];
            $scope.recordId = recordId;
            $scope.DelButtonShow = true;

            $scope.saveRecord = function () {

                records[recordId] = $scope.record;
                Records.save(records);
                $state.go('tab.records', { });
            }

        } else {

            $scope.record = Records.newRecord();

            $scope.saveRecord = function () {

                records.push($scope.record);
                Records.save(records);
                $state.go('tab.records', { });
            }
        }

        //删除记录
        $scope.delRecord = function (recordId) {

            records.splice(recordId, 1);
            Records.save(records);
            $state.go('tab.records', { });
        };
    })


/**
 *提醒列表
 */
    .controller('RemindsCtrl', function ($scope, $state, Reminds) {

        $scope.reminds = Reminds.allReminds();

        //标记过期，并且自动删除调度id
        var now = new Date().getTime();
        var localOffset = Math.abs(new Date().getTimezoneOffset() * 60000);//-480

        for(i=0; i<$scope.reminds.length; i++){
            $scope.reminds[i].timestamp = new Date($scope.reminds[i].time).getTime()-localOffset;

            if(now < $scope.reminds[i].timestamp){
                $scope.reminds[i].notExpired = true;
            } else {
                //取消过期的调度id
                babyThingsApp.cancelNotification($scope.reminds[i].remindId);
            }
        }

        $scope.addRemind = function () {
            $state.go('tab.remind-detail', {});
        }

        //清空过期提醒数据
        $scope.clearExpired = function() {

            var reminds = $scope.reminds;

            for(i=0; i<reminds.length; i++){
                reminds[i].timestamp = new Date(reminds[i].time).getTime()-localOffset;

                if(now > reminds[i].timestamp){
                    reminds.splice(i, 1);
                }
            }

            Reminds.save(reminds);
            $state.go('tab.reminds', { });
        }
    })


/**
 *提醒详情
 */
    .controller('RemindDetailCtrl', function ($scope, $state, $stateParams,$ionicPopup, Reminds) {
        $scope.title = '添加提醒';
        $scope.remindId = $stateParams.remindId;

        var remindId = $scope.remindId;

        var reminds = Reminds.allReminds();

        var notificationRemindId = 0;

        if (remindId) {
            //编辑
            $scope.title = '提醒详情';

            var remindWithIndex = Reminds.getRemindWithIndex(remindId);
            $scope.remind = remindWithIndex.remind;
            $scope.remindIndex = remindWithIndex.index;

        } else {
            //添加
            $scope.remind = Reminds.newRemind();
        }

        // "设置时间"Event(需要先 cordova plugin add datepicker插件，然后重新add platform和build)
        //已用原生html5的input替代
//        $scope.changeDate = function () {
//            var options = {
//                date: new Date().toLo,
//                mode: 'datetime'
//            };
//
//            datePicker.show(options, function(date){
//                $scope.remind.time = date;
//            });
//        }

        $scope.saveRemind = function () {
            //输入检验(例如 不能比现在时间要早) 可放入 common.js 做通用function
            var d = new Date();
            var localOffset = Math.abs(d.getTimezoneOffset() * 60000);//-480
            var nowTime = d.getTime();
            var inputTime = new Date($scope.remind.time).getTime() - localOffset;

            if(inputTime <= nowTime){
                var alertPopup = $ionicPopup.alert({
                    title: '不能早于当前时间',
                    template: "请选择比当前要晚的时间"
                });
                alertPopup.then(function(res) {
                    console.log('close alert of time error');
                });

                return;
            }

            if (remindId) {
                reminds[$scope.remindIndex] = $scope.remind;

                notificationRemindId = remindId;
            }else{
                var insertRemind = $scope.remind;
                insertRemind.remindId = Reminds.getLastRemindId() + 1;
                reminds.push(insertRemind);
                Reminds.setLastRemindId(insertRemind.remindId);

                notificationRemindId = insertRemind.remindId;
            }

            //注意ios只允许64个local notification
            //处理local notification(新增或修改)
            babyThingsApp.addNotification(notificationRemindId, $scope.remind.title, $scope.remind.content, inputTime);

            Reminds.save(reminds);

            $state.go('tab.reminds', { });
        }

        //删除提醒
        $scope.delRemind = function (remindIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确认删除',
                template: '确定要删除这个提醒吗?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('被删除提醒的index为' + remindIndex);

                    reminds.splice(remindIndex, 1);
                    Reminds.save(reminds);
                    $state.go('tab.reminds', { });
                } else {
                    console.log('取消了删除提醒');
                }
            });
        };

    })

/**
 *我的
 */
    .controller('MyCtrl', function ($scope, $state, $location, $ionicPopup, $timeout, $http, Categories, Things, Records) {

        var urlAppGroup = 'http://www.viizee.com/?s=/Babythings';

        $("#isUploaded").hide();

        // 显示全屏广告
        if (typeof AdMob !== 'undefined' && AdMob) AdMob.showInterstitial();

        //上次备份时间
        $scope.lastUploadTime = window.localStorage['lastUploadTime'];

        //进入页面时检查登录状态 测试阶段无需登录
        $scope.isLogin = false;

        var userInfo = $.fn.umshare.getToken("qzone");

        if(userInfo){
            $scope.isLogin = true;
        }

        //分享按钮
        var opt = {
            'data' : {
                'content' : {
                    'text' : '宝宝物品管家' //要分享的文字
                }
            }
        }
        $("#btnShare").umshare(opt);

        //登录按钮
        $scope.checkLogin = function(){
            $("#checkTokenInfo").html('');
            $.fn.umshare.checkToken('qzone',function(user){
                $.fn.umshare.tip('登录成功,token:' + user.token + ', uid:' + user.uid);
            });
            $location.path('/tab.my');//重载界面  不能放在回调函数里面，否则界面不会强制刷新
        }

        //退出登录
        $scope.logout =function(){
            var info = $.fn.umshare.delToken("qzone");
            $location.path('/tab.my');
        }

        //反馈
        $scope.feedback = function(){
            $scope.data = {}

            var myPopup = $ionicPopup.show({
                template: '<textarea rows="5" ng-model="data.feedback">',
                title: '意见反馈',
                subTitle: '非常感谢您的支持',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>提交</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.feedback) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.feedback;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                $http.get(urlAppGroup + '/Index/feedback/content/' +res).then(function (response) {
                    $scope.feedbackResult = response.data;
                });
            });
            //$timeout(function() {
            //    myPopup.close(); //close the popup after 3 seconds for some reason
            //}, 3000);
        }

        //上传数据
        $scope.uploadData = function(){
            if($scope.isLogin == true){

                var things = window.localStorage['things'];
                var categories = window.localStorage['categories'];
                var records = window.localStorage['records'];

                $.ajax({
                    type: 'POST',
                    url: urlAppGroup + '/Index/uploadData/',
                    crossDomain: true,
                    data: { uid:userInfo.uid, things: things, categories:categories, records: records },
                    dataType: 'json',
                    success: function(responseData, textStatus, jqXHR) {
                        var alertPopup = $ionicPopup.alert({
                            title: responseData.message,
                            template: '您的数据上传成功，随时可以从云端恢复'
                        });
                        alertPopup.then(function(res) {
                            //console.log('Thank you for not eating my delicious ice cream cone');
                        });
                        var now = new Date();
                        window.localStorage['lastUploadTime'] = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()
                        + " " + now.getHours() + ":" + now.getMinutes();

                        $location.path('/tab.my');
                    },
                    error: function (responseData, textStatus, errorThrown) {
                        //alert('POST failed.');
                    }
                });

                // get方式可以正常识别CORS，post无法识别服务器端的CORS处理
                //$http.post(urlAppGroup + '/Index/uploadData', {things:'aaa'}).
                //        success(function(data, status, headers, config) {
                //            alert(data);
                //            $("#isUploaded").show();
                //        }).
                //        error(function(data, status, headers, config) {
                //            // called asynchronously if an error occurs
                //            // or server returns response with an error status.
                //        });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请先登录'
                });
                alertPopup.then(function(res) {
                    //console.log('Thank you for not eating my delicious ice cream cone');
                });
            }

        }

        //下载数据
        $scope.downloadData = function(){
            if($scope.isLogin == true){
                var categories = window.localStorage['categories'];
                console.log(categories);

                $.ajax({
                    type: 'POST',
                    url: urlAppGroup + '/Index/downloadData',
                    crossDomain: true,
                    data: { uid:userInfo.uid },
                    dataType: 'json',
                    success: function(responseData, textStatus, jqXHR) {
                        window.localStorage['things'] = responseData.things;
                        window.localStorage['categories'] = responseData.categories;
                        window.localStorage['records'] = responseData.records;
                        console.log(responseData.categories);

                        var alertPopup = $ionicPopup.alert({
                            title: responseData.message,
                            template: '您的数据已经还原，本地数据已经被覆盖'
                        });
                        alertPopup.then(function(res) {
                            //console.log('Thank you for not eating my delicious ice cream cone');
                        });

                    },
                    error: function (responseData, textStatus, errorThrown) {
                        //alert('POST failed.');
                    }
                });
            }else {
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请先登录'
                });
                alertPopup.then(function (res) {

                });
            }
        }

        $scope.aboutUs = function(){
            var alertPopup = $ionicPopup.alert({
                title: '关于',
                template: '宝宝物品管家 V0.1'
            });
            alertPopup.then(function(res) {
                console.log('close about');
            });
        }

        $scope.delData = function(type){
            if('reminds' === type){
                window.localStorage.removeItem('reminds');
                window.localStorage.removeItem('lastRemindId');
            }
            if('records' === type){
                window.localStorage.removeItem('records');
            }
            if('things' === type){
                window.localStorage.removeItem('things');
                window.localStorage.removeItem('lastThingId');

                //类别的统计数据归0（使用empty）
                window.localStorage.removeItem('categories');
            }
            if('all' === type){
                window.localStorage.clear();
            }
            if('notifications' === type){
                babyThingsApp.cancelAllNotification();
            }

            alert("已删除" + type);
        }

        $scope.getNotifications = function(){
            babyThingsApp.getScheduledIds();
        }

        $scope.testNotification = function(){
            babyThingsApp.addNotification(999,'title','message',new Date(new Date().getTime()+10000));
        }

    });
