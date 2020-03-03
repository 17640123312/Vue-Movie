var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var sd = require('silly-datetime');
var time=sd.format(new Date(), 'YYYY-MM-DD');
var upload = multer({dest: 'upload_tmp/', filename:function(req,file,cb){
    cb(null,file.fieldname +' - '+ Date. now())
}});

//上传文件
router.post('/', upload.any(), function(req, res, next) {
    console.log(req.files[0]);  // 上传的文件信息
    var tmp_file=req.files[0].filename+req.files[0].originalname.substr(req.files[0].originalname.indexOf("."));
    var des_file = "../public/images/";
    if(!fs.existsSync("../public/images/"+time)){
        fs.mkdirSync("../public/images/"+time);
        des_file=des_file+time+'/'+tmp_file;
    }else{
        des_file=des_file+time+'/'+tmp_file;
    }
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:time+'/'+tmp_file
                };
                console.log( response );
                res.end( JSON.stringify( response ) );
            }
        });
    });
});
//删除文件
router.post("/del",function(req,res,next){
    if(!req.body.url){
        return res.json({status:1,message:"文件的路径必须存在"})
    }
    fs.unlink("../public/images/"+req.body.url,(err) => {
        if (err) throw err;
        console.log('文件已删除');
    });
    res.json({status:0,message:"删除成功"});
});

module.exports = router;