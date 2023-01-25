const express = require("express");
const PORT = process.env.PORT || 8080;
const ytdl = require("ytdl-core");
const cors = require("cors");
const fs = require("fs");
const { ffmpegProcess, merge } = require("./ffmpegProcess");
const { promiseSetTimeOut } = require("./helper");

const { iTags, iTagAudio } = require("./itag");

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(cors({ credentials: true }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.json("ok");
// });

const isEqual = (format, format1) => {
  return (
    format.container == format1.container &&
    format.hasAudio == format1.hasAudio &&
    format.hasVideo == format1.hasVideo &&
    format.quality == format1.quality &&
    format.mimeType == format1.mimeType &&
    format.audioBitrate == format1.audioBitrate
  );
};

const getVideoLink = async (url, q) => {
  const info = await ytdl.getInfo(url);
  // let format = ytdl.chooseFormat(info.formats, { quality: `${iTags[360]}` });

  try {
    const format1 = ytdl.chooseFormat(info.formats, { quality: `${iTags[q]}` });
    console.log("🚀 ~ file: app.js ~ line 23 ~ app.post ~ format", format1);

    // ytdl.downloadFromInfo(format).pipe(fs.createWriteStream("video.mp4"));
    const video = ytdl(url, {
      filter: (format) => {
        // format1.container === "mp4" && format1.hasAudio === true,
        // console.log("🚀 ~ file: app.js ~ line 33 ~ app.post ~ format1", format1);

        return isEqual(format, format1);
      },
    });

    const format2 = ytdl.chooseFormat(info.formats, { quality: `250` });
    console.log("🚀 ~ file: app.js ~ line 54 ~ app.post ~ format2", format2);

    // ytdl.downloadFromInfo(format).pipe(fs.createWriteStream("video.mp4"));
    const audio = ytdl(url, {
      filter: (format) => {
        // format1.container === "mp4" && format1.hasAudio === true,
        // console.log("🚀 ~ file: app.js ~ line 33 ~ app.post ~ format1", format1);

        return isEqual(format, format2);
      },
    });

    // video.pipe(ffmpegProcess.stdio[3]);
    // audio.pipe(ffmpegProcess.stdio[4]);
    // ffmpegProcess.stdio[1].pipe(fs.createWriteStream("newVideo.mp4"));

    video.pipe(fs.createWriteStream("video1.mp4"));
    audio.pipe(fs.createWriteStream("audio1.mp3"));
    await promiseSetTimeOut(5000);
    await merge("/tmp/video1.mp4", "/tmp/audio1.mp3");
  } catch (err) {
    console.log(err);
    throw new Error("this format is not available");
  }
};

const getAudioLink = async (url) => {
  const info = await ytdl.getInfo(url);
  const format2 = ytdl.chooseFormat(info.formats, { quality: `140` });
  console.log("🚀 ~ file: app.js ~ line 54 ~ app.post ~ format2", format2);

  try {
    // ytdl.downloadFromInfo(format).pipe(fs.createWriteStream("video.mp4"));
    const audio = ytdl(url, {
      filter: (format) => {
        // format1.container === "mp4" && format1.hasAudio === true,
        // console.log("🚀 ~ file: app.js ~ line 33 ~ app.post ~ format1", format1);

        return isEqual(format, format2);
      },
    });

    return audio;
  } catch (err) {
    console.log(err);
    throw new Error(err.toString());
  }
};

// for audio q must be 128 and for rest its quality
app.post("/getLink", async (req, res) => {
  const { url, q } = req.body; // q is number, url is string
  console.log("url: ", url);

  const valid_q = [128, 144, 240, 360, 480, 720, 1080];

  if (!valid_q.includes(q)) {
    res.status(400).json("invalid quality");
    return;
  }

  if (q === 128) {
    try {
      const audio = await getAudioLink(url);
      audio.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(500).json("some error");
    }

    return;
  }

  try {
    const video = await getVideoLink(url, q);
    fs.createReadStream("/tmp/merged.mp4").pipe(res);
  } catch (err) {
    res.status(500).json("some error");
  }

  // ytdl
  //   .getInfo(url)
  //   .then((data) => {
  //     //   console.log(data);
  //     //   fs.writeFileSync("data.json", JSON.stringify(data));
  //     const formats = [...data.formats, data.adaptiveFormats];
  //     fs.writeFileSync("data.json", JSON.stringify(formats));

  //     //   let format = ytdl.chooseFormat(formats, { filter: "video" });
  //     //   console.log("Format found! ", format);

  //     res.json(data);
  //   })
  //   .catch(console.log);
});

app.listen(PORT, () => {
  console.log(`app is running in ${PORT}`);
});
