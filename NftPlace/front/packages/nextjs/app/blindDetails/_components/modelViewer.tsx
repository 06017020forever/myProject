import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface ModelViewerProps {
    glbUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ glbUrl }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!glbUrl || !canvasRef.current) return;
        console.log(glbUrl)
        const canvas = canvasRef.current;
        const context = canvas.getContext("webgl2");

        if (!context) {
            console.error("WebGL2 context is not available.");
            return;
        }
        canvas.width = window.innerWidth; // 或者设置你需要的宽度
        canvas.height = window.innerHeight; // 或者设置你需要的高度
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#272727");

        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Lighting
        const light = new THREE.HemisphereLight(0xffffff, 0x444444, 8);
        light.position.set(0, 20, 0);
        scene.add(light);

        // Load the GLB model
        const loader = new GLTFLoader();
        loader.load(
            glbUrl,
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);
                model.scale.set(0.3, 0.3, 0.3);

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);

                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2)) * 6;
                camera.position.z = cameraZ;

                const controls = new OrbitControls(camera, renderer.domElement);
                controls.target.set(0, 0, 0);
                controls.update();

                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                }
                animate();
            },
            undefined,
            (error) => console.error("Error loading model", error)
        );

        // Cleanup on unmount
        return () => {
            // Dispose of the WebGL resources
            renderer.dispose();
        };
    }, [glbUrl]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
        />
    );
};

export default ModelViewer;
