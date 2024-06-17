const INFINITY = 1000000;

function intersect(x1, y1, x2, y2) {
  return (y1 + x1 * x1 - (y2 + x2 * x2)) / (2 * x1 - 2 * x2);
}

function horizontalPass(dists, y, width) {
  let xs = [],
    ys = [],
    ls = 0;

  for (let x = 0; x < width; x++) {
    let ny = dists[y * width + x];

    if (ny < INFINITY) {
      xs.push(x);
      ys.push(ny);
    }
  }

  let l = xs.length;

  if (l == 0) return;

  for (let i = 0; i < l - 2; i++) {
    let s = intersect(xs[i], ys[i], xs[i + 2], ys[i + 2]);
    let f2s = ys[i + 1] + (s - xs[i + 1]) * (s - xs[i + 1]);
    let f1s = ys[i] + (s - xs[i]) * (s - xs[i]);

    if (f1s <= f2s) {
      xs.splice(i + 1, 1);
      ys.splice(i + 1, 1);
      l--;
      i = 0;
    }
  }

  for (let i = 0; i < width; i++) dists[i + y * width] = INFINITY;
  for (let i = 0; i < l - 1; i++) {
    let s = Math.round(intersect(xs[i], ys[i], xs[i + 1], ys[i + 1]));

    for (let x = Math.max(ls, 0); x < width && x < s; x++) {
      dists[y * width + x] = ys[i] + (x - xs[i]) * (x - xs[i]);
    }
    ls = s;
  }

  for (let x = ls; x < width; x++) {
    dists[y * width + x] = ys[l - 1] + (x - xs[l - 1]) * (x - xs[l - 1]);
  }
}

function transpose(arr, width, height) {
  let result = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = y;
      let ny = width - 1 - x;

      result[ny * height + nx] = arr[y * width + x];
    }
  }

  return result;
}

function main() {
  let img = new Image();
  let contextOrig;
  let data = [],
    dists1 = [],
    dists = [];

  img.onload = function () {
    let canvasOrig = document.getElementById("canvas");
    canvasOrig.width = img.width;
    canvasOrig.height = img.height;
    contextOrig = canvasOrig.getContext("2d");

    let canvasSDF = document.getElementById("result");
    canvasSDF.width = img.width;
    canvasSDF.height = img.height;
    let contextSDF = canvasSDF.getContext("2d");

    contextOrig.globalCompositeOperation = "hard-light";

    contextOrig.drawImage(img, 0, 0);

    let data1 = Array.from(
      contextOrig.getImageData(0, 0, img.width, img.height).data
    );

    for (let i = 0; i < data1.length; i += 4) {
      if (data1[i] + data1[i + 1] + data1[i + 2] > 300) data.push(1);
      else data.push(0);
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i] == 1) contextOrig.fillStyle = "rgba(255, 255, 255, 1)";
      else contextOrig.fillStyle = "rgba(0, 0, 0, 1)";
      contextOrig.fillRect(
        Math.floor(i % img.width),
        Math.floor(i / img.width),
        1,
        1
      );
    }

    for (let i = 0; i < data.length; i++)
      if (data[i] == 1) dists.push(0);
      else dists.push(INFINITY);

    for (let i = 0; i < img.height; i++) horizontalPass(dists, i, img.width);

    dists1 = transpose(dists, img.width, img.height);

    for (let i = 0; i < img.width; i++) horizontalPass(dists1, i, img.height);

    dists = transpose(dists1, img.height, img.width);

    for (let i = 0; i < dists.length; i++) {
      let c = Math.floor(Math.min(Math.sqrt(dists[i]), 255)) * 20;

      contextSDF.fillStyle = `rgba(${c}, ${c}, ${c}, 1)`;
      contextSDF.fillRect(
        Math.floor(i % img.width),
        Math.floor(i / img.width),
        1,
        1
      );
    }
  };

  let fileInp = document.getElementById("img");
  fileInp.addEventListener("change", () => {
    img.src = URL.createObjectURL(fileInp.files[0]);
    (data = []), (dists1 = []), (dists = []);
  });
}

main();
