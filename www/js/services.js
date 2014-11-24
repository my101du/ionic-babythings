angular.module('babyThings.services', [])

/**
 * 类别
 *
 */
    .factory('Categories', function () {

        var empty_categories = [
            { id: 1, title: '奶粉与辅食', icon: 'naifen', totalNumber: 0, idleNumber: 0 },
            { id: 2, title: '尿裤湿巾', icon: 'niaoku', totalNumber: 0, idleNumber: 0 },
            { id: 3, title: '洗护用品', icon: 'xihu', totalNumber: 0, idleNumber: 0 },
            { id: 4, title: '喂养用品', icon: 'naiping', totalNumber: 0, idleNumber: 0 },
            { id: 5, title: '童车童床', icon: 'tongche', totalNumber: 0, idleNumber: 0 },
            { id: 6, title: '服装与配饰', icon: 'yifu', totalNumber: 0, idleNumber: 0 },
            { id: 7, title: '玩具与图书', icon: 'wanju', totalNumber: 0, idleNumber: 0 },
            { id: 8, title: '医药健康', icon: 'adgai', totalNumber: 0, idleNumber: 0 },
            { id: 9, title: '妈妈用品', icon: 'mama', totalNumber: 0, idleNumber: 0 },
            { id: 10, title: '其他', icon: 'qita', totalNumber: 0, idleNumber: 0 }
        ];

        //获取所有类别
        var getCategories = function () {
            var categoriesString = window.localStorage['categories'];
            if (categoriesString) {
                var categories = angular.fromJson(categoriesString);

                return categories;
            }

            return empty_categories;
        }

        //获取一个类别，并附带它的索引id
        var getCategoryWithIndex = function (categoryId) {
            var allCategories = getCategories();
            var categoryWithIndex = {index: 0, category: {}};

            for (i = 0; i < allCategories.length; i++) {
                if (allCategories[i].id == categoryId) {
                    categoryWithIndex = {index: i, category: allCategories[i]};
                    return categoryWithIndex;
                }
            }
        }

        //保存类别
        var saveCategories = function (categories) {
            window.localStorage['categories'] = angular.toJson(categories);
        }

        //更新某个类别的统计数据
        var updateCategoryCount = function(categoryId, categoryThings){
            var categoryWithIndex = getCategoryWithIndex(categoryId);
            var categories = getCategories();

            var modifyCategoryIndex = categoryWithIndex.index;
            categories[modifyCategoryIndex].totalNumber = categoryThings.length;
            categories[modifyCategoryIndex].idleNumber = 0;//clear
            for(i=0; i<categoryThings.length;i++){
                if ( true === categoryThings[i].isIdle ) {//必须注意 true 放前面，具体google
                    categories[modifyCategoryIndex].idleNumber++;
                }
            }
            saveCategories(categories);
        }

        return {
            allCategories: getCategories,
            getCategoryWithIndex: getCategoryWithIndex,
            saveCategories: saveCategories,
            updateCategoryCount: updateCategoryCount
        };
    })


