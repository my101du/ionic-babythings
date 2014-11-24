(function($) {    
  $.fn.umshare = function(options) {    
    $.fn.umshare.initDevice();
    if(!options.data.platform){
      options.data.platform = {};
    }
    for(i in $.fn.umshare.defaults.data.platform){
      if(!options.data.platform[i]){
        options.data.platform[i] = {};     
      }
      options.data.platform[i].content = $.extend(true,{},options.data.content,options.data.platform[i].content||{});
    }
    var opts = $.extend(true,{}, $.fn.umshare.defaults, options);    
    var _this = $(this);
    var init = function(){
        $.fn.umshare.getUid(opts.topic,function(){
            _this.click(function(){
                shareList();
            });
        });
    }
    var shareList = function(){
      var cr = opts.list.vertical;
      if($(window).width() > $(window).height()){
        cr = opts.list.horizontal;
      }
        var itemSideLength = $(window).width()/cr.col;
        $("body ul.shareList").remove();
        $("body div.cover").remove();
        var list = $('<ul class="shareList"></ul>');
         for(i in opts.data.platform){
            list.append('<li class="shareList_item shareList_item_'+i+'" val="'+i+'"><span>'+opts.data.platform[i].name+'</span></li>');
         }
         list.append("<div class=c></div>");

        list.css({
            height:itemSideLength*cr.row
        });
        list.find("li").css({
            width:itemSideLength-1,
            height:itemSideLength-1
        })
        //show
        var showList = function(){
            $("body").append("<div class='cover'></div>");
            $('body').append(list);
        }
        //close
        var closeList = function(callback){
            list.addClass('remove');
            $(".cover").addClass('remove');
            setTimeout(function(){
                list.remove();
                $(".cover").remove();
            },500);
        }
        showList();
        $(".cover").click(function(){ 
            closeList();
        });
        list.find("li.shareList_item").click(function(){
            closeList();
            var plat = $(this).attr('val');
            var opt = {};
            opt.data = opts.data.platform[plat];
            $.fn.umshare.share(plat, opt);
        });
    };
    init();

  };    
  $.fn.umshare.tip = function(text){
      var tip = $("<div class='umTip'><span>"+text+"</span><div>");
      tip.appendTo($("body")).fadeIn(300).delay(1000).fadeOut(300,function(){
          tip.remove();
      });
  };
  $.fn.umshare.getUid = function(opt,callback){
    $.fn.umshare.initDevice();
    if(window.localStorage.getItem('uid')){
        $.fn.umshare.constant.baseParams.ek = window.localStorage.getItem('ek');
        $.fn.umshare.constant.baseParams.uid = window.localStorage.getItem('uid');
        callback();
    }else{
        var url = $.fn.umshare.constant.baseUrl+'/bar/get/'+$.fn.umshare.constant.baseParams.ak+'/';
        var params = $.extend(true,{},$.fn.umshare.constant.baseParams,opt||{});
        $.get(url,params,function(d){
            window.localStorage.setItem('ek', d.data.ek);
            window.localStorage.setItem('uid', d.data.uid);
            $.fn.umshare.constant.baseParams.ek = d.data.ek;
            $.fn.umshare.constant.baseParams.uid = d.data.uid;
            callback(d.data.uid);
        },'json');            
    }
  };
  $.fn.umshare.login = function(plat,callback){
    var opt = {
      'dc': 'default',  
      'name':'default',    
      'ni':1
    }
    $.fn.umshare.getUid(opt,function(){
        $.fn.umshare.initDevice();
        var href = '';
        var url = $.fn.umshare.constant.baseUrl+'/share/auth/'+$.fn.umshare.constant.baseParams.ak+'/'+$.fn.umshare.constant.baseParams.ek+'/?';
        var params = {
            'via':plat,
            'opid':10
        };
        params = $.extend(true,{},$.fn.umshare.constant.baseParams,params);
        for(i in params){
            url += i+'='+params[i]+'&';
        }
        var loginWindow = window.open(url,'_blank','toolbar=no,menubar=no,location=no');
        loginWindow.addEventListener('loadstart', function(event) { 
            href =('start: ' + event.url);
            if(href.indexOf("access_secret") > -1){
                var params = href.split("?")[1].split("&");
                var pm = {};
                for(i in params){
                    var kv = params[i].split("=");
                    pm[kv[0]] = kv[1];
                }
                loginWindow.close();
                $.fn.umshare.saveToken(plat,pm.access_secret,pm.uid);
                callback({'token':pm.access_secret,'uid':pm.uid});
            }
        });
    });
  }
  $.fn.umshare.saveToken = function(plat,token,uid){
       window.localStorage.setItem(plat, token+','+uid);
       return true; 
  }
  $.fn.umshare.getToken = function(plat){
       var token = window.localStorage.getItem(plat);
       if(token){
        token = token.split(',');
        var user = {
          'token' : token[0],
          'uid' : token[1]
        };
        return user;
       }else{
        return false;
       }
  }
  $.fn.umshare.checkToken = function(plat,callback){
       var token = window.localStorage.getItem(plat);
       if(token){
        token = token.split(',');
        var user = {
          'token' : token[0],
          'uid' : token[1]
        };
        callback(user);
       }else{
        $.fn.umshare.login(plat,callback);
       }
  }
  $.fn.umshare.delToken = function(plat){
       return window.localStorage.removeItem(plat); 
  }
  $.fn.umshare.initDevice = function(){
      try{
      if(!device){
        $.fn.umshare.tip("系统错误：缺少org.apache.cordova.device");
      }
      if(!navigator.network){
        $.fn.umshare.tip("系统错误：缺少org.apache.cordova.network-information");
      }
      $.fn.umshare.constant.baseParams = $.extend(true,{},$.fn.umshare.constant.baseParams,{
          'imei' : device.uuid,
          'sdkv' : '5.0',
          'pcv'  : '2.0',
          'de'   : device.model,
          'os'   : device.platform,
          'ak'   : window.umappkey?window.umappkey:'528dc5aa56240bb52f02343c',
          'ek'   : '000',
          'en'   : navigator.network.connection.type,
          'phonegap': '1',
          'tp'   : 0
      });
    }catch(e){
        $.fn.umshare.tip("系统错误：缺少org.apache.cordova.device或org.apache.cordova.network-information");
        $.fn.umshare.constant.baseParams = $.extend(true,{},$.fn.umshare.constant.baseParams,{
            'imei' : '-1',
            'sdkv' : '5.0',
            'pcv'  : '2.0',
            'de'   : '-1',
            'os'   : '-1',
            'ak'   : window.umappkey?window.umappkey:'528dc5aa56240bb52f02343c',
            'ek'   : '000',
            'en'   : 'null',
            'phonegap': '1',
            'tp'   : 0
        });
    }
  }
  $.fn.umshare.share = function(plat,c){
    $.fn.umshare.initDevice();
    if(!c.name){
      c.name =  $.fn.umshare.defaults.data.platform[plat].name;
    }
    var sharePanel = function(plat,c){
      var panel = $('<div class="sharePage">\
              <div class="sharePageTitle">\
                  <b class="icon-back sharePageBack"></b>\
                  <span>分享到'+c.name+'</span>\
                  <b class="icon-submit sharePageSubmit"></b>\
              </div>\
              <textarea class="sharePageContent">'+c.data.content.text+'</textarea>\
              <div class="sharePageBottom">\
                  <span class="shareGeo"></span>\
                  <!--<span class="shareCamera shareBottomBtn"></span>\
                  <span class="sharePic shareBottomBtn"></span>-->\
                  <img id="shareImage" class="shareImg" src="'+(c.data.content.img?c.data.content.img:c.data.content.furl)+'"/>\
              </div>\
          </div>');
      if(panel.find("#shareImage").attr("src") != ""){
        panel.find("#shareImage").show();
      }
      var getGeo = function(){
          $('.shareGeo').html("获取位置(GPS)");
          var getGeoSuccess = function(position) {
              $.fn.umshare.checkToken(plat,function(user){
                $.fn.umshare.constant.lc = '('+position.coords.longitude+','+position.coords.latitude+')';
                var url = $.fn.umshare.constant.baseUrl+'/share/geo/'+$.fn.umshare.constant.baseParams.ak+'/'+$.fn.umshare.constant.baseParams.ek;
                var params = {
                  'lc' : location,
                  'via' : plat,
                  'usid' : user.uid
                };
                $.get(url,params,function(d){
                    if(d.st == '200'){
                        $('.shareGeo').html(d.data.address);
                    }else{
                        $('.shareGeo').html('未知地点');
                    }
                });
              });
          }
          var getGeoError = function(error) {
          $('.shareGeo').html("获取位置(Internet)");
            navigator.geolocation.getCurrentPosition(getGeoSuccess, function(){
              $('.shareGeo').html('未知地点');
            },{ maximumAge: 3000, timeout: 30000, enableHighAccuracy: false });
          }
          navigator.geolocation.getCurrentPosition(getGeoSuccess, getGeoError,{ maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
      }
      var showPanel = function(){
          panel.appendTo($("body"));
          getGeo();
      }
      var closePanel = function(callback){
          panel.addClass("remove");
          setTimeout(function(){
              panel.remove();
          },500);
      }
      showPanel();
      $(".sharePageBack").click(function(){
          closePanel();        
      });
      /*
       *拍照功能
       */
      $(".shareCamera").click(function(){
          navigator.camera.getPicture(function(imageData){
              var image = $('#shareImage');
              image.attr('src',imageData).show();
          }, function(message){
              $.fn.umshare.tip(message);
          }, { quality : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            mediaType : Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true 
          });
      });/* */
      /*
       *读取本地照片
       */
      $(".sharePic").click(function(){
          navigator.camera.getPicture(function(imageData){
              var image = $('#shareImage');
              image.attr('src',imageData).show();
          }, function(message){
              $.fn.umshare.tip(message);
          }, { quality : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit : true,
            mediaType : Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true 
          });
      });/* */
      $("#shareImage").click(function(){
          $(this).attr("src","").hide();
      });
      $(".sharePageSubmit").click(function(){
        closePanel();
          var content = $(".sharePageSubmit").parent().parent().find(".sharePageContent").val();
          var imageURI = $("#shareImage").attr("src");
          c.data.content.text = content;
          c.data.content.img = imageURI;
          $.fn.umshare.shareSubmit(plat,c);
      });
    }
    var shareToPlat = {
        'sina' : function(){
          sharePanel(plat,c);
        },
        'tencent' : function(){
          sharePanel(plat,c);
        },
        'douban' : function(){
          sharePanel(plat,c);
        },
        'renren' : function(){
          sharePanel(plat,c);
        },
        'qzone' : function(){
          sharePanel(plat,c);
        },
        'sms' : function(){
            var url = 'sms:?body='+c.data.content.text;
            var browser = window.open(url,'_blank','hidden=yes');
            browser.addEventListener('loadend', function(event) { 
              browser.close();  
            });
        },
        'email' : function(){
            var url = 'mailto:someone@somedomain.com?subject='+c.data.content.subject+'&body='+c.data.content.text;
            var browser = window.open(url,'_blank','hidden=yes');
            browser.addEventListener('loadend', function(event) { 
              browser.close();  
            });

        }
    };
    if(shareToPlat[plat]){
      var share = shareToPlat[plat];
      share();
    }else{
      $.fn.umshare.tip("not supported!");
    }
  }
  $.fn.umshare.CheckImg = function(imgurl) {  
      var ImgObj = new Image(); 
      ImgObj.src = imgurl;  
      if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
          return ImgObj;  
      } else {  
          return false;
      }  
  } 
  $.fn.umshare.shareSubmit = function(plat,c){
    $.fn.umshare.getUid(c.topic,function(){
      $.fn.umshare.initDevice();
      var content = c.data.content.text;
      var imageURI = $.fn.umshare.CheckImg(c.data.content.img?c.data.content.img:c.data.content.furl);
      if(!content){
        $.fn.umshare.tip('参数不全!');
        return false;
      }
      $.fn.umshare.checkToken(plat,function(token){
        var uid = token.uid;
        var token = token.token;
        var url = $.fn.umshare.constant.baseUrl+'/share/multi_add/'+$.fn.umshare.constant.baseParams.ak+'/'+$.fn.umshare.constant.baseParams.ek+'/';
        var params = {
            'ct' : content,
        };
        if($.fn.umshare.constant.location){
            params.lc = $.fn.umshare.constant.location;
        }
        if(c.data.content.furl){
          params.furl = c.data.content.furl;
        }
        if(c.data.content.furl == imageURI.src){
          imageURI = false;
        }
        params.sns = {};
        params.sns[plat] = uid;
        params.sns = JSON.stringify(params.sns);
        params = $.extend(true,{},$.fn.umshare.constant.baseParams,params);
        $.fn.umshare.tip('发送中...');
        if(imageURI){
            imageURI = imageURI.src;
            var options = new FileUploadOptions();
            options.fileKey="pic";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.params = params;
            var ft = new FileTransfer();
            ft.upload(imageURI, url, function(r){
                    d = eval('(' + r.response + ')');
                    if(d.st == '200'){
                        $.fn.umshare.tip("发送成功！");
                        c.callback();
                    }else{
                        $.fn.umshare.tip(d.msg);
                    }
            }, function(error){
                    $.fn.umshare.tip("发送失败！请稍候再试");
            }, options);

        }else{
            $.post(url,params,function(d){
                if(d.st == '200'){
                    $.fn.umshare.tip("发送成功！");
                    c.callback();
                }else{
                        $.fn.umshare.tip(d.msg);
                }
            });
        }
      });
    });
  }
  $.fn.umshare.shake = function(opt,callback){
    try{
      var defOpt = {
        freq : 1000,
        sens : 200
      };
      opts = $.extend(true,defOpt,opt||{});
      function startWatch() {
          var options = { frequency: opts.freq };

          watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
      }
      function stopWatch() {
          if (watchID) {
              navigator.accelerometer.clearWatch(watchID);
              watchID = null;
          }
      }
      function onSuccess(acceleration) {
          var a = parseInt(acceleration.x*acceleration.x + acceleration.y*acceleration.y + acceleration.z*acceleration.z);
          if(a > opts.sens){
            stopWatch();
            callback();
          }
      }
      function onError() {
          alert('onError!');
      } 
      startWatch();
    }catch(e){
        $.fn.umshare.tip("系统错误：缺少org.apache.cordova.device-motion");
    }

  }



  $.fn.umshare.screenshot = function(opt,callback){
    var defOpt = {};
    opts = $.extend(true,defOpt,opt||{});
   var stored = function(dataUrl){
      var url = "";
      function dataUrlToBuffer(dataurl) {
          var datas = dataurl.split(',', 2);
          var data = atob(datas[1]);
          var arr = new Uint8Array(data.length);
          for(var i = 0, l = data.length; i < l; i++) {
              arr[i] = data.charCodeAt(i);
          }
          return arr.buffer;
      };

      var buffer = dataUrlToBuffer(dataUrl);


      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
      function gotFS(fileSystem) {
          var fileName = (new Date()).valueOf();
          fileSystem.root.getDirectory("Camera", { create :  true , exclusive :  false },
            function(dirEntry){
              dirEntry.getDirectory("umshare", { create :  true , exclusive :  false },function(dE){
                dE.getFile(fileName+".png", { create :  true , exclusive :  false },gotFileEntry,fail);
              },function(err){
                alert('文件夹读取失败，错误代码：'+error.code);
              });
            },
            function(err){                      
              alert('文件夹读取失败，错误代码：'+error.code);
            }
          );
      }

      function gotFileEntry(fileEntry) {
          url = fileEntry.toURL();
          fileEntry.createWriter(gotFileWriter, fail);
      }

      function gotFileWriter(writer) {
          writer.onwriteend = function(evt) {
              $.fn.umshare.tip("截图成功！保存在"+url);
              callback(url);
          };
          writer.write(buffer);
      }

      function fail(error) {
          alert('文件保存失败，错误代码：'+error.code);
      }
    }
    if(opts.video){
          var canvas = document.createElement("canvas");
          canvas.width = opts.video.videoWidth;
          canvas.height = opts.video.videoHeight;
          canvas.getContext('2d')
                .drawImage(opts.video, 0, 0, canvas.width, canvas.height);
          try{
            var dataUrl = canvas.toDataURL();
            stored(dataUrl);
          }catch(e){
            alert('截图失败。权限问题');
          }
    }else{
      html2canvas(document.body, {
          allowTaint: true,
          taintTest: false,
          onrendered: function(canvas) {
              var dataUrl = canvas.toDataURL();
              stored(dataUrl);
          }
      });

    }
  }

  $.fn.umshare.constant = {
     baseUrl :'http://log.umsns.com'
  }
  $.fn.umshare.defaults = {
    'data' : {
      'content' : {
        'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给人人网'
      },
      'platform' : {
        'sina':{
            'name':'新浪微博',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！',
            }
        },
        'tencent':{
            'name':'腾讯微博',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给腾讯微博'
            }
        },
        'qzone':{
            'name':'QQ空间',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给QQ空间'
            }
        },
        'renren':{
            'name':'人人网',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给人人网'
            }
        },
        'douban':{
            'name':'豆瓣',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给豆瓣'
            }
        },
        'sms':{
            'name':'短信',
            'content': {
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给短信'
            }
        },
        'email':{
            'name':'邮件',
            'content': {
                'subject':'',
                'text' : '友盟社会化组件，让移动应用快速整合社交分享功能！发给邮件'
            }
        }        
      }
    },
    'topic': {
      'dc': 'default',  
      'name':'default',    
      'ni':1
    },
    'list': {
      'horizontal':{
        'col' : 6,
        'row' : 2
      },
      'vertical':{
        'col' : 4,
        'row' : 2
      }
    },
    'callback':function(){}
  };    
 })(jQuery); 
