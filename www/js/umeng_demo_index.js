/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        try{
          if (window.device.version.substr(0,1) === '7') {
          $('body').addClass('ios7');
          }
        }catch(e){};
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $(".loading").remove();
        //
        window.umappkey = '528dc5aa56240bb52f02343c';//设置来自友盟的APPKEY,请从友盟网站申请http://www.umeng.com
        //login
        $("#loginBtn").click(function(){
                $("#loginInfo").html('');
            $.fn.umshare.login('sina',function(user){
                $.fn.umshare.tip('登录成功,token:'+user.token+', uid:'+user.uid);
                $("#loginInfo").html('登录成功,token:'+user.token+', uid:'+user.uid);
            });
        });

        //getToken
        $("#getTokenBtn").click(function(){
               var info = $.fn.umshare.getToken("sina");
               $("#getTokenInfo").html( info ? 'token:' + info.token + ', uid:' + info.uid : 'false');
        });

        //checkToken
        $("#checkTokenBtn").click(function(){
            $("#checkTokenInfo").html('');
            $.fn.umshare.checkToken('sina',function(user){
                $.fn.umshare.tip('登录成功,token:' + user.token + ', uid:' + user.uid);
                $("#checkTokenInfo").html('登录成功,token:' + user.token + ', uid:' + user.uid);
            });
        });

        //delToken
        $("#delTokenBtn").click(function(){
               var info = $.fn.umshare.delToken("sina");
               $("#delTokenInfo").html('退出成功');
        });

        //umshare
        var opt = {
               'data' : {
                      'content' : {
                             'text' : '友盟分享组件帮您接入和升级微博、微信等社交平台，快速武装您的应用！',
                             'img' : 'img/share.png'
                      }
               } 
        }
        $("#shareBtn").umshare(opt);

        //share to some platform
        var opt = {
               'data' : {
                      'content' : {
                             'text' : '友盟分享组件帮您接入和升级微博、微信等社交平台，快速武装您的应用！',
                             'img' : 'img/share.png'
                      }
               } 
        }
        $("#shareToSinaBtn").click(function(){
               $.fn.umshare.share('sina',opt);
        });

        //share to some platform(no edit page)
        var opt = {
               'data' : {
                      'content' : {
                             'text' : '友盟分享组件帮您接入和升级微博、微信等社交平台，快速武装您的应用！',
                             'img' : 'img/share.png'
                      }
               } 
        }
        $("#shareSubmitSinaBtn").click(function(){
               $.fn.umshare.shareSubmit('sina',opt);
        });

        //shake
        $("#shakeBtn").click(function(){
          var shake = function(){
            var params = {};
            $.fn.umshare.shake(params,function(){
              $.fn.umshare.screenshot({},function(url){
                    var opt = {
                           'data' : {
                                  'content' : {
                                         'text' : '友盟分享组件帮您接入和升级微博、微信等社交平台，快速武装您的应用！',
                                         'img' : url
                                  }
                           },
                           'callback' : function(){
                              shake();
                           } 
                    }
                   $.fn.umshare.share('sina',opt);
              });
            });
          }
          shake();
        });

        //shake screenshot
        $("#screenshotBtn").click(function(){
          $.fn.umshare.screenshot({},function(url){
                var opt = {
                       'data' : {
                              'content' : {
                                     'text' : '友盟分享组件帮您接入和升级微博、微信等社交平台，快速武装您的应用！',
                                     'img' : url
                              }
                       } 
                }
               $.fn.umshare.share('sina',opt);
          });
        });
    }
};
