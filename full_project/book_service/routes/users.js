var express = require('express');
var router = express.Router();
var user=require('../model/user');
var crypto=require('crypto');
var movie=require('../model/movie');
var mail=require('../model/mail');
var comment=require('../model/comment');
var cors = require('cors')
const init_token='TKL02o';

//用户登录接口
router.post('/login',function(req, res, next){
  if(!req.body.username){
    return res.json({status:1,message:"用户名不能为空！"});
  }
  if(!req.body.password){
    return res.json({status:1,message:"密码不能为空！"});
  }
  user.findUserLogin(req.body.username,req.body.password,function(err,userSave){
    if(userSave.length!=0){
      var token_after=getMD5Password(userSave[0]._id);
      return res.json({status:0,data:{token:token_after,user:userSave}});
    }else{
      return res.json({status:1,message:"用户名或者密码错误！"});
    }
  })
});
//用户注册接口
router.post('/register',function(req, res, next){
  //注册逻辑：当用户发送的数据访问该路由时，会对数据的内容进行检查，
  // 如果数据内容没有问题，则需要在数据库中查询该用户名是否已注册。
  // 如果存在已注册的情况，则返回错误；
  // 如果没有注册且数据通过了审核，则需要将数据保存在数据库中，并回复JSON串提示注册成功。
  if(!req.body.username){
    return res.json({status:1,message:"用户名为空！"});
  }
  if(!req.body.password){
    return res.json({status:1,message:"密码不能为空！"});
  }
  if(!req.body.userMail){
    return res.json({status:1,message:"邮箱不能为空！"});
  }
  if(!req.body.userPhone){
    return res.json({status:1,message:"手机号不能为空！"});
  }
  user.findByUsername(req.body.username,function(err,userSave){
    if(userSave.length!=0){
      return res.json({status:1,message:"用户已注册"});
    }else{
      var registerUser=new user({
        username:req.body.username,
        password:req.body.password,
        userMail:req.body.userMail,
        userPhone:req.body.userPhone,
        userAdmin: req.body.userAdmin ? req.body.userAdmin : 0 ,
        userPower: 0,
        userStop:0
      });
      registerUser.save(function(){
        return res.json({status:0,message:"注册成功"});
      })
    }
  })
});
//用户提交评论
router.post('/postComment',function(req, res, next){
  if(!req.body.username){
    var username='匿名用户';
  }
  if(!req.body.movie_id){
    return res.json({status:1,message:'电影的id不能为空！'})
  }
  if(!req.body.context){
    return  res.json({status:1,message:'电影的评论不能为空'});
  }
  //建立一个新的数据集
  var saveComment=new comment({
    movie_id:req.body.movie_id,
    username:req.body.username ? req.body.username : username,
    context:req.body.context,
    check:0
  });

  //保存数据集
  saveComment.save(function(err){
    if(err){
      return res.json({status:1,message:err});
    }else{
      return  res.json({status:0,message:'评论成功！'});
    }
  });

});
//用户点赞
router.post('/support',function(req, res, next){
  if(!req.body.movie_id){
    return res.json({status:1,message:'电影id必须的传递!'});
  }
  movie.findById(req.body.movie_id,function(err,supportMovie){
    movie.update({_id:req.body.movie_id},{movieNumSuppose:parseInt(supportMovie.movieNumSuppose)+1},function(err){
      if(err){
        return res.json({status:1,message:"点赞失败!"});
      }else{
        return res.json({status:0,message:"点赞成功!"});
      }
    })
  })
});
//更新电影下载数
router.post('/download',function(req,res,next){
  if(!req.body.movie_id){
    return res.json({status:1,message:"必须传递电影ID"})
  }
  movie.findById(req.body.movie_id,function(err,downloadMovie){
    movie.update({_id:req.body.movie_id},{movieNumDownload: parseInt(downloadMovie.movieNumDownload)+1},function(err){
      if(err){
        return res.json({status:1,message:err});
      }else{
        return res.json({status:0,message:"电影下载成功"});
      }
    })
  })
});
//用户找回密码
router.post('/findPassword',function(req, res, next){
  // /users/findPassword用于找回用户的密码，
  // 这里需要输入mail、phone和username 3个字段来确定用户的身份，并且允许修改密码。
  // 该功能同样用于登录之后的密码修改功能，通过验证用户身份和原来使用的老密码，也可以由用户自己进行密码的修改。
  //判断传递过来的参数是否存在重置密码，如果不存在需要使用邮箱和手机号，姓名进行验证
  if(!req.body.repassword){
    if(!req.body.userMail){
      return res.json({status:1,message:"邮箱不能为空！"});
    }
    if(!req.body.userPhone){
      return res.json({status:1,message:"手机号不能为空！"});
    }
    user.findUserPassword(req.body.username,req.body.userMail,req.body.userPhone,function(err,userFound){
      if(userFound.length!=0){
        return res.json({status:1,message:"验证成功，请修改密码",data:{username:req.body.username,userMail:req.body.userMail,userPhone:req.body.userPhone}});
      }else{
        return res.json({status:1,message:"信息错误"});
      }
    })
  }else{
    //如果存在判断，当前用户是否是登录状态
    if(req.body.token){
      //判断传递过来的user_id是否存在
      if(!req.body.user_id){
        return res.json({status:1,message:"用户登录错误！"});
      }
      //判断传递过来的密码是否存在
      if(!req.body.password){
        return res.json({status:1,message:"用户密码错误！"});
      }
      if(req.body.token==getMD5Password(req.body.user_id)){
        user.findOne({_id:req.body.user_id,password:req.body.password},function(err,checkUser){
          if(checkUser){
            user.update({_id:req.body.user_id},{password:req.body.repassword},function(err,userUpdate){
              if(err){
                return res.json({status:1,message:"更改错误",data:err});
              }else{
                return res.json({status:0,message:"更改成功",data:userUpdate});
              }
            })
          }else{
            return res.json({status:1,message:"用户的老密码错误"});
          }
        })
      }else{
        return res.json({status:1,message:"用户登录错误"});
      }
    }else{
      user.findUserPassword(req.body.username,req.body.userMail,req.body.userPhone,function(err,userFound){
        if(userFound.length!=0){
          user.update({_id:userFound[0]._id},{password:req.body.repassword},function(err,userUpdate){
            if(err){
              return res.json({status:1,message:"更改错误",data:err});
            }else{
              return res.json({status:0,message:"更改成功",data:userUpdate});
            }
          })
        }else{
          return res.json({status:1,message:"信息错误"});
        }
      })
    }
  }
});
//用户发送站内信
router.post('/sendEmail',function(req, res, next){
  if(!req.body.token){
    return res.json({status:1,message:"用户登录状态失效！"});
  }
  if(!req.body.user_id){
    return res.json({status:1,message:"user_id不存在！"});
  }
  if(!req.body.toUserName){
    return res.json({status:1,message:"没有选择发送的用户！"});
  }
  if(!req.body.title){
    return res.json({status:1,message:"标题不能为空！"});
  }
  if(!req.body.context){
    return res.json({status:1,message:"内容不能为空!"});
  }
  if(req.body.token==getMD5Password(req.body.user_id)){
    //存在数据库之前要获取需要发动用户的user_id
    user.findByUsername(req.body.toUserName,function(err,toUser){
      if(toUser.length!=0){
        var newMail= new mail({
          fromUser:req.body.user_id,
          toUser:toUser[0]._id,
          title:req.body.title,
          context:req.body.context
        });
        newMail.save(function(err){
          if(err){
            return res.json({status:1,message:err});
          }else{
            return  res.json({status:0,message:"发送成功!"});
          }
        })
      }else{
        return res.json({status:1,message:"选择的用户不存在!"});
      }
    })
  }else{
    return res.json({status:1,message:"用户登录错误！"});
  }
});
//用户接受站内信
router.post("showEmail",function(req,res,next){
  //用户显示站内信，其中receive参数值为1时是发送的站内信，2时是收到的内容
  if(!req.body.token){
    return res.json({status:1,message:"用户登录状态失效"});
  }
  if(!req.body.user_id){
    return res.json({status:1,message:"user_id不存在"});
  }
  if(!req.body.receive){
    return res.json({status:1,message:"接受参数失败"});
  }
  if(req.body.token==getMD5Password(req.body.user_id)){
    //发送的站内信
    if(req.body.receiver==1){
      mail.findByFromUserId(req.body.user_id,function(err,sendMail){
        if(err){
          return res.json({status:1,message:"发送失败"});
        }else{
          return res.json({status:0,message:sendMail});
        }
      })
    }else{
      //接受的站内信
      mail.findByToUserId(req.body.user_id,function(err,showMail){
        if(err){
          return res.json({status:1,message:"接受失败"});
        }else{
          return res.json({status:0,message:showMail});
        }
      })
    }
  }else{
    return  res.json({status:1,message:"用户登录错误"});
  }
});
//获取md5值
function getMD5Password(id){
  var md5=crypto.createHash('md5');
  var token_before=id+init_token;
  return md5.update(token_before).digest('hex');
}

module.exports = router;
