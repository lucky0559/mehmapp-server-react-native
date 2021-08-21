// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const {authorization} = req.headers;

//     if(!authorization) {
//         return res.status(401).send({error: 'You must Login First -lucky'});
//     }

//     const token = authorization.replace('Bearer ', '');
//     jwt.verify(token, 'MY_MEHMAPP_KEY', async(err, payload) => {
//         if(err) {
//             return res.status(401).send({error: 'You must login first -lucky'});
//         }

//         const {userId} = payload;

//         const user = await User.findById(userId);

//         req.user = user;
//         next();
//     })
// }