const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const authenticateToken = require("./src/middleware/auth");
app.use(cors());
app.use(express.json());

const studentRouter = require("./src/routes/student");
const userRouter = require("./src/routes/user");
const studentHistoryRouter = require("./src/routes/studenthistory");

app.use("/student", authenticateToken, studentRouter);
app.use("/user", userRouter);
app.use("/studenthistory", authenticateToken, studentHistoryRouter);

//Dummy test
app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
