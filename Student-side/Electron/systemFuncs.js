const { exec } = require("child_process");
function shutdownComputer() {
  exec("shutdown /s /f /t 0", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Shutdown error: ${error.message}`);
      return;
    }
    console.log("✅ Shutdown initiated.");
  });
}

module.exports = {shutdownComputer};
