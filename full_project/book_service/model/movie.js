var mongoose =require('../common/db');

var movie=new mongoose.Schema({
    movieName:String,//电影的名字
    movieImg:String,//电影的图片
    movieVideo:String,//播放的频道
    movieDownload:String,//下载的地址
    movieTime:String,//电影时长
    movieDate:String,//上映时间
    movieNumSuppose:0,//电影支持数
    movieNumDownload:0,//电影下载数
    movieMainPage:Boolean,//是否是轮播图
    movieHot:Boolean,//是否是热播电影
    movieContent:String, //电影描述
    movieAhthor:String,//电影作者
    movieRole:String,//电影角色
    movieScore:String,//评分
    movieType:Number, //判断类型 1.电影 2.连续剧 3.综艺 4.动漫 5.资讯 6.专题
    modified:String, //更新时间
    created:String //创建时间
});

//数据库常用的操作
movie.statics.findById=function(movie_id,callBack){
    this.findOne({_id:movie_id},callBack);
};

movie.statics.findAll=function(callBack){
  this.find({},callBack);
};

var movieModel=mongoose.model('movie',movie);
module.exports=movieModel;