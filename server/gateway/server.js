import "./src/config/env.js";
import app from "./src/app.js";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});