



















// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   // const [currentBaseAction, setCurrentBaseAction] = useState('idle');
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   });

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0xa0a0a0);
//       newScene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = false;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {
//         const model = gltf.scene;
//         newScene.add(model);

//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).castShadow = true;
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);



//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             // console.log(`Loaded base action: ${name}`, action); // 检查是否加载成功
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       requestAnimationFrame(animate);
//       if (!scene || !camera || !renderer || !stats || !mixer) return;

//       const delta = clock.getDelta();
//       mixer.update(delta);

//       // Update weights of all actions
//       Object.entries(baseActions.current).forEach(([name, settings]) => {
//         if (settings.action) {
//           // console.log(`Updating weight for action: ${name}, target weight: ${settings.weight}`);
//           const weight = settings.action.getEffectiveWeight();
//           const targetWeight = settings.weight;
//           if (weight !== targetWeight) {
//             const diff = targetWeight - weight;
//             const step = delta / transitionDuration;
//             if (Math.abs(diff) < step) {
//               settings.action.setEffectiveWeight(targetWeight);
//             } else {
//               settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//             }
//           }
//         }
//       });

//       renderer.render(scene, camera);
//       stats.update();
//     };
//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };

//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });
//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//       additiveActions.current[clip.name as keyof typeof additiveActions.current];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (name: string) => {
//     // if (currentBaseAction === name) return;

//     // const previousAction = baseActions.current[currentBaseAction]?.action;
//     console.log('setBaseAction', name);
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     // Fade out all actions
//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     // Fade in the next action if it's not None
//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     // Update weights
//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });

//     // setCurrentBaseAction(name);
//     crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };

//   return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default ThreeScene;



// 'use client'
// import { Object3D } from 'three';
// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot, AnimationActions } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<AnimationActions>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<AnimationActions>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   });
//   const [characterModel, setCharacterModel] = useState<THREE.SkinnedMesh | null>(null);

//   // const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [
//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',
//     },
//     // Add more items here
//   ];

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0xa0a0a0);
//       newScene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
//       setScene(newScene);

//       // Add lights
//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xcbcbcb, 0.5);
//       newScene.add(ambientLight);

//       // Add ground
//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       // Set up camera
//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       // Set up renderer
//       const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       // Set up controls
//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       // Set up stats
//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       // Load character model
//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {

//         const model = gltf.scene;
//         let skinnedMesh: THREE.SkinnedMesh | null = null;
//         // setCharacterModel(model);
//         newScene.add(model);

//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;

//             if (mesh instanceof THREE.SkinnedMesh) {
//               skinnedMesh = mesh; // Save the first SkinnedMesh found
//             }

//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               );
//             }
//           }
//         });

//         if (skinnedMesh) {
//           setCharacterModel(skinnedMesh);

//         } else {
//           console.warn("No SkinnedMesh found in the model.");
//         }

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);

//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);



//   const findBoneForCategory = (
//     category: string,
//     model: THREE.SkinnedMesh
//   ): THREE.Bone | null => {
//     const skeleton = model.skeleton;
//     let targetBone: THREE.Bone | null = null;

//     skeleton.bones.forEach((bone) => {
//       const boneName = bone.name.toLowerCase();

//       switch (category) {
//         case 'head':
//           if (boneName.includes('head') || boneName.includes('neck')) {
//             targetBone = bone;
//           }
//           break;
//         case 'face':
//         case 'mask':
//           if (boneName.includes('head')) {
//             targetBone = bone;
//           }
//           break;
//         case 'top':
//           if (boneName.includes('spine') || boneName.includes('chest')) {
//             targetBone = bone;
//           }
//           break;
//         case 'bottom':
//           if (boneName.includes('hips') || boneName.includes('pelvis')) {
//             targetBone = bone;
//           }
//           break;
//         default:
//           console.warn(`Unknown category: ${category}`);
//           break;
//       }
//     });

//     if (!targetBone) {
//       console.warn(`No bone found matching category "${category}"`);
//     }

//     return targetBone;
//   };



//   const handleSelectItem = async (item: CustomizationItem) => {
//     if (!scene || !characterModel) return;

//     // Remove previously equipped item
//     const existingItem = equippedItems[item.category];
//     if (existingItem) {
//       if (existingItem.parent) {
//         existingItem.parent.remove(existingItem);
//       }
//       scene.remove(existingItem);
//     }

//     const loader = new GLTFLoader();
//     try {
//       const gltf = await loader.loadAsync(item.modelPath);
//       const clothingModel = gltf.scene;

//       // Find the bone to attach to
//       const bone = findBoneForCategory(item.category, characterModel);

//       if (bone) {
//         console.log(`Found suitable bone: ${bone.name}`);

//         clothingModel.traverse((object) => {
//           if (object instanceof THREE.SkinnedMesh) {
//             const clothMesh = object;

//             // Get the original bones and inverse matrices
//             const originalBones = clothMesh.skeleton.bones;
//             const originalBindMatrix = clothMesh.bindMatrix.clone();
//             const originalMatrixWorld = clothMesh.matrixWorld.clone();

