import { mat4Rotate, mat4Translate } from "./mth/mth_mat4";
import vec3 from "./mth/mth_vec3";
import { countNormals, primitive, vertex } from "./rnd/prim/prim";
import render from "./rnd/rnd";
import { timer } from "./timer/timer";

let rnd, prim, workTime;

const draw = () => {
  rnd.render();
  prim.world = mat4Rotate(Math.sin(workTime.localTime), vec3(1, 1, 3)).mul(
    mat4Translate(vec3(0, Math.cos(workTime.localTime * 2), 0))
  );
  prim.draw(rnd);
  rnd.render();
  window.requestAnimationFrame(draw);
};

function main() {
  rnd = render(document.getElementById("myCan"));

  workTime = new timer();
  workTime.responce("myCan:fps");

  let verts = [
    vertex(vec3(-1)),
    vertex(vec3(-1, 1, -1)),
    vertex(vec3(1, 1, -1)),
    vertex(vec3(1, -1, -1)),
    vertex(vec3(-1, -1, 1)),
    vertex(vec3(-1, 1, 1)),
    vertex(vec3(1, 1, 1)),
    vertex(vec3(1, -1, 1)),
  ];

  let inds = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 0, 1, 4, 1, 4, 5, 2, 6, 7, 2, 7, 3, 1,
    5, 6, 1, 6, 2, 0, 4, 7, 0, 7, 3,
  ];

  countNormals(verts, inds);

  prim = primitive(rnd, verts, inds);

  draw();
}

window.addEventListener("load", () => {
  main();
});

console.log("CGSG forever!!! mylib.js imported");
