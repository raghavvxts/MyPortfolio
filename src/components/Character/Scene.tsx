import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const characterRef = useRef<THREE.Object3D | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      const isMobile = window.innerWidth <= 1024;
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.6));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let removeHoverEffects: (() => void) | undefined;
      let frameId = 0;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            removeHoverEffects = animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          const loadedCharacter = gltf.scene;
          characterRef.current = loadedCharacter;
          scene.add(loadedCharacter);
          headBone = loadedCharacter.getObjectByName("spine006") || null;
          screenLight = loadedCharacter.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
        }
      });

      const onResize = () => {
        if (characterRef.current) {
          handleResize(renderer, camera, canvasDiv, characterRef.current);
        }
      };

      window.addEventListener("resize", onResize);
      const landingDiv = document.getElementById("landingDiv");

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchMove = (e: TouchEvent) =>
        handleTouchMove(e, (x, y) => (mouse = { x, y }));
      const onTouchStart = () => {
        debounce = setTimeout(() => {
          landingDiv?.addEventListener("touchmove", onTouchMove, { passive: true });
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove, { passive: true });
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        clearTimeout(debounce);
        cancelAnimationFrame(frameId);
        removeHoverEffects?.();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
          landingDiv.removeEventListener("touchmove", onTouchMove);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
