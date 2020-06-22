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
  let cameraRotY = 0;

  window.addEventListener('load', () => {
    initialize();
  });

  function initialize() {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    camera = new Vector3(GRID_SIZE / 2, 10, GRID_SIZE / 2);

    eventSetting();
    render();
  }

  function eventSetting() {
    window.addEventListener('keydown', (evnet) => {
      console.log(event.key);
      if (event.key === 'ArrowRight') cameraRotY -= Math.PI / 10;
      else if (event.key === 'ArrowLeft') cameraRotY += Math.PI / 10;
      else if (event.key === 'ArrowUp') {
        camera.x += Math.cos(cameraRotY + Math.PI / 2) * 10;
        camera.z += Math.sin(cameraRotY + Math.PI / 2) * 10;
      }
      else if (event.key === 'ArrowDown') {
        camera.x -= Math.cos(cameraRotY + Math.PI / 2) * 10;
        camera.z -= Math.sin(cameraRotY + Math.PI / 2) * 10;
      }
      camera.print();
      console.log(cameraRotY);
    });
  }

  function render() {
    context.fillStyle = 'gray';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < GRID_HEIGHT; i++) for (let j = 0; j < GRID_WIDTH; j++) {
      const [x1, y1] = new Vector3((j + 0) * GRID_SIZE, 0, (i + 0) * GRID_SIZE).adjust(camera, cameraRotY);
      const [x2, y2] = new Vector3((j + 1) * GRID_SIZE, 0, (i + 0) * GRID_SIZE).adjust(camera, cameraRotY);
      const [x3, y3] = new Vector3((j + 1) * GRID_SIZE, 0, (i + 1) * GRID_SIZE).adjust(camera, cameraRotY);
      const [x4, y4] = new Vector3((j + 0) * GRID_SIZE, 0, (i + 1) * GRID_SIZE).adjust(camera, cameraRotY);

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.lineTo(x4, y4);

      context.closePath();
      context.strokeStyle = 'black';
      context.stroke();

      context.fillStyle = ((i + j) % 2 === 0 ? 'black' : 'white');
      context.fill();
    }

    requestAnimationFrame(render);
  }
})();