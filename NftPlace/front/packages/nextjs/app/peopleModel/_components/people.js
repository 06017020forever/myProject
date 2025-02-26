// import * as THREE from 'three';
// import Stats from 'three/addons/libs/stats.module.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// export const ThreeScene = () => {
// let scene, renderer, camera, stats;
// let model, skeleton, mixer, clock;

// const crossFadeControls = [];

// let currentBaseAction = 'idle';
// const allActions = [];
// const baseActions = {
//   idle: { weight: 1 },
//   walk: { weight: 0 },
//   run: { weight: 0 }
// };
// const additiveActions = {
//   sneak_pose: { weight: 0 },
//   sad_pose: { weight: 0 },
//   agree: { weight: 0 },
//   headShake: { weight: 0 }
// };
// let panelSettings, numAnimations;

// init();

// function init() {

//   const container = document.getElementById( 'container' );
//   clock = new THREE.Clock();

//   scene = new THREE.Scene();
//   scene.background = new THREE.Color( 0xa0a0a0 );
//   scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

//   const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
//   hemiLight.position.set( 0, 20, 0 );
//   scene.add( hemiLight );

//   const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
//   dirLight.position.set( 3, 10, 10 );
//   dirLight.castShadow = true;
//   dirLight.shadow.camera.top = 2;
//   dirLight.shadow.camera.bottom = - 2;
//   dirLight.shadow.camera.left = - 2;
//   dirLight.shadow.camera.right = 2;
//   dirLight.shadow.camera.near = 0.1;
//   dirLight.shadow.camera.far = 40;
//   scene.add( dirLight );

//   // ground

//   const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
//   mesh.rotation.x = - Math.PI / 2;
//   mesh.receiveShadow = true;
//   scene.add( mesh );

//   const loader = new GLTFLoader();
//   loader.load( '/Xbot.glb', function ( gltf ) {

//     model = gltf.scene;
//     scene.add( model );

//     model.traverse( function ( object ) {

//       if ( object.isMesh ) object.castShadow = true;

//     } );

//     skeleton = new THREE.SkeletonHelper( model );
//     skeleton.visible = false;
//     scene.add( skeleton );

//     const animations = gltf.animations;
//     mixer = new THREE.AnimationMixer( model );

//     numAnimations = animations.length;

//     for ( let i = 0; i !== numAnimations; ++ i ) {

//       let clip = animations[ i ];
//       const name = clip.name;

//       if ( baseActions[ name ] ) {

//         const action = mixer.clipAction( clip );
//         activateAction( action );
//         baseActions[ name ].action = action;
//         allActions.push( action );

//       } else if ( additiveActions[ name ] ) {

//         // Make the clip additive and remove the reference frame

//         THREE.AnimationUtils.makeClipAdditive( clip );

//         if ( clip.name.endsWith( '_pose' ) ) {

//           clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );

//         }

//         const action = mixer.clipAction( clip );
//         activateAction( action );
//         additiveActions[ name ].action = action;
//         allActions.push( action );

//       }

//     }

//     createPanel();

//     renderer.setAnimationLoop( animate );

//   } );

//   renderer = new THREE.WebGLRenderer( { antialias: true } );
//   renderer.setPixelRatio( window.devicePixelRatio );
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   renderer.shadowMap.enabled = true;
//   container.appendChild( renderer.domElement );

//   // camera
//   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
//   camera.position.set( - 1, 2, 3 );

//   const controls = new OrbitControls( camera, renderer.domElement );
//   controls.enablePan = false;
//   controls.enableZoom = false;
//   controls.target.set( 0, 1, 0 );
//   controls.update();

//   stats = new Stats();
//   container.appendChild( stats.dom );

//   window.addEventListener( 'resize', onWindowResize );

// }

// function createPanel() {

//   const panel = new GUI( { width: 310 } );

//   const folder1 = panel.addFolder( 'Base Actions' );
//   const folder2 = panel.addFolder( 'Additive Action Weights' );
//   const folder3 = panel.addFolder( 'General Speed' );

