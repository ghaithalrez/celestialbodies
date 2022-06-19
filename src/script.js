import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// import Planet from "./planet";
import grav from "./gravity";

//screen sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//init the scene
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const startTexture = textureLoader.load("/textures/starfield.jpg  ");
scene.background = startTexture;
const gui = new dat.GUI();

//camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.set(0, 0, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//axes helper
const axes = new THREE.AxesHelper();
scene.add(axes);

//Debug UI
const parameters = {
  vx: 0 * 10,
  vy: 0 * 10,
  t: 1,
  size: 0.1,
  mass: 200,
  clear: false,
  types: {
    star: true,
    gas: false,
    rocky: false,
    "icy gas": false,
  },
};
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

gui.add(parameters, "t", 1, 50, 0.1).name("Time Scale ");

let planetGui = gui.addFolder("Planet option");
//planetGui.add(parameters,'size',0,0.5,0.000001).name('Radiu (km)')
planetGui.add(parameters, "mass", 100, 100000, 10).name("Mass (kg)");
planetGui.add(parameters, "vx", -100, 100, 0.1).name(" Initial velocity X");
planetGui.add(parameters, "vy", -100, 100, 0.1).name("Initial velocity y");
planetGui
  .add(parameters, "clear")
  .name("clear all planets")
  .onChange((value) => {
    if (value == true) {
      gra.planets.forEach((planet) => {
        scene.remove(planet.planetMesh);
      });
      gra.planets.length = 0;
    }
  });

let planetType = planetGui.addFolder("Planet type");
planetType
  .add(parameters.types, "star")
  .name("star")
  .onChange(() => {
    Checked("star");
  })
  .listen();
planetType
  .add(parameters.types, "gas")
  .name("gas")
  .onChange(() => {
    Checked("gas");
  })
  .listen();
planetType
  .add(parameters.types, "rocky")
  .name("rocky")
  .onChange(() => {
    Checked("rocky");
  })
  .listen();
planetType
  .add(parameters.types, "icy gas")
  .name("icy gas")
  .onChange(() => {
    Checked("icy gas");
  })
  .listen();

function Checked(type) {
  for (const e in parameters.types) {
    parameters.types[e] = false;
  }
  parameters.types[type] = true;
}
let lightOption = gui.addFolder("Light option");
lightOption.add(ambientLight, "intensity", 0, 1, 0.001).name("ambient light");

let q = 1;
let t = 1;

///////////////////////////////////////////////////////////////////

/**
 *  grav
 * كلاس الجاذبية
 * يحتوي على
 * 1 مصفوفة الكواكب
 * 2 التوابع الخاصة بالجاذبية
 */
//Planet class
export default class Planet {
  x;
  y;
  z;
  ridus;
  mass;
  xvelocity;
  yvelocity;
  // create a planet
  constructor(position, mass, texture, velocity) {
    this.mass = mass;
    this.position = position;
    this.position.z = 0;
    this.x = position.x;
    this.y = position.y;
    this.z = 0;
    this.xvelocity = velocity.x + this.x;
    // console.log('xvelocity'+this.xvelocity)
    this.yvelocity = velocity.y + this.y;

    console.log("the  rad " + this.masstorad(mass));
    this.ridus = this.masstorad(mass);
    this.planetTexture = textureLoader.load(
      "/textures/planets/" + texture + ".jpg"
    );
    this.planetMaterial = new THREE.MeshStandardMaterial({
      map: this.planetTexture,
    });
    // this.planetMaterial.wireframe=ture
    this.planetGeometry = new THREE.SphereBufferGeometry(this.ridus, 50, 50);
    this.planetMesh = new THREE.Mesh(this.planetGeometry, this.planetMaterial);
    this.planetMesh.position.copy(position);

    scene.add(this.planetMesh);
    if (texture == "star") {
      this.addLight();
    }
    //console.log(this.planetMesh)
    //  planets.push(this)
    // q=planets;
    // console.log(q);
  }
  addLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.copy(this.position);
    directionalLight.position.z += 1;
    scene.add(directionalLight);
  }
  updateLightPosition() {}
  masstorad(mass) {
    return Math.log(mass) / 20;
  }
  //move the planet
  moveTo(x, y) {
    this.planetMesh.position.x = x;
    // this.planetMesh.position.
    this.planetMesh.position.y = y;
    console.log(this.planetMesh.position);
  }

  vector1 = new THREE.Vector2(0, 0);
  moves(b2) {
    let velocity = gra.calcVelocity(this, b2, t);
    this.x += velocity.x * t;
    this.y += velocity.y * t;
    // console.log('after : '+this.x)
    this.xvelocity = velocity.x;
    this.yvelocity = velocity.y;
    this.planetMesh.position.x = this.x;
    this.planetMesh.position.y = this.y;
  }
  increase(x, y) {
    this.planetMesh.position.x = this.planetMesh.position.x + x;
    this.planetMesh.position.y = this.planetMesh.position.y + y;
    console.log(this.planetMesh.position);
  }
}
// planets =[]
const G = 100;
/**
 *
 * نهاية كلاس الجاذبية
 */
////////////////////////////////////////////////////

const material = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});

const points = [];
/////تابع رسم خط مستقيم بين كوكبين
///بتبعتول الكوكبين وبيرسم خط بيناتن
function drawline(b1, b2) {
  points.push(new THREE.Vector3(b1.x, b1.y, 0));
  //points.push( new THREE.Vector3(0,1, 0 ) );
  points.push(new THREE.Vector3(b2.x, b2.y, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);
  scene.add(line);
  // line.position.x=1
}

////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * class planet
 * كلاس الكوكب :
 * من خلال استدعاء الكونستراكتر الخاص به
 * نستيطع انشاء كوكب
 * لاحقا يتم اضافتها الى مصفوفة الكواكب الموجودة
 * في كلاس الجاذبية
 *
 */
const gra = new grav();

/**
 * نهاية كلاس الكوكب
 */

function getChecked() {
  for (const e in parameters.types) {
    if (parameters.types[e]) return e;
  }
}

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth),
    (sizes.height = window.innerHeight),
    (camera.aspect = sizes.width / sizes.height);
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

const mouse = new THREE.Vector2();
const intersectionpoint = new THREE.Vector3();
const plannormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", function (e) {
  mouse.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
  plannormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(plannormal, scene.position);
  plane.normal.set(0, 6.123233995736766e-17, 1);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionpoint);
});
window.addEventListener("dblclick", (event) => {
  gra.planets.push(
    new Planet(
      intersectionpoint,
      parameters.mass,
      getChecked(),
      new THREE.Vector2(parameters.vx, parameters.vy)
    )
  );
  // console.log('x palnet is '+gra.planets[ii].x);
  //console.log(gra.planets[ii].x) ;
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enableRotate = false;
const clock = new THREE.Clock();
let maxt = parameters.t * 10e-6;

const tick = () => {
  //console.log(gra.planets.p)
  controls.update();
  maxt = parameters.t * 10e-6;
  t = maxt;
  if (gra.planets.length > 1)
    for (let i = 1; i < gra.planets.length; i++)
      for (let j = i - 1; j >= 0; j--) {
        gra.planets[i].moves(gra.planets[j]);
        gra.planets[j].moves(gra.planets[i]);
      }

  const elpasedTime = clock.getElapsedTime();
  gra.planets.forEach((planet) => {
    planet.planetMesh.rotation.y = elpasedTime * 0.2;
  });
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
