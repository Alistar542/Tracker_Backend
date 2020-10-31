const router = require("express").Router();
const connection = require("../../connection/connection");
const dateUtils = require("../utils/dateutils");
const textUtils = require("../utils/textutils");
const STUDENT_QUERY = require("../constants/studentquery");
const COMMON_CONSTANTS = require("../constants/common");
const STUDENT_HISTORY_QUERY = require("../constants/studenthistoryquery");
var HashMap = require("hashmap");
const convertToMySqlDate = dateUtils.convertToMySqlDate;
const convertToMySqlDateTime = dateUtils.convertToMySqlDateTime;

router.route("/add").post((req, res) => {
  let {
    studentQueryPrefix,
    studentQueryInsertValues,
  } = populateStudentPersonalDetails(req);

  let {
    englishExamQueryInsertValues,
    englishExamQueryPrefix,
  } = populateEnglistExamDetails(req);

  let {
    educationQueryInsertValues,
    educationQueryPrefix,
  } = populateEducationDetails(req);

  let {
    workExperienceQueryInsertValues,
    workExperienceQueryPrefix,
  } = populateWorkExperienceDetails(req);

  let { officeDataQueryValues, officeDataQueryPrefix } = populateOfficeData(
    req
  );

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
          }
        );
        workExperienceQueryInsertValues[0] = rows.insertId;
        connection.query(
          workExperienceQueryPrefix,
          workExperienceQueryInsertValues,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO WORKEXPERIENCE : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
          }
        );

        officeDataQueryValues[0] = rows.insertId;
        connection.query(
          officeDataQueryPrefix,
          officeDataQueryValues,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO OFFICEDATA : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
          }
        );

        if (req.body.requestedCourseDetails) {
          populateInterestedCourses(rows, req);
        }

        populateEducationalDetails(rows.insertId, req);

        populateToDoFollowUpDetails(
          req,
          req.body.followUpRemarks,
          req.body.toDoRemarks,
          rows.insertId,
          "Prospectus"
        );
        saveStudentHistory(req, rows.insertId, "I", "New Entry");
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
          return res.json(rows);
        });
      }
    );
  });
});

