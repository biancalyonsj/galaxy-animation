import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({width: 320});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const galaxyParameters = {
    count: 13000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}

let geometry;
let material;
let points;

// generate particles
function generateGalaxy(){
    // check if particles exists
    if (points){
        // free the memory
        geometry.dispose();
        material.dispose();
        // remove points from the scene
        scene.remove(points);
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry();
    // each vertex has x,y,z values
    const positions = new Float32Array(galaxyParameters.count * 3);
    // rgb
    const colors = new Float32Array(galaxyParameters.count * 3);

    /**
     * Color
     */
    const insideColor = new THREE.Color(galaxyParameters.insideColor);
    const outsideColor = new THREE.Color(galaxyParameters.outsideColor);


    // fill positions with random coordinates
    for (let i = 0; i < galaxyParameters.count; i++){
        const i3 = i * 3;

        // randomly place particles along the radus
        const radius = Math.random() * galaxyParameters.radius;
        // the further away from the center, the higher the angle
        const spinAngle = radius * galaxyParameters.spin;
        // calculate # of branches, convert to radians
        const branchAngle = (i % galaxyParameters.branches) / galaxyParameters.branches * Math.PI * 2;
        // condense the particles at the center of the branches, both negative and positive
        const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        // x coordinate, place the particles along branches
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        // y coordinate
        positions[i3 + 1] = randomY;
        // z coordinate, place the particles along branches
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // mix the two colors without changing the original colors
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / galaxyParameters.radius);

        // red color 
        colors[i3] = mixedColor.r;
        // green color
        colors[i3 + 1] = mixedColor.g;
        // blue color
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    );    

    /**
     * Material
     */
    material =  new THREE.PointsMaterial({
        size: galaxyParameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    /**
     * Create Points Mesh
     */

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

generateGalaxy();

/**
 * GUI
 */
gui.add(galaxyParameters, 'count').min(100).max(100000).step(100).name('number of stars').onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'size').min(0.001).max(0.1).step(0.001).name('size of stars').onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'radius').min(0.01).max(20).step(0.01).name('length of branches').onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'branches').min(2).max(20).step(1).name('number of branches').onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'spin').min(-5).max(5).step(0.001).name('angle of the spin').onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'randomness').min(0).max(2).step(0.001).name('randomn placement of stars').onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'insideColor').name('inside color').onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'outsideColor').name('inside color').onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

function animate(){
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
}

animate();