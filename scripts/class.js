// カメラを管理するクラス
class Camera {
  /**
   * @constructor
   * @param {number} x - x座標
   * @param {number} y - y座標
   * @param {number} z - z座標
   * @param {number} rotX - x軸回りの回転角(ラジアン)
   * @param {number} rotY - y軸回りの回転角(ラジアン) 
   */
  constructor(x, y, z, rotX, rotY) {
    this.pos = new Vector3(x, y, z);
    this.rotX = rotX;
    this.rotY = rotY;
  }

  /**
   * キー入力に応じて位置を角度を更新する
   */
  update() {
    if (isKeydown.ArrowRight === true) this.rotY -= Math.PI / 2 / 120;
    if (isKeydown.ArrowLeft === true) this.rotY += Math.PI / 2 / 120;

    if (isKeydown.ArrowUp === true) this.rotX -= Math.PI / 2 / 240;
    if (isKeydown.ArrowDown === true) this.rotX += Math.PI / 2 / 240;


    const dir = this.rotY + Math.PI / 2;
    if (isKeydown.w === true) {
      this.pos.x += Math.cos(dir) * 5;
      this.pos.z += Math.sin(dir) * 5;
    }
    if (isKeydown.s === true) {
      this.pos.x -= Math.cos(dir) * 5;
      this.pos.z -= Math.sin(dir) * 5;
    }
    if (isKeydown.a === true) this.pos.y += 2;
    if (isKeydown.d === true) this.pos.y -= 2, this.pos.y = Math.max(this.pos.y, 20);
  }
}

//　面の頂点のインデックスを持つクラス
class Polygon {
  /**
   * @constructor
   * @param {Array<number>} indexes - 頂点のインデックスの配列
   */
  constructor(indexes) {
    this.indexes = indexes;
    this.center = null;
    this.color = 'white';
    this.normalVector = null;
  }

  /**
   * 面を描画する
   * @param {CanvasRenderingContext2D} - 描画用のコンテキスト
   * @param {Array<Vector3>} points - 元の図形の点の集合
   */
  draw(context, points, camera) {
    context.beginPath();

    let first = true;
    this.indexes.forEach((i) => {
      const point = points[i];
      // const [x, y] = adjust(point.x, point.y, point.z);
      const [x, y] = point.adjust(camera);
      if (first === true) context.moveTo(x, y), first = false;
      else context.lineTo(x, y);
    });

    context.closePath();
    context.strokeStyle = 'black';
    context.stroke();
    context.fillStyle = this.color;
    context.fill();
  }

  /**
   * 面の情報(中心の座標、法線ベクトル)を再計算する
   * @param {Array<Vector3>} points - 元の図形の点の集合
   */
  update(points) {
    // 中心の座標を再計算する
    this.center = new Vector3(
      this.indexes.reduce((acc, idx) => acc + points[idx].x, 0) / this.indexes.length,
      this.indexes.reduce((acc, idx) => acc + points[idx].y, 0) / this.indexes.length,
      this.indexes.reduce((acc, idx) => acc + points[idx].z, 0) / this.indexes.length
    );

    // 法線ベクトルを再計算する
    const p0 = points[this.indexes[0]];
    const p1 = points[this.indexes[1]];
    const p2 = points[this.indexes[2]];
    this.normalVector = p1.sub(p0).cross(p2.sub(p1)).normalize();
    // this.normalVector = new Vector3(0, 1, 0);

    // 色を再計算する
    const light = new Vector3(1, -1, 1).normalize();
    const cos = this.normalVector.dot(light);
    this.color = this.calcColor(cos);
  }

  /**
   * 面の明るさを計算する
   * @param {number} cos - 光源と法線ベクトルの成す角の余弦
   */
  calcColor(cos) {
    const b = 120 + 120 * (-1) * cos;
    return `rgba(${b}, ${b}, ${b})`;
  }
}

// 図形(とりあえず立方体)を扱うクラス
class Cube {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} context - 描画用のコンテキスト
   */
  constructor(context) {
    const SIZE = 25;
    const point0 = new Vector3(525 + SIZE, 25 + SIZE, 525 + SIZE);
    const point1 = new Vector3(525 - SIZE, 25 + SIZE, 525 + SIZE);
    const point2 = new Vector3(525 - SIZE, 25 - SIZE, 525 + SIZE);
    const point3 = new Vector3(525 + SIZE, 25 - SIZE, 525 + SIZE);
    const point4 = new Vector3(525 + SIZE, 25 + SIZE, 525 - SIZE);
    const point5 = new Vector3(525 - SIZE, 25 + SIZE, 525 - SIZE);
    const point6 = new Vector3(525 - SIZE, 25 - SIZE, 525 - SIZE);
    const point7 = new Vector3(525 + SIZE, 25 - SIZE, 525 - SIZE);

    this.context = context;
    this.points = [point0, point1, point2, point3, point4, point5, point6, point7];
    this.polygons = [
      new Polygon([0, 1, 2, 3]),
      new Polygon([0, 4, 5, 1]),
      new Polygon([1, 5, 6, 2]),
      new Polygon([2, 6, 7, 3]),
      new Polygon([3, 7, 4, 0]),
      new Polygon([4, 7, 6, 5])
    ];
  }

  /**
   * 頂点を描画する
   */
  drawPoints(camera) {
    this.context.fillStyle = 'gray';
    for (const point of this.points) {
      // const [x, y] = adjust(point.x, point.y, point.z);
      const [x, y] = point.adjust(camera);
      console.log(x, y);
      this.context.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  /**
   * 面を描画する
   */
  drawPolygons(camera) {
    // 面の情報を更新する
    for (const polygon of this.polygons) polygon.update(this.points);
    // z座標の大きい順にソートする
    this.polygons.sort((a, b) => b.center.z - a.center.z);
    // 描画処理
    for (const polygon of this.polygons) polygon.draw(this.context, this.points, camera);
  }

  /**
   * x軸回りに回転する
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateX(theta) {
    this.points = this.points.map(point => point.rotateX(theta));
  }
  /**
   * y軸回りに回転する
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateY(theta) {
    this.points = this.points.map(point => point.rotateY(theta));
  }
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function adjust(x, y, z) {
  const cameraZ = 1000;
  const screenZ = 1000;
  return [
    x / (z + cameraZ) * screenZ + CANVAS_WIDTH / 2,
    -y / (z + cameraZ) * screenZ + CANVAS_HEIGHT / 2
  ];
}