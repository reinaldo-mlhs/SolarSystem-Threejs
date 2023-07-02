import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// r = 2439 km
class Mercury {
    constructor(sizeFactor) {
        this.orbit = new THREE.Object3D();
        this.geometry = new THREE.SphereGeometry(2439 * sizeFactor, 40, 40);
        this.material = new THREE.MeshPhysicalMaterial({
            map: loader.load('public/mercury.jpg'),
        });
        this.planet = new THREE.Mesh(this.geometry, this.material);
    }
}

export default Mercury;

