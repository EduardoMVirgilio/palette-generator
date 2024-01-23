const $url = document.querySelector("#url");
const $preview = document.querySelector("#preview");
const canvas = document.querySelector("#picture");
const $colors = document.querySelector("#colors");
const ctx = canvas.getContext("2d");

url.oninput = (e) => {
  const value = e.target.value.trim();
  if (value.length <= 5) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    e.target.value = null;
    return null;
  }

  fetch(`https://cors-anywhere.herokuapp.com/${value}`)
    .then((res) => res.blob())
    .then((blob) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      $colors.innerHTML = null;
      img.onload = () => {
        const scaleWidth = canvas.width / img.width;
        const scaleHeight = canvas.height / img.height;
        const scale = Math.min(scaleWidth, scaleHeight);
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
        const palette = colors();
        console.clear();
        palette.forEach((color) => {
          let element = document.createElement("li");
          element.style.backgroundColor = color[0];
          $colors.appendChild(element);
        });
      };
    });
};

const colors = () => {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;
  const colorCounts = {};

  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  for (let i = 0; i < imageData.length; i += 4 * 32 * 32) {
    const red = toHex(imageData[i]);
    const green = toHex(imageData[i + 1]);
    const blue = toHex(imageData[i + 2]);
    const rgba = `#${red}${green}${blue}`;
    colorCounts[rgba] = (colorCounts[rgba] || 0) + 1;
  }
  let colors = Array.from(new Set(Object.keys(colorCounts)));
  return colors
    .sort((a, b) => colorCounts[b] - colorCounts[a])
    .map((hexColor) => [hexColor, colorCounts[hexColor]]);
};