//   panelSettings = {
//     'modify time scale': 1.0
//   };

//   const baseNames = [ 'None', ...Object.keys( baseActions ) ];

//   for ( let i = 0, l = baseNames.length; i !== l; ++ i ) {

//     const name = baseNames[ i ];
//     const settings = baseActions[ name ];
//     panelSettings[ name ] = function () {

//       const currentSettings = baseActions[ currentBaseAction ];
//       const currentAction = currentSettings ? currentSettings.action : null;
//       const action = settings ? settings.action : null;

//       if ( currentAction !== action ) {

//         prepareCrossFade( currentAction, action, 0.35 );

//       }

//     };

//     crossFadeControls.push( folder1.add( panelSettings, name ) );

//   }

//   for ( const name of Object.keys( additiveActions ) ) {

//     const settings = additiveActions[ name ];

//     panelSettings[ name ] = settings.weight;
//     folder2.add( panelSettings, name, 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

//       setWeight( settings.action, weight );
//       settings.weight = weight;

//     } );

//   }

//   folder3.add( panelSettings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

//   folder1.open();
//   folder2.open();
//   folder3.open();

//   crossFadeControls.forEach( function ( control ) {

//     control.setInactive = function () {

//       control.domElement.classList.add( 'control-inactive' );

//     };

//     control.setActive = function () {

//       control.domElement.classList.remove( 'control-inactive' );

//     };

//     const settings = baseActions[ control.property ];

//     if ( ! settings || ! settings.weight ) {

//       control.setInactive();

//     }

//   } );

// }

// function activateAction( action ) {

//   const clip = action.getClip();
//   const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
//   setWeight( action, settings.weight );
//   action.play();

// }

// function modifyTimeScale( speed ) {

//   mixer.timeScale = speed;

// }

// function prepareCrossFade( startAction, endAction, duration ) {

//   // If the current action is 'idle', execute the crossfade immediately;
//   // else wait until the current action has finished its current loop

//   if ( currentBaseAction === 'idle' || ! startAction || ! endAction ) {

//     executeCrossFade( startAction, endAction, duration );

//   } else {

//     synchronizeCrossFade( startAction, endAction, duration );

//   }

//   // Update control colors

//   if ( endAction ) {

//     const clip = endAction.getClip();
//     currentBaseAction = clip.name;

//   } else {

//     currentBaseAction = 'None';

//   }

//   crossFadeControls.forEach( function ( control ) {

//     const name = control.property;

//     if ( name === currentBaseAction ) {

//       control.setActive();

//     } else {

//       control.setInactive();

//     }

//   } );

// }

// function synchronizeCrossFade( startAction, endAction, duration ) {

//   mixer.addEventListener( 'loop', onLoopFinished );

//   function onLoopFinished( event ) {

//     if ( event.action === startAction ) {

//       mixer.removeEventListener( 'loop', onLoopFinished );

//       executeCrossFade( startAction, endAction, duration );

//     }

//   }

// }

// function executeCrossFade( startAction, endAction, duration ) {



//   if ( endAction ) {

//     setWeight( endAction, 1 );
//     endAction.time = 0;

//     if ( startAction ) {

//       // Crossfade with warping

//       startAction.crossFadeTo( endAction, duration, true );

//     } else {

//       // Fade in

//       endAction.fadeIn( duration );

//     }

//   } else {

//     // Fade out

//     startAction.fadeOut( duration );

//   }

// }



// function setWeight( action, weight ) {

//   action.enabled = true;
//   action.setEffectiveTimeScale( 1 );
//   action.setEffectiveWeight( weight );

// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize( window.innerWidth, window.innerHeight );

// }

// function animate() {

//   // Render loop

//   for ( let i = 0; i !== numAnimations; ++ i ) {

//     const action = allActions[ i ];
//     const clip = action.getClip();
//     const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
//     settings.weight = action.getEffectiveWeight();

//   }

//   // Get the time elapsed since the last frame, used for mixer update

