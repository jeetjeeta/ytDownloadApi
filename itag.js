// const iTags = {
//   144: "160",
//   240: "133",

//   360: "18",
//   480: "83",
//   720: "22",
//   1080: "37",
//   1440: "264",
//   2160: "138",
// };

//quality:itag
const iTags = {
  144: "394", //videoonly: 394,132
  240: "395", //videoonly: 395,133

  360: "18", //videoonly: 396,134   both: 18
  480: "397", //videoonly: 397, 135 both: 44
  720: "398", //videoonly: 398, 136   both: 22
  1080: "399", //videoOnly: 399, 137   both: 37
  1440: "264",
  2160: "138",
};

// bitrate : itag
const iTagAudio = {
  128: "140", //mp4
  64: "250", //webm to be chosen
  160: "251", //webm
  48: "249", //webm
};

module.exports = {
  iTags,
  iTagAudio,
};
