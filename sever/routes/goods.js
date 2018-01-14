var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Goods = require("../models/goods");


mongoose.connect('mongodb://127.0.0.1:27017/mock');

//链接成功
mongoose.connection.on("connected",function () {
  console.log("MongoDb connected success.")
});

//链接失败
mongoose.connection.on("error",function () {
  console.log("MongoDb connected fail.")
});

//链接断开
mongoose.connection.on("disconnected",function () {
  console.log("MongoDb connected disconnected.")
});

//路由
router.get("/",function (req,res,next) {
  /*业务代码*/
  /* Obj.find(arguments[0],查询条件
  *arguments[1],callback,回调函数)*/
  let page = parseInt(req.param("page"));//当前页 页码 转为int类型，否则报错，get方法获得的数据都是字符串类型
  let pageSize = parseInt(req.param("pageSize"));//当前页显示条数
  let sort = parseInt(req.param("sort"));//接收前端传过来的字段'sort'-正序1/倒序-1
  let priceLevel = req.param("priceLevel");//价格区间
  let params = {};//查询条件
  let priceGt = '',priceLte = '';//大于的价格，小于等于的价格
  if(priceLevel !== "all"){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 5000;break;
    }
    params = {//条件查询设置价格区间
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let skip = (page-1)*pageSize;//分页，查找时跳过前面多少条数据
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);//设置条件 分页 利用skip跳过前面条数，和limit限制只查几条，类似截取字符串
  goodsModel.sort({'salePrice':sort});//设置条件
  goodsModel.exec(function (err,doc) {//执行操作
    if(err){
      //传一个json文件
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        mes:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  })
});

module.exports = router;

