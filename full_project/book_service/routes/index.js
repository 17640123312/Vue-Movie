//引用express框架
var express = require('express');
//引用路由
var router = express.Router();
//数据库引入
var mongoose=require('mongoose');
var recommend = require("../model/recommend");
var movie = require("../model/movie");
var article = require("../model/article");
var user = require("../model/user");
//查找首页轮播图
router.post('/', function(req, res, next) {
    movie.find({movieMainPage:true},{movieImg:1,_id:0},function(err,getBanners){
      return res.json({status:0,message:'查询成功',data:getBanners});
    });
});
//热播电影

//定义路由
router.get('/mongooseTest',function(req, res, next){
  mongoose.connect('mongodb://localhost/pets',{useMongoClient:true});
  mongoose.Promise=global.Promise;
  var Cat=mongoose.model('Cat',{name:String});
  var tom=new Cat({name:'Tom'});
  tom.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log('success insert');
    }
  });
  res.send('数据库连接测试');
});

//显示主页的推荐大图等
router.get("/showIndex",function(req,res,next){
  recommend.findAll(function(err,getRecommend){
    if(err){
      return  res.json({status:1,message:err});
    }else{
      return res.json({status:0,message:"获取推荐",data:getRecommend});
    }
  })
});

//显示所有的排行榜，也就是对于电影字段index样式
router.get("/showRanking",function(req,res,next){
  movie.find({movieMainPage:true},function(err,getMovie){
    if(err){
      return res.json({status:1,message:err});
    }else{
      return res.json({status:0,message:"获取主页",data:getMovie});
    }
  })
});

//显示文章列表

router.get("/showArticle",function(req,res,next){
  article.findAll(function(err,getArticles){
    if(err){
      return  res.json({status:1,message:err});
    }else{
      return  res.json({status:0,message:"获取文章",data:getArticles});
    }
  })
});

//显示文章详情
router.post("/articleDetail",function(req,res,next){
  if(!req.body.article_id){
    return res.json({status:1,message:"文章ID出错"});
  }
  article.findByArticleId(req.body.article_id,function(err,getArticle){
    if(err){
      return res.json({status:1,message:err});
    }else{
      return res.json({status:0,message:getArticle});
    }
  })
});

//显示用户个人信息的内容
router.post("/showUser",function(req,res,next){
  if(!req.body.user_id){
    return res.json({status:1,message:"user_id不能为空"});
  }
  user.findById(req.body.user_id,function(err,getUser){
    if(err){
      return  res.json({status:1,message:err});
    }else{
      res.json({status:0,message:"获取成功",data:{
          user_id:getUser._id,
          username:getUser.username,
          userMail:getUser.userMail,
          userPhone:getUser.userPhone,
          userStop:getUser.userStop
        }})
    }
  })
});

module.exports = router;
