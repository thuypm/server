const Room = require('../../models/room');

async function saveMess(id, mess)
{
    // console.log(mess);
  var kq = await  Room.findByIdAndUpdate(id, {$push: {message: mess}},{new: true, upsert: true,useFindAndModify: false});
  return kq
}
module.exports= {
    // newConversation: newConversation,
    saveMess: saveMess,
    // getMess: getMess
}