//   const mixerUpdateDelta = clock.getDelta();

//   // Update the animation mixer, the stats panel, and render this frame

//   mixer.update( mixerUpdateDelta );

//   renderer.render( scene, camera );

//   stats.update();

// }
// }

// export default ThreeScene;

Bone: mixamorigHips
Bone: mixamorigSpine
Bone: mixamorigSpine1
Bone: mixamorigSpine2
Bone: mixamorigNeck
Bone: mixamorigHead
Bone: mixamorigHeadTop_End
Bone: mixamorigLeftEye
Bone: mixamorigRightEye
Bone: mixamorigLeftShoulder
Bone: mixamorigLeftArm
Bone: mixamorigLeftForeArm
Bone: mixamorigLeftHand
Bone: mixamorigLeftHandThumb1
Bone: mixamorigLeftHandThumb2
Bone: mixamorigLeftHandThumb3
Bone: mixamorigLeftHandThumb4
Bone: mixamorigLeftHandIndex1
Bone: mixamorigLeftHandIndex2
Bone: mixamorigLeftHandIndex3
Bone: mixamorigLeftHandIndex4
Bone: mixamorigLeftHandMiddle1
Bone: mixamorigLeftHandMiddle2
Bone: mixamorigLeftHandMiddle3
Bone: mixamorigLeftHandMiddle4
Bone: mixamorigLeftHandRing1
Bone: mixamorigLeftHandRing2
Bone: mixamorigLeftHandRing3
Bone: mixamorigLeftHandRing4
Bone: mixamorigLeftHandPinky1
Bone: mixamorigLeftHandPinky2
Bone: mixamorigLeftHandPinky3
Bone: mixamorigLeftHandPinky4
Bone: mixamorigRightShoulder
Bone: mixamorigRightArm
Bone: mixamorigRightForeArm
Bone: mixamorigRightHand
Bone: mixamorigRightHandPinky1
Bone: mixamorigRightHandPinky2
Bone: mixamorigRightHandPinky3
Bone: mixamorigRightHandPinky4
Bone: mixamorigRightHandRing1
Bone: mixamorigRightHandRing2
Bone: mixamorigRightHandRing3
Bone: mixamorigRightHandRing4
Bone: mixamorigRightHandMiddle1
Bone: mixamorigRightHandMiddle2
Bone: mixamorigRightHandMiddle3
Bone: mixamorigRightHandMiddle4
Bone: mixamorigRightHandIndex1
Bone: mixamorigRightHandIndex2
Bone: mixamorigRightHandIndex3
Bone: mixamorigRightHandIndex4
Bone: mixamorigRightHandThumb1
Bone: mixamorigRightHandThumb2
Bone: mixamorigRightHandThumb3
Bone: mixamorigRightHandThumb4
Bone: mixamorigLeftUpLeg
Bone: mixamorigLeftLeg
Bone: mixamorigLeftFoot
Bone: mixamorigLeftToeBase
Bone: mixamorigLeftToe_End
Bone: mixamorigRightUpLeg
Bone: mixamorigRightLeg
Bone: mixamorigRightFoot
Bone: mixamorigRightToeBase
Bone: mixamorigRightToe_End
Bone: mixamorigHips
Bone: mixamorigSpine
Bone: mixamorigSpine1
Bone: mixamorigSpine2
Bone: mixamorigNeck
Bone: mixamorigHead
Bone: mixamorigHeadTop_End
Bone: mixamorigLeftEye
Bone: mixamorigRightEye
Bone: mixamorigLeftShoulder
Bone: mixamorigLeftArm
Bone: mixamorigLeftForeArm
Bone: mixamorigLeftHand
Bone: mixamorigLeftHandThumb1
Bone: mixamorigLeftHandThumb2
Bone: mixamorigLeftHandThumb3
Bone: mixamorigLeftHandThumb4
Bone: mixamorigLeftHandIndex1
Bone: mixamorigLeftHandIndex2
Bone: mixamorigLeftHandIndex3
Bone: mixamorigLeftHandIndex4
Bone: mixamorigLeftHandMiddle1
Bone: mixamorigLeftHandMiddle2
Bone: mixamorigLeftHandMiddle3
Bone: mixamorigLeftHandMiddle4
Bone: mixamorigLeftHandRing1
Bone: mixamorigLeftHandRing2
Bone: mixamorigLeftHandRing3
Bone: mixamorigLeftHandRing4
Bone: mixamorigLeftHandPinky1
Bone: mixamorigLeftHandPinky2
Bone: mixamorigLeftHandPinky3
Bone: mixamorigLeftHandPinky4
Bone: mixamorigRightShoulder
Bone: mixamorigRightArm
Bone: mixamorigRightForeArm
Bone: mixamorigRightHand
Bone: mixamorigRightHandPinky1
Bone: mixamorigRightHandPinky2
Bone: mixamorigRightHandPinky3
Bone: mixamorigRightHandPinky4
Bone: mixamorigRightHandRing1
Bone: mixamorigRightHandRing2
Bone: mixamorigRightHandRing3
Bone: mixamorigRightHandRing4
Bone: mixamorigRightHandMiddle1
Bone: mixamorigRightHandMiddle2
Bone: mixamorigRightHandMiddle3
Bone: mixamorigRightHandMiddle4
Bone: mixamorigRightHandIndex1
Bone: mixamorigRightHandIndex2
Bone: mixamorigRightHandIndex3
Bone: mixamorigRightHandIndex4
Bone: mixamorigRightHandThumb1
Bone: mixamorigRightHandThumb2
Bone: mixamorigRightHandThumb3
Bone: mixamorigRightHandThumb4
Bone: mixamorigLeftUpLeg
Bone: mixamorigLeftLeg
Bone: mixamorigLeftFoot
Bone: mixamorigLeftToeBase
Bone: mixamorigLeftToe_End
Bone: mixamorigRightUpLeg
Bone: mixamorigRightLeg
Bone: mixamorigRightFoot
Bone: mixamorigRightToeBase
Bone: mixamorigRightToe_End这是characterModel模型骨骼


