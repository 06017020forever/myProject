
"use client";
import { useEffect, useRef } from 'react';
import { PerspectiveCamera, Scene, Texture, TextureLoader, WebGLRenderer, InstancedBufferGeometry, BufferAttribute, InstancedBufferAttribute, Vector2, RawShaderMaterial, Mesh, DoubleSide } from 'three';
import { resize } from '../type/threeUtil'; // Adjust this import if needed
import { getPathWithPrefix } from '../util'; // Adjust this import if needed

import AnimatState from '../type/AnimatState';

// 简化后的顶点着色器
const vs = `
precision highp float;
attribute vec3 position;
attribute vec2 offset;
attribute vec2 uv;
uniform vec2 uTextureSize;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uThick;
varying vec2 vuv;

void main() {
  // 计算纹理的大小
  float width = uTextureSize.x;
  float height = uTextureSize.y;
  vec2 cellSize = vec2(1. / width, 1. / height);

  // 将偏移量映射到纹理坐标
  vuv = (uv.xy + vec2(offset.x, height - offset.y)) * cellSize;

  // 基本的位移
  float x = offset.x - width * 0.5;
  float y = height * 0.5 - offset.y;
  float z = sin(uTime * 0.0001) * uThick * 0.1;

  gl_Position = vec4(x, y, z, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * gl_Position;
}
`;

// 简化后的片段着色器
const fs = `
precision highp float;
uniform sampler2D uTexture;
varying vec2 vuv;

void main() {
  gl_FragColor = texture2D(uTexture, vuv);
}
`;

let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let loader: TextureLoader;
let texture: Texture;
let colors: Float32Array;
let totalPoints = 0;
let width = 0, height = 0;
let particles: Mesh;
let imgThick = 1000;
let thickAnimat = new AnimatState({ value: imgThick }, 'LINEAR');
let inStartAnimation = true;

const loop = (time: number) => {
  requestAnimationFrame(loop);
  thickAnimat.update(time);
  (particles.material as RawShaderMaterial).uniforms.uThick.value = imgThick;
  (particles.material as RawShaderMaterial).uniforms.uTime.value = time;

  renderer.render(scene, camera);
};

const pixelExtraction = () => {
  width = texture.image.width;
  height = texture.image.height;
  totalPoints = width * height;

  const img = texture.image;
  const temCanvas = document.createElement('canvas');
  const ctx = temCanvas.getContext('2d') as CanvasRenderingContext2D;
  temCanvas.width = width;
  temCanvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  colors = Float32Array.from(imgData.data);
};

const initParticles = () => {
  const geometryParticles = new InstancedBufferGeometry();
  const positions = new BufferAttribute(new Float32Array(4 * 3), 3);
  positions.setXYZ(0, -0.5, 0.5, 0.0);
  positions.setXYZ(1, 0.5, 0.5, 0.0);
  positions.setXYZ(2, -0.5, -0.5, 0.0);
  positions.setXYZ(3, 0.5, -0.5, 0.0);
  geometryParticles.setAttribute('position', positions);

  const uvs = new BufferAttribute(new Float32Array(4 * 2), 2);
  uvs.setXY(0, 0, 1);
  uvs.setXY(1, 1, 1);
  uvs.setXY(2, 0, 0);
  uvs.setXY(3, 1, 0);
  geometryParticles.setAttribute('uv', uvs);

  geometryParticles.setIndex(new BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

  const offsets = new Float32Array(totalPoints * 2);
  const pindexs = new Float32Array(totalPoints);

  for (let i = 0; i < totalPoints; i++) {
    offsets[i * 2 + 0] = i % width;
    offsets[i * 2 + 1] = Math.floor(i / width);
    pindexs[i] = i;
  }

  geometryParticles.setAttribute('offset', new InstancedBufferAttribute(offsets, 2, false));

  const uniforms = {
    uTextureSize: { value: new Vector2(width, height) },
    uTexture: { value: texture },
    uTime: { value: 1 },
    uThick: { value: imgThick },
  };

  const materialParticles = new RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    depthTest: false,
    transparent: true,
    side: DoubleSide,
  });

  particles = new Mesh(geometryParticles, materialParticles);
  scene.add(particles);
};

const start = (tex: Texture) => {
  texture = tex;
  pixelExtraction();
  initParticles();
  thickAnimat.to({ value: 1 }, 1000).onUpdate((thickObj) => (imgThick = thickObj.value)).onEnd(() => {
    inStartAnimation = false;
    thickAnimat.to({ value: 50 }, 2000).start();
  }).start();
  requestAnimationFrame(loop);
};

const setup = (canvas: HTMLCanvasElement) => {
  renderer = new WebGLRenderer({
    antialias: true,
    canvas,
  });
  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 200);

  scene = new Scene();
  loader = new TextureLoader();
  resize(camera, renderer);
};

const on = () => {
  const mousemove = (x: number, y: number) => {
    camera.position.x += (x - camera.position.x) * 0.1;
    camera.position.y += (-y - camera.position.y) * 0.1;
    camera.lookAt(0, 0, 0);
  };
  const mousedown = () => {
    if (!inStartAnimation) {
      thickAnimat.to({ value: 1 }, 1000).start();
    }
  };
  const mouseup = () => {
    if (!inStartAnimation) {
      thickAnimat.to({ value: 50 }, 1000).start();
    }
  };
  window.addEventListener('resize', () => resize(camera, renderer));
  window.addEventListener('mousemove', (event) => {
    const mouseposition = {
      x: (event.offsetX - window.innerWidth * 0.5) * 0.1,
      y: (event.offsetY - window.innerHeight * 0.5) * 0.1,
    };

    mousemove(mouseposition.x, mouseposition.y);
  });

  window.addEventListener('mousedown', mousedown);
  window.addEventListener('mouseup', mouseup);
  window.addEventListener('touchstart', mousedown);
  window.addEventListener('touchend', mouseup);
};

const init = (canvas: HTMLCanvasElement) => {
  canvas.style.cursor = 'pointer';

  setup(canvas);
  on();
  loader.load('/images/pixelImage/OIP.jpg', start); // Make
};

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      init(canvasRef.current);
    }

    return () => {
      // Cleanup logic (remove event listeners, stop animation, etc.)
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default Particles;
