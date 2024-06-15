function marchParabolas(row, vertices, intersections) {
  let k = 0;
  let result = [];
  for (let q = 0; q < row.length; q++) {
    while (intersections[k + 1].x < q) k++;
    let dx = q - vertices[k].x;
    result[q] = dx * dx + vertices[k].y;
  }
  return result;
}

function intersectParabolas(p, q) {
  return (q.y + q.x * q.x - p.y * p.x * p.x) / (2 * (q.x - p.x));
}

function findHullParabolas(row) {
  let vertices = [],
    intersections = [],
    k = 0;

  vertices[0].x = 0;
  (intersections[0].x = -Infinity), (intersections[1].x = Infinity);

  for (let i = 1; i < row.length; i++) {
    let q = { x: i, y: row[i] };
    let p = vertices[k];
    let s = intersectParabolas(p, q);
    while (s.x <= z[k].x) {
      k--;
      p = vertices[k];
      s = intersectParabolas(p, q);
    }
    k++;
    vertices[k] = q;
    intersections[k].x = s;
    intersections[k + 1].x = Infinity;
  }
  return {
    verts: vertices,
    inters: intersections,
  };
}

function horisontalPass(row) {
  let t = findHullParabolas(row);
  let hull_vertices = t.verts,
    hulll_intersections = t.inters;

  return marchParabolas(row, hull_vertices, hulll_intersections);
}

function transpose(array) {
  let result = [[]];

  for (i in array) for (j in array[i]) result[j][i] = array[i][j];

  return result;
}

// !!! boolMap is 2lay array
function computeSdf(boolMap) {
  let sedt = [[]];
  for (let i in boolMap) {
    for (let j in boolMap[i]) {
      sedt[i][j] = boolMap[i][j] ? 0 : Infinity;
      console.log(i + " " + j + " " + boolMap[i][j]);
    }
  }

  for (let row in sedt) {
    sedt[row] = horisontalPass(sedt[row]);
  }
  sedt = transpose(sedt);
  for (let row in sedt) {
    sedt[row] = horisontalPass(sedt[row]);
  }
  sedt = transpose(sedt);
  return sedt;
}

let canvasOrig,
  contextOrig,
  canvasFiltred,
  contextFiltred,
  canvasSDF,
  contextSDF;

function fillArray(array, width, height) {
  let arr = [],
    diArr = [];
  // console.log(array);

  for (let i = 0; i < array.length; i += 4) {
    arr[i] = array[i] == 0;
    // console.log(arr[i]);
  }

  for (let i = 0; i < height - 1; i++) {
    diArr[i] = arr.slice(i * width, width * (i + 1));
    // console.log(diArr[i]);
    // console.log(i);
  }

  canvasSDF = document.getElementById("sdf");
  contextSDF = canvasSDF.getContext("2d");

  diArr = computeSdf(diArr);

  // let i, j;

  // let drawAray = contextSDF.getImageData(0, 0, BigInt(width), BigInt(height));
  // for (i = 0; i < height; i++) {
  //   for (j = 0; j < width; j++) {
  //     drawAray.data[4 * (i * width + j)] = arr[i][j];
  //     drawAray.data[4 * (i * width + j) + 1] = arr[i][j];
  //     drawAray.data[4 * (i * width + j) + 2] = arr[i][j];
  //     drawAray.data[4 * (i * width + j) + 3] = 255;
  //   }
  // }

  // contextSDF.putImageData(drawAray, 0, 0);
}

function main() {
  let fileInput = document.querySelector("#img");
  fileInput.addEventListener("change", () => {
    let fileUrl = URL.createObjectURL(fileInput.files[0]);

    const img = new Image(400, 500);
    img.src = fileUrl;

    const img1 = new Image(400, 500);
    img1.src = fileUrl;

    img.onload = () => {
      canvasOrig = document.getElementById("original");
      contextOrig = canvasOrig.getContext("2d");

      canvasOrig.width = img.naturalWidth;
      canvasOrig.height = img.naturalHeight;
      // (canvasSDF.width = img.width), (canvasSDF.height = img.height);

      contextOrig.drawImage(img, 0, 0);
    };

    img1.onload = () => {
      canvasFiltred = document.getElementById("filtred");
      contextFiltred = canvasFiltred.getContext("2d");

      canvasFiltred.width = img1.naturalWidth;
      canvasFiltred.height = img1.naturalHeight;

      // canvasSDF.width = img1.naturalWidth;
      // canvasSDF.height = img1.naturalHeight;

      contextFiltred.drawImage(img1, 0, 0);
      let arr = contextFiltred.getImageData(
        0,
        0,
        canvasFiltred.width,
        canvasFiltred.height
      );

      for (
        let i = 0;
        i < canvasFiltred.width * canvasFiltred.height * 4;
        i += 4
      ) {
        let x = (arr.data[i] + arr.data[i + 1] + arr.data[i + 2]) / 765;
        arr.data[i] = arr.data[i + 1] = arr.data[i + 2] = x >= 0.35 ? 255 : 0;
        arr.data[i + 3] = 255;
      }

      // for (let i = 0; i < canvasFiltred.height; i++) {
      //   for (let j = 0; j < canvasFiltred.width; j++) {
      //     array[i][j] = arr.data[4 * (i * canvasFiltred.width + j)] == 0;
      //   }
      // }

      contextFiltred.putImageData(arr, 0, 0);
      let array = arr.data;
      fillArray(array, canvasFiltred.width, canvasFiltred.height);

      // array = computeSdf(array);
      // for (let i = 0; i < canvasFiltred.height; i++) {
      //   for (let j = 0; j < canvasFiltred.width; j++) {
      //     arr.data[4 * (i * canvasFiltred.width + j)] =
      //       arr.data[4 * (i * canvasFiltred.width + j) + 1] =
      //       arr.data[4 * (i * canvasFiltred.width + j) + 2] =
      //         array[i][j] * 5;
      //   }
      // }
    };
  });
}

window.addEventListener("load", () => main());
