import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function threeInit(sceneWidth: number, sceneHeight: number) {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sceneWidth, sceneHeight);
  renderer.setPixelRatio(devicePixelRatio)
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    sceneWidth / sceneHeight,
    0.1,
    1000
  );
  
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.maxPolarAngle = Math.PI / 2
  
  camera.position.set(30, 20, 30);
  orbit.update();
  renderer.setClearColor('lightblue');
  
  const axesHelper = new THREE.AxesHelper(15);
  scene.add(axesHelper);

  return {
    camera,
    scene, 
    renderer,
    orbit 
  }
}

