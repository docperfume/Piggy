const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.Task = async () => {
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      const info = await axios.post(
        "https://api.prod.piggypiggy.io/game/GetDailyTaskInfo",
        {
          PlayerID: 0,
        },
        {
          headers: {
            Authorization: `bearer ${token.token}`,
          },
        }
      );
      const taskID = [1001, 1002, 1003, 1004, 1005, 1006, 9002];
      const compeleteCount = [2, 5, 8, 8, 5, 5, 1];

      let availableTaskID = [];

      for (let i = 0; i < taskID.length; i++) {
        if (
          info.data.data.mapTask[taskID[i]].compeleteCount < compeleteCount[i]
        ) {
          availableTaskID.push(taskID[i]);
        }
      }
      if (availableTaskID.length > 0) {
        for (const id of availableTaskID) {
          await axios.post(
            "https://api.prod.piggypiggy.io/game/TakeTask",
            { TaskID: id, PlayerID: 0 },
            {
              headers: {
                Authorization: `bearer ${token.token}`,
              },
            }
          );
          console.log(`[ Đang chạy ] : Nhận nhiệm vụ ${id} thành công.`);
          console.log(`[ BOT ] : Đợi 60 giây để hoàn thành nhiệm vụ...`);
          await new Promise((resolve) => setTimeout(resolve, 60000));
          await axios.post(
            "https://api.prod.piggypiggy.io/game/CompleteTask",
            { TaskID: id, PlayerID: 0 },
            {
              headers: {
                Authorization: `bearer ${token.token}`,
              },
            }
          );
          console.log(`[ Đã hoàn thành ] : Nhiệm vụ ${id} thành công.`);
        }
      } else {
        console.log(`[ Đã hoàn thành ] : Không có nhiệm vụ nào khả dụng.`);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
