var express = require('express');
var router = express.Router();
var user=require('../model/user');
var crypto=require('crypto');
var movie=require('../model/movie');
var mail=require('../model/mail');
var comment=require('../model/comment');
const init_token='TKL02o';
//后台登录
router.post('/loginAdmin',function(req,res,next){
    if(!req.body.username){
        return res.json({status:1,message:"账号不能为空"});
    }
    if(!req.body.password){
        return res.json({status:1,message:"密码不能为空"});
    }
    user.findUserLogin(req.body.username,req.body.password,function(err,getAdmin){
        if(getAdmin.length==0){
            return res.json({status:1,message:"账号或者密码错误"});
        }else{
            if(getAdmin[0].userStop==true){
                return res.json({status:1,message:"账号已经停用"});
            }
            if(getAdmin[0].userAdmin==true){
                var token_after=getMD5Password(getAdmin[0]._id);
                req.session.token=token_after;
                return res.json({status:0,message:"登录成功",data:getAdmin,sess:req.session.user_id,token:req.session.token});
            }else{
                return res.json({status:1,message:"您不是管理员不能登录后台"});
            }

        }
    })
});


//删除电影
router.post("/movieDel",function(req,res,next){
    res.json({status:1,message:req.session.token});
    // if(!req.body.token){
    //     return res.json({status:1,message:"登录失效"});
    // }
    // if(!req.body.user_id){
    //     return res.json({status:1,message:"没有传递user_id"});
    // }
    // if(!req.body.movie_id){
    //     return res.json({status:1,message:"没有传递电影Id"});
    // }
    // if(req.body.token==getMD5Password(req.body.user_id)){
    //     user.findById(req.body.user_id,function(err,getUser){
    //         if(getUser.userAdmin==true){
    //             movie.remove({_id:req.body.movie_id},function(err,delMovie){
    //                 if(err){
    //                     return res.json({status:1,message:err});
    //                 }else{
    //                     return res.json({status:0,message:"删除成功",data:delMovie});
    //                 }
    //             })
    //         }else{
    //             return res.json({status:1,message:"您不是管理员！"});
    //         }
    //     });
    // }else{
    //     return res.json({status:1,message:"登录不对"});
    // }

});
//获取md5值
function getMD5Password(id){
    var md5=crypto.createHash('md5');
    var token_before=id+init_token;
    return md5.update(token_before).digest('hex');
}
module.exports = router;