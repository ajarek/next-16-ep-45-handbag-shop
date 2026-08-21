"use client";

import React, { useEffect, useRef } from "react";
import { useShop } from "@/context/ShopContext";

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useShop();
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    // Kod shadera wierzchołków
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Kod shadera fragmentów - delikatne gradienty, subtelna siatka i interaktywny spotlight
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_dark;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectUv = vec2(uv.x * aspect, uv.y);
        vec2 aspectMouse = vec2(u_mouse.x * aspect, 1.0 - u_mouse.y);

        // Odległość od kursora dla efektu spotlight
        float dist = distance(aspectUv, aspectMouse);
        float spotlight = smoothstep(0.65, 0.0, dist);

        // Subtelna geometryczna siatka (grid)
        vec2 gridUv = uv * vec2(28.0 * aspect, 28.0);
        vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
        float line = min(grid.x, grid.y);
        float gridAlpha = 1.0 - min(line, 1.0);
        gridAlpha *= 0.035;

        // Kolory bazowe zgodne z globals.css
        // Jasny: kremowo-beżowy
        vec3 lightBg = vec3(0.98, 0.97, 0.96);
        vec3 lightWarmAura = vec3(0.95, 0.92, 0.88);
        vec3 lightSpot = vec3(0.86, 0.76, 0.64);

        // Ciemny: głęboki grafitowo-bursztynowy
        vec3 darkBg = vec3(0.067, 0.063, 0.059);
        vec3 darkWarmAura = vec3(0.12, 0.10, 0.09);
        vec3 darkSpot = vec3(0.38, 0.31, 0.23);

        vec3 bg = mix(lightBg, darkBg, u_dark);
        vec3 aura = mix(lightWarmAura, darkWarmAura, u_dark);
        vec3 spotColor = mix(lightSpot, darkSpot, u_dark);

        // Falowanie gradientu
        float wave = sin(uv.x * 2.5 + u_time * 0.4) * cos(uv.y * 2.5 + u_time * 0.3) * 0.5 + 0.5;
        vec3 finalColor = mix(bg, aura, wave * 0.5);

        // Nałożenie spotlightu
        finalColor += spotColor * (spotlight * (u_dark > 0.5 ? 0.28 : 0.16));

        // Nałożenie siatki
        vec3 gridColor = u_dark > 0.5 ? vec3(0.85, 0.80, 0.75) : vec3(0.45, 0.40, 0.35);
        finalColor = mix(finalColor, gridColor, gridAlpha * (0.3 + spotlight * 0.7));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const darkLocation = gl.getUniformLocation(program, "u_dark");

    let animationFrameId: number;
    const startTime = performance.now();

    const handleResize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const currentTime = (performance.now() - startTime) * 0.001;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform1f(darkLocation, theme === "dark" ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
