// カメラを管理するクラス
class Camera {
  /**
   * @constructor
   * @param {number} x -x座標
   * @param {number} y -y座標
   * @param {number} z -z座標
   * @param {number} rotY - y軸回りの回転角(ラジアン) 
   */
  constructor(x, y, z, rotY) {
    this.pos = new Vector3(x, y, z);
    this.rotY = rotY;
  }

  /**
   * キー入力に応じて位置を角度を更新する
   */
  update() {
    if (isKeydown.ArrowRight === true) this.rotY -= Math.PI / 2 / 120;
    if (isKeydown.ArrowLeft === true) this.rotY += Math.PI / 2 / 120;

    const dir = this.rotY + Math.PI / 2;
    if (isKeydown.ArrowUp === true) {
      this.pos.x += Math.cos(dir) * 5;
      this.pos.z += Math.sin(dir) * 5;
    }
    if (isKeydown.ArrowDown === true) {
      this.pos.x -= Math.cos(dir) * 5;
      this.pos.z -= Math.sin(dir) * 5;
    }
    if (isKeydown.Control === true) this.pos.y += 1;
    if (isKeydown.Shift === true) this.pos.y -= 1, this.pos.y = Math.max(this.pos.y, 20);
  }
}