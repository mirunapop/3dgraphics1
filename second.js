import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from './FirstPersonControls';



const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 15, -22);
const fpControls = new FirstPersonControls( camera, renderer.domElement );
orbit.update();

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = 'ground';

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial( { wireframe: true } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.x = -40



const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1; //pos a
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;//pos b

    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(function(intersect) {
		console.log(intersect.point.x)
        if(intersect.object.name === 'ground') {
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
			// console.log(intersect.point.x)
			// console.log(highlightPos.x);

            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

            const objectExist = objects.find(function(object) {
                return (object.position.x === highlightMesh.position.x)
                && (object.position.z === highlightMesh.position.z)
            });

            if(!objectExist)
                highlightMesh.material.color.setHex(0xFFFFFF);
            else
                highlightMesh.material.color.setHex(0xFF0000);
        }
    });
});

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xFFEA00
    })
);

const objects = [];

window.addEventListener('mousedown', function() {
    const objectExist = objects.find(function(object) {
        return (object.position.x === highlightMesh.position.x)
        && (object.position.z === highlightMesh.position.z)
    });

    if(!objectExist) {
        intersects.forEach(function(intersect) {
            if(intersect.object.name === 'ground') {
                const sphereClone = sphereMesh.clone();
                sphereClone.position.copy(highlightMesh.position);
                scene.add(sphereClone);
                objects.push(sphereClone);
                highlightMesh.material.color.setHex(0xFF0000);
            }
        });
    }
    console.log(scene.children.length);
});

function animate(time) {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
    objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
	fpControls.update(0.3);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// window.addEventListener('resize', function() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });