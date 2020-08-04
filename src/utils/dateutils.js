exports.convertToMySqlDate = function (jsDate) {
  return jsDate ? jsDate.slice(0, 10) : null;
};

exports.convertToMySqlDateTime = function (jsDate) {
  return jsDate ? jsDate.slice(0, 19).replace("T", " ") : null;
};
