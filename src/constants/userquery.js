exports.LOGIN_USER_QUERY = `SELECT * FROM user WHERE userName=? and officeCode=?`;

exports.CREATE_USER_QUERY = `INSERT INTO user (userName,password,userType,officeCode) values
(?,?,?,?)`;

exports.LIST_USER_QUERY=`SELECT * FROM user `