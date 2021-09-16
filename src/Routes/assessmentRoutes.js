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

    
        // const email = await db.promise().query(`SELECT email FROM users WHERE id = '${user_id}' `)
    
        try {

            

            await db.promise().query(`INSERT INTO assessment_form(userId, firstName, lastName, studentNumber, phoneNumber, userdescribe, userPresentIssues, userProblemIssue, userReceivedCounseling, userIfYes, userDuration, userPreviousCounseling) VALUES('${user_id}', '${firstName}', '${lastName}','${student_number}', '${phone_number}', '${describe}', '${presentIssues}', '${problemIssue}', '${radio}', '${when}', '${duration}', '${previousCounseling}')  `)


            const options = {
                'method': 'POST',
                'url': 'https://www.itexmo.com/php_api/api.php',
                'headers': { 
                },
                formData: {
                    '1': '09167517273',
                    '2': `MeHMApp user ${student_number} submit a Assessment Form.\nUser Phone Number: ${phone_number}`,
                    '3': 'TR-MENTA766291_K9S37',
                    'passwd': '3d@2iq(431'
                }
            };

            request(options, (error, response) => {
                if(error) throw new Error(error);
                console.log(response.body);
            })

            return res.status(200).send("Assessment Form Submitted to Guidance Counselor");
        }
        catch(err) {
            res.send(err);
        }
    
        res.status(400).send('Empty Field');
    

    
})



module.exports = router;