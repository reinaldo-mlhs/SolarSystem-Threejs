import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


import Sun from './things/sun';
import Mercury from './things/mercury';
import Venus from './things/venus';
import Earth, { Moon } from './things/earth';
import Mars from './things/mars';


class CameraTarget {
    constructor(initTarget) {
        this.target = initTarget;
        this.offset = new THREE.Vector3(0.3, 0.1, 0);
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000000);

const canvas = document.getElementById("threejs");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/// BACKGROUND ///

const backgroundLoader = new THREE.CubeTextureLoader();
const backgroundTexture = backgroundLoader.load([
    'public/stars.jpg',
    'public/stars.jpg',
    'public/stars.jpg',
    'public/stars.jpg',
    'public/stars.jpg',
    'public/stars.jpg'
]);
scene.background = backgroundTexture;

/// LIGHT ///

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0);
scene.add(light);

/// OBJECTS ///

const loader = new THREE.TextureLoader();
const distanceFactor = 0.00001;
let sizeFactor = 0.0001;

// r = 696342 km
const sun = new Sun(scene, sizeFactor).mesh;
// scene.add(sun);

// r = 2439 km
// dS = 5800000 km
const mercury = new Mercury(sizeFactor);
scene.add(mercury.orbit);
mercury.planet.position.x = 58000000 * distanceFactor;
mercury.orbit.add(mercury.planet);

// r = 6051 km
// dS = 6700000 km
const venus = new Venus(sizeFactor).mesh;
venus.position.x = 67000000 * distanceFactor;
sun.add(venus);

// r = 6371 km
// dS = 150000000 km
const earth = new Earth(
    sun, 
    new THREE.Vector3(150000000 * distanceFactor, 0.0, 0.0),
    sizeFactor
).mesh;


// r = 1737 km
// dE = 238855 km
const moon = new Moon(sizeFactor).mesh;
moon.position.x = 384400 * (distanceFactor * 5);
earth.add(moon);

// r = 3389 km
// dS = 22800000 km
const mars = new Mars(sizeFactor).mesh;
mars.position.x = 228000000 * distanceFactor;
sun.add(mars);

/// CAMERA ///

camera.position.z = 150;
const cameraTarget = new CameraTarget(sun);

const controls = new OrbitControls(camera, renderer.domElement);

/// GUI ///
// const params = {
//     sizeFactor: 0,
// };

// const gui = new GUI();
// gui.add(params, "sizeFactor", 0.0, 1.0).step(0.0001).onChange(function (value) {
//     sizeFactor = Number(value);
// });

const btns = document.getElementsByClassName("things-link");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", (e) => {
        const thingId = e.target.id;
        handleClick(thingId);
    })
}

function handleClick(thing) {
    const things = [
        {
            "id": "sun-link",
            "mesh": sun,
            "zoom": 150
        },
        {
            "id": "mercury-link",
            "mesh": mercury.planet,
            "zoom": 2
        },
        {
            "id": "venus-link",
            "mesh": venus,
            "zoom": 2
        },
        {
            "id": "earth-link",
            "mesh": earth,
            "zoom": 2
        },
        {
            "id": "moon-link",
            "mesh": moon,
            "zoom": 2
        },
        {
            "id": "mars-link",
            "mesh": mars,
            "zoom": 2
        },
    ];

    const currentThing = things.find(t => t["id"] === thing);
    cameraTarget.target = currentThing["mesh"];
    cameraTarget.target.getWorldPosition(controls.target);

    controls.maxDistance = currentThing["zoom"];
    controls.update();
    controls.maxDistance = Infinity;
}

/// ANIMATE ///

function animate() {
    requestAnimationFrame(animate);

    mercury.orbit.rotation.y += 0.0001;
    // sun.rotation.y += 0.001;
    // earth.rotation.y += 0.001;

    cameraTarget.target.getWorldPosition(controls.target);
    // controls.maxDistance = 2;
    controls.update();

    renderer.render(scene, camera);
}
animate();
