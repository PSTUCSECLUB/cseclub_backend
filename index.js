const app = require("./app");
const dotenv = require("dotenv").config();
const connectDatabase = require("./src/config/db");

const port = 5005 || process.env.PORT;

app.listen(port, () => {
  connectDatabase();
  console.log(`Server is listing on port ${port}`);
});
