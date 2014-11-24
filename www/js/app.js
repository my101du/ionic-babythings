window.umappkey = '545c846bfd98c57079002c42';

angular.module('babyThings', ['ionic', 'babyThings.controllers', 'babyThings.filters','babyThings.directives', 'babyThings.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                //StatusBar.styleDefault();
            }
            //ios下select会出现无法自动消失的问题，（没有那个有“done”按钮的一栏），必须注释这两行

            //admob的参数
            var ad_units = {
                ios: {
                    banner: 'ca-app-pub-0105370953470770/6467133257', // or DFP format "/6253334/dfp_example_ad"
                    interstitial: 'ca-app-pub-0105370953470770/7943866451'
                },
                android: {
                    banner: 'ca-app-pub-0105370953470770/3435954855', // or DFP format "/6253334/dfp_example_ad"
                    interstitial: 'ca-app-pub-0105370953470770/4912688050'
                }
            };
// select the right Ad Id according to platform
            var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

            //banner if (AdMob !== undefined ){
            //if(AdMob) AdMob.createBanner( admobid.banner );

            if (typeof AdMob !== 'undefined' && AdMob) AdMob.createBanner({
                adId: admobid.banner,
                //adSize:'MEDIUM_RECTANGLE',
                overlap: false,
                position: AdMob.AD_POSITION.TOP_CENTER,
                autoShow: true
            });

            //弹窗 准备
            if (typeof AdMob !== 'undefined' && AdMob) AdMob.prepareInterstitial({adId: admobid.interstitial, autoShow: false});
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            //类别列表
            .state('tab.categories', {
                url: '/categories',
                views: {
                    'tab-things': {
                        templateUrl: 'templates/categories.html',
                        controller: 'CategoriesCtrl'
                    }
                }
            })

            //物品列表(某个类别)
            .state('tab.things', {
                url: '/things/:categoryId',
                views: {
                    'tab-things': {
                        templateUrl: 'templates/things.html',
                        controller: 'ThingsCtrl'
                    }
                }
            })

            //物品详情
            .state('tab.thing-detail', {
                url: '/thing-detail/:categoryId/:thingId',
                views: {
                    'tab-things': {
                        templateUrl: 'templates/thing-detail.html',
                        controller: 'ThingDetailCtrl'
                    }
                }
            })

            //转让(暂无)
            .state('tab.sell', {
                url: '/sell',
                views: {
                    'tab-sell': {
                        templateUrl: 'templates/sell.html',
                        controller: 'SellCtrl'
                    }
                }
            })

            //商店(大家在用)
            .state('tab.shop', {
                url: '/shop',
                views: {
                    'tab-shop': {
                        templateUrl: 'templates/shop.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            //记账列表
            .state('tab.records', {
                url: '/records',
                views: {
                    'tab-records': {
                        templateUrl: 'templates/records.html',
                        controller: 'RecordsCtrl'
                    }
                }
            })

            //记账详情
            .state('tab.record-detail', {
                url: '/record-detail/:recordId',
                views: {
                    'tab-records': {
                        templateUrl: 'templates/record-detail.html',
                        controller: 'RecordDetailCtrl'
                    }
                }
            })

            //提醒列表
            .state('tab.reminds', {
                url: '/reminds',
                views: {
                    'tab-reminds': {
                        templateUrl: 'templates/reminds.html',
                        controller: 'RemindsCtrl'
                    }
                }
            })

            //记账详情
            .state('tab.remind-detail', {
                url: '/remind-detail/:remindId',
                views: {
                    'tab-reminds': {
                        templateUrl: 'templates/remind-detail.html',
                        controller: 'RemindDetailCtrl'
                    }
                }
            })

            //我的
            .state('tab.my', {
                url: '/my',
                views: {
                    'tab-my': {
                        templateUrl: 'templates/my.html',
                        controller: 'MyCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/categories');

    });

