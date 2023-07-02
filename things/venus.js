import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// r = 6051 km
class Venus {
    constructor(sizeFactor) {
        this.geometry = new THREE.SphereGeometry(6051 * sizeFactor, 40, 40);
        this.material = new THREE.MeshPhysicalMaterial({
            map: loader.load('public/venus.jpg'),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}

export default Venus;

