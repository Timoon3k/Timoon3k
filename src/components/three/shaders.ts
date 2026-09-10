/**
 * Shadery sceny sygnaturowej „Digital Core”.
 *
 * Szum simplex 3D (Ashima / Stefan Gustavson, MIT) trzymany w jednym miejscu —
 * używają go zarówno rdzeń, jak i powłoka punktowa.
 */
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/* -------------------------------------------------------------------------- */
/* Rdzeń — deformowana bryła z rimem fresnela                                 */
/* -------------------------------------------------------------------------- */

export const coreVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uScroll;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

/** Deformacja liczona raz — używana też do przybliżenia normalnej. */
float fieldAt(vec3 p) {
  float base = snoise(p * uFrequency + vec3(0.0, uTime * 0.14, uTime * 0.07));
  float detail = snoise(p * (uFrequency * 2.4) - uTime * 0.09) * 0.32;
  return (base + detail) * uAmplitude;
}

void main() {
  float displacement = fieldAt(position) * (1.0 + uScroll * 0.35);
  vec3 pos = position + normal * displacement;

  vDisplacement = displacement;
  vLocalPosition = pos;

  // Normalna przybliżona różnicowo — tańsza niż liczenie stycznych,
  // a dla miękkiego rimu wystarczająco dokładna.
  float eps = 0.04;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
  vec3 bitangent = normalize(cross(normal, tangent));
  float dTangent = fieldAt(position + tangent * eps) - displacement;
  float dBitangent = fieldAt(position + bitangent * eps) - displacement;
  vec3 perturbed = normalize(normal - (tangent * dTangent + bitangent * dBitangent) * 9.0);

  vNormal = normalize(normalMatrix * perturbed);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const coreFragmentShader = /* glsl */ `
uniform vec3 uColorDeep;
uniform vec3 uColorRim;
uniform float uTime;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  float facing = clamp(dot(normal, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - facing, 3.0);

  // Kierunkowe światło gwiazdy z lewej góry — buduje bryłę, nie oświetla całości.
  float key = clamp(dot(normal, normalize(vec3(-0.5, 0.8, 0.4))), 0.0, 1.0);

  // Zagłębienia ciemnieją, grzbiety łapią akcent — czyta się jako struktura,
  // a nie jako równomierna poświata.
  float ridge = smoothstep(-0.06, 0.09, vDisplacement);

  vec3 color = uColorDeep;
  color += uColorRim * fresnel * 0.85;
  color += uColorRim * key * ridge * 0.16;

  // Bardzo powolne przejście skanujące w pionie — ledwie zauważalne.
  float scan = smoothstep(0.985, 1.0, sin(vLocalPosition.y * 2.2 - uTime * 0.35) * 0.5 + 0.5);
  color += uColorRim * scan * 0.10;

  // Delikatna emisja od strony obserwatora — bez niej środek czyta się jak dziura,
  // a nie jak świecący rdzeń.
  color += uColorRim * pow(facing, 3.0) * 0.07;

  float alpha = (0.30 + fresnel * 0.70 + pow(facing, 4.0) * 0.16) * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
`;

/* -------------------------------------------------------------------------- */
/* Powłoka punktowa — „siatka” otaczająca rdzeń                               */
/* -------------------------------------------------------------------------- */

export const shellVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uScroll;

attribute float aSeed;

varying float vFade;

void main() {
  // Powłoka oddycha i lekko rozsuwa się przy przewijaniu — warstwy się rozdzielają.
  float breathe = 1.0 + sin(uTime * 0.32 + aSeed * 6.283) * 0.012 + uScroll * 0.16;
  vec3 pos = position * breathe;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);

  // Punkty od strony obserwatora są jaśniejsze — daje wrażenie głębi.
  vFade = smoothstep(-2.0, 2.0, -mvPosition.z * -1.0) * 0.6 + 0.4;
}
`;

export const shellFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;

varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float falloff = smoothstep(0.5, 0.1, d);
  gl_FragColor = vec4(uColor, falloff * vFade * uOpacity);
}
`;

/* -------------------------------------------------------------------------- */
/* Konstelacja — węzły danych na orbitach                                     */
/* -------------------------------------------------------------------------- */

export const nodesVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSpeed;
attribute float aPhase;

varying float vAlpha;

void main() {
  vec3 pos = position;

  float angle = uTime * aSpeed + aPhase;
  float c = cos(angle);
  float s = sin(angle);
  pos.xz = mat2(c, -s, s, c) * pos.xz;
  pos.y += sin(uTime * 0.42 + aPhase) * 0.05;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);

  // Pulsowanie rozjeżdżone fazą — węzły „mrugają” niezależnie od siebie.
  vAlpha = (0.35 + 0.65 * (sin(uTime * 0.9 + aPhase * 2.0) * 0.5 + 0.5)) * aScale;
}
`;

export const nodesFragmentShader = /* glsl */ `
uniform vec3 uColor;

varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, core * vAlpha);
}
`;
