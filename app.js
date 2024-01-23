const url = document.querySelector("#url");
const preview = document.querySelector("#preview");
const canvas = document.querySelector("#picture");
const ctx = canvas.getContext("2d");

url.oninput = (e) => {
  const value = e.target.value.trim();
  if (value.length <= 5) {
    return (e.target.value = null);
  }

  fetch(`https://eduardomvirgilio.github.io/palette-generator/${value}`, {
    mode: "no-cors",
  })
    .then((res) => res.blob())
    .then((blob) => {
      const img = new Image();
      img.onload = () => {
        preview.append(img);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let colors = [];
        for (let i = 0; i < data; i += 4) {
          const rgba = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${
            data[i + 3]
          }`;
          colors.push(rgba);
        }
        let palette = new Set(colors);
        console.log([...palette]);
      };
      img.src = URL.createObjectURL(blob);
    });
};