//             // Set up the mesh to use character's skeleton
//             clothMesh.skeleton = characterModel.skeleton;
//             clothMesh.bindMode = 'attached';

//             // Map bones from clothing to character skeleton
//             const boneMapping = new Map();
//             originalBones.forEach((originalBone) => {
//               const matchingBone = characterModel.skeleton.bones.find(
//                 (characterBone) => characterBone.name.toLowerCase() === originalBone.name.toLowerCase()
//               );
//               if (matchingBone) {
//                 boneMapping.set(originalBone, matchingBone);
//               }
//             });

//             // Update bone indices in geometry
//             const geometry = clothMesh.geometry;
//             if (geometry.getAttribute('skinIndex') && geometry.getAttribute('skinWeight')) {
//               const skinIndices = geometry.getAttribute('skinIndex').array;
//               const newSkinIndices = new Uint16Array(skinIndices.length);

//               for (let i = 0; i < skinIndices.length; i++) {
//                 const originalBone = originalBones[skinIndices[i]];
//                 const newBone = boneMapping.get(originalBone);
//                 if (newBone) {
//                   const newIndex = characterModel.skeleton.bones.indexOf(newBone);
//                   newSkinIndices[i] = newIndex;
//                 }
//               }

//               geometry.setAttribute('skinIndex', new THREE.BufferAttribute(newSkinIndices, 4));
//             }

//             // Set up materials
//             if (clothMesh.material) {
//               const materials = Array.isArray(clothMesh.material) 
//                 ? clothMesh.material 
//                 : [clothMesh.material];

//               materials.forEach((material) => {
//                 if (material instanceof THREE.Material) {
//                   material.needsUpdate = true;
//                   material.transparent = true;
//                   material.side = THREE.DoubleSide;
//                   material.depthWrite = true;
//                   material.depthTest = true;
//                 }
//               });
//             }

//             // Position and scale
//             clothMesh.position.set(0, 0, 0);
//             clothMesh.rotation.set(0, 0, 0);
//             clothMesh.scale.set(1, 1, 1);

//             // Add to scene and update matrices
//             scene.add(clothMesh);
//             clothMesh.updateMatrixWorld(true);

//             // Store the equipped item
//             setEquippedItems((prev) => ({
//               ...prev,
//               [item.category]: clothMesh,
//             }));

//             console.log(`Successfully attached ${item.name} to character`);
//           }
//         });

//         // Update equipment slots
//         setSlots((prev) =>
//           prev.map((slot) =>
//             slot.category === item.category ? { ...slot, item } : slot
//           )
//         );
//       } else {
//         console.error(`No suitable bone found for category: ${item.category}`);
//       }
//     } catch (error) {
//       console.error("Error loading model:", error);
//     }
//   };



//   useEffect(() => {
//     const animate = () => {
//       requestAnimationFrame(animate);
//       if (!scene || !camera || !renderer || !stats || !mixer) return;

//       const delta = clock.getDelta();

//       mixer.update(delta);

//       Object.entries(baseActions.current).forEach(([name, settings]) => {
//         if (settings.action) {
//           const weight = settings.action.getEffectiveWeight();
//           const targetWeight = settings.weight;
//           if (weight !== targetWeight) {
//             const diff = targetWeight - weight
//               ;
//             const step = delta / transitionDuration;
//             if (Math.abs(diff) < step) {
//               settings.action.setEffectiveWeight(targetWeight);
//             } else {
//               settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//             }
//           }
//         }
//       });

//       renderer.render(scene, camera);
//       stats.update();
//     };
//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);



//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find(s => s.id === slotId);
//     if (!slot?.item || !scene) return;

//     const model = equippedItems[slot.item.category];
//     if (model) {
//       if (model.parent) {
//         model.parent.remove(model);
//       }
//       scene.remove(model);
//     }

//     setEquippedItems(prev => {
//       const next = { ...prev };
//       delete next[slot.item!.category];
//       return next;
//     });

//     setSlots(prev => prev.map(s =>
//       s.id === slotId
//         ? { ...s, item: null }
//         : s
//     ));
//   };



//   const onWindowResize = () => {
//     if (!camera || !renderer) return;
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };





//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });



//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name] || additiveActions.current[clip.name];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (name: string) => {
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });

//     crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };


//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;

// 'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot, AnimationActions } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   });

//   const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [

//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',
//     },



//   ];

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0x1a1a1a);
//       newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//       newScene.add(ambientLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({
//         antialias: true,

//       });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {
//         const model = gltf.scene;
//         setCharacterModel(model);
//         newScene.add(model);

//         // 打印人物模型的骨骼层级
//         console.log('Character model loaded. Traversing bones:');
//         model.traverse((object) => {
//           if (object.type === 'Bone') {
//             console.log(`Bone: ${object.name}`);
//           }
//         });

//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               )
//             }
//           }
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);

//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);

//   const printHierarchy = (object: THREE.Object3D, depth: number = 0) => {
//     console.log(`${' '.repeat(depth * 2)}- ${object.name || '(unnamed)'} [${object.type}]`);
//     object.children.forEach((child) => printHierarchy(child, depth + 1));
//   };





//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find(s => s.id === slotId);
//     if (!slot?.item || !scene) return;

