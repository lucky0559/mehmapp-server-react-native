const { Router } = require('express');
const db = require('../db/database');
const request = require('request')

const router = Router();



router.post('/assessment/:user_id', async(req, res) => {

    const user_id = req.params.user_id;

    const {
        firstName,
        lastName,
        student_number,
        phone_number,
        presentIssues,
        describe,
        problemIssue,
        radio,
        when,
        duration,
        previousCounseling
    } = req.body;

    

    if(user_id, firstName, lastName, student_number, phone_number, presentIssues, describe,radio) {
        try {
            await db.promise().query(`INSERT INTO assessment_form(userId, firstName, lastName,studentNumber, phoneNumber, userdescribe, userPresentIssues, userProblemIssue, userReceivedCounseling, userIfYes, userDuration, userPreviousCounseling) VALUES('${user_id}', '${firstName}', '${lastName}','${student_number}', '${phone_number}', '${describe}', '${presentIssues}', '${problemIssue}', '${radio}', '${when}', '${duration}', '${previousCounseling}')  `)

            const email = await db.promise().query(`SELECT email FROM users WHERE id = '${user_id}' `)

            // var options = {
            //     'method': 'POST',
            //     'url': 'https://www.itexmo.com/php_api/api.php',
            //     'headers': {

            //     },
            //     formData: {
            //         '1': '09955183839',
            //         '2': `MeHMApp user ${student_number} submit a Assessment Form.\nUser Phone Number: ${phone_number}\nEmail: ${email} `,
            //         '3': 'TR-MEHMA183839_58WCC',
            //         'passwd': 'vge6a$x[mn'
            //     }
            // };

            request(options, (error, response) => {
                if(error) throw new Error(error);
                console.log(response.body);
            })

            res.status(201).send("Assesment Form Submitted to Guidance Counselor" + email[0]);
        }
        catch(err) {
            res.send(err);
        }
    }
    else {
        res.status(400).send('Empty Field');
    }

    
})



module.exports = router;