router.route("/update/:id").post((req, res) => {
  console.log("Update Id : " + req.params.id);
  let queryPrefix = STUDENT_QUERY.UPDATE_STUDENT_QUERY;
  let queryUpdateValues = [];

  queryUpdateValues.push(req.body.firstName);
  queryUpdateValues.push(req.body.middleName);
  queryUpdateValues.push(req.body.lastName);
  queryUpdateValues.push(req.body.email);
  queryUpdateValues.push(req.body.phoneNumber);
  queryUpdateValues.push(req.body.additionalPhNo);
  queryUpdateValues.push(convertToMySqlDateTime(req.body.dateOfBirth));
  queryUpdateValues.push(req.body.gender);
  queryUpdateValues.push(req.body.maritalStatus);
  queryUpdateValues.push(req.body.courseInterested);
  queryUpdateValues.push(convertToMySqlDateTime(req.body.followUpDate));
  queryUpdateValues.push(req.body.priority);
  queryUpdateValues.push(req.body.status);
  queryUpdateValues.push(req.user.userName);
  queryUpdateValues.push(convertToMySqlDateTime(new Date().toISOString()));
  queryUpdateValues.push(req.body.currentState);
  queryUpdateValues.push(req.body.studentRemarks);
  queryUpdateValues.push(req.body.remarksStatus);
  queryUpdateValues.push(req.params.id);

  let englishExamQueryPrefix = STUDENT_QUERY.UPDATE_ENGLISH_EXAM_QUERY;
  let englishExamQueryInsertValues = [];
  englishExamQueryInsertValues[0] = req.params.id;
  englishExamQueryInsertValues.push(req.body.englishExamType);
  englishExamQueryInsertValues.push(convertToMySqlDateTime(req.body.examDate));
  englishExamQueryInsertValues.push(req.body.overall);
  englishExamQueryInsertValues.push(req.body.listening);
  englishExamQueryInsertValues.push(req.body.reading);
  englishExamQueryInsertValues.push(req.body.writing);
  englishExamQueryInsertValues.push(req.body.speaking);
  englishExamQueryInsertValues.push(req.params.id);

  let educationQueryPrefix = STUDENT_QUERY.UPDATE_EDUCATION_QUERY;
  let educationQueryInsertValues = [];
  educationQueryInsertValues[0] = req.params.id;
  educationQueryInsertValues.push(req.body.countryOfEducation);
  educationQueryInsertValues.push(req.body.highestLevelOfEducation);
  educationQueryInsertValues.push(req.body.gradingScheme);
  educationQueryInsertValues.push(req.body.gradeAverage);
  educationQueryInsertValues.push(
    convertToMySqlDateTime(req.body.graduatedYear)
  );
  educationQueryInsertValues.push(req.body.eduCourseType);
  educationQueryInsertValues.push(req.params.id);

  let workExperienceQueryPrefix = STUDENT_QUERY.UPDATE_WORK_EXPERIENCE_QUERY;
  let workExperienceQueryInsertValues = [];
  workExperienceQueryInsertValues[0] = req.params.id;
  workExperienceQueryInsertValues.push(req.body.companyName);
  workExperienceQueryInsertValues.push(req.body.position);
  workExperienceQueryInsertValues.push(
    convertToMySqlDateTime(req.body.endDate)
  );
  workExperienceQueryInsertValues.push(
    convertToMySqlDateTime(req.body.startDate)
  );
  workExperienceQueryInsertValues.push(req.body.workAddress);
  workExperienceQueryInsertValues.push(req.params.id);

  let officeDataQueryPrefix = STUDENT_QUERY.UPDATE_OFFICE_DATA_QUERY;
  let officeDataQueryValues = [];
  officeDataQueryValues[0] = req.params.id;
  officeDataQueryValues.push(req.body.source);
  officeDataQueryValues.push(req.body.wayOfContact);
  officeDataQueryValues.push(req.body.counselor);
  officeDataQueryValues.push(req.body.priority);
  officeDataQueryValues.push(convertToMySqlDateTime(req.body.dateOfRequest));
  officeDataQueryValues.push(req.params.id);
  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(queryPrefix, queryUpdateValues, (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO STUDENT : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
      connection.query(
        englishExamQueryPrefix,
        englishExamQueryInsertValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO STUDENT HISTORY : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
      connection.query(
        educationQueryPrefix,
        educationQueryInsertValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO Education : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
      connection.query(
        workExperienceQueryPrefix,
        workExperienceQueryInsertValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO Education : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
      saveStudentHistory(req, req.body.studentId, "U", "Prospectus Updated");
      connection.query(
        officeDataQueryPrefix,
        officeDataQueryValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO Education : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
      if (req.body.requestedCourseDetails) {
        let interestedCourseQueryPrefix =
          STUDENT_QUERY.DELETE_INTERESTED_COURSES_QUERY;
        let interestedCourseQueryValue = [];
        interestedCourseQueryValue[0] = req.params.id;
        connection.query(
          interestedCourseQueryPrefix,
          interestedCourseQueryValue,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO INTERESTED COURSES : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
          }
        );
        for (let i = 0; i < req.body.requestedCourseDetails.length; i++) {
          let interestedCourseQuery =
            STUDENT_QUERY.INSERT_INTERESTED_COURSES_QUERY;
          let interestedCourseQueryValues = [];
          interestedCourseQueryValues[0] = req.params.id;
          interestedCourseQueryValues.push(i + 1);
          interestedCourseQueryValues.push(
            req.body.requestedCourseDetails[i].requestedCourse
          );
          interestedCourseQueryValues.push(
            req.body.requestedCourseDetails[i].preferredCountry
          );
          interestedCourseQueryValues.push(
            req.body.requestedCourseDetails[i].intEduLevel
          );

          connection.query(
            interestedCourseQuery,
            interestedCourseQueryValues,
            (err, rows) => {
              if (err) {
                console.log("ERROR CONNECTING TO INTERESTED COURSES : " + err);
                return connection.rollback(function () {
                  throw err;
                });
              }
            }
          );
        }
      }
      populateToDoFollowUpDetails(
        req,
        req.body.followUpRemarks,
        req.body.toDoRemarks,
        req.params.id,
        "Prospectus"
      );
      populateEducationalDetails(req.params.id, req);
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
        return res.json(rows);
      });
    });
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
    queryConditions = queryConditions + " AND STD.firstName LIKE ?";
    queryConditionValues.push(firstName + "%");
  }

  if (req.body.status) {
    queryConditions = queryConditions + " AND STD.status= ?";
    queryConditionValues.push(req.body.status);
  }

  if (req.body.phoneNumber) {
    queryConditions = queryConditions + " AND STD.phoneNumber= ?";
    queryConditionValues.push(req.body.phoneNumber);
  }

  if (req.body.priority) {
    queryConditions = queryConditions + " AND OFF.priority= ?";
    queryConditionValues.push(req.body.priority);
  }
  if (req.body.creationFromDate && req.body.creationToDate) {
    queryConditions = queryConditions + " AND STD.createdDate BETWEEN ? AND ?";
    queryConditionValues.push(
      convertToMySqlDateTime(req.body.creationFromDate)
    );
    queryConditionValues.push(convertToMySqlDateTime(req.body.creationToDate));
  } else if (req.body.creationFromDate) {
    queryConditions = queryConditions + " AND STD.createdDate > ?";
    queryConditionValues.push(
      convertToMySqlDateTime(req.body.creationFromDate)
    );
  }
  if (req.body.studentId) {
    queryConditions = queryConditions + " AND STD.studentId= ?";
    queryConditionValues.push(req.body.studentId);
  }
  if (req.body.source) {
    queryConditions = queryConditions + " AND OFF.source LIKE ?";
    queryConditionValues.push(req.body.source + "%");
  }
  queryConditions = queryConditions + " AND STD.officeCode= ?";
  queryConditionValues.push(req.user.officeCode);

  queryConditions =
    queryConditions +
    " ORDER BY COU.intrId,PRO.proposalId,REM.toDoFollowUpSerNum,EDUHIS.eduHisId,studentId DESC";
  let finalCondition = queryPrefix + queryConditions;

  connection.query(finalCondition, queryConditionValues, (err, rows) => {
    err
      ? console.log("ERROR CONNECTING TO STUDENT : " + err)
      : mapResponse(res, rows);
  });
});

