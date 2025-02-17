import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export async function generateThumbnail(modelUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#272727');
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 300);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 10);
    light.position.set(0, 20, 0);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

        camera.position.set(center.x, center.y, center.z + cameraZ);
        camera.lookAt(center);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(center.x, center.y, center.z);
        controls.update();

        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/png');
        resolve(dataUrl);

        // Clean up
        renderer.dispose();
      },
      undefined,
      (error) => reject(error)
    );
  });
}