Scene
 Armature
 Beta_Joints
 Beta_Surface
 mixamorigHips
 mixamorigSpine
 mixamorigSpine1
 mixamorigSpine2
 mixamorigNeck
 mixamorigHead
 mixamorigHeadTop_End
 mixamorigLeftEye
 mixamorigRightEye
 mixamorigLeftShoulder
 mixamorigLeftArm
 mixamorigLeftForeArm
 mixamorigLeftHand
 mixamorigLeftHandThumb1
 mixamorigLeftHandThumb2
 mixamorigLeftHandThumb3
 mixamorigLeftHandThumb4
 mixamorigLeftHandIndex1
 mixamorigLeftHandIndex2
 mixamorigLeftHandIndex3
 mixamorigLeftHandIndex4
 mixamorigLeftHandMiddle1
 mixamorigLeftHandMiddle2
 mixamorigLeftHandMiddle3
 mixamorigLeftHandMiddle4
 mixamorigLeftHandRing1
 mixamorigLeftHandRing2
 mixamorigLeftHandRing3
 mixamorigLeftHandRing4
 mixamorigLeftHandPinky1
 mixamorigLeftHandPinky2
 mixamorigLeftHandPinky3
 mixamorigLeftHandPinky4
 mixamorigRightShoulder
 mixamorigRightArm
 mixamorigRightForeArm
 mixamorigRightHand
 mixamorigRightHandPinky1
 mixamorigRightHandPinky2
 mixamorigRightHandPinky3
 mixamorigRightHandPinky4
 mixamorigRightHandRing1
 mixamorigRightHandRing2
 mixamorigRightHandRing3
 mixamorigRightHandRing4
 mixamorigRightHandMiddle1
 mixamorigRightHandMiddle2
 mixamorigRightHandMiddle3
 mixamorigRightHandMiddle4
 mixamorigRightHandIndex1
 mixamorigRightHandIndex2
 mixamorigRightHandIndex3
 mixamorigRightHandIndex4
 mixamorigRightHandThumb1
 mixamorigRightHandThumb2
 mixamorigRightHandThumb3
 mixamorigRightHandThumb4
 mixamorigLeftUpLeg
 mixamorigLeftLeg
 mixamorigLeftFoot
 mixamorigLeftToeBase
 mixamorigLeftToe_End
 mixamorigRightUpLeg
 mixamorigRightLeg
 mixamorigRightFoot
 mixamorigRightToeBase
 