//     const model = equippedItems[slot.item.category];
//     if (model) {
//       if (model.parent) {
//         model.parent.remove(model);
//       }
//       scene.remove(model);
//     }

//     setEquippedItems(prev => {
//       const next = { ...prev };
//       delete next[slot.item!.category];
//       return next;
//     });

//     setSlots(prev => prev.map(s =>
//       s.id === slotId
//         ? { ...s, item: null }
//         : s
//     ));
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (!scene || !camera || !renderer || !stats || !mixer) return;

//     const delta = clock.getDelta();
//     mixer.update(delta);

//     Object.entries(baseActions.current).forEach(([name, settings]) => {
//       if (settings.action) {
//         const weight = settings.action.getEffectiveWeight();
//         const targetWeight = settings.weight;
//         if (weight !== targetWeight) {
//           const diff = targetWeight - weight;
//           const step = delta / transitionDuration;
//           if (Math.abs(diff) < step) {
//             settings.action.setEffectiveWeight(targetWeight);
//           } else {
//             settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//           }
//         }
//       }
//     });

//     renderer.render(scene, camera);
//     stats.update();
//   };

//   useEffect(() => {

//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };

//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });
//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//       additiveActions.current[clip.name as keyof typeof additiveActions.current];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (
//     name: string) => {
//     console.log('setBaseAction', name);
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });

//     crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };


//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;




// const handleSelectItem = async (item: CustomizationItem) => {+
//   if (!scene || !characterModel) return;

//   const existingItem = equippedItems[item.category];
//   if (existingItem) {
//     scene.remove(existingItem);  // 移除已有装备
//   }

//   const loader = new GLTFLoader();
//   try {
//     const gltf = await loader.loadAsync(item.modelPath);
//     const model = gltf.scene;
//     // 打印衣服模型的层级结构
//     console.log(`Loaded clothing model: ${item.name}`);
//     const printHierarchy = (object: THREE.Object3D, depth: number = 0) => {
//       console.log(`${' '.repeat(depth * 2)}- ${object.name || '(unnamed)'} [${object.type}]`);
//       object.children.forEach((child) => printHierarchy(child, depth + 1));
//     };
//     printHierarchy(model);




//     // 找到目标骨骼
//     const bone = findBoneForCategory(item.category, characterModel);

//     if (bone) {

//       // 遍历衣服模型，手动绑定 Mesh 到骨骼
//       // model.traverse((object) => {
//       //   if ((object as THREE.Mesh).isMesh) {
//       //     const mesh = object as THREE.Mesh;

//           // 检查是否已经是 SkinnedMesh
//           // if (!(mesh as THREE.SkinnedMesh).isSkinnedMesh) {
//           //   console.log(`Converting Mesh "${mesh.name}" to SkinnedMesh...`);

//             // 创建 SkinnedMesh
//             // const skinnedClothingMesh = new THREE.SkinnedMesh(mesh.geometry, mesh.material);

//             // // 获取骨骼的 Skeleton
//             // const skinnedMesh = characterModel.getObjectByProperty("type", "SkinnedMesh") as THREE.SkinnedMesh | undefined;
//             // const skeleton = skinnedMesh?.skeleton;
//             // if (skeleton) {

//             //   // 绑定骨骼
//             //   skinnedClothingMesh.bind(skeleton);
//             //   console.log(`Successfully bound SkinnedMesh "${mesh.name}" to skeleton.`);

//             // } else {
//             //   console.error("Failed to find skeleton in SkeletonHelper.");
//             // }

//             // 骨骼（确保骨骼是主人物模型的骨骼）
//             // const skeletonEX = characterModel.getObjectByName("Armature") as THREE.SkinnedMesh;
//             // const skeleton = skeletonEX?.skeleton;
//             // if (!skeleton) {
//             //   console.error("Failed to find skeleton in character model.");
//             //   return;
//             // }
//             //   // 绑定骨骼
//             // skinnedClothingMesh.bind(skeleton);
//             // console.log(`Successfully bound SkinnedMesh "${mesh.name}" to skeleton.`);

//             // // 替换原始 Mesh
//             // mesh.parent?.add(skinnedClothingMesh); // 将 skinnedClothingMesh 添加到父节点
//             // mesh.parent?.remove(mesh); // 移除原始 Mesh
//       //     }
//       //   }
//       // });


//       // 在骨骼上添加衣服模型
//       bone.add(model);
//       model.scale.copy(characterModel.scale); // 调整到与人物相同的缩放比例
//       model.position.set(0, 0, 0); // Adjust as needed
//       model.rotation.set(0, 0, 0); // Adjust as needed

//       scene.add(model);
//       printHierarchy(characterModel);
//       // // 验证衣服是否正确挂载到骨骼
//       // console.log(`Clothing model "${item.name}" added to bone: ${bone.name}`);
//       // console.log('Bone children after adding clothing:', bone.children);

//       // 验证衣服是否跟随骨骼
//       // if (bone.children.includes(model)) {
//       //   console.log(`Clothing model "${item.name}" is successfully attached to bone: ${bone.name}`);
//       // } else {
//       //   console.error(`Failed to attach clothing model "${item.name}" to bone: ${bone.name}`);
//       // }



