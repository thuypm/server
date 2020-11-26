const User = require('../../models/user');
const bcrypt =require('bcrypt');
var fs = require('fs');

exports.Resister = async(data)=>{
    const username = await User.findOne({ username : data.username});
    
    if(username) return {
        message: 'username đã tồn tại. Vui lòng sử dụng username khác!',
        content: null
    }

    // hash password by bcrypt

    const salt =  await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(data.password, salt);

    // save new user

    const newUser = await User.create({
        username : data.username,
        password : hashedPass,
    });
    // console.log("===== new user========", newUser);
        // fs.mkdir('./public/user/'+ newRoom._id,function(err){
        //        if (err) {
        //           return console.error(err);
        //           }
    
        //         });
        fs.copyFile('./public/user/unknown.jpg', './public/user/' + newUser.username + '.jpg' , (err)=>{
              if(err)
                  throw err;
              }); 
    return{
        message : 'Đăng kí thành công!',
        content : newUser
    }


}
