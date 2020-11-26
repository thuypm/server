const registerService = require('./register.service');


exports.Resgister = async(req, res) =>{

	// console.log(req.body);
    try {
 
        const User = await registerService.Resister(req.body);
        res.status(200).json(User);
    } catch (error) {
        res.status(400).json(error);
    }
}