require("dotenv").config();
const app = require("./src/app")
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(() => {
  process.exit(1);
});
