import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';

export type WallObject = RoundedWall | StraightWall;
export type RoundedWall = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>
export type StraightWall = THREE.Mesh<ConvexGeometry, THREE.MeshBasicMaterial>