/**
 * 物品
 *
 */
    .factory('Things', function (Categories) {
        //全部
        var getAllThings = function () {
            //测试阶段 随时清空数据
            //window.localStorage['things'] = '';

            var thingsString = window.localStorage['things'];
            if (thingsString) {
                var things = angular.fromJson(thingsString);

                return things;
            }
            return [];
        }

        //某个类别下
        var getCategoryThings = function (categoryId) {
            var allThings = getAllThings();
            var categoryThings = [];

            for (i = 0; i < allThings.length; i++) {
                if (allThings[i].categoryId == categoryId) {
                    categoryThings.push(allThings[i]);
                }
            }

            return categoryThings;
        }

        //单个物品
        var getThingWithIndex = function (thingId) {
            var allThings = getAllThings();
            var thingWithIndex = {index: 0, thing: {}};

            for (i = 0; i < allThings.length; i++) {
                if (allThings[i].thingId == thingId) {
                    thingWithIndex = {index: i, thing: allThings[i]};
                    return thingWithIndex;
                }
            }
        }

        //保存
        var saveThings = function (things) {
            window.localStorage['things'] = angular.toJson(things);
        }


        return {
            getAllThings: getAllThings,
            getCategoryThings: getCategoryThings,
            getThingWithIndex: getThingWithIndex,
            saveThings: saveThings,

            newThing: function (categoryId) {
                return {
                    thingId: 0,
                    categoryId: categoryId,
                    title: '',
                    isIdle: false,
                    place: '',
                    leftNumber: '',
                    leftUnit: '',
                    description: '',
                    pic:'img/ios7-plus-outline.png'
                };
            },

            // 参考代码 勿删(对象内有数组)
            // newThing: function(thingTitle) {
            //   return {
            //     title: thingTitle,
            //     tasks: []
            //   };
            // },

            //获取最后插入的事件Id（模拟自增）
            getLastThingId: function () {
                return parseInt(window.localStorage['lastThingId']) || 0;
            },

            //存储最后插入的事件Id（模拟自增）
            setLastThingId: function (index) {
                window.localStorage['lastThingId'] = index;
            }
        };
    })


/**
 *记账
 *
 */
    .factory('Records', function () {

        return {
            allRecords: function () {
                var recordsString = window.localStorage['records'];
                if (recordsString) {
                    var records = angular.fromJson(recordsString);

                    return records;
                }
                return [];
            },

            save: function (records) {
                window.localStorage['records'] = angular.toJson(records);
            },

            //创建一个新的记账对象
            newRecord: function () {
                return {
                    indexId: 0,//实际上没用到，在列表里用的索引
                    title: '',
                    date: new Date().toLocaleDateString(),//默认英文格式，.toLocaleString()转为本地，toLocaleDateString 只显示日期部分
                    address: '',
                    price: 0,
                    description: ''
                };
            }
        };
    })


/**
 *提醒
 *
 */
    .factory('Reminds', function () {
        var getAllReminds = function(){
            var remindsString = window.localStorage['reminds'];
            if (remindsString) {
                var reminds = angular.fromJson(remindsString);

                return reminds;
            }
            return [];
        }

        return {
            allReminds: getAllReminds,

            //单个提醒
            getRemindWithIndex: function (remindId) {
                var allReminds = getAllReminds();
                var remindWithIndex = {index: 0, remind: {}};

                for (i = 0; i < allReminds.length; i++) {
                    if (allReminds[i].remindId == remindId) {
                        remindWithIndex = {index: i, remind: allReminds[i]};
                        return remindWithIndex;
                    }
                }
            },

            save: function (reminds) {
                window.localStorage['reminds'] = angular.toJson(reminds);
            },

            //获取最后插入的事件Id（模拟自增）
            getLastRemindId: function () {
                return parseInt(window.localStorage['lastRemindId']) || 0;
            },

            //存储最后插入的事件Id（模拟自增）
            setLastRemindId: function (index) {
                window.localStorage['lastRemindId'] = index;
            },

            //创建一个新的提醒对象
            newRemind: function () {
                return {
                    remindId:0,
                    time: '', //new Date().toLocaleString()
                    title: '',
                    content: ''
                };
            }
        };
    })


/**
 *商城 大家在买
 */
    .factory('Goods', function ($http) {
        var getGoods = function () {
            var promise = $http.get('http://www.myprojects.com/demos/baby_things/index.php').then(function (response) {
                console.log(response.data);
                return response.data;
            });

            // $http.get('http://www.myprojects.com/demos/baby_things/index.php')
            // .success(function(data, status, headers, config) {
            //   var goods = angular.fromJson(data);
            //   return goods;
            // })
            // .error(function(data, status, headers, config) {
            //   alert('网络错误或无法获取数据');
            // });
        }

        return {
            getGoods: getGoods
        };
    });