//  人体分成各个部件, 比如头, 上半身, 下半身, 手, 脚等, 每个部件制作多个不同的Mesh, 但是这些部件共享同一套 人体骨骼 
//  'use client'

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
//  const containerRef = useRef<HTMLDivElement>(null);
//  const panelRef = useRef<GUI | null>(null);
//  const [scene, setScene] = useState<THREE.Scene | null>(null);
//  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
//  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
//  const [stats, setStats] = useState<Stats | null>(null);
//  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
//  const [clock] = useState(new THREE.Clock());

//  const crossFadeControls = useRef<any[]>([]);
//  const allActions = useRef<THREE.AnimationAction[]>([]);

//  const baseActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//    idle: { weight: 1 },
//    walk: { weight: 0 },
//    run: { weight: 0 },
//  });
//  const additiveActions = useRef<Record<string, { weight: number; action?: THREE.AnimationAction }>>({
//    sneak_pose: { weight: 0 },
//    sad_pose: { weight: 0 },
//    agree: { weight: 0 },
//    headShake: { weight: 0 },
//  });

//  const [characterModel, setCharacterModel] = useState<THREE.Object3D | null>(null);
//  const [equippedItems, setEquippedItems] = useState<Record<string, THREE.Object3D>>({});
//  const [slots, setSlots] = useState<EquipmentSlot[]>([
//    { id: 'head', category: 'head', item: null },
//    { id: 'face', category: 'face', item: null },
//    { id: 'mask', category: 'mask', item: null },
//    { id: 'top', category: 'top', item: null },
//    { id: 'bottom', category: 'bottom', item: null },
//  ]);

//  const customizationItems: CustomizationItem[] = [

//    {
//      id: 'crop-top-1',
//      name: 'Crop Top',
//      category: 'top',
//      modelPath: '/cloth/topCloth/clothJacket.glb',
//      thumbnail: '/cloth/topClothThumbnail/jacket.png',
//      boneName: 'mixamorigSpine' // Try this first
//    },



//  ];

//  const transitionDuration = 0.5;

//  useEffect(() => {
//    if (!containerRef.current) return;

//    const init = () => {
//      const newScene = new THREE.Scene();
//      newScene.background = new THREE.Color(0x1a1a1a);
//      newScene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
//      setScene(newScene);

//      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
//      hemiLight.position.set(0, 20, 0);
//      newScene.add(hemiLight);

//      const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//      dirLight.position.set(3, 10, 10);
//      dirLight.castShadow = true;
//      dirLight.shadow.camera.top = 2;
//      dirLight.shadow.camera.bottom = -2;
//      dirLight.shadow.camera.left = -2;
//      dirLight.shadow.camera.right = 2;
//      dirLight.shadow.camera.near = 0.1;
//      dirLight.shadow.camera.far = 40;
//      newScene.add(dirLight);

//      const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
//      newScene.add(ambientLight);

//      const mesh = new THREE.Mesh(
//        new THREE.PlaneGeometry(100, 100),
//        new THREE.MeshStandardMaterial({
//          color: 0x3d3d3d,
//          depthWrite: false,
//          roughness: 0.8,
//          metalness: 0.2
//        })
//      );
//      mesh.rotation.x = -Math.PI / 2;
//      mesh.receiveShadow = true;
//      newScene.add(mesh);

//      const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
//      newCamera.position.set(-1, 2, 3);
//      setCamera(newCamera);