function populateToDoFollowUpDetails(
  req,
  followUpRemarks,
  toDoRemarks,
  studentId,
  screenName
) {
  let serNum = 0;
  if (followUpRemarks) {
    let todoFolloupQueryPrefix = STUDENT_QUERY.DELETE_TODO_FOLLOWUP_QUERY;
    let todoFolloupQueryValues = [];
    todoFolloupQueryValues[0] = studentId;
    todoFolloupQueryValues.push("F");
    todoFolloupQueryValues.push(screenName);
    connection.query(
      todoFolloupQueryPrefix,
      todoFolloupQueryValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO TODO FOLLOWUP : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }
      }
    );
    for (let i = 0; i < followUpRemarks.length; i++) {
      let todoFolloupQueryPrefix = STUDENT_QUERY.INSERT_TODO_FOLLOWUP_QUERY;
      let todoFolloupQueryValues = [];
      todoFolloupQueryValues[0] = studentId;
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(0);
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(req.body.status);
      todoFolloupQueryValues.push(screenName);
      todoFolloupQueryValues.push(followUpRemarks[i].remark);
      todoFolloupQueryValues.push("F");
      todoFolloupQueryValues.push(req.user.userName);
      todoFolloupQueryValues.push(
        convertToMySqlDateTime(new Date().toISOString())
      );

      connection.query(
        todoFolloupQueryPrefix,
        todoFolloupQueryValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO FOLLOWUP REMARKS : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
      serNum = i + 1;
    }
  }
  if (toDoRemarks) {
    let todoFolloupQueryPrefix = STUDENT_QUERY.DELETE_TODO_FOLLOWUP_QUERY;
    let todoFolloupQueryValues = [];
    todoFolloupQueryValues[0] = studentId;
    todoFolloupQueryValues.push("T");
    todoFolloupQueryValues.push(screenName);
    connection.query(
      todoFolloupQueryPrefix,
      todoFolloupQueryValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO TODO FOLLOWUP : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }
      }
    );
    for (let i = 0; i < toDoRemarks.length; i++) {
      let todoFolloupQueryPrefix = STUDENT_QUERY.INSERT_TODO_FOLLOWUP_QUERY;
      let todoFolloupQueryValues = [];
      todoFolloupQueryValues[0] = studentId;
      todoFolloupQueryValues.push(serNum + 1);
      ++serNum;
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(0);
      todoFolloupQueryValues.push(req.body.status);
      todoFolloupQueryValues.push(screenName);
      todoFolloupQueryValues.push(toDoRemarks[i].remark);
      todoFolloupQueryValues.push("T");
      todoFolloupQueryValues.push(req.user.userName);
      todoFolloupQueryValues.push(
        convertToMySqlDateTime(new Date().toISOString())
      );

      connection.query(
        todoFolloupQueryPrefix,
        todoFolloupQueryValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO FOLLOWUP REMARKS : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
    }
  }
}

function populateInterestedCourses(rows, req) {
  let interestedCourseQueryPrefix =
    STUDENT_QUERY.DELETE_INTERESTED_COURSES_QUERY;
  let interestedCourseQueryValue = [];
  interestedCourseQueryValue[0] = rows.insertId;
  connection.query(
    interestedCourseQueryPrefix,
    interestedCourseQueryValue,
    (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO INTERESTED COURSES : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
    }
  );
  for (let i = 0; i < req.body.requestedCourseDetails.length; i++) {
    let interestedCourseQuery = STUDENT_QUERY.INSERT_INTERESTED_COURSES_QUERY;
    let interestedCourseQueryValues = [];
    interestedCourseQueryValues[0] = rows.insertId;
    interestedCourseQueryValues.push(i + 1);
    interestedCourseQueryValues.push(
      req.body.requestedCourseDetails[i].requestedCourse
    );
    interestedCourseQueryValues.push(
      req.body.requestedCourseDetails[i].preferredCountry
    );
    interestedCourseQueryValues.push(
      req.body.requestedCourseDetails[i].intEduLevel
    );

    connection.query(
      interestedCourseQuery,
      interestedCourseQueryValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO INTERESTED COURSES : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }
      }
    );
  }
}

