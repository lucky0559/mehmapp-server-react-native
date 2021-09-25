const express = require('express');
const db = require('../db/database');
const bcryptjs = require('bcryptjs')
const saltRounds = 10;
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const all_refresh_token = '1//04tWqy1JCtxmbCgYIARAAGAQSNwF-L9IrSuSQi2eSMBoXqwZdNy0FFfJltfvbeHOv5oABukbWompvljHAu3eL0ASnbdar1xXC5M0'



const router = express.Router();

router.post('/signup', async(req, res) => {
    const {firstName, lastName, email, phoneNumber, studentNumber} = req.body;

    const password = req.body.password;
    const password_hashed = await bcryptjs.hash(password, saltRounds);
    const is_verified = false;

    const email_token = crypto.randomBytes(64).toString('hex')

    const check = await db.promise().query(`SELECT * FROM users WHERE email = '${email}' `);

    if(check[0].length > 0) {
        return res.status(422).send({message:'This email is already used'});
    }


   
 
    try {

        await db.promise().query(`INSERT INTO users(firstName, lastName, email, password, phoneNumber, studentNumber, is_verified, email_token) VALUES('${firstName}', '${lastName}', '${email}', '${password_hashed}', '${phoneNumber}', '${studentNumber}', '${is_verified}', '${email_token}') `)


        const user = await db.promise().query(`SELECT * FROM users WHERE email = '${email}' `)

        console.log(user[0][0])

// verify email
        
        const CLIENT_ID = '990361057332-3h6cpoksgrn0ed6785jlbd8p3ag6sskl.apps.googleusercontent.com'
        const CLIENT_SECRET = 'gdYm5p6Q7bOJQqqE0OkmH-JH'
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
        const REFRESH_TOKEN = all_refresh_token

        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        sendMail = async() => {
            try {
                const accessToken = await oAuth2Client.getAccessToken();
                
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'luckyangelo.rabosa@cvsu.edu.ph',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: 'MeHMApp <mehmapp@cvsu.edu.ph>',
                    to: `${email}`,
                    subject: 'MeHMApp Verify Your Email',
                    text: `
                        Hello ${firstName}!
                        Please click the link below to verify your email
                        http://${req.headers.host}/verify?token=${email_token}
                    `,
                    html: `
                        <h1>Hello ${firstName}!</h1>
                        <p>Please click the link below to verify your email.</p>
                        <p>http://${req.headers.host}/verify?token=${email_token}</p>
                        <button><h2><a href="http://${req.headers.host}/verify?token=${email_token}">Verify Email</a></h2></button>
                    `
                }

                const result = await transport.sendMail(mailOptions)
                return result


            }
            catch(error) {
                return error
            }
        }

        sendMail().then(result => console.log('Email is Sent', result))
        .catch(error => console.log(error.message))

        res.status(200).send({message:'Account Created! Please verify your email'})

        
    }
    catch(err) {
        res.status(422).send(err.message);
       
    }
});



//verify email 

router.get('/verify', async(req, res, next) => {
    try {
        const user = await db.promise().query(`SELECT * FROM users WHERE email_token = '${req.query.token}' `)
        if(!user[0][0]) {
            return res.send("Error")
        }
        await db.promise().query(`UPDATE users SET is_verified = '${true}', email_token = '${''}' WHERE email_token = '${req.query.token}' `)
        
        res.status(200).send('Verified!')

    }
    catch(err) {
        return next(err);
    }
})




router.post('/signin', async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({message: 'Must provide email and password'})
    }

    const check = await db.promise().query(`SELECT * FROM users WHERE email = '${email}' `)

    

    if(check[0].length <= 0 ) {
        return res.status(400).send({message:'Unregistered Email'})
    }
    

    



    const compare = await bcryptjs.compare(password, check[0][0].password);

    if(compare) {
        const if_verified = await db.promise().query(`SELECT * FROM users WHERE email = '${email}' && is_verified = '${false}' `)


        if(if_verified[0].length > 0) {
            return res.status(400).send({message:'Please Verify Your Email First'})
        }

        const user = await db.promise().query(`SELECT * FROM users WHERE email = '${email}' `)

        const token = jwt.sign({userId: if_verified.id}, 'MY_MEHMAPP_KEY')

        res.status(200).send({token, email, firstName: user[0][0].firstName, lastName: user[0][0].lastName, user_id: user[0][0].id, student_number: user[0][0].studentNumber, phone_number: user[0][0].phoneNumber})
    }
    else {
        res.status(400).send({message:"Invalid Email or Password"})
    }


   
})


router.post('/sendConfirmationToken', async(req, res) => {
    try{

    const email = req.body.email
    
    const password_token = crypto.randomInt(0, 1000000)

    const verificationCode = password_token.toString().padStart(6, "0");

    const check = await db.promise().query(` SELECT * FROM users WHERE email = '${email}' `)

    if(check[0].length === 0) {
        return res.status(400).send({msg: 'Not Registered Email'})
    }


    await db.promise().query(` UPDATE users SET password_token = '${verificationCode}' WHERE email = '${email}' `)

    const CLIENT_ID = '990361057332-3h6cpoksgrn0ed6785jlbd8p3ag6sskl.apps.googleusercontent.com'
        const CLIENT_SECRET = 'gdYm5p6Q7bOJQqqE0OkmH-JH'
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
        const REFRESH_TOKEN = all_refresh_token

        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        sendMail = async() => {
            try {
                const accessToken = await oAuth2Client.getAccessToken();
                
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'luckyangelo.rabosa@cvsu.edu.ph',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: 'MeHMApp <mehmapp@cvsu.edu.ph>',
                    to: `${email}`,
                    subject: 'MeHMApp Reset Password',
                    text: `
                        This is your Confirmation Code ${verificationCode}
                    `,
                    html: `
                        <h2>Your Confirmation Code ${verificationCode}</h2>
                    `
                }

                const result = await transport.sendMail(mailOptions)
                return result

            }
            catch(error) {
                return error
            }
        }

        sendMail().then(result => console.log('Email is Sent', result))
        .catch(error => console.log(error.message))
    }
    catch(err) {
        res.status(400).send({msg: 'Error'})
    }

})


router.put('/changePassword',async(req, res) => {

    try {
        const {email, new_password, password_token} = req.body

        const new_hash = await bcryptjs.hash(new_password, saltRounds)

        const check = await db.promise().query(` SELECT * FROM users WHERE email = '${email}' && password_token = '${password_token}' `)

        if(check[0].length === 0) {
            return res.status(400).send({msg: 'Invalid Confirmation Code'})
        }

        await db.promise().query(` UPDATE users SET password = '${new_hash}', password_token = '${''}' WHERE email = '${email}' && password_token = '${password_token}' `)

        res.status(400).send({msg: 'Password Reset Successfully'})
    }
    catch(err) {
        res.status(400).send({msg: 'Invalid Confirmation Code'})
    }
    

})


module.exports = router;