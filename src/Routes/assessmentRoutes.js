const { Router } = require('express');
const db = require('../db/database');
const request = require('request')

const router = Router();



router.post('/assessment/:user_id', async(req, res) => {

    const user_id = req.params.user_id;

    const {
        fullname,
        student_number,
        phone_number,
        user_describe,
        user_present_issues,
        user_problem_issue,
        user_received_counseling,
        user_if_yes,
        user_duration,
        user_previous_counseling
    } = req.body;

    

    if(user_id, fullname, student_number, phone_number, user_describe, user_present_issues, user_problem_issue, user_received_counseling, user_if_yes, user_duration, user_previous_counseling) {
        try {
            await db.promise().query(`INSERT INTO assessment_form(userId, fullname, studentNumber, phoneNumber, userdescribe, userPresentIssues, userProblemIssue, userReceivedCounseling, userIfYes, userDuration, userPreviousCounseling) VALUES('${user_id}', '${fullname}', '${student_number}', '${phone_number}', '${user_describe}', '${user_present_issues}', '${user_problem_issue}', '${user_received_counseling}', '${user_if_yes}', '${user_duration}', '${user_previous_counseling}')  `)

            var options = {
                'method': 'POST',
                'url': 'https://www.itexmo.com/php_api/api.php',
                'headers': {

                },
                formData: {
                    '1': '09167517273',
                    '2': `MeHMApp user ${student_number} submit a Assessment Form.\nUser Phone Number: ${phone_number}`,
                    '3': 'TR-MEHMA375926_FEC4G',
                    'passwd': 'gs9lky!41e'
                }
            };

            request(options, (error, response) => {
                if(error) throw new Error(error);
                console.log(response.body);
            })

            res.status(201).send("Assesment Form Submitted to Guidance Counselor");
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