function populateEducationalDetails(id, req) {
  let educationHistoryQuery = STUDENT_QUERY.DELETE_EDUCATION_HISTORY;
  let educationHistoryQueryValue = [];
  educationHistoryQueryValue[0] = id;
  connection.query(
    educationHistoryQuery,
    educationHistoryQueryValue,
    (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO HISTORY COURSES : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
    }
  );
  if (req.body.educationDetails) {
    for (let i = 0; i < req.body.educationDetails.length; i++) {
      let educationHistoryQuery = STUDENT_QUERY.INSERT_EDUCATION_HISTORY;
      let educationHistoryQueryValues = [];
      educationHistoryQueryValues[0] = id;
      educationHistoryQueryValues.push(i + 1);
      educationHistoryQueryValues.push(req.body.educationDetails[i].address);
      educationHistoryQueryValues.push(
        convertToMySqlDateTime(req.body.educationDetails[i].attendedFromDate)
      );
      educationHistoryQueryValues.push(
        convertToMySqlDateTime(req.body.educationDetails[i].attendedToDate)
      );
      educationHistoryQueryValues.push(
        req.body.educationDetails[i].degreeAwarded
      );
      educationHistoryQueryValues.push(
        convertToMySqlDateTime(req.body.educationDetails[i].attendedToDate)
      );
      educationHistoryQueryValues.push(
        req.body.educationDetails[i].educationLevel
      );
      educationHistoryQueryValues.push(
        req.body.educationDetails[i].institutionCountry
      );
      educationHistoryQueryValues.push(
        req.body.educationDetails[i].institutionName
      );
      educationHistoryQueryValues.push(
        req.body.educationDetails[i].primaryLanguage
      );
      educationHistoryQueryValues.push(req.body.educationDetails[i].city);
      educationHistoryQueryValues.push(req.body.educationDetails[i].province);
      educationHistoryQueryValues.push(req.body.educationDetails[i].zipCode);
      connection.query(
        educationHistoryQuery,
        educationHistoryQueryValues,
        (err, rows) => {
          if (err) {
            console.log("ERROR CONNECTING TO INTERESTED COURSES : " + err);
            return connection.rollback(function () {
              throw err;
            });
          }
        }
      );
    }
  }
}

function saveStudentHistory(req, studentId, operationId, remarks) {
  let studentHistoryQueryPrefix =
    STUDENT_HISTORY_QUERY.ADD_STUDENT_HISTORY_QUERY;
  let studentHistoryQueryInsertValues = [];
  studentHistoryQueryInsertValues[0] = studentId;
  studentHistoryQueryInsertValues.push(operationId);
  studentHistoryQueryInsertValues.push(remarks);
  studentHistoryQueryInsertValues.push(req.user.userName);
  studentHistoryQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );
  studentHistoryQueryInsertValues.push(req.user.officeCode);
  connection.query(
    studentHistoryQueryPrefix,
    studentHistoryQueryInsertValues,
    (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO STUDENT HISTORY : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
    }
  );
}

function populateOfficeData(req) {
  let officeDataQueryPrefix = STUDENT_QUERY.ADD_OFFICE_DATA_QUERY;
  let officeDataQueryValues = [];
  officeDataQueryValues[0] = "studentId";
  officeDataQueryValues.push(req.body.source);
  officeDataQueryValues.push(req.body.wayOfContact);
  officeDataQueryValues.push(req.body.counselor);
  officeDataQueryValues.push(req.body.priority);
  officeDataQueryValues.push(convertToMySqlDateTime(req.body.dateOfRequest));
  return { officeDataQueryValues, officeDataQueryPrefix };
}

function populateWorkExperienceDetails(req) {
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
  return { workExperienceQueryInsertValues, workExperienceQueryPrefix };
}

function populateEducationDetails(req) {
  let educationQueryPrefix = STUDENT_QUERY.ADD_EDUCATION_QUERY;
  let educationQueryInsertValues = [];
  educationQueryInsertValues[0] = "studentId";
  educationQueryInsertValues.push(req.body.countryOfEducation);
  educationQueryInsertValues.push(req.body.highestLevelOfEducation);
  educationQueryInsertValues.push(req.body.gradingScheme);
  educationQueryInsertValues.push(req.body.gradeAverage);
  educationQueryInsertValues.push(req.body.eduCourseType);
  educationQueryInsertValues.push(
    convertToMySqlDateTime(req.body.graduatedYear)
  );
  return { educationQueryInsertValues, educationQueryPrefix };
}

function populateEnglistExamDetails(req) {
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
  return { englishExamQueryInsertValues, englishExamQueryPrefix };
}

function populateStudentPersonalDetails(req) {
  let studentQueryPrefix = STUDENT_QUERY.ADD_STUDENT_QUERY;
  let studentQueryInsertValues = [];
  studentQueryInsertValues.push(req.body.firstName);
  studentQueryInsertValues.push(req.body.middleName);
  studentQueryInsertValues.push(req.body.lastName);
  studentQueryInsertValues.push(req.body.email);
  studentQueryInsertValues.push(req.body.phoneNumber);
  studentQueryInsertValues.push(req.body.additionalPhNo);
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
  studentQueryInsertValues.push(req.user.userName);
  studentQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );
  studentQueryInsertValues.push(req.user.officeCode);
  studentQueryInsertValues.push(req.body.currentState);
  studentQueryInsertValues.push(req.body.studentRemarks);
  studentQueryInsertValues.push(req.body.remarksStatus);
  return { studentQueryPrefix, studentQueryInsertValues };
}

