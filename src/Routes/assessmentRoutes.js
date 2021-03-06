const { Router } = require("express");
const db = require("../db/database");
const request = require("request");
// const itexmo = require("itexmo")({ apiCode: "TR-MEHMA790279_XE2L5" });

const router = Router();

router.post("/assessment/:user_id", async (req, res) => {
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

  try {
    await db
      .promise()
      .query(
        `INSERT INTO assessment_form(userId, firstName, lastName, studentNumber, phoneNumber, userdescribe, userPresentIssues, userProblemIssue, userReceivedCounseling, userIfYes, userDuration, userPreviousCounseling) VALUES('${user_id}', '${firstName}', '${lastName}', '${student_number}', '${phone_number}', '${describe}', '${presentIssues}', '${problemIssue}', '${radio}', '${when}', '${duration}', '${previousCounseling}') `
      );

    const options = {
      method: "POST",
      url: "https://www.itexmo.com/php_api/api.php",
      headers: {},
      formData: {
        1: "09167517273",
        2: `MeHMApp User ${student_number} with User ID ${user_id} submit a Assessment Form.\nUser Phone Number:${phone_number}`,
        3: "TR-MEHMA790279_XE2L5",
        passwd: "8$e@v(yn!$"
      }
    };

    request(options, (error, response) => {
      if (error) throw new Error(error);
      console.log(response.body);
    });

    // itexmo
    //   .send({
    //     to: "09167517273",
    //     body: `MeHMApp-user ${student_number} with User ID ${user_id} submit a Assessment Form.\nUser Phone Number:${phone_number}`
    //   })
    //   .then(message => console.log(message));

    return res
      .status(200)
      .send("Assessment Form Submitted to Guidance Counselor");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
