import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// r = 696342 km
class Sun {
    constructor(scene, sizeFactor) {
        this.sizeFactor = sizeFactor;
        this.mesh = null;
        this.radius = 696342;
        this.init(scene);
    }

    init(scene) {
        // sun
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius * this.sizeFactor, 40, 40),
            new THREE.ShaderMaterial({
                vertexShader: vertexShader(),
                fragmentShader: fragmentShader(),
                uniforms: {
                    sunTexture: {
                        value: loader.load('public/sun_4k.jpg')
                    }
                }
            })
        );
        scene.add(this.mesh);
        // sun glow

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius * this.sizeFactor, 40, 40),
            new THREE.ShaderMaterial({
                vertexShader: vertexShader_atmosphere(),
                fragmentShader: fragmentShader_atmosphere(),
                uniforms: {
                    atmosphereColor: {
                        value: new THREE.Vector3(1.0,1.0,0.0)
                    }
                },
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            })
        );

        atmosphere.scale.set(1.2, 1.2, 1.2);
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
        uniform sampler2D sunTexture;
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main() {
            gl_FragColor = vec4(texture2D(sunTexture, vertexUV).xyz, 1.0);
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

export default Sun;