function mapResponse(res, rows) {
  let hashmap = new HashMap();
  let intCourMap = new HashMap();
  let educationHisMap = new HashMap();
  let toDoFollowUpMap = new HashMap();
  let newRows = [];
  for (i = 0; i < rows.length; i++) {
    let requestedCourseDetails = [];
    let educationDetails = [];
    let row = rows[i];

    let interestedCouresesKey =
      row.studentId + row.phoneNumber + row.email + row.intrId;
    let masterKey = row.studentId + row.phoneNumber + row.email;
    let toDoFollowUpRemarksKey =
      row.studentId + row.phoneNumber + row.email + row.toDoFollowUpSerNum;
    let educationHistoryKey =
      row.studentId + row.phoneNumber + row.email + row.eduHisId;
    if (
      row.courseStartingDate ||
      row.currency ||
      row.totalTutionFees ||
      row.annualTutionFees
    ) {
      let enrolledData = {
        totalTutionFees: row.totalTutionFees,
        annualTutionFees: row.annualTutionFees,
        totalCommission: row.totalCommission,
        firstCommission: row.firstCommission,
        balanceCommission: row.balanceCommission,
        courseStartingDate: row.courseStartingDate,
        nextInvoiceDate: row.nextInvoiceDate,
        invoiceDate: row.invoiceDate,
        currency: row.currency,
        followUpDate: row.followUpDate,
        currentState: row.currentState,
        remarksStatus: row.remarksStatus,
        studentRemarks: row.enrolledStudentRemarks,
      };
      row.enrolledInfo = enrolledData;
    }
    if (row.intrId === 1 && !intCourMap.has(interestedCouresesKey)) {
      if (row.requestedCourse) {
        let element = {
          requestedCourse: row.requestedCourse,
          preferredCountry: row.preferredCountry,
          intEduLevel: row.intEduLevel,
        };
        requestedCourseDetails.push(element);
        row.requestedCourseDetails = requestedCourseDetails;
        intCourMap.set(interestedCouresesKey, row);
        hashmap.set(masterKey, row);
      }
    } else if (row.intrId > 1 && !intCourMap.has(interestedCouresesKey)) {
      if (row.requestedCourse) {
        let element = {
          requestedCourse: row.requestedCourse,
          preferredCountry: row.preferredCountry,
          intEduLevel: row.intEduLevel,
        };
        row = hashmap.get(masterKey);
        requestedCourseDetails = row.requestedCourseDetails;
        requestedCourseDetails.push(element);
        row.requestedCourseDetails = requestedCourseDetails;
        intCourMap.set(interestedCouresesKey, row);
        hashmap.set(masterKey, row);
      }
    }
    // newbegin
    if (row.eduHisId === 1 && !educationHisMap.has(educationHistoryKey)) {
      if (row.institutionName) {
        let element = {
          address: row.address,
          attendedFromDate: row.attendedFromDate,
          attendedToDate: row.attendedToDate,
          degreeAwarded: row.degreeAwarded,
          degreeAwardedOn: row.degreeAwardedOn,
          educationLevel: row.educationLevel,
          institutionCountry: row.institutionCountry,
          institutionName: row.institutionName,
          primaryLanguage: row.primaryLanguage,
          city: row.city,
          province: row.province,
          zipCode: row.zipCode,
        };
        educationDetails.push(element);
        row.educationDetails = educationDetails;
        educationHisMap.set(educationHistoryKey, row);
        hashmap.set(masterKey, row);
      }
    } else if (row.eduHisId > 1 && !educationHisMap.has(educationHistoryKey)) {
      if (row.institutionName) {
        let element = {
          address: row.address,
          attendedFromDate: row.attendedFromDate,
          attendedToDate: row.attendedToDate,
          degreeAwarded: row.degreeAwarded,
          degreeAwardedOn: row.degreeAwardedOn,
          educationLevel: row.educationLevel,
          institutionCountry: row.institutionCountry,
          institutionName: row.institutionName,
          primaryLanguage: row.primaryLanguage,
          city: row.city,
          province: row.province,
          zipCode: row.zipCode,
        };
        row = hashmap.get(masterKey);
        educationDetails = row.educationDetails;
        educationDetails.push(element);
        row.educationDetails = educationDetails;
        educationHisMap.set(educationHistoryKey, row);
        hashmap.set(masterKey, row);
      }
    }
    if (
      row.toDoFollowUpSerNum > 0 &&
      !toDoFollowUpMap.has(toDoFollowUpRemarksKey) &&
      row.screenName === "Prospectus"
    ) {
      let followUpSerNum = row.followUpSerNum;
      let toDoSerNum = row.toDoSerNum;
      let element = {
        remark: row.remarks,
        operationFlag: "",
      };
      let existingRow = hashmap.get(masterKey);
      if (followUpSerNum > 0 && followUpSerNum === 1) {
        existingRow.followUpRemarks = [];
        existingRow.followUpRemarks.push(element);
      } else if (followUpSerNum > 0) {
        existingRow = hashmap.get(masterKey);
        existingRow.followUpRemarks.push(element);
      }
      if (toDoSerNum > 0 && toDoSerNum == 1) {
        existingRow.toDoRemarks = [];
        existingRow.toDoRemarks.push(element);
      } else if (toDoSerNum > 0) {
        existingRow = hashmap.get(masterKey);
        existingRow.toDoRemarks.push(element);
      }
      toDoFollowUpMap.set(toDoFollowUpRemarksKey, existingRow);
      hashmap.set(masterKey, existingRow);
    }
  }

  let proposalHashmap = hashmap;
  let proposalIntCourMap = new HashMap();
  let proposalToDoFollowUpMap = new HashMap();

  for (i = 0; i < rows.length; i++) {
    let proposalInfo = {};
    let row = rows[i];
    let proposalKey =
      row.studentId + row.phoneNumber + row.email + row.proposalId;
    let masterKey = row.studentId + row.phoneNumber + row.email;
    let toDoFollowUpRemarksKey =
      row.studentId +
      row.phoneNumber +
      row.email +
      row.toDoFollowUpSerNum +
      row.screenName;
    if (row.proposalId === 1 && !proposalIntCourMap.has(proposalKey)) {
      if (row.appldUnvsty) {
        let element = {
          visaApplnStatus: row.visaApplnStatus,
          visaStatus: row.visaStatus,
          visaApplnPrcDate: row.visaApplnPrcDate,
          visaApRjDate: row.visaApRjDate,
          travelDate: row.travelDate,
          followUpDate: row.followUpDate,
          currentState: row.currentState,
          remarksStatus: row.remarksStatus,
          studentRemarks: row.proposalStudentRemarks,
          applicationDetails: [
            {
              applnId: row.applnId,
              appldUnvsty: row.appldUnvsty,
              appldCourse: row.appldCourse,
              appldCourseTyp: row.appldCourseTyp,
              appldDate: row.appldDate,
              offrLtrStatus: row.offrLtrStatus,
              offrLtrDate: row.offrLtrDate,
              visaLtrStatus: row.visaLtrStatus,
              visaLtrDate: row.visaLtrDate,
              feesPaid: row.feesPaid,
              courseStrtDate: row.courseStrtDate,
              stdUsrName: row.stdUsrName,
              stdPwd: row.stdPwd,
              applStatus: row.applStatus,
            },
          ],
        };
        proposalInfo = element;
        row.proposalInfo = proposalInfo;
        proposalIntCourMap.set(proposalKey, row);
        proposalHashmap.set(masterKey, row);
      }
    } else if (row.proposalId > 1 && !proposalIntCourMap.has(proposalKey)) {
      if (row.appldUnvsty) {
        let element = {
          visaApplnStatus: row.visaApplnStatus,
          visaStatus: row.visaStatus,
          visaApplnPrcDate: row.visaApplnPrcDate,
          visaApRjDate: row.visaApRjDate,
          travelDate: row.travelDate,
          followUpDate: row.followUpDate,
          currentState: row.currentState,
          remarksStatus: row.remarksStatus,
          studentRemarks: row.proposalStudentRemarks,
          applicationDetails: [
            {
              applnId: row.applnId,
              appldUnvsty: row.appldUnvsty,
              appldCourse: row.appldCourse,
              appldCourseTyp: row.appldCourseTyp,
              appldDate: row.appldDate,
              offrLtrStatus: row.offrLtrStatus,
              offrLtrDate: row.offrLtrDate,
              visaLtrStatus: row.visaLtrStatus,
              visaLtrDate: row.visaLtrDate,
              feesPaid: row.feesPaid,
              courseStrtDate: row.courseStrtDate,
              stdUsrName: row.stdUsrName,
              stdPwd: row.stdPwd,
              applStatus: row.applStatus,
            },
          ],
        };
        row = proposalHashmap.get(masterKey);
        proposalInfo = row.proposalInfo;
        proposalInfo.applicationDetails.push(element.applicationDetails[0]);
        row.proposalInfo = proposalInfo;
        proposalIntCourMap.set(proposalKey, row);
        proposalHashmap.set(masterKey, row);
      }
    } else if (
      row.toDoFollowUpSerNum > 0 &&
      !proposalToDoFollowUpMap.has(toDoFollowUpRemarksKey) &&
      row.screenName === "Proposal"
    ) {
      let followUpSerNum = row.followUpSerNum;
      let toDoSerNum = row.toDoSerNum;
      let element = {
        remark: row.remarks,
        operationFlag: "",
      };
      let existingRow = proposalHashmap.get(masterKey);
      if (followUpSerNum > 0 && followUpSerNum === 1) {
        existingRow.proposalInfo.followUpRemarks = [];
        existingRow.proposalInfo.followUpRemarks.push(element);
      } else if (followUpSerNum > 0) {
        existingRow = proposalHashmap.get(masterKey);
        existingRow.proposalInfo.followUpRemarks.push(element);
      }
      if (toDoSerNum > 0 && toDoSerNum == 1) {
        existingRow.proposalInfo.toDoRemarks = [];
        existingRow.proposalInfo.toDoRemarks.push(element);
      } else if (toDoSerNum > 0) {
        existingRow = proposalHashmap.get(masterKey);
        existingRow.proposalInfo.toDoRemarks.push(element);
      }
      proposalToDoFollowUpMap.set(toDoFollowUpRemarksKey, existingRow);
      proposalHashmap.set(masterKey, existingRow);
    } else if (
      row.toDoFollowUpSerNum > 0 &&
      !proposalToDoFollowUpMap.has(toDoFollowUpRemarksKey) &&
      row.screenName === "Enrolled"
    ) {
      let followUpSerNum = row.followUpSerNum;
      let toDoSerNum = row.toDoSerNum;
      let element = {
        remark: row.remarks,
        operationFlag: "",
      };
      let existingRow = proposalHashmap.get(masterKey);
      if (followUpSerNum > 0 && followUpSerNum === 1) {
        existingRow.enrolledInfo.followUpRemarks = [];
        existingRow.enrolledInfo.followUpRemarks.push(element);
      } else if (followUpSerNum > 0) {
        existingRow = proposalHashmap.get(masterKey);
        existingRow.enrolledInfo.followUpRemarks.push(element);
      }
      if (toDoSerNum > 0 && toDoSerNum == 1) {
        existingRow.enrolledInfo.toDoRemarks = [];
        existingRow.enrolledInfo.toDoRemarks.push(element);
      } else if (toDoSerNum > 0) {
        existingRow = proposalHashmap.get(masterKey);
        existingRow.enrolledInfo.toDoRemarks.push(element);
      }
      proposalToDoFollowUpMap.set(toDoFollowUpRemarksKey, existingRow);
      proposalHashmap.set(masterKey, existingRow);
    }
  }
  proposalHashmap.forEach(function (value, key) {
    newRows.push(value);
    rows = newRows;
  });
  return res.json(rows);
}

