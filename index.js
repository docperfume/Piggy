const cron = require("node-cron");
const express = require("express");

const { configDotenv } = require("dotenv");
const { getAuthToken } = require("./func/getAuthToken");
const { validateToken } = require("./func/CheckValidToken");
const { Task } = require("./func/Task");
const { CreateStarPay } = require("./func/CreateStarPay");
const { initTask } = require("./func/initTask");
configDotenv();

// Lên lịch cho nhiệm vụ chạy mỗi giờ vào đầu giờ
const main = async () => {
  await initTask();
  await Task();
  CreateStarPay();
};

main();
cron.schedule("0 * * * *", CreateStarPay);
cron.schedule("0 * * * *", Task);
cron.schedule("0 * * * *", initTask);

// Khởi động máy chủ
const port = process.env.PORT || 104;
const app = express();

app.get("/", (req, res) => {
  res.send("Máy chủ cron job API đang chạy");
});

app.listen(port, async () => {
  console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
