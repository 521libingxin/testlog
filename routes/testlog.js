'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('testlog');

// 查询 Todo 列表ajax
router.get('/', function(req, res, next) {
  var query = new AV.Query(Todo);
  query.find().then(function(results) {
    res.json(results);
  }, function(err) {
    res.status(500).json({
      error: err.message
    });
  }).catch(next);
});
router.post('/remove', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  var objid = req.body.objid;
  var avobjects = []; 
  var avobjects2 = []; 
  for(var i in objid){
  	var t_av_obj = AV.Object.createWithoutData('testlog', objid[i]);
  	avobjects.push(t_av_obj);
  }
  AV.Object.destroyAll(avobjects).then(function () {
  	//res.location('/testlog/page');
  	res.redirect('/testlog/page');
	  /*res.json({
		  back:"success",
		  list:avobjects2
		});*/
  }, function (error) {
	  res.json({
		  back:"error"
		});
  });
});
// 查询 Todo 列表page
router.get('/page', function(req, res, next) {
  var query = new AV.Query(Todo);
  query.find().then(function(results) {
    res.render('testlog', {
      todos: results
    });
  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('testlog', {
        todos: []
      });
    } else {
      next(err);
    }
  }).catch(next);
});
// 新增 Todo 项目
router.post('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  var testkey = req.body.testkey;
  var todo = new Todo();
  todo.set('testkey', testkey);
  todo.save().then(function(todo) {
    res.json({
      back:true
    });
  }).catch(next);
});

module.exports = router;
