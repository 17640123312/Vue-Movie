var  mongoose=require('mongoose');
var url='mongodb://localhost/movieServer';
//连接数据库
mongoose.connect(url);
module.exports=mongoose;