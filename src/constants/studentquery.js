exports.ADD_STUDENT_QUERY =
  "INSERT INTO student " +
  "(firstName,middleName,lastName,email,phoneNumber,additionalPhNo," +
  "dateOfBirth,gender,maritalStatus,courseInterested," +
  "followUpDate,status,priority,createdDate,lastUpdateUser,lastUpdateTime) " +
  "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

exports.UPDATE_STUDENT_QUERY =
  "UPDATE student SET " +
  "firstName=?,middleName=?,lastName=?,email=?,phoneNumber=?,additionalPhNo=?," +
  "dateOfBirth=?,gender=?,maritalStatus=?,courseInterested=?," +
  "followUpDate=?,priority=?,status=?,lastUpdateUser=?,lastUpdateTime=? " +
  "WHERE studentId= ?";

exports.FIND_STUDENT_QUERY = `SELECT 
    STD.studentId,STD.firstName,STD.middleName,STD.lastName,STD.email,STD.gender,
    STD.maritalStatus,STD.courseInterested,STD.status,STD.priority,
    STD.phoneNumber,STD.additionalPhNo,STD.followUpDate,STD.dateOfBirth,STD.createdDate,
    STD.lastUpdateUser,STD.lastUpdateTime,EGX.overall,EGX.listening,EGX.reading,EGX.writing,EGX.speaking,
    EGX.englishExamType,EGX.examDate,EGX.examId,EDU.countryOfEducation,EDU.highestLevelOfEducation,EDU.gradingScheme,
    EDU.gradeAverage,EDU.graduatedYear,WRK.companyName,WRK.position,WRK.endDate,WRK.startDate,WRK.workAddress,OFF.source,OFF.wayOfContact,OFF.counselor,OFF.priority,OFF.dateOfRequest,
    COU.intrId,COU.requestedCourse,COU.preferredCountry,
    REM.toDoFollowUpSerNum,REM.toDoSerNum,REM.followUpSerNum,REM.remarks,REM.remarkType,REM.userName
    FROM student STD
    LEFT JOIN englishexam EGX ON STD.studentId=EGX.studentId 
    LEFT JOIN education EDU ON STD.studentId=EDU.studentId 
    LEFT JOIN workexperience WRK ON STD.studentId=WRK.studentId
    LEFT JOIN officedata OFF ON STD.studentId=OFF.studentId
    LEFT JOIN interestedcourses COU ON STD.studentId=COU.studentId
    LEFT JOIN todofollowupremarks REM ON STD.studentId=REM.studentId
    WHERE 1=1`;

exports.ADD_ENGLISH_EXAM_QUERY = `INSERT INTO englishexam 
(studentId,englishExamType,examDate,
    overall,listening,reading,writing,speaking) 
    VALUES(?,?,?,?,?,?,?,?)`;

exports.UPDATE_ENGLISH_EXAM_QUERY = `UPDATE englishexam
  SET studentId=?,englishExamType=?,examDate=?,
  overall=?,listening=?,reading=?,writing=?,speaking=? WHERE studentId= ?`;

exports.ADD_EDUCATION_QUERY = `INSERT INTO education 
(studentId,countryOfEducation,highestLevelOfEducation,
    gradingScheme,gradeAverage,graduatedYear) 
    VALUES(?,?,?,?,?,?)`;
exports.UPDATE_EDUCATION_QUERY = `UPDATE education
    SET studentId=?,countryOfEducation=?,highestLevelOfEducation=?,
    gradingScheme=?,gradeAverage=?,graduatedYear=? WHERE studentId= ?`;

exports.ADD_WORK_EXPERIENCE_QUERY = `INSERT INTO workexperience 
    (studentId,companyName,position,
        endDate,startDate,workAddress) 
        VALUES(?,?,?,?,?,?)`;

exports.UPDATE_WORK_EXPERIENCE_QUERY = `UPDATE workexperience
    SET studentId=?,companyName=?,position=?,
    endDate=?,startDate=?,workAddress=? WHERE studentId= ?`;

exports.ADD_OFFICE_DATA_QUERY = `INSERT INTO officedata 
    (studentId,source,
      wayOfContact,counselor,priority,dateOfRequest) 
        VALUES(?,?,?,?,?,?)`;

exports.UPDATE_OFFICE_DATA_QUERY = `UPDATE officedata
    SET studentId=?,source=?,wayOfContact=?,
    counselor=?,priority=?,dateOfRequest=? WHERE studentId= ?`;

exports.DELETE_INTERESTED_COURSES_QUERY = `DELETE FROM interestedcourses where studentId=?`;

exports.INSERT_INTERESTED_COURSES_QUERY = `INSERT INTO interestedcourses 
      (studentId,intrId,requestedCourse,preferredCountry) 
        VALUES(?,?,?,?)`;

exports.DELETE_TODO_FOLLOWUP_QUERY=`DELETE FROM todofollowupremarks where studentId=? AND remarkType=?`;

exports.INSERT_TODO_FOLLOWUP_QUERY = `INSERT INTO todofollowupremarks 
      (studentId,toDoFollowUpSerNum,toDoSerNum,followUpSerNum,currentStatus,remarks,remarkType,userName,lastUpdatedTime) 
        VALUES(?,?,?,?,?,?,?,?,?)`;
        
exports.UPDATE_STUDENT_STATUS=`UPDATE student
SET status=? WHERE studentId= ?`
