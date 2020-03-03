var mongoose = require("../common/db");

//建立数据集

var mail = new mongoose.Schema({
    fromUser:String,
    toUser:String,
    title:String,
    context:String
});

//数据库常用的方法

mail.statics.findByToUserId=function(user_id,callBack){
    this.find({toUser:user_id},callBack);
};

mail.statics.findByFromUserId=function(user_id,callBack){
    this.find({fromUser:user_id},callBack);
};

var mailModel=new mongoose.model('mail',mail);
module.exports=mailModel;