//       // 调整衣服模型的位置、旋转和缩放
//       // model.position.set(0, 0, 0);
//       // model.rotation.set(0, 0, 0);
//       // model.scale.copy(characterModel.scale); // 调整到与人物相同的缩放比例


//       model.traverse((object) => {
//         if ((object as THREE.Mesh).isMesh) {
//           const mesh = object as THREE.Mesh;
//           mesh.castShadow = true; // 设置阴影

//           if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//             mesh.morphTargetInfluences = Array.from(
//               new Float32Array(mesh.morphTargetInfluences.length)
//             );
//           }
//         }
//       });


//     }


//     // 更新已装备的物品状态
//     setEquippedItems((prev) => ({
//       ...prev,
//       [item.category]: model,
//     }));

//     // 更新物品槽
//     setSlots((prev) =>
//       prev.map((slot) =>
//         slot.category === item.category ? { ...slot, item } : slot
//       )
//     );
//   } catch (error) {
//     console.error('Error loading model:', error);
//   }
// };

// const findBoneForCategory = (category: string, model: THREE.Object3D): THREE.Bone | null => {
//   let targetBone: THREE.Bone | null = null;

//   model.traverse((object) => {
//     if (targetBone) return; // Early exit if bone is found
//     if (object.type === 'Bone') {
//       const bone = object as THREE.Bone; // Type assertion is safe here
//       switch (category) {
//         case 'head':
//           if (bone.name.toLowerCase().includes('head')) targetBone = bone;
//           break;
//         case 'top':
//           if (bone.name.toLowerCase().includes('spine') || bone.name.toLowerCase().includes('chest')) targetBone = bone;
//           break;
//         case 'bottom':
//           if (bone.name.toLowerCase().includes('hips') || bone.name.toLowerCase().includes('pelvis')) targetBone = bone;
//           break;
//         case 'leftArm':
//           if (bone.name.toLowerCase().includes('leftarm') || bone.name.toLowerCase().includes('leftshoulder')) targetBone = bone;
//           break;
//         case 'rightArm':
//           if (bone.name.toLowerCase().includes('rightarm') || bone.name.toLowerCase().includes('rightshoulder')) targetBone = bone;
//           break;
//         case 'leftLeg':
//           if (bone.name.toLowerCase().includes('leftleg') || bone.name.toLowerCase().includes('leftupleg')) targetBone = bone;
//           break;
//         case 'rightLeg':
//           if (bone.name.toLowerCase().includes('rightleg') || bone.name.toLowerCase().includes('rightupleg')) targetBone = bone;
//           break;
//       }
//     }
//   });

//   if (!targetBone) {
//     console.warn(`No suitable bone found for category: ${category}.  Using default or skipping.`);
//     //Consider a better default strategy - perhaps skip adding the item?
//     //targetBone = model.getObjectByName('mixamorigHips') as THREE.Bone | null; // risky cast!
//   }

//   return targetBone;
// };










//   'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   });

//   const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [

//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',
//       boneName: 'mixamorigSpine' // Try this first
//     },



//   ];

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0x1a1a1a);
//       newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//       newScene.add(ambientLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({
//         antialias: true,

//       });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {

//         const model = gltf.scene;
//         setCharacterModel(model);
//         newScene.add(model);



//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               )
//             }
//           }
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);

//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);


//   const handleSelectItem = async (item: CustomizationItem) => {

//   };




//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find((s) => s.id === slotId);
//     if (slot && slot.item && equippedItems[slotId] && equippedItems[slotId].parent) {
//       equippedItems[slotId].parent.remove(equippedItems[slotId]);
//       setEquippedItems((prev) => {
//         const next = { ...prev };
//         delete next[slotId];
//         return next;
//       });
//       setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
//     }
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (!scene || !camera || !renderer || !stats || !mixer) return;

//     const delta = clock.getDelta();
//     mixer.update(delta);

//     Object.entries(baseActions.current).forEach(([name, settings]) => {
//       if (settings.action) {
//         const weight = settings.action.getEffectiveWeight();
//         const targetWeight = settings.weight;
//         if (weight !== targetWeight) {
//           const diff = targetWeight - weight;
//           const step = delta / transitionDuration;
//           if (Math.abs(diff) < step) {
//             settings.action.setEffectiveWeight(targetWeight);
//           } else {
//             settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//           }
//         }
//       }
//     });

//     renderer.render(scene, camera);
//     stats.update();
//   };

//   useEffect(() => {

//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };

//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });
//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//       additiveActions.current[clip.name as keyof typeof additiveActions.current];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (
//     name: string) => {
//     console.log('setBaseAction', name);
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });

//     crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };


//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;






// 'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   }); 

//   const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
//   const [bones, setBones] = useState<THREE.Bone[]>([]);
//   const [materials, setMaterials] = useState<THREE.Material[]>([]);
//   const bonesMap = useRef<Map<string, THREE.Bone>>(new Map());

