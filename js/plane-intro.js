// =============================================================================
// plane-intro.js — F-22 cinematic intro overlay for the portfolio
// Globals expected: THREE (r134), THREE.GLTFLoader, gsap, VANTA
// =============================================================================

(function () {
  const canvas = document.getElementById('plane-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ---------------------------------------------------------------------------
  // Skip path: repeat visits in this session, OR deep-links to a section.
  // Tear down the overlay immediately and let the portfolio render normally.
  // ---------------------------------------------------------------------------
  const SESSION_KEY = 'rb_intro_seen';

  // sessionStorage may throw in private mode / sandboxed iframes — fall back to "not seen"
  let hasSeenIntro = false;
  try {
    hasSeenIntro = sessionStorage.getItem(SESSION_KEY) === '1';
  } catch (e) {
    console.warn('[plane-intro] sessionStorage unavailable, treating as first visit:', e.message);
  }

  // Treat empty / "#" / "#hero" / "#top" as "no specific destination" — still play intro.
  const hash = (window.location.hash || '').toLowerCase();
  const isDeepLink = hash.length > 1 && !['#hero', '#top'].includes(hash);

  // Respect OS-level reduced-motion preference (vestibular disorders, etc.)
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (hasSeenIntro || isDeepLink || prefersReducedMotion) {
    const intro = document.getElementById('plane-intro');
    const flash = document.getElementById('white-flash');
    if (intro) intro.remove();
    if (flash) flash.remove();
    canvas.remove();
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    return;
  }

  // ---------------------------------------------------------------------------
  // Scene setup
  // ---------------------------------------------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, -60);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const CRUISE_SPEED = 15;
  const CAMERA_OFFSET = new THREE.Vector3(0, 8, -60);
  const TRAIL_LIFETIME = 3.0;

  const EXHAUST_LEFT = new THREE.Vector3(-1.2, -1.2, -16.8);
  const EXHAUST_RIGHT = new THREE.Vector3(1.2, -1.2, -16.8);

  const WING_LEFT = new THREE.Vector3(-0.35, -0.14, -0.18);
  const WING_RIGHT = new THREE.Vector3(0.35, -0.14, -0.18);
  const MISSILE_SCALE = 0.0012;

  const _offset = new THREE.Vector3();
  const _forward = new THREE.Vector3();
  const _camTarget = new THREE.Vector3();
  const _targetQuat = new THREE.Quaternion();
  const _tempObj = new THREE.Object3D();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let plane, mixer;
  let planeTemplate = null;
  let missileTemplate = null;

  let cruising = true;
  let diving = false;

  let flybyPlane = null;
  let flybyActive = false;
  let flybyMaterials = [];

  let leftMissile = null;
  let rightMissile = null;
  let missileLaunched = false;

  let revealed = false;
  let rafId = null;

  const clock = new THREE.Clock();

  // ---------------------------------------------------------------------------
  // Asset loading
  // ---------------------------------------------------------------------------
  const loader = new THREE.GLTFLoader();

  loader.load('assets/f22.glb', (gltf) => {
    planeTemplate = gltf.scene;

    plane = gltf.scene.clone();
    plane.scale.set(20, 20, 20);
    scene.add(plane);

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(plane);
      const action = mixer.clipAction(gltf.animations[0]);
      action.setLoop(THREE.LoopRepeat);
      action.play();
    }
  });

  loader.load('assets/missile.glb', (gltf) => {
    missileTemplate = gltf.scene;
  });

  // ---------------------------------------------------------------------------
  // Contrail system
  // ---------------------------------------------------------------------------
  const trailMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float depth = max(-mvPosition.z, 0.1);
        gl_PointSize = 10.0 * (100.0 / depth);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float soft = smoothstep(0.5, 0.0, length(uv));
        float age = 1.0 - vAlpha;

        vec3 hot    = vec3(0.6, 0.25, 0.05);
        vec3 orange = vec3(0.5, 0.2, 0.05);
        vec3 smoke  = vec3(0.5, 0.5, 0.55);

        vec3 color = age < 0.2
          ? mix(hot, orange, age / 0.2)
          : mix(orange, smoke, (age - 0.2) / 0.8);

        float fade = smoothstep(0.0, 1.0, vAlpha);
        gl_FragColor = vec4(color, soft * fade * 0.01 / max(age, 0.05));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const MAX_TRAIL_PARTICLES = 1000;
  const trailPositions = new Float32Array(MAX_TRAIL_PARTICLES * 3);
  const trailAlphas = new Float32Array(MAX_TRAIL_PARTICLES);
  const trailAges = new Float32Array(MAX_TRAIL_PARTICLES);

  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(trailAlphas, 1));

  const trail = new THREE.Points(trailGeometry, trailMaterial);
  trail.frustumCulled = false;
  scene.add(trail);

  let trailHead = 0;
  let trailActive = true;

  function spawnTrailParticle(x, y, z) {
    const i = trailHead;
    trailPositions[i * 3 + 0] = x;
    trailPositions[i * 3 + 1] = y;
    trailPositions[i * 3 + 2] = z;
    trailAges[i] = 0;
    trailAlphas[i] = 1;
    trailHead = (trailHead + 1) % MAX_TRAIL_PARTICLES;
  }

  function updateTrail(delta) {
    for (let i = 0; i < MAX_TRAIL_PARTICLES; i++) {
      if (trailAlphas[i] > 0) {
        trailAges[i] += delta;
        trailAlphas[i] = Math.max(0, 1 - trailAges[i] / TRAIL_LIFETIME);
      }
    }
    trailGeometry.attributes.position.needsUpdate = true;
    trailGeometry.attributes.alpha.needsUpdate = true;
  }

  const FLYBY_TRAIL_MAX = 800;
  const flybyTrailPositions = new Float32Array(FLYBY_TRAIL_MAX * 3);
  const flybyTrailAlphas = new Float32Array(FLYBY_TRAIL_MAX);
  const flybyTrailAges = new Float32Array(FLYBY_TRAIL_MAX);

  const flybyTrailGeometry = new THREE.BufferGeometry();
  flybyTrailGeometry.setAttribute('position', new THREE.BufferAttribute(flybyTrailPositions, 3));
  flybyTrailGeometry.setAttribute('alpha', new THREE.BufferAttribute(flybyTrailAlphas, 1));

  const flybyTrail = new THREE.Points(flybyTrailGeometry, trailMaterial);
  flybyTrail.frustumCulled = false;
  scene.add(flybyTrail);

  let flybyTrailHead = 0;
  let flybyTrailOpacity = 0;

  function spawnFlybyParticle(x, y, z) {
    const i = flybyTrailHead;
    flybyTrailPositions[i * 3 + 0] = x;
    flybyTrailPositions[i * 3 + 1] = y;
    flybyTrailPositions[i * 3 + 2] = z;
    flybyTrailAges[i] = 0;
    flybyTrailAlphas[i] = flybyTrailOpacity;
    flybyTrailHead = (flybyTrailHead + 1) % FLYBY_TRAIL_MAX;
  }

  function updateFlybyTrail(delta) {
    for (let i = 0; i < FLYBY_TRAIL_MAX; i++) {
      if (flybyTrailAlphas[i] > 0) {
        flybyTrailAges[i] += delta;
        flybyTrailAlphas[i] = Math.max(0, 1 - flybyTrailAges[i] / TRAIL_LIFETIME);
      }
    }
    flybyTrailGeometry.attributes.position.needsUpdate = true;
    flybyTrailGeometry.attributes.alpha.needsUpdate = true;
  }

  function spawnExhaustParticles(obj, spawnFn) {
    for (let k = 0; k < 2; k++) {
      _offset.copy(EXHAUST_LEFT).applyQuaternion(obj.quaternion);
      spawnFn(obj.position.x + _offset.x, obj.position.y + _offset.y, obj.position.z + _offset.z);
      _offset.copy(EXHAUST_RIGHT).applyQuaternion(obj.quaternion);
      spawnFn(obj.position.x + _offset.x, obj.position.y + _offset.y, obj.position.z + _offset.z);
    }
  }

  // ---------------------------------------------------------------------------
  // Missile launch + impact transition
  // ---------------------------------------------------------------------------
  function launchMissile(missile) {
    if (!missile || !flybyPlane) return;

    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();
    missile.getWorldPosition(worldPos);
    missile.getWorldQuaternion(worldQuat);
    missile.getWorldScale(worldScale);

    flybyPlane.remove(missile);
    scene.add(missile);
    missile.position.copy(worldPos);
    missile.quaternion.copy(worldQuat);
    missile.scale.copy(worldScale);

    gsap.to(missile.position, {
      z: camera.position.z - 50,
      duration: 0.85,
      ease: 'power3.in',
      onComplete: () => {
        triggerWhiteFlash();
        scene.remove(missile);
      }
    });
  }

  function triggerWhiteFlash() {
    const flash = document.getElementById('white-flash');
    if (!flash) return;

    gsap.timeline()
      .to(flash, { opacity: 1, duration: 0.07, ease: 'power3.in' })
      .to(flash, { opacity: 1, duration: 0.5, onStart: revealPortfolio })
      .to(flash, { opacity: 0, duration: 1.4, ease: 'power2.out' });
  }

  function revealPortfolio() {
    if (revealed) return;
    revealed = true;

    // Remember that this visitor has seen the intro — skip it on next page view
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {
      console.warn('[plane-intro] could not persist intro-seen flag:', e.message);
    }

    const intro = document.getElementById('plane-intro');
    if (intro) intro.classList.add('hidden');

    // Re-enable scroll on the portfolio underneath
    document.body.classList.remove('intro-active');
    document.documentElement.classList.remove('intro-active');

    // Resume Lenis if it was paused while the intro played
    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }

    // Tear down the WebGL stage once the flash has fully faded
    setTimeout(() => {
      if (intro) intro.style.display = 'none';
      if (canvas) canvas.style.display = 'none';

      cancelAnimationFrame(rafId);

      // Stop Vanta to free GPU resources
      if (window.__vantaIntroEffect && typeof window.__vantaIntroEffect.destroy === 'function') {
        window.__vantaIntroEffect.destroy();
        window.__vantaIntroEffect = null;
      }

      renderer.dispose();
    }, 1600);
  }

  // ---------------------------------------------------------------------------
  // Flyby sequence
  // ---------------------------------------------------------------------------
  function spawnFlyby() {
    if (!planeTemplate || !missileTemplate) return;

    flybyPlane = planeTemplate.clone();
    flybyPlane.scale.set(20, 20, 20);
    missileLaunched = false;

    flybyMaterials = [];
    flybyPlane.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m) => {
          const c = m.clone();
          c.transparent = true;
          c.opacity = 0;
          flybyMaterials.push(c);
          return c;
        });
        if (obj.material.length === 1) obj.material = obj.material[0];
      } else {
        const c = obj.material.clone();
        c.transparent = true;
        c.opacity = 0;
        flybyMaterials.push(c);
        obj.material = c;
      }
    });

    leftMissile = missileTemplate.clone();
    leftMissile.position.copy(WING_LEFT);
    leftMissile.scale.set(MISSILE_SCALE, MISSILE_SCALE, MISSILE_SCALE);
    flybyPlane.add(leftMissile);

    rightMissile = missileTemplate.clone();
    rightMissile.position.copy(WING_RIGHT);
    rightMissile.scale.set(MISSILE_SCALE, MISSILE_SCALE, MISSILE_SCALE);
    flybyPlane.add(rightMissile);

    scene.add(flybyPlane);
    flybyActive = true;
    flybyTrailOpacity = 0;

    const camZ = camera.position.z;
    const camY = camera.position.y;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(camera.position.x, camY - 2, camZ + 350),
      new THREE.Vector3(camera.position.x, camY - 2, camZ + 220),
      new THREE.Vector3(camera.position.x, camY - 2, camZ + 160),
      new THREE.Vector3(camera.position.x, camY + 5, camZ + 110),
      new THREE.Vector3(camera.position.x, camY + 30, camZ + 90),
      new THREE.Vector3(camera.position.x, camY + 90, camZ + 90),
      new THREE.Vector3(camera.position.x, camY + 180, camZ + 110),
      new THREE.Vector3(camera.position.x, camY + 280, camZ + 140)
    ], false, 'catmullrom', 0.5);

    const follow = { t: 0 };
    const _lookTarget = new THREE.Vector3();

    curve.getPointAt(0, flybyPlane.position);
    curve.getPointAt(0.01, _lookTarget);
    flybyPlane.lookAt(_lookTarget);

    const tl = gsap.timeline({
      onComplete: () => {
        flybyActive = false;
        scene.remove(flybyPlane);
        flybyMaterials.forEach((m) => m.dispose());
        flybyMaterials = [];
        flybyPlane = null;
        leftMissile = null;
        rightMissile = null;
      }
    });

    tl.to(follow, {
      t: 1,
      duration: 5,
      ease: 'power1.inOut',
      onUpdate: () => {
        const t = follow.t;
        curve.getPointAt(t, flybyPlane.position);

        const aheadT = Math.min(t + 0.015, 1);
        curve.getPointAt(aheadT, _lookTarget);
        _tempObj.position.copy(flybyPlane.position);
        _tempObj.lookAt(_lookTarget);
        _targetQuat.copy(_tempObj.quaternion);
        flybyPlane.quaternion.slerp(_targetQuat, 0.1);

        if (!missileLaunched && t >= 0.42) {
          missileLaunched = true;
          launchMissile(leftMissile);
          launchMissile(rightMissile);
        }
      }
    }, 0)
      .to({ o: 0 }, {
        o: 1,
        duration: 1.2,
        ease: 'power2.in',
        onUpdate: function () {
          const o = this.targets()[0].o;
          flybyMaterials.forEach((m) => { m.opacity = o; });
          flybyTrailOpacity = o;
        }
      }, 0);
  }

  // ---------------------------------------------------------------------------
  // Main loop
  // ---------------------------------------------------------------------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });

  function animate() {
    rafId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (plane && cruising && !diving) {
      _forward.set(0, 0, 1).applyQuaternion(plane.quaternion);
      plane.position.addScaledVector(_forward, CRUISE_SPEED * delta);

      _camTarget.copy(CAMERA_OFFSET).applyQuaternion(plane.quaternion).add(plane.position);
      camera.position.lerp(_camTarget, Math.min(1, delta * 4));
      camera.lookAt(plane.position);

      const t = clock.elapsedTime;
      plane.rotation.x = Math.sin(t * 3.7) * 0.005 + Math.sin(t * 11.3) * 0.004;
      plane.rotation.z = Math.sin(t * 2.9) * 0.10 + Math.sin(t * 9.1) * 0.005;
      plane.rotation.y = Math.sin(t * 1.8) * 0.01;
    }

    if (trailActive && plane) spawnExhaustParticles(plane, spawnTrailParticle);
    if (flybyActive && flybyPlane) spawnExhaustParticles(flybyPlane, spawnFlybyParticle);

    updateTrail(delta);
    updateFlybyTrail(delta);

    renderer.render(scene, camera);
  }
  animate();

  // ---------------------------------------------------------------------------
  // Dive sequence (button click triggers everything)
  // ---------------------------------------------------------------------------
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!plane || diving) return;
      diving = true;
      cruising = false;
      trailActive = true;

      startBtn.classList.add('engaged');

      const tl = gsap.timeline();

      tl.to(plane.position, {
        z: '+=120',
        duration: 5,
        ease: 'power2.in'
      }, 0)
        .to(plane.position, {
          y: '+=3',
          duration: 1.6,
          ease: 'sine.inOut',
          onComplete: () => gsap.delayedCall(1.4, spawnFlyby)
        }, 0)
        .to(plane.rotation, {
          z: `+=${Math.PI / 2.5}`,
          duration: 1.8,
          ease: 'sine.inOut'
        }, 0.6)
        .to(plane.rotation, {
          y: `-=${Math.PI / 2}`,
          duration: 2.6,
          ease: 'sine.inOut'
        }, '<+=0.7')
        .to(plane.position, {
          x: '-=260',
          duration: 3,
          ease: 'power3.in'
        }, '<-=0.3');
    });
  }

  // Initialize Vanta clouds bg now that DOM + globals are ready
  if (typeof VANTA !== 'undefined' && VANTA.CLOUDS) {
    window.__vantaIntroEffect = VANTA.CLOUDS({
      el: '#plane-intro .bg',
      mouseControls: false,
      touchControls: true,
      gyroControls: false
    });
  }
})();
