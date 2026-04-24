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
import {
  getPerformanceMode,
  isCharacterLowPower,
} from "../utils/performanceMode";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const characterRef = useRef<THREE.Object3D | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      const isMobile = window.innerWidth <= 1024;
      const lowPowerRef = {
        current: isCharacterLowPower(getPerformanceMode()) || isMobile,
      };
      const frameIntervalRef = {
        current: lowPowerRef.current ? 1000 / 30 : 1000 / 45,
      };
      let lastRenderTime = 0;

      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !lowPowerRef.current,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, lowPowerRef.current ? 1 : 1.25)
      );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = !lowPowerRef.current;
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
      let sceneActive = true;

      const clock = new THREE.Clock();

      const light = setLighting(scene, lowPowerRef.current);
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

      const applyPerformanceMode = () => {
        lowPowerRef.current = isCharacterLowPower(getPerformanceMode()) || isMobile;
        frameIntervalRef.current = lowPowerRef.current ? 1000 / 30 : 1000 / 45;
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, lowPowerRef.current ? 1 : 1.25)
        );
        renderer.shadowMap.enabled = !lowPowerRef.current;
      };

      applyPerformanceMode();

      const updateSceneActivity = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const activeLimit = window.innerHeight * (isMobile ? 1.15 : 1.8);
        sceneActive = !document.hidden && scrollY < activeLimit;
      };

      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", updateSceneActivity, { passive: true });
      document.addEventListener("visibilitychange", updateSceneActivity);
      window.addEventListener(
        "rv-performance-mode-change",
        applyPerformanceMode as EventListener
      );
      updateSceneActivity();
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

      if (!isMobile) {
        document.addEventListener("mousemove", onMouseMove, { passive: true });
      }
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = (time = 0) => {
        frameId = requestAnimationFrame(animate);
        if (!sceneActive) {
          return;
        }

        if (time - lastRenderTime < frameIntervalRef.current) {
          return;
        }

        lastRenderTime = time;

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

      animate(0);

      return () => {
        clearTimeout(debounce);
        cancelAnimationFrame(frameId);
        removeHoverEffects?.();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updateSceneActivity);
        document.removeEventListener("visibilitychange", updateSceneActivity);
        window.removeEventListener(
          "rv-performance-mode-change",
          applyPerformanceMode as EventListener
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          if (!isMobile) {
            document.removeEventListener("mousemove", onMouseMove);
          }
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
