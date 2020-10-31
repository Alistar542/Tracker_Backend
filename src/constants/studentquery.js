exports.ADD_STUDENT_QUERY =
  "INSERT INTO student " +
  "(firstName,middleName,lastName,email,phoneNumber,additionalPhNo," +
  "dateOfBirth,gender,maritalStatus,courseInterested," +
  "followUpDate,status,priority,createdDate,lastUpdateUser,lastUpdateTime,officeCode,currentState,studentRemarks,remarksStatus) " +
  "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

exports.UPDATE_STUDENT_QUERY =
  "UPDATE student SET " +
  "firstName=?,middleName=?,lastName=?,email=?,phoneNumber=?,additionalPhNo=?," +
  "dateOfBirth=?,gender=?,maritalStatus=?,courseInterested=?," +
  "followUpDate=?,priority=?,status=?,lastUpdateUser=?,lastUpdateTime=? ,currentState=?,studentRemarks=?,remarksStatus=? " +
  "WHERE studentId= ?";

exports.UPDATE_STUDENT_FOLLOWUP_QUERY=
`UPDATE student
  SET followUpDate=?, currentState=?,remarksStatus=? WHERE studentId= ?`

exports.FIND_STUDENT_QUERY = `SELECT 
    STD.studentId,STD.firstName,STD.middleName,STD.lastName,STD.email,STD.gender,
    STD.maritalStatus,STD.courseInterested,STD.status,STD.priority,
    STD.phoneNumber,STD.additionalPhNo,STD.followUpDate,STD.dateOfBirth,STD.createdDate,
    STD.lastUpdateUser,STD.lastUpdateTime,STD.officeCode,STD.currentState,STD.studentRemarks,STD.remarksStatus,EGX.overall,EGX.listening,EGX.reading,EGX.writing,EGX.speaking,
    EGX.englishExamType,EGX.examDate,EGX.examId,EDU.countryOfEducation,EDU.highestLevelOfEducation,EDU.gradingScheme,
    EDU.gradeAverage,EDU.graduatedYear,EDU.eduCourseType,WRK.companyName,WRK.position,WRK.endDate,WRK.startDate,WRK.workAddress,OFF.source,OFF.wayOfContact,OFF.counselor,OFF.priority,OFF.dateOfRequest,
    COU.intrId,COU.requestedCourse,COU.preferredCountry,COU.intEduLevel,
    REM.toDoFollowUpSerNum,REM.toDoSerNum,REM.followUpSerNum,REM.remarks,REM.remarkType,REM.userName,REM.screenName,
    PRO.proposalId,PRO.applnId,PRO.appldUnvsty,PRO.appldCourse,PRO.appldCourseTyp,PRO.appldDate,PRO.offrLtrStatus,
    PRO.offrLtrDate,PRO.visaLtrStatus,PRO.visaLtrDate,PRO.feesPaid,PRO.courseStrtDate,PRO.stdUsrName,PRO.stdPwd,PRO.applStatus,
    PRO.visaApplnStatus,PRO.visaStatus,PRO.visaApplnPrcDate,PRO.visaAppvd,PRO.visaApRjDate,PRO.travelDate,PRO.studentRemarks proposalStudentRemarks,
    ENR.totalTutionFees,ENR.annualTutionFees,ENR.totalCommission,ENR.firstCommission,ENR.balanceCommission,ENR.courseStartingDate,
    ENR.nextInvoiceDate,ENR.invoiceDate,ENR.currency,ENR.studentRemarks enrolledStudentRemarks,
    EDUHIS.eduHisId,EDUHIS.address,EDUHIS.attendedFromDate,EDUHIS.attendedToDate,EDUHIS.degreeAwarded,EDUHIS.degreeAwardedOn,
    EDUHIS.educationLevel, EDUHIS.institutionCountry, EDUHIS.institutionName,EDUHIS.primaryLanguage,EDUHIS.city,EDUHIS.province,EDUHIS.zipCode
    FROM student STD
    LEFT JOIN englishexam EGX ON STD.studentId=EGX.studentId 
    LEFT JOIN education EDU ON STD.studentId=EDU.studentId 
    LEFT JOIN workexperience WRK ON STD.studentId=WRK.studentId
    LEFT JOIN officedata OFF ON STD.studentId=OFF.studentId
    LEFT JOIN interestedcourses COU ON STD.studentId=COU.studentId  
    LEFT JOIN todofollowupremarks REM ON STD.studentId=REM.studentId
    LEFT JOIN proposal PRO ON STD.studentId=PRO.studentId
    LEFT JOIN enrolled ENR ON STD.studentId=ENR.studentId
    LEFT JOIN educationhistory EDUHIS ON STD.studentId=EDUHIS.studentId
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
    gradingScheme,gradeAverage,eduCourseType,graduatedYear) 
    VALUES(?,?,?,?,?,?,?)`;
exports.UPDATE_EDUCATION_QUERY = `UPDATE education
    SET studentId=?,countryOfEducation=?,highestLevelOfEducation=?,
    gradingScheme=?,gradeAverage=?,graduatedYear=?,eduCourseType=? WHERE studentId= ?`;

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
      (studentId,intrId,requestedCourse,preferredCountry,intEduLevel) 
        VALUES(?,?,?,?,?)`;

exports.DELETE_TODO_FOLLOWUP_QUERY=`DELETE FROM todofollowupremarks where studentId=? AND remarkType=? AND screenName=?`;

exports.INSERT_TODO_FOLLOWUP_QUERY = `INSERT INTO todofollowupremarks 
      (studentId,toDoFollowUpSerNum,toDoSerNum,followUpSerNum,currentStatus,screenName,remarks,remarkType,userName,lastUpdatedTime) 
        VALUES(?,?,?,?,?,?,?,?,?,?)`;

exports.UPDATE_STUDENT_STATUS=`UPDATE student
SET status=? WHERE studentId= ?`

exports.INSERT_PROPOSAL_INFO=`INSERT INTO proposal
(studentId,proposalId,applnId,appldUnvsty,appldCourse,appldCourseTyp,appldDate,offrLtrStatus,offrLtrDate,visaLtrStatus,visaLtrDate,
feesPaid,courseStrtDate,stdUsrName,stdPwd,applStatus,visaApplnStatus,visaStatus,visaApplnPrcDate,visaAppvd,visaApRjDate,travelDate,studentRemarks)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

exports.DELETE_PROPOSAL_INFO=`DELETE FROM proposal WHERE studentId=?`

exports.INSERT_ENROL_INFO=`INSERT INTO enrolled
(studentId,enrolId,totalTutionFees,annualTutionFees,totalCommission,firstCommission,courseStartingDate,balanceCommission,currency,nextInvoiceDate,
  invoiceDate,studentRemarks) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`

exports.DELETE_ENROL_INFO=`DELETE FROM enrolled WHERE studentId=?`

exports.INSERT_EDUCATION_HISTORY=`INSERT INTO educationhistory(studentId,eduHisId,address,attendedFromDate,attendedToDate,
degreeAwarded,degreeAwardedOn,educationLevel,institutionCountry,institutionName,primaryLanguage,city,province,zipCode)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

exports.DELETE_EDUCATION_HISTORY=`DELETE FROM educationhistory WHERE studentId=?`