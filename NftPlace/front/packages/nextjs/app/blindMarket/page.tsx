"use client"

// import Box3D from './_components/Box3D';
// export const Home = () => {
//   return (
//     <div
//       style={{
//         position: 'relative',  // Change position to absolute for free positioning
//         top: '0px',           // Move the div 20px from the top
//         right: '10px',         // Move the div 20px from the right
//         width: '30vw',         // Set a width relative to the viewport width (60% of the viewport width)
//         height: '30vh',        // Set a height relative to the viewport height (60% of the viewport height)
//         backgroundColor: '#f0f0f0',
//         borderRadius: '10px',  // Optional: add rounded corners
//         padding: '1px',       // Optional: add padding inside the div
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: add some shadow for better look
//       }}
//     >
//       <h1
//         style={{
//           textAlign: 'center',
//           marginTop: '20px',
//           fontSize: '36px',
//           color: '#264653',
//         }}
//       >
//         3D 盲盒抽奖
//       </h1>
//       <Box3D />
//     </div>
//   );
// };


"use client"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useState, useRef, useEffect } from "react"
import { Case } from "./types/case"

interface BidProps {
  address: string;  // 声明 status 的类型
}

export const  CaseSelectionPage: React.FC<BidProps> = ({ address }) => {
  const [activeTab, setActiveTab] = useState<"containers" | "items">("containers")
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const cases: Case[] = [
    {
      id: "1",
      name: "",
      price: 1,
      imageUrl: "/image.png"
    },
  ]
  

  // useEffect(() => {
  //   if (!canvasRef.current || !cases.length) return;

  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("webgl2");

  //   if (!context) {
  //     console.error("WebGL2 context is not available.");
  //     return;
  //   }



  //   const scene = new THREE.Scene();
  //   scene.background = new THREE.Color("#121b27");

  //   const camera = new THREE.PerspectiveCamera(
  //     75,
  //     canvas.clientWidth / canvas.clientHeight,
  //     0.1,
  //     1000
  //   );
  //   const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
  //   renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  //   const light = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
  //   light.position.set(0, 10, 10);
  //   scene.add(light);

  //   const loader = new GLTFLoader();

   
  //   cases.forEach(({ imageUrl }) => {
  //     loader.load(
  //       imageUrl,
  //       (gltf) => {
  //         const model = gltf.scene;
  //         scene.add(model);
  //         model.scale.set(1, 1, 1);

  //         // Center the model
  //         const box = new THREE.Box3().setFromObject(model);
  //         const center = box.getCenter(new THREE.Vector3());
  //         model.position.sub(center);

  //         // Adjust camera distance based on model size
  //         const size = box.getSize(new THREE.Vector3());
  //         const maxDim = Math.max(size.x, size.y, size.z);
  //         const fov = camera.fov * (Math.PI / 180);
  //         const cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2)) * 10;
  //         camera.position.z = cameraZ;

  //         // Set camera position to adjust the angle (tilt)
  //         camera.position.set(0, 1, cameraZ);

  //         // Rotate model to achieve the tilt angle you desire
  //         model.rotation.x = Math.PI / 6; // Rotate the model by 30 degrees on X axis
  //         model.rotation.y = Math.PI / 4; // Rotate the model by 45 degrees on Y axis

  //         // Add orbit controls for user interaction
  //         const controls = new OrbitControls(camera, renderer.domElement);
  //         controls.target.set(0, 0, 0);
  //         controls.update();

  //         // Animation loop
  //         function animate() {
  //           requestAnimationFrame(animate);
  //           controls.update();
  //           renderer.render(scene, camera);
  //         }
  //         animate();
  //       },
  //       undefined,
  //       (error) => console.error("Error loading model", error)
  //     );
  //   });

    
  //   return () => {
  //     renderer.dispose();
  //   };
  // }, []);



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1B2838 0%, #0A1017 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {(['containers', 'items'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {cases.map((case_) => (
                <a
                  key={case_.id}
                  href={`/blindDetails/${address}/${case_.id}`}
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{
                    aspectRatio: '1',
                    position: 'relative',
                    marginBottom: '5px',
                    height: "250px",
                    width: "180px"
                  }}>

<img src={case_.imageUrl} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />

{/* 
                    <canvas
                      ref={canvasRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                    /> */}
                  </div>
                  <div style={{
                    color: '#fff',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {case_.name}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px'
                  }}>
                    {case_.price.toFixed(2)}ETH
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseSelectionPage;  