export default async function startScreenCapture() {
  console.log("📸 Capturing screen...");

  const sources = await window.electronAPI.captureScreen(); // Request screen sources from main

  if (sources.length === 0) {
    console.log("⚠️ No screen sources found!");
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sources[0].id,
      },
    },
  });

  const videoElement = document.createElement("video");
  videoElement.srcObject = stream;
  videoElement.play();

  setInterval(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoElement.videoWidth / 2;
    canvas.height = videoElement.videoHeight / 2;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          window.electronAPI.sendScreenData(reader.result); // Send screen data to main
        };
      }
    }, "image/jpeg", 0.5);
  }, 100); // Send every 500ms
}