//   const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [
//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',
//       boneName: 'mixamorigSpine2'
//     },
//     {
//       id: 'jeans-1',
//       name: 'Jeans',
//       category: 'bottom',
//       modelPath: '/cloth/bottomCloth/jeans.glb',
//       thumbnail: '/cloth/bottomClothThumbnail/jeans.png',
//       boneName: 'mixamorigHips'
//     },
//     {
//       id: 'hat-1',
//       name: 'Baseball Cap',
//       category: 'head',
//       modelPath: '/cloth/headCloth/baseballCap.glb',
//       thumbnail: '/cloth/headClothThumbnail/baseballCap.png',
//       boneName: 'mixamorigHead'
//     },
//   ];

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0x1a1a1a);
//       newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//       newScene.add(ambientLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {
//         const model = gltf.scene;
//         setCharacterModel(model);
//         newScene.add(model);

//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               )
//             }
//           }
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);

//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);

//   // Modify the initial model loading to create bone map
//   useEffect(() => {
//     if (!characterModel) return;

//     // Create bone map when character model is loaded
//     characterModel.traverse((object) => {
//       if (object instanceof THREE.Bone) {
//         bonesMap.current.set(object.name, object);
//       }
//     });
//   }, [characterModel]);


//   const handleSelectItem = async (item: CustomizationItem) => {
//     if (!characterModel || !scene) return;

//     // Remove existing item in the slot if any
//     handleRemoveItem(item.category);

//     // Load new item model
//     const loader = new GLTFLoader();
//     const gltf = await loader.loadAsync(item.modelPath);
//     const itemModel = gltf.scene;

//     // Get the bone to attach to from the bone map
//     const attachBone = bonesMap.current.get(item.boneName!);
//     if (!attachBone) {
//       console.error(`Bone ${item.boneName} not found`);
//       return;
//     }

//     // Process the item's SkinnedMeshRenderer equivalent
//     itemModel.traverse((object) => {
//       if ((object as THREE.Mesh).isMesh) {
//         const mesh = object as THREE.SkinnedMesh;
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;

//         // Store mesh, materials and bones
//         setMeshes(prev => [...prev, mesh]);
//         setMaterials(prev => [...prev, ...(Array.isArray(mesh.material) ? mesh.material : [mesh.material])]);
//         if (mesh.skeleton) {
//           setBones(prev => [...prev, ...mesh.skeleton.bones]);
//         }

//         // Bind the mesh to the character's skeleton
//         mesh.skeleton.bones = [attachBone, ...mesh.skeleton.bones];
//         mesh.bind(mesh.skeleton);
//       }
//     });

//     // Add the item to the scene and update state
//     attachBone.add(itemModel);
//     setEquippedItems(prev => ({
//       ...prev,
//       [item.category]: itemModel
//     }));

//     setSlots(prev => 
//       prev.map(slot => 
//         slot.category === item.category 
//           ? { ...slot, item: item }
//           : slot
//       )
//     );
//   };

//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find((s) => s.id === slotId);
//     if (slot && slot.item && equippedItems[slotId]) {
//       const itemToRemove = equippedItems[slotId];
//       itemToRemove.parent?.remove(itemToRemove);
//       setEquippedItems((prev) => {
//         const next = { ...prev };
//         delete next[slotId];
//         return next;
//       });
//       setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
//     }
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (!scene || !camera || !renderer || !stats || !mixer) return;

//     const delta = clock.getDelta();
//     mixer.update(delta);

//     Object.entries(baseActions.current).forEach(([name, settings]) => {
//       if (settings.action) {
//         const weight = settings.action.getEffectiveWeight();
//         const targetWeight = settings.weight;
//         if (weight !== targetWeight) {
//           const diff = targetWeight - weight;
//           const step = delta / transitionDuration;
//           if (Math.abs(diff) < step) {
//             settings.action.setEffectiveWeight(targetWeight);
//           } else {
//             settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//           }
//         }
//       }
//     });

//     renderer.render(scene, camera);
//     stats.update();
//   };

//   useEffect(() => {
//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };

//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });
//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//       additiveActions.current[clip.name as keyof typeof additiveActions.current];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (name: string) => {
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });
// crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };

//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;



// 'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//   const [clock] = useState(new THREE.Clock());

//   const crossFadeControls = useRef<any[]>([]);
//   const allActions = useRef<THREE.AnimationAction[]>([]);

//   const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 },
//   });
//   const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 },
//   }); 



//   const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [
//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',
//       boneName: 'mixamorigSpine2'
//     },
//     {
//       id: 'jeans-1',
//       name: 'Jeans',
//       category: 'bottom',
//       modelPath: '/cloth/buttom1/clothJacket.glb',
//       thumbnail: '/cloth/buttomThumbnail/buttom1.glb',
//       boneName: 'mixamorigHips'
//     },

//   ];

//   const transitionDuration = 0.5;

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0x1a1a1a);
//       newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//       newScene.add(ambientLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/Xbot.glb', (gltf) => {
//         const model = gltf.scene;
//         setCharacterModel(model);
//         newScene.add(model);
//         model.traverse((object) => {
//           if ((object as THREE.Bone).isBone) {
//             console.log('Bone:', object.name); // 输出骨骼的名称
//           }
//         });

//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               )
//             }
//           }
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);

//         const animations = gltf.animations;
//         const newMixer = new THREE.AnimationMixer(model);
//         setMixer(newMixer);

