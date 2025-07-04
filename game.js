// Initialize scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 1.6;
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,7.5);
scene.add(light);

// Floor
let floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100,100),
  new THREE.MeshPhongMaterial({color:0x222222})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Controls
let moveForward=false, moveBackward=false, moveLeft=false, moveRight=false;
let velocity = new THREE.Vector3();

document.addEventListener('keydown', e=>{
  if(e.code==='KeyW') moveForward=true;
  if(e.code==='KeyS') moveBackward=true;
  if(e.code==='KeyA') moveLeft=true;
  if(e.code==='KeyD') moveRight=true;
});
document.addEventListener('keyup', e=>{
  if(e.code==='KeyW') moveForward=false;
  if(e.code==='KeyS') moveBackward=false;
  if(e.code==='KeyA') moveLeft=false;
  if(e.code==='KeyD') moveRight=false;
});

let yaw=0, pitch=0, mouseDown=false;
document.body.addEventListener('mousedown', ()=>{mouseDown=true;});
document.body.addEventListener('mouseup', ()=>{mouseDown=false;});
document.body.addEventListener('mousemove', e=>{
  if(mouseDown){
    yaw -= e.movementX*0.002;
    pitch -= e.movementY*0.002;
    pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
  }
});

// Bullets
let bullets=[];
function shoot(){
  let b = new THREE.Mesh(
    new THREE.SphereGeometry(0.05,8,8),
    new THREE.MeshBasicMaterial({color:0xff0000})
  );
  b.position.copy(camera.position);
  b.direction = new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));
  bullets.push(b);
  scene.add(b);
}
document.addEventListener('click', shoot);

function animate(){
  requestAnimationFrame(animate);

  // Move
  velocity.set(0,0,0);
  let speed=0.1;
  if(moveForward) velocity.z-=speed;
  if(moveBackward) velocity.z+=speed;
  if(moveLeft) velocity.x-=speed;
  if(moveRight) velocity.x+=speed;

  camera.position.add(velocity.applyEuler(new THREE.Euler(0,yaw,0)));

  camera.rotation.set(pitch,yaw,0,'YXZ');

  bullets.forEach(b=>{
    b.position.add(b.direction.clone().multiplyScalar(0.5));
  });

  renderer.render(scene,camera);
}
animate();
