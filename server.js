const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const studentRouter = require("./src/routes/student");
const userRouter = require("./src/routes/user");
app.use("/student", studentRouter);
app.use("/user", userRouter);

//Dummy test
app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
