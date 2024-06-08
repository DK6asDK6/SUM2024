import vec3 from "../../mth/mth_vec3";

class _vertex {
  constructor(pos, norm) {
    this.pos = pos;
    this.norm = norm;
  }
}

export function vertex(pos, norm) {
  return new _vertex(pos, norm);
}

export function autoNormals(vertexes, indexes) {
  for (let i in vertexes) vertexes[i].norm = vec3();

  for (let i = 0; i < indexes; i += 3) {
    let n0 = indexes[i],
      n1 = indexes[i + 1],
      n2 = indexes[i + 2];
    let p0 = vertexes[n0].pos,
      p1 = vertexes[n1].pos,
      p2 = vertexes[n2].pos,
      N = p1.sub(p0).cross(p2.sub(p0)).normalize();

    vertexes[n0].norm = vertexes[n0].norm.add(N);
    vertexes[n1].norm = vertexes[n1].norm.add(N);
    vertexes[n2].norm = vertexes[n2].norm.add(N);
  }

  for (let i in vertexes) vertexes[i].norm = vertexes[i].norm.normalize();
}

class _prim {
  constructor(rnd, vertexes, indexes) {
    let trimesh = [],
      i = 0;

    for (let v of vertexes) {
      trimesh[i++] = v.pos.x;
      trimesh[i++] = v.pos.y;
      trimesh[i++] = v.pos.z;
      trimesh[i++] = v.norm.x;
      trimesh[i++] = v.norm.y;
      trimesh[i++] = v.norm.z;
    }

    this.vertexArrayId = rnd.gl.createVertexArray();

    rnd.gl.bindVertexArray(this.vertexArrayId);
    this.vertexBufferId = rnd.gl.createBuffer();

    if (rnd.posLoc != -1) {
      rnd.gl.vertexAttribPointer(rnd.posLoc, 3, rnd.gl.FLOAT, false, 24, 0);
      //there we go
    }

    rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.indexBufferId);
    rnd.gl.bufferData(
      rnd.gl.ARRAY_BUFFER,
      new Float32Array(trimesh),
      rnd.gl.STATIC_DRAW
    );

    this.numOfElements = indexes.length;
  }
}

export function _prim(render, vertexes, indexes) {
  return new _prim(render, vertexes, indexes);
}
