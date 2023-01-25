// const ffmpeg = require("ffmpeg-static");

// const ffmpeginstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpeginstaller.path);
// const ffmpeg = require("fluent-ffmpeg");
const cp = require("child_process");
const fs = require("fs");

// const ffmpegProcess = cp.spawn(
//   ffmpeg,
//   [
//     "-i",
//     `pipe:3`,
//     "-i",
//     `pipe:4`,
//     "-map",
//     "0:v",
//     "-map",
//     "1:a",
//     "-c:v",
//     "copy",
//     "-c:a",
//     "libmp3lame",
//     "-crf",
//     "27",
//     "-preset",
//     "veryfast",
//     "-movflags",
//     "frag_keyframe+empty_moov",
//     "-f",
//     "mp4",
//     "-loglevel",
//     "error",
//     "-",
//   ],
//   {
//     stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
//   }
// );

async function merge(video, audio) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    const commandArray = [];
    // command.addInput(video);
    command.addInput(video);
    command.addInput(audio);

    // commandArray.push(`[1]volume=0.1[a1]`);
    // command.addInput(`./voiceover.mp3`);
    // commandArray.push(`[2]volume=0.9[a2]`);
    let ffmpegKeys = "[a1][a2]amix=inputs=2[a]";

    // commandArray.push(ffmpegKeys);
    // command.complexFilter(commandArray);

    command
      .outputOptions("-movflags frag_keyframe+empty_moov")
      // command
      //   .addOptions(["-map 0:v", "-map [a]", "-c:v copy"])
      .format("mp4")
      .on("error", (error) => {
        console.log(error);
        reject(err);
      })
      .on("end", function () {
        console.log("Merging finished !");
        resolve({ status: 200, msg: "done" });
      })
      .save("/tmp/merged.mp4");
  });
  // ffmpeg()
  //   .addInput(video)
  //   .addInput(audio)
  //   .addOptions(["-map 0:v", "-map 1:a", "-c:v copy"])
  //   .format("mp4")
  //   .on("error", (error) => console.log(error))
  //   .on("end", () => console.log(" finished !"))
  //   .saveToFile("merged.mp4");
}

module.exports = {
  // ffmpegProcess,
  merge,
};