//         for (let i = 0; i !== animations.length; ++i) {
//           let clip = animations[i];
//           const name = clip.name;

//           if (baseActions.current[name]) {
//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             baseActions.current[name].action = action;
//             allActions.current.push(action);
//           } else if (additiveActions.current[name]) {
//             THREE.AnimationUtils.makeClipAdditive(clip);

//             if (clip.name.endsWith('_pose')) {
//               clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//             }

//             const action = newMixer.clipAction(clip);
//             activateAction(action);
//             additiveActions.current[name].action = action;
//             allActions.current.push(action);
//           }
//         }

//         createPanel();
//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);



//   const handleSelectItem = async (item: CustomizationItem) => {
//     const loader = new GLTFLoader();
//     loader.load(item.modelPath, (gltf) => {
//       const newItem = gltf.scene;
//       const bone = characterModel?.getObjectByName(item.boneName!) as THREE.Bone;

//       if (bone) {
//         // Attach the item to the correct bone
//         bone.add(newItem);
//         setEquippedItems((prev) => ({
//           ...prev,
//           [item.id]: newItem
//         }));
//         setSlots((prev) => prev.map((slot) => 
//           slot.id === item.category ? { ...slot, item: newItem } : slot
//         ));
//       }
//     });
//   };

//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find((s) => s.id === slotId);
//     if (slot && slot.item && equippedItems[slotId]) {
//       const itemToRemove = equippedItems[slotId];
//       itemToRemove.parent?.remove(itemToRemove);
//       setEquippedItems((prev) => {
//         const next = { ...prev };
//         delete next[slotId];
//         return next;
//       });
//       setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
//     }
//   };


//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (!scene || !camera || !renderer || !stats || !mixer) return;

//     const delta = clock.getDelta();
//     mixer.update(delta);

//     Object.entries(baseActions.current).forEach(([name, settings]) => {
//       if (settings.action) {
//         const weight = settings.action.getEffectiveWeight();
//         const targetWeight = settings.weight;
//         if (weight !== targetWeight) {
//           const diff = targetWeight - weight;
//           const step = delta / transitionDuration;
//           if (Math.abs(diff) < step) {
//             settings.action.setEffectiveWeight(targetWeight);
//           } else {
//             settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//           }
//         }
//       }
//     });

//     renderer.render(scene, camera);
//     stats.update();
//   };

//   useEffect(() => {
//     animate();
//   }, [scene, camera, renderer, stats, mixer, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };

//   const createPanel = () => {
//     if (panelRef.current) return;

//     const panel = new GUI({ width: 310 });
//     panelRef.current = panel;

//     const folder1 = panel.addFolder('Base Actions');
//     const folder2 = panel.addFolder('Additive Action Weights');
//     const folder3 = panel.addFolder('General Speed');

//     const panelSettings: { [key: string]: any } = {
//       'modify time scale': 1.0,
//     };

//     const baseNames = ['None', ...Object.keys(baseActions.current)];

//     for (let i = 0, l = baseNames.length; i !== l; ++i) {
//       const name = baseNames[i];
//       panelSettings[name] = () => {
//         setBaseAction(name);
//       };

//       crossFadeControls.current.push(folder1.add(panelSettings, name));
//     }

//     for (const name of Object.keys(additiveActions.current)) {
//       const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//       panelSettings[name] = settings.weight;

//       folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//         setWeight(settings.action!, weight);
//         settings.weight = weight;
//       });
//     }

//     folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//     crossFadeControls.current.forEach((control) => {
//       control.setInactive = () => {
//         control.domElement.classList.add('control-inactive');
//       };

//       control.setActive = () => {
//         control.domElement.classList.remove('control-inactive');
//       };

//       const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//       if (!settings || !settings.weight) {
//         control.setInactive();
//       }
//     });
//   };

//   const activateAction = (action: THREE.AnimationAction) => {
//     const clip = action.getClip();
//     const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//       additiveActions.current[clip.name as keyof typeof additiveActions.current];
//     setWeight(action, settings.weight);
//     action.play();
//   };

//   const modifyTimeScale = (speed: number) => {
//     if (mixer) mixer.timeScale = speed;
//   };

//   const setBaseAction = (name: string) => {
//     const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//     Object.values(baseActions.current).forEach(({ action }) => {
//       if (action) {
//         action.fadeOut(transitionDuration);
//       }
//     });

//     if (nextAction) {
//       nextAction.reset().fadeIn(transitionDuration).play();
//     }

//     Object.keys(baseActions.current).forEach((key) => {
//       baseActions.current[key].weight = key === name ? 1 : 0;
//     });
// crossFadeControls.current.forEach((control) => {
//       const actionName = control.property;
//       if (actionName === name) {
//         control.setActive();
//       } else {
//         control.setInactive();
//       }
//     });
//   };

//   const setWeight = (action: THREE.AnimationAction, weight: number) => {
//     action.enabled = true;
//     action.setEffectiveTimeScale(1);
//     action.setEffectiveWeight(weight);
//   };

//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;




