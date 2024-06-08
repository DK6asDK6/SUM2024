import vec3 from "./mth_vec3";
import mat4, {
  mat4Ortho,
  mat4Frustum,
  mat4View,
  mat4Scale,
  mat4Translate,
  mat4RotateZ,
  mat4RotateY,
  mat4RotateX,
  mat4Rotate,
} from "./mth_mat4";
import camera from "./mth_cam";

export {
  vec3,
  mat4,
  camera,
  mat4Ortho,
  mat4Frustum,
  mat4View,
  mat4Scale,
  mat4Translate,
  mat4RotateZ,
  mat4RotateY,
  mat4RotateX,
  mat4Rotate,
};

export function R2D(degree) {
  return (degree * Math.PI) / 180;
}
export function D2R(radian) {
  return (radian * 180) / Math.PI;
}
