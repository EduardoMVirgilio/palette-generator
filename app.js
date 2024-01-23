const url = document.querySelector("#url");
const preview = document.querySelector("#preview");
const canvas = document.querySelector("#picture");
const ctx = canvas.getContext("2d");

url.oninput = (e) => {
  const value = e.target.value.trim();
  if (value.length <= 5) {
    return (e.target.value = null);
  }

  fetch(`https://cors-anywhere.herokuapp.com/${value}`)
    .then((res) => res.blob())
    .then((blob) => {
      const img = new Image();
      img.onload = () => {
        preview.append(img);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let colors = [];
        console.log(data.data);
      };
      img.src = URL.createObjectURL(blob);
    });
};
