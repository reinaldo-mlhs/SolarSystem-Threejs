import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// r = 3389 km
class Mars {
    constructor(sizeFactor) {
        this.geometry = new THREE.SphereGeometry(3389 * sizeFactor, 40, 40);
        this.material = new THREE.MeshPhysicalMaterial({
            map: loader.load('public/mars.jpg'),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}

export default Mars;