router.route("/updatestatusofstudent/:id").post((req, res) => {
  console.log("Update Id : " + req.params.id);

  let queryPrefix = STUDENT_QUERY.UPDATE_STUDENT_STATUS;
  let queryUpdateValues = [];

  queryUpdateValues.push(req.body.status);
  queryUpdateValues.push(req.params.id);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(queryPrefix, queryUpdateValues, (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO STUDENT : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
      let status = req.body.status;
      saveStudentHistory(
        req,
        req.body.studentId,
        "S",
        "Status Changed to " + COMMON_CONSTANTS.APPLICATION_STATUS[status]
      );
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
        return res.json(rows);
      });
    });
  });
});
router.route("/saveproposalinfo/").post((req, res) => {
  let deleteQueryPrefix = STUDENT_QUERY.DELETE_PROPOSAL_INFO;
  let deleteQueryUpdateValues = [];
  deleteQueryUpdateValues.push(req.body.studentId);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    saveStudentHistory(req, req.body.studentId, "U", "Proposal info updated");
    connection.query(
      deleteQueryPrefix,
      deleteQueryUpdateValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO STUDENT : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }
        for (i = 0; i < req.body.proposalInfo.applicationDetails.length; i++) {
          let application = req.body.proposalInfo.applicationDetails[i];
          let insertQueryPrefix = STUDENT_QUERY.INSERT_PROPOSAL_INFO;
          let insertQueryUpdateValues = [];
          insertQueryUpdateValues.push(req.body.studentId);
          insertQueryUpdateValues.push(i + 1);
          insertQueryUpdateValues.push(application.applnId);
          insertQueryUpdateValues.push(application.appldUnvsty);
          insertQueryUpdateValues.push(application.appldCourse);
          insertQueryUpdateValues.push(application.appldCourseTyp);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(application.appldDate)
          );
          insertQueryUpdateValues.push(application.offrLtrStatus);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(application.offrLtrDate)
          );
          insertQueryUpdateValues.push(application.visaLtrStatus);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(application.visaLtrDate)
          );
          insertQueryUpdateValues.push(application.feesPaid);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(application.courseStrtDate)
          );
          insertQueryUpdateValues.push(application.stdUsrName);
          insertQueryUpdateValues.push(application.stdPwd);
          insertQueryUpdateValues.push(application.applStatus);
          insertQueryUpdateValues.push(req.body.proposalInfo.visaApplnStatus);
          insertQueryUpdateValues.push(req.body.proposalInfo.visaStatus);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(req.body.proposalInfo.visaApplnPrcDate)
          );
          insertQueryUpdateValues.push(req.body.proposalInfo.visaAppvd);
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(req.body.proposalInfo.visaApRjDate)
          );
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(req.body.proposalInfo.travelDate)
          );
          insertQueryUpdateValues.push(
            convertToMySqlDateTime(req.body.proposalInfo.studentRemarks)
          );
          connection.query(
            insertQueryPrefix,
            insertQueryUpdateValues,
            (err, rows) => {
              if (err) {
                console.log("ERROR CONNECTING TO STUDENT : " + err);
                return connection.rollback(function () {
                  throw err;
                });
              }
            }
          );
        }
        populateToDoFollowUpDetails(
          req,
          req.body.proposalInfo.followUpRemarks,
          req.body.proposalInfo.toDoRemarks,
          req.body.studentId,
          "Proposal"
        );
        updateStudentFollowUpDetails(
          req,
          req.body.proposalInfo.followUpDate,
          req.body.proposalInfo.currentState,
          req.body.proposalInfo.remarksStatus
        );
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
          return res.json(rows);
        });
      }
    );
  });
});

