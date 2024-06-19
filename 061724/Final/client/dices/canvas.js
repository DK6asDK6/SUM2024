import { timer } from "./timer/timer";
import shader from "./rnd/shd/shd";
import { vec3, mat4 } from "../mth/mth_def";
import render from "./rnd/rnd";
import figure from "./Plato/plato";

let rnd, prim, workTime, shd, fig;

const draw = () => {
  workTime.responce();

  rnd.render();

  const date = new Date();
  let t =
    date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000;

  prim.world = mat4
    .rotate(60 * t, vec3(-10, 14, 20))
    .mul(mat4.translate(vec3(0, Math.sin(t * 4), 0)));

  shd.apply();

  prim.draw(rnd);

  window.requestAnimationFrame(draw);
};

export function launchCanvas() {
  rnd = render(document.getElementById("figure"));

  workTime = new timer();
  workTime.responce();

  fig = figure();
  fig.setD10();

  shd = shader(rnd, "default");

  prim = fig.makePrim(shd);

  draw();
}