// 'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CustomizationPanel } from '../bodyModel/customization-panel';
// import { EquipmentSlots } from '../bodyModel/equipment-slots';
// import { CustomizationItem, EquipmentSlot } from '../types/customization';

// const ThreeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const panelRef = useRef<GUI | null>(null);
//   const [scene, setScene] = useState<THREE.Scene | null>(null);
//   const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);

//   const [clock] = useState(new THREE.Clock());








//   const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//   const [slots, setSlots] = useState<EquipmentSlot[]>([
//     { id: 'head', category: 'head', item: null },
//     { id: 'face', category: 'face', item: null },
//     { id: 'mask', category: 'mask', item: null },
//     { id: 'top', category: 'top', item: null },
//     { id: 'bottom', category: 'bottom', item: null },
//   ]);

//   const customizationItems: CustomizationItem[] = [ 
//     {
//       id: 'crop-top-1',
//       name: 'Crop Top',
//       category: 'top',
//       modelPath: '/cloth/topCloth/clothJacket.glb',
//       thumbnail: '/cloth/topClothThumbnail/jacket.png',

//     },
//     {
//       id: 'jeans-1',
//       name: 'Jeans',
//       category: 'bottom',
//       modelPath: '/cloth/bottom/bottom1.glb',
//       thumbnail: '/cloth/bottomThumbnail/bottom1.png',

//     },

//   ];

