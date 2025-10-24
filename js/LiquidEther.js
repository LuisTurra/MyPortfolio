window.addEventListener("load", () => {
  const container = document.getElementById("liquid-ether");
  if (!container) {
    console.error("Container not found!");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    time: { value: 0 },
    colors: {
      value: [
        new THREE.Color("#5227FF"),
        new THREE.Color("#FF9FFC"),
        new THREE.Color("#B19EEF"),
      ],
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader: `
      uniform float time;
      uniform vec3 colors[3];
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float len = length(p);
        float wave = sin(len * 20.0 - time * 2.0) * 0.1;
        vec3 col = mix(colors[0], colors[1], len + wave);
        col = mix(col, colors[2], smoothstep(0.2, 0.8, len + wave));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function animate() {
    uniforms.time.value += 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
