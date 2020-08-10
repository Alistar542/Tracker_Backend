exports.LOGIN_USER_QUERY = `SELECT * FROM user WHERE userName=?`;

exports.CREATE_USER_QUERY = `INSERT INTO user (userName,password) values
(?,?)`;