//   const clothingPositions = useRef<Record<string, THREE.Vector3>>({
//     top: new THREE.Vector3(),
//     bottom: new THREE.Vector3(),
//   });

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const init = () => {
//       const newScene = new THREE.Scene();
//       newScene.background = new THREE.Color(0x1a1a1a);
//       newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//       setScene(newScene);

//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//       hemiLight.position.set(0, 20, 0);
//       newScene.add(hemiLight);

//       const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//       dirLight.position.set(3, 10, 10);
//       dirLight.castShadow = true;
//       dirLight.shadow.camera.top = 2;
//       dirLight.shadow.camera.bottom = -2;
//       dirLight.shadow.camera.left = -2;
//       dirLight.shadow.camera.right = 2;
//       dirLight.shadow.camera.near = 0.1;
//       dirLight.shadow.camera.far = 40;
//       newScene.add(dirLight);

//       const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//       newScene.add(ambientLight);

//       const mesh = new THREE.Mesh(
//         new THREE.PlaneGeometry(100, 100),
//         new THREE.MeshStandardMaterial({
//           color: 0x3d3d3d,
//           depthWrite: false,
//           roughness: 0.8,
//           metalness: 0.2
//         })
//       );
//       mesh.rotation.x = -Math.PI / 2;
//       mesh.receiveShadow = true;
//       newScene.add(mesh);

//       const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//       newCamera.position.set(-1, 2, 3);
//       setCamera(newCamera);

//       const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//       newRenderer.setPixelRatio(window.devicePixelRatio);
//       newRenderer.setSize(window.innerWidth, window.innerHeight);
//       newRenderer.shadowMap.enabled = true;
//       newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//       containerRef.current!.appendChild(newRenderer.domElement);
//       setRenderer(newRenderer);

//       const controls = new OrbitControls(newCamera, newRenderer.domElement);
//       controls.enablePan = false;
//       controls.enableZoom = true;
//       controls.minDistance = 2;
//       controls.maxDistance = 5;
//       controls.target.set(0, 1, 0);
//       controls.update();

//       const newStats = new Stats();
//       containerRef.current!.appendChild(newStats.dom);
//       setStats(newStats);

//       const loader = new GLTFLoader();
//       loader.load('/female.glb', (gltf) => {
//         const model = gltf.scene;

//         newScene.add(model);

//         console.log("=============Initial Clothing Positions:");
//         Object.keys(clothingPositions.current).forEach((category) => {
//           const position = clothingPositions.current[category];
//           console.log(`${category} initial position:`, position);
//         });


//         model.traverse((object) => {
//           if ((object as THREE.Mesh).isMesh) {
//             const mesh = object as THREE.Mesh;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//               mesh.morphTargetInfluences = Array.from(
//                 new Float32Array(mesh.morphTargetInfluences.length)
//               )
//             }
//           }
//         });

//         const skeleton = new THREE.SkeletonHelper(model);
//         skeleton.visible = false;
//         newScene.add(skeleton);


//   ;


//       });

//       window.addEventListener('resize', onWindowResize);
//     };

//     init();

//     return () => {
//       window.removeEventListener('resize', onWindowResize);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = '';
//       }
//       if (panelRef.current) {
//         panelRef.current.destroy();
//         panelRef.current = null;
//       }
//     };
//   }, []);



//   const handleSelectItem = async (item: CustomizationItem) => {

//   };

//   const handleRemoveItem = (slotId: string) => {
//     const slot = slots.find((s) => s.id === slotId);
//     if (slot && slot.item && equippedItems[slotId]) {
//       const itemToRemove = equippedItems[slotId];
//       itemToRemove.parent?.remove(itemToRemove);
//       setEquippedItems((prev) => {
//         const next = { ...prev };
//         delete next[slotId];
//         return next;
//       });
//       setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
//     }
//   };


//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (!scene || !camera || !renderer || !stats ) return;
//     renderer.render(scene, camera);
//     stats.update();
//   };

//   useEffect(() => {
//     animate();
//   }, [scene, camera, renderer, stats, clock]);

//   const onWindowResize = () => {
//     if (!camera || !renderer) return;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   };



//   return (
//     <>
//       <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//       <CustomizationPanel
//         items={customizationItems}
//         onSelectItem={handleSelectItem}
//         totalItems={customizationItems.length}
//       />
//       <EquipmentSlots
//         slots={slots}
//         onRemoveItem={handleRemoveItem}
//       />
//     </>
//   );
// };

// export default ThreeScene;

'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CustomizationPanel } from '../bodyModel/customization-panel';
import { EquipmentSlots } from '../bodyModel/equipment-slots';
import { CustomizationItem, EquipmentSlot } from '../types/customization';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<GUI | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [clock] = useState(new THREE.Clock());
  const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
  const [slots, setSlots] = useState<EquipmentSlot[]>([
    { id: 'head', category: 'head', item: null },
    { id: 'face', category: 'face', item: null },
    { id: 'mask', category: 'mask', item: null },
    { id: 'top', category: 'top', item: null },
    { id: 'bottom', category: 'bottom', item: null },
  ]);

  const customizationItems: CustomizationItem[] = [
    {
      id: 'crop-top-1',
      name: 'Crop Top',
      category: 'top',
      modelPath: '/cloth/topCloth/clothJacket.glb',
      thumbnail: '/cloth/topClothThumbnail/jacket.png',
    },
    {
      id: 'jeans-1',
      name: 'Jeans',
      category: 'bottom',
      modelPath: '/cloth/bottom/bottom1.glb',
      thumbnail: '/cloth/bottomThumbnail/bottom1.png',
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      const newScene = new THREE.Scene();
      newScene.background = new THREE.Color(0x1a1a1a);
      newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
      setScene(newScene);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
      hemiLight.position.set(0, 20, 0);
      newScene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 3);
      dirLight.position.set(3, 10, 10);
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 2;
      dirLight.shadow.camera.bottom = -2;
      dirLight.shadow.camera.left = -2;
      dirLight.shadow.camera.right = 2;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 40;
      newScene.add(dirLight);

      const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
      newScene.add(ambientLight);

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({
          color: 0x3d3d3d,
          depthWrite: false,
          roughness: 0.8,
          metalness: 0.2,
        })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      newScene.add(mesh);

      const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
      newCamera.position.set(-1, 2, 3);
      setCamera(newCamera);

      const newRenderer = new THREE.WebGLRenderer({ antialias: true });
      newRenderer.setPixelRatio(window.devicePixelRatio);
      newRenderer.setSize(window.innerWidth, window.innerHeight);
      newRenderer.shadowMap.enabled = true;
      newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      containerRef.current!.appendChild(newRenderer.domElement);
      setRenderer(newRenderer);

      const controls = new OrbitControls(newCamera, newRenderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.minDistance = 2;
      controls.maxDistance = 5;
      controls.target.set(0, 1, 0);
      controls.update();

      const newStats = new Stats();
      containerRef.current!.appendChild(newStats.dom);
      setStats(newStats);

      const loader = new GLTFLoader();
      loader.load('/female.glb', (gltf) => {
        const model = gltf.scene;
        newScene.add(model);
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
      });

      window.addEventListener('resize', onWindowResize);
    };

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (panelRef.current) {
        panelRef.current.destroy();
        panelRef.current = null;
      }
    };
  }, []);

  const handleSelectItem = async (item: CustomizationItem) => {
    const loader = new GLTFLoader();
    loader.load(item.modelPath, (gltf) => {
      const clothing = gltf.scene;
      const slot = slots.find((s) => s.category === item.category);
      if (slot) {
        const bodyPart = scene?.getObjectByName(slot.id); // Get the body part (e.g., head, top, etc.)
        if (bodyPart) {
          // Remove any existing clothing
          if (equippedItems[slot.id]) {
            equippedItems[slot.id].parent?.remove(equippedItems[slot.id]);
          }
          // Add the new clothing to the body part
          bodyPart.add(clothing);
          // Update the state with the new item
          setEquippedItems((prev) => ({
            ...prev,
            [slot.id]: clothing,
          }));
          setSlots((prev) =>
            prev.map((s) => (s.id === slot.id ? { ...s, item: clothing } : s))
          );
        }
      }
    });
  };

  const handleRemoveItem = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot && slot.item && equippedItems[slotId]) {
      const itemToRemove = equippedItems[slotId];
      itemToRemove.parent?.remove(itemToRemove);
      setEquippedItems((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);
    if (!scene || !camera || !renderer || !stats) return;
    renderer.render(scene, camera);
    stats.update();
  };

  useEffect(() => {
    animate();
  }, [scene, camera, renderer, stats, clock]);

  const onWindowResize = () => {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return (
    <>
      <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
      <CustomizationPanel
        items={customizationItems}
        onSelectItem={handleSelectItem}
        totalItems={customizationItems.length}
      />
      <EquipmentSlots slots={slots} onRemoveItem={handleRemoveItem} />
    </>
  );
};

export default ThreeScene;
