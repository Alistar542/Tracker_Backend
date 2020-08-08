const router = require("express").Router();
const connection = require("../../connection/connection");
const dateUtils = require("../utils/dateutils");
const textUtils = require("../utils/textutils");
const STUDENT_QUERY = require("../constants/studentquery");

const convertToLowerCase = textUtils.convertToLowerCase;
const convertToMySqlDate = dateUtils.convertToMySqlDate;
const convertToMySqlDateTime = dateUtils.convertToMySqlDateTime;

router.route("/add").post((req, res) => {
  let studentQueryPrefix = STUDENT_QUERY.ADD_STUDENT_QUERY;
  let studentQueryInsertValues = [];
  studentQueryInsertValues.push(convertToLowerCase(req.body.firstName));
  studentQueryInsertValues.push(convertToLowerCase(req.body.middleName));
  studentQueryInsertValues.push(convertToLowerCase(req.body.lastName));
  studentQueryInsertValues.push(req.body.email);
  studentQueryInsertValues.push(req.body.phoneNumber);
  studentQueryInsertValues.push(convertToMySqlDateTime(req.body.dateOfBirth));
  studentQueryInsertValues.push(req.body.gender);
  studentQueryInsertValues.push(req.body.maritalStatus);
  studentQueryInsertValues.push(req.body.courseInterested);
  studentQueryInsertValues.push(convertToMySqlDateTime(req.body.followUpDate));
  studentQueryInsertValues.push(req.body.status);
  studentQueryInsertValues.push(req.body.priority);
  studentQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );
  studentQueryInsertValues.push("ADMIN");
  studentQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );

  let englishExamQueryPrefix = STUDENT_QUERY.ADD_ENGLISH_EXAM_QUERY;
  let englishExamQueryInsertValues = [];
  englishExamQueryInsertValues[0] = "studentId";
  englishExamQueryInsertValues.push(req.body.englishExamType);
  englishExamQueryInsertValues.push(convertToMySqlDateTime(req.body.examDate));
  englishExamQueryInsertValues.push(req.body.overall);
  englishExamQueryInsertValues.push(req.body.listening);
  englishExamQueryInsertValues.push(req.body.reading);
  englishExamQueryInsertValues.push(req.body.writing);
  englishExamQueryInsertValues.push(req.body.speaking);

  let educationQueryPrefix = STUDENT_QUERY.ADD_EDUCATION_QUERY;
  let educationQueryInsertValues = [];
  educationQueryInsertValues[0] = "studentId";
  educationQueryInsertValues.push(req.body.countryOfEducation);
  educationQueryInsertValues.push(req.body.highestLevelOfEducation);
  educationQueryInsertValues.push(req.body.gradingScheme);
  educationQueryInsertValues.push(req.body.gradeAverage);
  educationQueryInsertValues.push(
    convertToMySqlDateTime(req.body.graduatedYear)
  );

  let workExperienceQueryPrefix = STUDENT_QUERY.ADD_WORK_EXPERIENCE_QUERY;
  let workExperienceQueryInsertValues = [];
  workExperienceQueryInsertValues[0] = "studentId";
  workExperienceQueryInsertValues.push(req.body.companyName);
  workExperienceQueryInsertValues.push(req.body.position);
  workExperienceQueryInsertValues.push(
    convertToMySqlDateTime(req.body.endDate)
  );
  workExperienceQueryInsertValues.push(
    convertToMySqlDateTime(req.body.startDate)
  );
  workExperienceQueryInsertValues.push(req.body.workAddress);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }

    connection.query(
      studentQueryPrefix,
      studentQueryInsertValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO STUDENT : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }
        englishExamQueryInsertValues[0] = rows.insertId;
        connection.query(
          englishExamQueryPrefix,
          englishExamQueryInsertValues,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO ENGLISHEXAM : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
          }
        );
        educationQueryInsertValues[0] = rows.insertId;
        connection.query(
          educationQueryPrefix,
          educationQueryInsertValues,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO EDUCATION : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
            return res.json(rows);
          }
        );
      }
    );
  });
});

router.route("/update/:id").post((req, res) => {
  console.log("Update Id : : " + req.params.id);
  let queryPrefix = STUDENT_QUERY.UPDATE_STUDENT_QUERY;
  let queryUpdateValues = [];

  queryUpdateValues.push(convertToLowerCase(req.body.firstName));
  queryUpdateValues.push(convertToLowerCase(req.body.middleName));
  queryUpdateValues.push(convertToLowerCase(req.body.lastName));
  queryUpdateValues.push(req.body.email);
  queryUpdateValues.push(req.body.phoneNumber);
  queryUpdateValues.push(convertToMySqlDateTime(req.body.dateOfBirth));
  queryUpdateValues.push(req.body.gender);
  queryUpdateValues.push(req.body.maritalStatus);
  queryUpdateValues.push(req.body.courseInterested);
  queryUpdateValues.push(convertToMySqlDateTime(req.body.followUpDate));
  queryUpdateValues.push(req.body.priority);
  queryUpdateValues.push(req.body.status);
  queryUpdateValues.push("ADMIN");
  queryUpdateValues.push(convertToMySqlDateTime(new Date().toISOString()));
  queryUpdateValues.push(req.params.id);

  connection.query(queryPrefix, queryUpdateValues, (err, rows) => {
    err ? console.log("ERROR CONNECTING TO STUDENT : " + err) : res.json(rows);
  });
});

router.route("/getstudent").post((req, res) => {
  let queryPrefix = STUDENT_QUERY.FIND_STUDENT_QUERY;
  let queryConditions = "";
  let queryConditionValues = [];

  if (req.body.followUpDate) {
    queryConditions = queryConditions + " AND DATE(followUpDate)= ?";
    queryConditionValues.push(convertToMySqlDate(req.body.followUpDate));
  }

  if (req.body.firstName) {
    let firstName = req.body.firstName ? req.body.firstName.toLowerCase() : "";
    queryConditions = queryConditions + " AND firstName= ?";
    queryConditionValues.push(firstName);
  }

  if (req.body.status) {
    queryConditions = queryConditions + " AND status= ?";
    queryConditionValues.push(req.body.status);
  }

  if (req.body.phoneNumber) {
    queryConditions = queryConditions + " AND phoneNumber= ?";
    queryConditionValues.push(req.body.phoneNumber);
  }

  if (req.body.priority) {
    queryConditions = queryConditions + " AND priority= ?";
    queryConditionValues.push(req.body.priority);
  }

  let finalCondition = queryPrefix + queryConditions;

  connection.query(finalCondition, queryConditionValues, (err, rows) => {
    err ? console.log("ERROR CONNECTING TO STUDENT : " + err) : res.json(rows);
  });
});

module.exports = router;
