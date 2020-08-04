const convertToMySqlDate = require("./dateutils");

exports.convertToLowerCase = function (uppperCaseWord) {
  return uppperCaseWord ? uppperCaseWord.toLowerCase() : null;
};
