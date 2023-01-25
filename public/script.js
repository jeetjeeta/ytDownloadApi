const HOST = "";

const download = () => {
  fetch(`${HOST}/getLink`, {
    method: "post",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url: "https://www.youtube.com/watch?v=MMFj8uDubsE",
      q: 128,
    }),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "extraordinary.mp3";
      link.href = url;
      link.click();
    })
    .catch(console.log);
};