//      const newRenderer = new THREE.WebGLRenderer({
//        antialias: true,

//      });
//      newRenderer.setPixelRatio(window.devicePixelRatio);
//      newRenderer.setSize(window.innerWidth, window.innerHeight);
//      newRenderer.shadowMap.enabled = true;
//      newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
//      containerRef.current!.appendChild(newRenderer.domElement);
//      setRenderer(newRenderer);

//      const controls = new OrbitControls(newCamera, newRenderer.domElement);
//      controls.enablePan = false;
//      controls.enableZoom = true;
//      controls.minDistance = 2;
//      controls.maxDistance = 5;
//      controls.target.set(0, 1, 0);
//      controls.update();

//      const newStats = new Stats();
//      containerRef.current!.appendChild(newStats.dom);
//      setStats(newStats);

//      const loader = new GLTFLoader();
//      loader.load('/Xbot.glb', (gltf) => {

//        const model = gltf.scene;
//        setCharacterModel(model);
//        newScene.add(model);



//        model.traverse((object) => {
//          if ((object as THREE.Mesh).isMesh) {
//            const mesh = object as THREE.Mesh;
//            mesh.castShadow = true;
//            mesh.receiveShadow = true;
//            if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
//              mesh.morphTargetInfluences = Array.from(
//                new Float32Array(mesh.morphTargetInfluences.length)
//              )
//            }
//          }
//        });

//        const skeleton = new THREE.SkeletonHelper(model);
//        skeleton.visible = false;
//        newScene.add(skeleton);

//        const animations = gltf.animations;
//        const newMixer = new THREE.AnimationMixer(model);
//        setMixer(newMixer);

//        for (let i = 0; i !== animations.length; ++i) {
//          let clip = animations[i];
//          const name = clip.name;

//          if (baseActions.current[name]) {
//            const action = newMixer.clipAction(clip);
//            activateAction(action);
//            baseActions.current[name].action = action;
//            allActions.current.push(action);
//          } else if (additiveActions.current[name]) {
//            THREE.AnimationUtils.makeClipAdditive(clip);

//            if (clip.name.endsWith('_pose')) {
//              clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
//            }

//            const action = newMixer.clipAction(clip);
//            activateAction(action);
//            additiveActions.current[name].action = action;
//            allActions.current.push(action);
//          }
//        }

//        createPanel();
//      });

//      window.addEventListener('resize', onWindowResize);
//    };

//    init();

//    return () => {
//      window.removeEventListener('resize', onWindowResize);
//      if (containerRef.current) {
//        containerRef.current.innerHTML = '';
//      }
//      if (panelRef.current) {
//        panelRef.current.destroy();
//        panelRef.current = null;
//      }
//    };
//  }, []);


//  const handleSelectItem = async (item: CustomizationItem) => {

//  };




//  const handleRemoveItem = (slotId: string) => {
//    const slot = slots.find((s) => s.id === slotId);
//    if (slot && slot.item && equippedItems[slotId] && equippedItems[slotId].parent) {
//      equippedItems[slotId].parent.remove(equippedItems[slotId]);
//      setEquippedItems((prev) => {
//        const next = { ...prev };
//        delete next[slotId];
//        return next;
//      });
//      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, item: null } : s)));
//    }
//  };

//  const animate = () => {
//    requestAnimationFrame(animate);
//    if (!scene || !camera || !renderer || !stats || !mixer) return;

//    const delta = clock.getDelta();
//    mixer.update(delta);

//    Object.entries(baseActions.current).forEach(([name, settings]) => {
//      if (settings.action) {
//        const weight = settings.action.getEffectiveWeight();
//        const targetWeight = settings.weight;
//        if (weight !== targetWeight) {
//          const diff = targetWeight - weight;
//          const step = delta / transitionDuration;
//          if (Math.abs(diff) < step) {
//            settings.action.setEffectiveWeight(targetWeight);
//          } else {
//            settings.action.setEffectiveWeight(weight + Math.sign(diff) * step);
//          }
//        }
//      }
//    });

