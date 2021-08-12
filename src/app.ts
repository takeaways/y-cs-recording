import "./style.css";

const recordButton = document.querySelector(
  ".record-button"
) as HTMLButtonElement;
const stopButton = document.querySelector(".stop-button") as HTMLButtonElement;
const playButton = document.querySelector(".play-button") as HTMLButtonElement;
const downloadButton = document.querySelector(
  ".download-button"
) as HTMLAnchorElement;
const previewView = document.querySelector("#preview") as HTMLVideoElement;
const recordingView = document.querySelector("#recording") as HTMLVideoElement;

let recorder: MediaRecorder;
let recordedChunks: BlobPart[] = [];
// let recordingStream;
// handlers
async function handleStartRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    recordingView.srcObject = stream;
    recording(stream);
  } catch (error) {
    console.log(error);
  }
}

function handleStropRecording() {
  (recordingView.srcObject as MediaStream) //
    .getTracks()
    .forEach((t) => t.stop());
  recorder.stop();
}

function handlePlayRecording() {
  const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  previewView.src = URL.createObjectURL(recordedBlob);
  previewView.play();
  previewView.controls = true;
  downloadButton.href = previewView.src;
  downloadButton.download = `recording_${new Date()}.webm`;
}

// events
recordButton.addEventListener("click", handleStartRecording);
stopButton.addEventListener("click", handleStropRecording);
playButton.addEventListener("click", handlePlayRecording);

// functions
function recording(stream: MediaStream) {
  recordedChunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => recordedChunks.push(e.data);
  recorder.start();
}
