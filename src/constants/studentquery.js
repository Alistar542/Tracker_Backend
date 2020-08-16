exports.ADD_STUDENT_QUERY =
  "INSERT INTO student " +
  "(firstName,middleName,lastName,email,phoneNumber," +
  "dateOfBirth,gender,maritalStatus,courseInterested," +
  "followUpDate,status,priority,createdDate,lastUpdateUser,lastUpdateTime) " +
  "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

exports.UPDATE_STUDENT_QUERY =
  "UPDATE student SET " +
  "firstName=?,middleName=?,lastName=?,email=?,phoneNumber=?," +
  "dateOfBirth=?,gender=?,maritalStatus=?,courseInterested=?," +
  "followUpDate=?,priority=?,status=?,lastUpdateUser=?,lastUpdateTime=? " +
  "WHERE studentId= ?";

exports.FIND_STUDENT_QUERY = `SELECT 
STD.studentId,STD.firstName,STD.middleName,STD.lastName,STD.email,STD.gender,
STD.maritalStatus,STD.courseInterested,STD.status,STD.priority,
STD.phoneNumber,STD.followUpDate,STD.dateOfBirth,STD.createdDate,
STD.lastUpdateUser,STD.lastUpdateTime  
FROM student STD 
LEFT JOIN englishexam EGX ON STD.studentId=EGX.studentId 
LEFT JOIN education EDU ON STD.studentId=edu.studentId 
WHERE 1=1`;

exports.ADD_ENGLISH_EXAM_QUERY = `INSERT INTO englishexam 
(studentId,englishExamType,examDate,
    overall,listening,reading,writing,speaking) 
    VALUES(?,?,?,?,?,?,?,?)`;

exports.ADD_EDUCATION_QUERY = `INSERT INTO education 
(studentId,countryOfEducation,highestLevelOfEducation,
    gradingScheme,gradeAverage,graduatedYear) 
    VALUES(?,?,?,?,?,?)`;

exports.ADD_WORK_EXPERIENCE_QUERY = `INSERT INTO workexperience 
    (studentId,companyName,position,
        endDate,startDate,address) 
        VALUES(?,?,?,?,?,?)`;

exports.ADD_STUDENT_HISTORY_QUERY = `INSERT INTO studenthistory
(studentId,operationFlag,remarks,lastUpdateUser,lastUpdateTime)
VALUES(?,?,?,?,?)`;
