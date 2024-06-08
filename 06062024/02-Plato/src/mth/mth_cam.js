import vec3 from "./mth_vec3";
import mat4, { mat4Frustum, mat4View } from "./mth_mat4";

// Camera class.
class _camera {
  constructor() {
    this.loc = vec3();
    this.at = vec3();
    this.dir = vec3();
    this.right = vec3();
    this.up = vec3();
    this.matView = mat4();
    console.log(this.matView);
    this.matProj = mat4();
    this.matVP = mat4();
    this.frameH = this.frameW = 1;

    this.setPos(vec3(5), vec3(), vec3(0, 1, 0));
    this.setProj(0.1, 0.1, 100000);
  }

  /**
   * Set camera function
   * @param {*vec3} loc
   * @param {*vec3} at
   * @param {*vec3} up
   */
  setPos(loc, at, up) {
    this.matView = mat4View(loc, at, up);
    console.log(this.matView);
    this.right = vec3(
      this.matView.m[0][0],
      this.matView.m[1][0],
      this.matView.m[2][0]
    );
    this.up = vec3(
      this.matView.m[0][1],
      this.matView.m[1][1],
      this.matView.m[2][1]
    );
    this.dir = vec3(
      -this.matView.m[0][2],
      -this.matView.m[1][2],
      -this.matView.m[2][2]
    );

    this.loc = loc;
    this.at = at;
    this.matVP = this.matView.mul(this.matProj);
  } // End of 'setPos' function

  /**
   * Set camera frame size function
   * @param {*float} projSize
   * @param {*float} projDist
   * @param {*float} projFarClip
   */
  setProj(projSize, projDist, projFarClip) {
    this.projDist = projDist;
    this.projFarClip = projFarClip;

    let rx, ry;

    rx = ry = this.projSize = projSize;

    if (this.frameW >= this.frameH) rx *= this.frameW / this.frameH;
    else ry *= this.frameH / this.frameW;

    this.wp = rx;
    this.hp = ry;
    this.matProj = mat4Frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      this.projDist,
      this.projFarClip
    );
    this.matVP = this.matView.mul(this.matProj);
  }

  /**
   * Setting projection data function.
   * @param {*number} frameW
   * @param {*number} frameH
   */
  setFrameSize(frameW, frameH) {
    this.frameW = frameW;
    this.frameH = frameH;
    this.setProj(this.projSize, this.projDist, this.projFarClip);
  }
} // end of '_camera' class

function camera() {
  return new _camera();
}

export default camera;
