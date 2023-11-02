const ImgShader = {
  uniforms: {},

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float alpha;

    varying vec2 vUv;

    void main(void) {
      vec4 dest = texture2D(tDiffuse, vUv);
      
      // dest.rgb += vec3(0.0, 1.0, 0.0);
      // dest.a += 0.5;

      dest.a *= alpha;
      gl_FragColor = dest;
    }`,
}

export { ImgShader }
