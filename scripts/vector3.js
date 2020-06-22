// 3次元ベクトル(3次元の点)を扱うクラス
class Vector3 {
  /**
   * @constructor
   * @param {number} x - x成分
   * @param {number} y - y成分
   * @param {number} z - z成分
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // 基本演算
  add(vec) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }
  sub(vec) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }
  mul(k) {
    return new Vector3(this.x * k, this.y * k, this.z * k);
  }
  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }
  cross(vec) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }

  // 大きさに関する演算
  norm() {
    return Math.hypot(this.x, this.y, this.z);
  }
  normalize() {
    console.assert(this.norm() !== 0, 'zero division occured!');
    return this.mul(1 / this.norm());
  }

  /**
   * x軸回りに回転する(時計回り...?)
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateX(theta) {
    const A = [
      [1, 0, 0],
      [0, Math.cos(theta), -Math.sin(theta)],
      [0, Math.sin(theta), Math.cos(theta)]
    ];
    const x = A[0][0] * this.x + A[0][1] * this.y + A[0][2] * this.z;
    const y = A[1][0] * this.x + A[1][1] * this.y + A[1][2] * this.z;
    const z = A[2][0] * this.x + A[2][1] * this.y + A[2][2] * this.z;
    return new Vector3(x, y, z);
  }
  /**
   * y軸回りに回転する(時計周り...?)
   * @param {number} theta - 回転角度(ラジアン)
   */
  rotateY(theta) {
    const A = [
      [Math.cos(theta), 0, -Math.sin(theta)],
      [0, 1, 0],
      [Math.sin(theta), 0, Math.cos(theta)]
    ];
    /*
     const A = [
       [Math.cos(theta), 0, -Math.sin(theta)],
       [0, 1, 0],
       [Math.sin(theta), 0, Math.cos(theta)]
     ]
     */
    const x = A[0][0] * this.x + A[0][1] * this.y + A[0][2] * this.z;
    const y = A[1][0] * this.x + A[1][1] * this.y + A[1][2] * this.z;
    const z = A[2][0] * this.x + A[2][1] * this.y + A[2][2] * this.z;
    return new Vector3(x, y, z);
  }
  /**
   * 成分を表示する(デバッグ用)
   */
  print() {
    console.log(`(${this.x}, ${this.y}, ${this.z})`);
  }

  /**
   * カメラからの相対位置(を補正したもの)を返す
   */
  adjust(camera) {
    const relativePos = this.sub(camera.pos).rotateY(-camera.rotY).rotateX(-camera.rotX);
    if (relativePos.z <= 0) {
      return [
        relativePos.x / 0.1 * 1000 + 300,
        -relativePos.y / 0.1 * 1000 + 300
      ];
    }
    return [
      relativePos.x / relativePos.z * 1000 + 300,
      -relativePos.y / relativePos.z * 1000 + 300
    ];
  }
}