router.route("/saveenrolledinfo/").post((req, res) => {
  let deleteQueryPrefix = STUDENT_QUERY.DELETE_ENROL_INFO;
  let deleteQueryUpdateValues = [];
  deleteQueryUpdateValues.push(req.body.studentId);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    saveStudentHistory(req, req.body.studentId, "U", "Enrolment info updated");
    connection.query(
      deleteQueryPrefix,
      deleteQueryUpdateValues,
      (err, rows) => {
        if (err) {
          console.log("ERROR CONNECTING TO STUDENT : " + err);
          return connection.rollback(function () {
            throw err;
          });
        }

        let insertQueryPrefix = STUDENT_QUERY.INSERT_ENROL_INFO;
        let insertQueryUpdateValues = [];
        insertQueryUpdateValues.push(req.body.studentId);
        insertQueryUpdateValues.push(req.body.studentId);
        insertQueryUpdateValues.push(req.body.enrolledInfo.totalTutionFees);
        insertQueryUpdateValues.push(req.body.enrolledInfo.annualTutionFees);
        insertQueryUpdateValues.push(req.body.enrolledInfo.totalCommission);
        insertQueryUpdateValues.push(req.body.enrolledInfo.firstCommission);
        insertQueryUpdateValues.push(
          convertToMySqlDateTime(req.body.enrolledInfo.courseStartingDate)
        );
        insertQueryUpdateValues.push(req.body.enrolledInfo.balanceCommission);
        insertQueryUpdateValues.push(req.body.enrolledInfo.currency);
        insertQueryUpdateValues.push(
          convertToMySqlDateTime(req.body.enrolledInfo.nextInvoiceDate)
        );
        insertQueryUpdateValues.push(
          convertToMySqlDateTime(req.body.enrolledInfo.invoiceDate)
        );
        insertQueryUpdateValues.push(
          convertToMySqlDateTime(req.body.enrolledInfo.studentRemarks)
        );

        connection.query(
          insertQueryPrefix,
          insertQueryUpdateValues,
          (err, rows) => {
            if (err) {
              console.log("ERROR CONNECTING TO STUDENT : " + err);
              return connection.rollback(function () {
                throw err;
              });
            }
          }
        );

        populateToDoFollowUpDetails(
          req,
          req.body.enrolledInfo.followUpRemarks,
          req.body.enrolledInfo.toDoRemarks,
          req.body.studentId,
          "Enrolled"
        );
        updateStudentFollowUpDetails(
          req,
          req.body.enrolledInfo.followUpDate,
          req.body.enrolledInfo.currentState,
          req.body.enrolledInfo.remarksStatus
        );
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
          return res.json(rows);
        });
      }
    );
  });
});

