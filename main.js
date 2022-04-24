import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from './FirstPersonControls';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const fpControls = new FirstPersonControls(camera, renderer.domElement);


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial( { wireframe: true } );
const cube = new THREE.Mesh( geometry, material );
const sphere_geometry = new THREE.SphereGeometry(10, 10, 10);
const sphere = new THREE.Mesh(sphere_geometry, material)


const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshBasicMaterial({
      // side: THREE.DoubleSide,
      visible: false
  })
);

const lidMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.8,0.2,0.8),
  new THREE.MeshBasicMaterial({
      color: 0xFFFF00
  })
);
// window.addEventListener('mousemove', )

//OUR EFFIN OWN MOUSEPOSITION
const cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.8,0.8,0.8),
  new THREE.MeshBasicMaterial({
      color: 0x0000FF
  })
);

for(let x = 0; x<5; x++){
  for(let y = 0; y<5; y++){
    for(let z = 0; z<5; z++){
      //add two colors
      const sphereClone = cubeMesh.clone();
      sphereClone.position.set(2*x+0.5, y+0.5, 2*z+0.5);
      scene.add(sphereClone);
    }

  }
}


planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = 'ground';

const grid = new THREE.GridHelper(1000, 1000);
scene.add(grid);
//scene.add( cube );
scene.add(sphere);
sphere.position.x = 40
cube.position.set(5.5,0.5,0.5)

camera.position.set(10, 0, 10);
console.log(scene.children);


fpControls.enabled = false;
fpControls.activeLook = false; //will change depending on .dragOn
fpControls.lookVertical = true;


fpControls.constrainVertical = true;
fpControls.verticalMin = Math.PI/ 1.7;
fpControls.verticalMax = Math.PI / 2.3;


function animate() {
  requestAnimationFrame( animate );
  fpControls.update(0.3);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};




animate();