//    renderer.render(scene, camera);
//    stats.update();
//  };

//  useEffect(() => {

//    animate();
//  }, [scene, camera, renderer, stats, mixer, clock]);

//  const onWindowResize = () => {
//    if (!camera || !renderer) return;

//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize(window.innerWidth, window.innerHeight);
//  };

//  const createPanel = () => {
//    if (panelRef.current) return;

//    const panel = new GUI({ width: 310 });
//    panelRef.current = panel;

//    const folder1 = panel.addFolder('Base Actions');
//    const folder2 = panel.addFolder('Additive Action Weights');
//    const folder3 = panel.addFolder('General Speed');

//    const panelSettings: { [key: string]: any } = {
//      'modify time scale': 1.0,
//    };

//    const baseNames = ['None', ...Object.keys(baseActions.current)];

//    for (let i = 0, l = baseNames.length; i !== l; ++i) {
//      const name = baseNames[i];
//      panelSettings[name] = () => {
//        setBaseAction(name);
//      };

//      crossFadeControls.current.push(folder1.add(panelSettings, name));
//    }

//    for (const name of Object.keys(additiveActions.current)) {
//      const settings = additiveActions.current[name as keyof typeof additiveActions.current];

//      panelSettings[name] = settings.weight;

//      folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange((weight: number) => {
//        setWeight(settings.action!, weight);
//        settings.weight = weight;
//      });
//    }

//    folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

//    crossFadeControls.current.forEach((control) => {
//      control.setInactive = () => {
//        control.domElement.classList.add('control-inactive');
//      };

//      control.setActive = () => {
//        control.domElement.classList.remove('control-inactive');
//      };

//      const settings = baseActions.current[control.property as keyof typeof baseActions.current];

//      if (!settings || !settings.weight) {
//        control.setInactive();
//      }
//    });
//  };

//  const activateAction = (action: THREE.AnimationAction) => {
//    const clip = action.getClip();
//    const settings = baseActions.current[clip.name as keyof typeof baseActions.current] ||
//      additiveActions.current[clip.name as keyof typeof additiveActions.current];
//    setWeight(action, settings.weight);
//    action.play();
//  };

//  const modifyTimeScale = (speed: number) => {
//    if (mixer) mixer.timeScale = speed;
//  };

//  const setBaseAction = (
//    name: string) => {
//    console.log('setBaseAction', name);
//    const nextAction = name === 'None' ? null : baseActions.current[name]?.action;

//    Object.values(baseActions.current).forEach(({ action }) => {
//      if (action) {
//        action.fadeOut(transitionDuration);
//      }
//    });

//    if (nextAction) {
//      nextAction.reset().fadeIn(transitionDuration).play();
//    }

//    Object.keys(baseActions.current).forEach((key) => {
//      baseActions.current[key].weight = key === name ? 1 : 0;
//    });

//    crossFadeControls.current.forEach((control) => {
//      const actionName = control.property;
//      if (actionName === name) {
//        control.setActive();
//      } else {
//        control.setInactive();
//      }
//    });
//  };

//  const setWeight = (action: THREE.AnimationAction, weight: number) => {
//    action.enabled = true;
//    action.setEffectiveTimeScale(1);
//    action.setEffectiveWeight(weight);
//  };


//  return (
//    <>
//      <div ref={containerRef} className="w-full h-screen bg-[#1a1a1a]" />
//      <CustomizationPanel
//        items={customizationItems}
//        onSelectItem={handleSelectItem}
//        totalItems={customizationItems.length}
//      />
//      <EquipmentSlots
//        slots={slots}
//        onRemoveItem={handleRemoveItem}
//      />
//    </>
//  );
// };

// export default ThreeScene;
// 修改一下这个代码，使其可以成功换装，当我点击左边栏，将衣服换上去，3d建模身上要显示对应的衣服出来，帮我修改一下代码，使其可以实现这个功能