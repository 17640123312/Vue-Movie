var express = require('express');
var router = express.Router();
var movie=require('../model/movie');
var sd = require('silly-datetime');
var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
//轮播区
//电影：查询  全部
router.post("/store",function(req,res,next){
    //return res.json({status:-1,message:req.session.token+"asdsdad"});
    var total =0 ;
    var skip=(req.body.pageCurrent-1)*req.body.pageSize;
    movie.count({},function(err,count){
        total=count;
    });
    var query=movie.find({}).sort({_id:-1}).skip(skip).limit(req.body.pageSize);
    query.exec(function(err,getMovieAll){
        if(getMovieAll.length==0){
            return res.json({status:1,message:"暂无数据"});
        }else{
            return res.json({status:0,message:"查询成功",data:getMovieAll,total:total,kip:skip});
        }
    });
});
//电影：查询 轮播图
router.post("/banner_store",function(req,res,next){
    //return res.json({status:-1,message:req.session.token+"asdsdad"});
    var total =0 ;
    var skip=(req.body.pageCurrent-1)*req.body.pageSize;
    movie.count({movieMainPage:1},function(err,count){
        total=count;
    });
    var query=movie.find({movieMainPage:1}).sort({_id:-1}).skip(skip).limit(req.body.pageSize);
    query.exec(function(err,getMovieAll){
        if(getMovieAll.length==0){
            return res.json({status:1,message:"暂无数据"});
        }else{
            return res.json({status:0,message:"查询成功",data:getMovieAll,total:total,kip:skip});
        }
    });
});
//电影：查询 热播
router.post("/hot_store",function(req,res,next){
    var total =0 ;
    var skip=(req.body.pageCurrent-1)*req.body.pageSize;
    movie.count({movieHot:1},function(err,count){
        total=count;
    });
    var query=movie.find({movieHot:1}).sort({_id:-1}).skip(skip).limit(req.body.pageSize);
    query.exec(function(err,getMovieAll){
        if(getMovieAll.length==0){
            return res.json({status:1,message:"暂无数据"});
        }else{
            return res.json({status:0,message:"查询成功",data:getMovieAll,total:total,kip:skip});
        }
    });
});
//电影添加操作
router.post('/add',function(req,res,next){
    if(!req.body.movieName){
        return res.json({status:1,message:"电影名称不能为空"});
    }
    if(!req.body.movieAhthor){
        return res.json({status:1,message:"电影作者不能为空"});
    }
    if(!req.body.movieRole){
        return res.json({status:1,message:"电影角色不能为空"});
    }
    if(!req.body.movieTime){
        return res.json({status:1,message:"电影时长不能为空"});
    }
    if(!req.body.movieImg) {
        return res.json({status: 1, message: "电影图片不能为空"});
    }
    //建立一个数据集
    var movieSave=new movie({
        movieName:req.body.movieName,
        movieAhthor:req.body.movieAhthor,
        movieRole:req.body.movieRole,
        movieContent:req.body.movieContent,
        movieTime:req.body.movieTime,
        movieImg:req.body.movieImg,
        movieDate:req.body.movieDate,
        movieScore:req.body.movieScore,
        movieVideo:req.body.movieVideo,
        movieDownload:req.body.movieDownload,
        movieNumSuppose:0,
        movieNumDownload:0,
        movieMainPage:req.body.movieMainPage ? req.body.movieMainPage :0 ,
        movieHot:req.body.movieHot ? req.body.movieHot : 0,
        movieType:req.body.movieType,
        modified:time,
        created:time
    });
    movieSave.save(function(err){
        if(err){
            return res.json({status:1,message:err});
        }else{
            return res.json({status:0,message:"电影保存成功"})
        }
    });
});
//更新电影
router.post("/update",function(req,res,next){
    if(!req.body.movieName){
        return res.json({status:1,message:"电影名称不能为空"});
    }
    if(!req.body.movieImg){
        return res.json({status:1,message:"电影图片不能为空"});
    }
    if(!req.body.movieVideo){
        return res.json({status:1,message:"电影音频不能为空"});
    }
    if(!req.body.movieDownload){
        return res.json({status:1,message:"下载地址不能为空"});
    }
    if(!req.body.id){
        return res.json({status:1,message:"没有传ID"});
    }
    movie.update({_id:req.body.id},{
        movieName:req.body.movieName,
        movieImg:req.body.movieImg,
        movieVideo:req.body.movieVideo,
        movieDownload:req.body.movieDownload,
        movieMainPage:req.body.movieMainPage ? req.body.movieMainPage :0 ,
        movieHot:req.body.movieHot ? req.body.movieHot : 0
    },function(err,getUpdate){
        if(err){
            return res.json({status:1,message:err});
        }else{
            return res.json({status:0,message:"更新成功",data:getUpdate});
        }
    });
});

//删除电影
router.post("/del",function(req,res,next){
    if(!req.body.id){
        return res.json({status:1,message:"没有传递电影Id"});
    }
    movie.remove({_id:req.body.id},function(err,delMovie){
        return res.json({status:0,message:"删除成功",data:delMovie});
    });
});
//编辑电影使用
router.post('/edit',function(req,res,next){
    if(!req.body.movie_id){
        return res.json({status:1,message:"movie_id必须传"});
    }
    movie.findById({_id:req.body.movie_id},function (err,getMovieOne) {
        return res.json({status:0,message:"查询成功",data:getMovieOne});
    })
});

//热播区

//添加热播
//电影：查询
router.post("/hot_store",function(req,res,next){
    var total =0 ;
    var skip=(req.body.pageCurrent-1)*req.body.pageSize;
    movie.count({movieHot:1},function(err,count){
        total=count;
    });
    var query=movie.find({movieHot:1}).sort({_id:-1}).skip(skip).limit(req.body.pageSize);
    query.exec(function(err,getMovieAll){
        if(getMovieAll.length==0){
            return res.json({status:1,message:"暂无数据"});
        }else{
            return res.json({status:0,message:"查询成功",data:getMovieAll,total:total,kip:skip});
        }
    });
});
module.exports = router;
