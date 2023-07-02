import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// r = 6371 km
class Earth {
    constructor(scene, position, sizeFactor) {
        this.radius = 6371;
        this.sizeFactor = sizeFactor;
        this.position = position;
        this.mesh = null;

        this.init(scene);
    }

    init(scene) {
        // earth
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius * this.sizeFactor, 40, 40),
            new THREE.ShaderMaterial({
                vertexShader: vertexShader(),
                fragmentShader: fragmentShader(),
                uniforms: {
                    planetTexture: {
                        value: loader.load('public/earth_8k.jpg')
                    }
                }
            })
        );
        this.mesh.position.x = this.position.x;
        scene.add(this.mesh);
        // earth atmosphre

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius * this.sizeFactor, 40, 40),
            new THREE.ShaderMaterial({
                vertexShader: vertexShader_atmosphere(),
                fragmentShader: fragmentShader_atmosphere(),
                uniforms: {
                    atmosphereColor: {
                        value: new THREE.Vector3(0.3,0.0,1.0)
                    }
                },
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            })
        );

        atmosphere.scale.set(1.2, 1.2, 1.2);
        atmosphere.position.x = this.position.x;
        scene.add(atmosphere);
    }
}

function vertexShader() {

    return `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main() {
            vertexUV = uv;
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
        }
    `
}

function fragmentShader() {

    return `
        uniform sampler2D planetTexture;
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main() {
            float intensity = 1.05 - dot(vertexNormal, vec3(0.0,0.0,1.0));
            vec3 atmosphere = vec3(0.0,0.0,1.0) * pow(intensity, 1.5);
            gl_FragColor = vec4(atmosphere + texture2D(planetTexture, vertexUV).xyz, 1.0);
        }
    `
}

function vertexShader_atmosphere() {

    return `
        varying vec3 vertexNormal;

        void main() {
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
        }
    `
}

function fragmentShader_atmosphere() {

    return `
        uniform vec3 atmosphereColor;
        varying vec3 vertexNormal;

        void main() {
            float intensity = pow(0.5 - dot(vertexNormal, vec3(0,0,1.0)), 2.0);
            gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
        }
    `
}

// r = 1737 km
export class Moon {
    constructor(sizeFactor) {
        this.geometry = new THREE.SphereGeometry(1737 * sizeFactor, 40, 40);
        this.material = new THREE.MeshPhysicalMaterial({
            map: loader.load('public/moon_8k.jpg'),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}

export default Earth;

