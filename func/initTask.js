const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.initTask = async () => {
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

      for (const id of taskID) {
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
      if (info.data.data.mapTask) {
        console.log(`[ BOT ] : Thông tin nhiệm vụ`);
        console.log(
          `[ BOT ] : taskID : ${infoUsers["1001"].taskID} - Đã hoàn thành : ${infoUsers["1001"].compeleteCount}/2\n[ BOT ] : taskID : ${infoUsers["1002"].taskID} - Đã hoàn thành : ${infoUsers["1002"].compeleteCount}/5\n[ BOT ] : taskID : ${infoUsers["1003"].taskID} - Đã hoàn thành : ${infoUsers["1003"].compeleteCount}/8\n[ BOT ] : taskID : ${infoUsers["1004"].taskID} - Đã hoàn thành : ${infoUsers["1004"].compeleteCount}/8\n[ BOT ] : taskID : ${infoUsers["1005"].taskID} - Đã hoàn thành : ${infoUsers["1005"].compeleteCount}/5\n[ BOT ] : taskID : ${infoUsers["1006"].taskID} - Đã hoàn thành : ${infoUsers["1006"].compeleteCount}/5\n[ BOT ] : taskID : ${infoUsers["9002"].taskID} - Đã hoàn thành : ${infoUsers["9002"].compeleteCount}/1`
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
