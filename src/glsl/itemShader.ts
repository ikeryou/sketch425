const itemShader = {
  uniforms: {},

  vertexShader: /* glsl */ `
    precision highp float;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPosition;

    uniform float size;
    uniform float time;
    uniform float trail;
    uniform float useMouse;
    uniform vec3 dist;
    uniform vec3 mouse;

    attribute vec3 position;
    attribute vec3 centerPos;
    attribute vec3 info;
    attribute vec3 distPos;
    attribute vec3 lineColor;
    attribute vec3 lineColor2;

    varying float vDist;
    varying float vMouse;
    varying vec3 vColor;
    varying vec3 vColor2;
    varying vec3 vInfo;

    float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
      return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
    }

    vec3 rotate(vec3 p, float angle, vec3 axis){
      vec3 a = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float r = 1.0 - c;
      mat3 m = mat3(
          a.x * a.x * r + c,
          a.y * a.x * r + a.z * s,
          a.z * a.x * r - a.y * s,
          a.x * a.y * r - a.z * s,
          a.y * a.y * r + c,
          a.z * a.y * r + a.x * s,
          a.x * a.z * r + a.y * s,
          a.y * a.z * r - a.x * s,
          a.z * a.z * r + c
      );
      return m * p;
    }

    vec3 rgb2hsb(vec3 c){
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz),vec4(c.gb, K.xy),step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r),vec4(c.r, p.yzx),step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),d / (q.x + e),q.x);
    }

    vec3 hsb2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        rgb = rgb*rgb*(3.0-2.0*rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }

    float ease(float t) {
      t *= 2.0;
      if (t < 1.0) {
        return -0.5 * (sqrt(1.0 - t * t) - 1.0);
      }
      t -= 2.0;
      return 0.5 * (sqrt(1.0 - t * t) + 1.0);
    }

    void main(){
      vec3 p = vec3(0.0);

      p.x = position.x;
      p.y = position.y;

      float mdx = mouse.x - centerPos.x;
      float mdy = mouse.y - centerPos.y;
      float mdist = sqrt(mdx * mdx + mdy * mdy);
      float power = map(mdist, 1.0, 0.0, 0.0, 1.0);
      power = pow(power, 8.0);
      power = clamp(power, 0.0, 1.0);
      power *= useMouse;
      power = 0.5 * useMouse;
      vMouse = power;

      float time2 = time * info.z;

      float rad = info.x + time2 * 0.05;
      float trailDist = ease(map(sin(rad), -1.0, 1.0, 0.0, 1.0));
      vDist = trailDist;

      p.x = mix(p.x, p.x + distPos.x * trailDist, info.y);
      p.y = mix(p.y, p.y + distPos.y * trailDist, info.y);

      p = rotate(p, radians(info.z + time2 * 1.0), vec3(0.0, 0.0, 1.0));

      float radiusPower = mix(1.0, ease(map(sin(rad * -0.25), -1.0, 1.0, 0.25, 1.0)), distPos.z) * (power * 1.0);
      p.x *= radiusPower;
      p.y *= radiusPower;

      p.x += centerPos.x;
      p.y += centerPos.y;

      // p.x -= step(info.x, 0.0) * 9999.0;

      vInfo = info;

      vColor = lineColor;
      vColor2 = lineColor2;

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * pow((power * 1.5), 6.0);
    }`,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform vec3 color;
    uniform vec3 dist;
    uniform float size;
    uniform float time;

    varying float vDist;
    varying float vMouse;
    varying vec3 vColor;
    varying vec3 vColor2;
    varying vec3 vInfo;

    float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
      return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
    }

    vec3 rgb2hsb(vec3 c){
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz),vec4(c.gb, K.xy),step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r),vec4(c.r, p.yzx),step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),d / (q.x + e),q.x);
    }

    vec3 hsb2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      rgb = rgb*rgb*(3.0-2.0*rgb);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }

    void main(void) {
      vec4 dest = vec4(vColor, 1.0);
      float ef = mix(1.0, map(vDist, 0.0, 1.0, 0.0, 1.0), vInfo.y);

      vec3 hsb = rgb2hsb(vColor);

      hsb.x += mix(0.0, mix(0.0, vInfo.y * vColor2.x, ef), vMouse);
      hsb.y = 1.0;
      hsb.z = 1.0;

      // dest.rgb = hsb2rgb(hsb);
      dest.a *= ef;
      gl_FragColor = dest;
    }`,
}

export { itemShader }
