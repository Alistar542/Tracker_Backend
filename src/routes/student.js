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

  let {
    studentHistoryQueryInsertValues,
    studentHistoryQueryPrefix,
  } = populateStudentHistory();

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

        studentHistoryQueryInsertValues[0] = rows.insertId;
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

        if (req.body.requestedCourseDetails) {
          populateInterestedCourses(rows, req);
        }
        populateToDoFollowUpDetails(req, rows.insertId);
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
  queryUpdateValues.push(req.body.lastUpdateUser);
  queryUpdateValues.push(convertToMySqlDateTime(new Date().toISOString()));
  queryUpdateValues.push(req.params.id);

  let studentHistoryQueryPrefix =
    STUDENT_HISTORY_QUERY.ADD_STUDENT_HISTORY_QUERY;
  let studentHistoryQueryInsertValues = [];
  studentHistoryQueryInsertValues.push(req.params.id);
  studentHistoryQueryInsertValues.push(COMMON_CONSTANTS.OPERATION_FLAG.UPDATE);
  studentHistoryQueryInsertValues.push(req.body.remarks);
  studentHistoryQueryInsertValues.push(req.body.user);
  studentHistoryQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );

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
      populateToDoFollowUpDetails(req, req.params.id);
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
  queryConditions = queryConditions + " ORDER BY studentId DESC";
  let finalCondition = queryPrefix + queryConditions;

  connection.query(finalCondition, queryConditionValues, (err, rows) => {
    err
      ? console.log("ERROR CONNECTING TO STUDENT : " + err)
      : mapResponse(res, rows);
  });
});


function populateToDoFollowUpDetails(req, studentId) {
  let serNum = 0;
  if (req.body.followUpRemarks) {
    let todoFolloupQueryPrefix = STUDENT_QUERY.DELETE_TODO_FOLLOWUP_QUERY;
    let todoFolloupQueryValues = [];
    todoFolloupQueryValues[0] = studentId;
    todoFolloupQueryValues.push("F");
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
    for (let i = 0; i < req.body.followUpRemarks.length; i++) {
      let todoFolloupQueryPrefix = STUDENT_QUERY.INSERT_TODO_FOLLOWUP_QUERY;
      let todoFolloupQueryValues = [];
      todoFolloupQueryValues[0] = studentId;
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(0);
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(req.body.status);
      todoFolloupQueryValues.push(req.body.followUpRemarks[i].remark);
      todoFolloupQueryValues.push("F");
      todoFolloupQueryValues.push(req.user.userName);
      todoFolloupQueryValues.push(convertToMySqlDateTime(new Date().toISOString()));

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
  if (req.body.toDoRemarks) {
    let todoFolloupQueryPrefix = STUDENT_QUERY.DELETE_TODO_FOLLOWUP_QUERY;
    let todoFolloupQueryValues = [];
    todoFolloupQueryValues[0] = studentId;
    todoFolloupQueryValues.push("T");
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
    for (let i = 0; i < req.body.toDoRemarks.length; i++) {
      let todoFolloupQueryPrefix = STUDENT_QUERY.INSERT_TODO_FOLLOWUP_QUERY;
      let todoFolloupQueryValues = [];
      todoFolloupQueryValues[0] = studentId;
      todoFolloupQueryValues.push(serNum + 1);
      ++serNum;
      todoFolloupQueryValues.push(i + 1);
      todoFolloupQueryValues.push(0);
      todoFolloupQueryValues.push(req.body.status);
      todoFolloupQueryValues.push(req.body.toDoRemarks[i].remark);
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

function populateStudentHistory() {
  let studentHistoryQueryPrefix =
    STUDENT_HISTORY_QUERY.ADD_STUDENT_HISTORY_QUERY;
  let studentHistoryQueryInsertValues = [];
  studentHistoryQueryInsertValues[0] = "studentId";
  studentHistoryQueryInsertValues.push(COMMON_CONSTANTS.OPERATION_FLAG.INSERT);
  studentHistoryQueryInsertValues.push(null);
  studentHistoryQueryInsertValues.push("ADMIN");
  studentHistoryQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );
  return { studentHistoryQueryInsertValues, studentHistoryQueryPrefix };
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
  studentQueryInsertValues.push(req.body.lastUpdateUser);
  studentQueryInsertValues.push(
    convertToMySqlDateTime(new Date().toISOString())
  );
  return { studentQueryPrefix, studentQueryInsertValues };
}

function mapResponse(res, rows) {
  let hashmap = new HashMap();
  let intCourMap=new HashMap();
  let toDoFollowUpMap=new HashMap();
  let newRows = [];
  for (i = 0; i < rows.length; i++) {
    let requestedCourseDetails = [];
    let row = rows[i];
    
    let interestedCouresesKey = row.studentId + row.phoneNumber + row.email+row.intrId;
    let masterKey=row.studentId + row.phoneNumber + row.email;
    let toDoFollowUpRemarksKey = row.studentId + row.phoneNumber + row.email+row.toDoFollowUpSerNum;
    if (row.intrId === 1 && !intCourMap.has(interestedCouresesKey)) {
      if (row.requestedCourse) {
        let element = {
          requestedCourse: row.requestedCourse,
          preferredCountry: row.preferredCountry,
        };
        requestedCourseDetails.push(element);
        row.requestedCourseDetails = requestedCourseDetails;
        intCourMap.set(interestedCouresesKey,row);
        hashmap.set(masterKey, row);
      }
    } else if (row.intrId > 1 && !intCourMap.has(interestedCouresesKey)) {
      if (row.requestedCourse) {
        let element = {
          requestedCourse: row.requestedCourse,
          preferredCountry: row.preferredCountry,
        };
        row = hashmap.get(masterKey);
        requestedCourseDetails = row.requestedCourseDetails;
        requestedCourseDetails.push(element);
        row.requestedCourseDetails = requestedCourseDetails;
        intCourMap.set(interestedCouresesKey,row);
        hashmap.set(masterKey, row);
      }
    } 
    if(row.toDoFollowUpSerNum>0 && !toDoFollowUpMap.has(toDoFollowUpRemarksKey)){
      let followUpSerNum=row.followUpSerNum;
      let toDoSerNum=row.toDoSerNum;
      let element={
        remark:row.remarks,
        operationFlag:""
      }
      let existingRow=hashmap.get(masterKey);
      if(followUpSerNum>0 && followUpSerNum===1){
        existingRow.followUpRemarks=[];
        existingRow.followUpRemarks.push(element);
      }
      else if(followUpSerNum>0){
        existingRow=hashmap.get(masterKey);
        existingRow.followUpRemarks.push(element);
      }
      if(toDoSerNum>0 && toDoSerNum==1){
        existingRow.toDoRemarks=[];
        existingRow.toDoRemarks.push(element);
      }
      else if(toDoSerNum>0){
        existingRow=hashmap.get(masterKey);
        existingRow.toDoRemarks.push(element);
      }
      toDoFollowUpMap.set(toDoFollowUpRemarksKey,existingRow);
      hashmap.set(masterKey, existingRow);
    }
    
  }
  hashmap.forEach(function (value, key) {
    newRows.push(value);
  });
  rows = newRows;
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
    connection.query(
      queryPrefix,
      queryUpdateValues,
      (err, rows) => {
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
      }
    );
  });
  
});
router.route("/saveproposalinfo/").post((req, res) => {
  let request=req;
 return null;
});
module.exports = router;