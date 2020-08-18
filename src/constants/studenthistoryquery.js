exports.FIND_STUDENT_HISTORY = `SELECT * FROM studenthistory where studentId= ?`;

exports.ADD_STUDENT_HISTORY_QUERY = `INSERT INTO studenthistory
(studentId,operationFlag,remarks,lastUpdateUser,lastUpdateTime)
VALUES(?,?,?,?,?)`;