router.route("/validatephonenumber").post((req, res) => {
  let queryPrefix = "select 1 from student";
  let queryConditionValues = [];

  queryPrefix = queryPrefix + " where phoneNumber=?";
  queryConditionValues.push(req.body.phoneNumber);

  queryPrefix = queryPrefix + " AND studentId <> ?";
  queryConditionValues.push(req.body.studentId);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(queryPrefix, queryConditionValues, (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO STUDENT : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
        return res.json(rows);
      });
    });
  });
});

router.route("/validateemail").post((req, res) => {
  let queryPrefix = "select 1 from student";
  let queryConditionValues = [];

  queryPrefix = queryPrefix + " where email=?";
  queryConditionValues.push(req.body.email);

  queryPrefix = queryPrefix + " AND studentId <> ?";
  queryConditionValues.push(req.body.studentId);

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(queryPrefix, queryConditionValues, (err, rows) => {
      if (err) {
        console.log("ERROR CONNECTING TO STUDENT : " + err);
        return connection.rollback(function () {
          throw err;
        });
      }
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
        return res.json(rows);
      });
    });
  });
});
function updateStudentFollowUpDetails(
  req,
  followUpDate,
  currentState,
  remarksStatus
) {
  let updateQueryPrefix = STUDENT_QUERY.UPDATE_STUDENT_FOLLOWUP_QUERY;
  let queryUpdateValues = [];

  queryUpdateValues.push(convertToMySqlDate(followUpDate));
  queryUpdateValues.push(currentState);
  queryUpdateValues.push(remarksStatus);
  queryUpdateValues.push(req.body.studentId);

  connection.query(updateQueryPrefix, queryUpdateValues, (err, rows) => {
    if (err) {
      console.log("ERROR CONNECTING TO STUDENT : " + err);
      return connection.rollback(function () {
        throw err;
      });
    }
  });
}
module.exports = router;
