const STUDENT_HISTORY_QRY = require("../constants/studenthistoryquery");
const router = require("express").Router();
const connection = require("../../connection/connection");

router.route("/getstudenthistory").post((req, res) => {
  let queryPrefix = STUDENT_HISTORY_QRY.FIND_STUDENT_HISTORY;
  let queryConditionValues = [];
  queryConditionValues.push(req.body.studentId);
  console.log(req.body.studentId);
  connection.query(queryPrefix, queryConditionValues, (err, rows) => {
    if (err) console.log("ERROR CONNECTING TO STUDENT HISTORY : " + err);
    console.log(rows);
    res.json(rows);
  });
});

module.exports = router;
