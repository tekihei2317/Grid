(() => {
  // canvas
  let canvas = null;
  let context = null;
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;

  // canvas
  const GRID_WIDTH = 23;
  const GRID_HEIGHT = 23;
  const GRID_SIZE = 50;

  // camera
  let camera = null;

  // keyboard
  window.isKeydown = {};

  // cube
  let cube = null;

  window.addEventListener('load', () => {
    initialize();
  });

  function initialize() {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    camera = new Camera(GRID_SIZE / 2, 25, GRID_SIZE / 2, 0, 0);
    cube = new Cube(context);

    eventSetting();
    render();
  }

  function eventSetting() {
    window.addEventListener('keydown', (evnet) => {
      isKeydown[`${event.key}`] = true;
      // console.log(event.key);
    });
    window.addEventListener('keyup', (event) => {
      isKeydown[`${event.key}`] = false;
    });
  }

  function render() {
    context.fillStyle = '#0A0A0A';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // カメラの位置と向きの更新
    camera.update();
    // camera.pos.print();
    // cube.rotateY(Math.PI / 2 / 60);
    // cube.drawPoints(camera);

    for (let i = 0; i < GRID_HEIGHT; i++) for (let j = 0; j < GRID_WIDTH; j++) {
      const [x1, y1] = new Vector3((j + 0) * GRID_SIZE, 0, (i + 0) * GRID_SIZE).adjust(camera);
      const [x2, y2] = new Vector3((j + 1) * GRID_SIZE, 0, (i + 0) * GRID_SIZE).adjust(camera);
      const [x3, y3] = new Vector3((j + 1) * GRID_SIZE, 0, (i + 1) * GRID_SIZE).adjust(camera);
      const [x4, y4] = new Vector3((j + 0) * GRID_SIZE, 0, (i + 1) * GRID_SIZE).adjust(camera);

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.lineTo(x4, y4);

      context.closePath();
      context.strokeStyle = '0A0A0A';
      context.stroke();

      context.fillStyle = ((i + j) % 2 === 0 ? '#4C6085' : '#F2F7F2');
      context.fill();
    }
    cube.drawPolygons(camera);

    requestAnimationFrame(render);
  }
})();