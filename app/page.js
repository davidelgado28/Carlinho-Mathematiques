'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as math from 'mathjs';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function CarlinhoMathematiques() {
  const [activeTab, setActiveTab] = useState('functions');

  const tabs = [
    { id: 'functions', label: 'Funções' },
    { id: 'geometry', label: 'Geometria 2D/3D' },
    { id: 'hypercube', label: 'Simulador 4D' },
    { id: 'calculus', label: 'Cálculo' },
    { id: 'stats', label: 'Probabilidade' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '20px',
        backgroundColor: '#0a0a0f',
        borderBottom: '2px solid #00f0ff',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#ffffff',
          textShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff',
          fontSize: '2.5rem',
          letterSpacing: '2px'
        }}>
          CARLINHO MATHÉMATIQUES
        </h1>
      </header>

      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '20px',
        backgroundColor: '#111118'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab.id ? '#00f0ff' : '#1a1a24',
              color: activeTab === tab.id ? '#000000' : '#00f0ff',
              border: '1px solid #00f0ff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 0 10px #00f0ff' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#0d0d14',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 0 20px rgba(176, 38, 255, 0.1)',
          border: '1px solid #2a2a35'
        }}>
          {activeTab === 'functions' && <FunctionsModule />}
          {activeTab === 'geometry' && <GeometryModule />}
          {activeTab === 'hypercube' && <HypercubeModule />}
          {activeTab === 'calculus' && <CalculusModule />}
          {activeTab === 'stats' && <StatsModule />}
        </div>
      </main>
    </div>
  );
}

function FunctionsModule() {
  const [coeffs, setCoeffs] = useState({ a: 0, b: 0, c: 0, d: 0, e: 1, f: 0 });
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = [];
    for (let x = -10; x <= 10; x += 0.5) {
      const y = coeffs.a * Math.pow(x, 5) +
                coeffs.b * Math.pow(x, 4) +
                coeffs.c * Math.pow(x, 3) +
                coeffs.d * Math.pow(x, 2) +
                coeffs.e * x +
                coeffs.f;
      newData.push({ x, y });
    }
    setData(newData);
  }, [coeffs]);

  const handleChange = (key, value) => {
    setCoeffs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <div>
      <h2 style={{ color: '#39ff14', textShadow: '0 0 8px #39ff14', marginBottom: '20px' }}>Plotagem Polinomial (Até 5º Grau)</h2>
      <p style={{ color: '#aaa', marginBottom: '15px' }}>f(x) = ax⁵ + bx⁴ + cx³ + dx² + ex + f</p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Object.keys(coeffs).map(k => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#00f0ff', marginBottom: '5px' }}>{k.toUpperCase()}</label>
            <input
              type="number"
              value={coeffs[k]}
              onChange={(e) => handleChange(k, e.target.value)}
              style={{ padding: '8px', width: '80px', backgroundColor: '#1a1a24', color: '#fff', border: '1px solid #39ff14', borderRadius: '4px' }}
            />
          </div>
        ))}
      </div>

      <div style={{ width: '100%', height: '400px', backgroundColor: '#050507', padding: '10px', borderRadius: '8px' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="x" stroke="#00f0ff" />
            <YAxis stroke="#00f0ff" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #39ff14' }} />
            <Line type="monotone" dataKey="y" stroke="#39ff14" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GeometryModule() {
  const mountRef = useRef(null);
  const [shape, setShape] = useState('cube');

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050507');

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    let geometry;
    switch (shape) {
      case 'polygon': geometry = new THREE.CylinderGeometry(2, 2, 0.1, 6); break;
      case 'circle': geometry = new THREE.CircleGeometry(2, 32); break;
      case 'sphere': geometry = new THREE.SphereGeometry(2, 32, 32); break;
      case 'cube': geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); break;
      case 'pyramid': geometry = new THREE.ConeGeometry(2, 3, 4); break;
      default: geometry = new THREE.BoxGeometry(2, 2, 2);
    }

    const material = new THREE.MeshPhongMaterial({ color: 0xb026ff, wireframe: false, shininess: 100 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x00f0ff });
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, wireframeMaterial);
    mesh.add(line);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [shape]);

  return (
    <div>
      <h2 style={{ color: '#b026ff', textShadow: '0 0 8px #b026ff', marginBottom: '20px' }}>Laboratório Geométrico</h2>
      <select 
        value={shape} 
        onChange={(e) => setShape(e.target.value)}
        style={{ padding: '10px', backgroundColor: '#1a1a24', color: '#fff', border: '1px solid #b026ff', borderRadius: '4px', marginBottom: '20px', outline: 'none' }}
      >
        <option value="polygon">Hexágono (Polígono 2D)</option>
        <option value="circle">Círculo (2D)</option>
        <option value="sphere">Esfera (3D)</option>
        <option value="cube">Cubo (3D)</option>
        <option value="pyramid">Pirâmide (3D)</option>
      </select>
      <div ref={mountRef} style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }} />
    </div>
  );
}

function HypercubeModule() {
  const mountRef = useRef(null);
  const [rotationXW, setRotationXW] = useState(0);
  const [rotationYW, setRotationYW] = useState(0);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050507');

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    const vertices4D = [];
    for (let i = 0; i < 16; i += 1) {
      vertices4D.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1
      ]);
    }

    const edges = [];
    for (let i = 0; i < 16; i += 1) {
      for (let j = i + 1; j < 16; j += 1) {
        let diff = 0;
        for (let k = 0; k < 4; k += 1) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff += 1;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    const material = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    const wDistance = 2.5;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const cosXW = Math.cos(rotationXW);
      const sinXW = Math.sin(rotationXW);
      const cosYW = Math.cos(rotationYW);
      const sinYW = Math.sin(rotationYW);

      const projected = vertices4D.map(v => {
        let x = v[0], y = v[1], z = v[2], w = v[3];

        let nx = x * cosXW - w * sinXW;
        let nw = x * sinXW + w * cosXW;
        x = nx;
        w = nw;

        let ny = y * cosYW - w * sinYW;
        let nw2 = y * sinYW + w * cosYW;
        y = ny;
        w = nw2;

        const f = 1 / (wDistance - w);
        return [x * f, y * f, z * f];
      });

      const posArray = lines.geometry.attributes.position.array;
      let idx = 0;
      for (let i = 0; i < edges.length; i += 1) {
        const v1 = projected[edges[i][0]];
        const v2 = projected[edges[i][1]];
        posArray[idx] = v1[0]; posArray[idx+1] = v1[1]; posArray[idx+2] = v1[2];
        posArray[idx+3] = v2[0]; posArray[idx+4] = v2[1]; posArray[idx+5] = v2[2];
        idx += 6;
      }
      
      lines.geometry.attributes.position.needsUpdate = true;
      lines.rotation.x += 0.005;
      lines.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [rotationXW, rotationYW]);

  return (
    <div>
      <h2 style={{ color: '#00f0ff', textShadow: '0 0 8px #00f0ff', marginBottom: '20px' }}>Projeção Hiperespacial 4D (Tesserato)</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#fff', marginBottom: '10px' }}>Rotação Eixo XW</label>
          <input 
            type="range" min="0" max="6.28" step="0.01" value={rotationXW} 
            onChange={(e) => setRotationXW(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#00f0ff' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#fff', marginBottom: '10px' }}>Rotação Eixo YW</label>
          <input 
            type="range" min="0" max="6.28" step="0.01" value={rotationYW} 
            onChange={(e) => setRotationYW(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#00f0ff' }}
          />
        </div>
      </div>

      <div ref={mountRef} style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }} />
    </div>
  );
}

function CalculusModule() {
  const [expression, setExpression] = useState('x^2');
  const [derivative, setDerivative] = useState('');
  const [limits, setLimits] = useState({ a: 0, b: 1 });
  const [integral, setIntegral] = useState('');

  const calculateAll = () => {
    try {
      const der = math.derivative(expression, 'x').toString();
      setDerivative(der);

      const node = math.parse(expression);
      const code = node.compile();
      const f = (x) => code.evaluate({ x });
      
      const n = 1000;
      const h = (limits.b - limits.a) / n;
      let sum = f(limits.a) + f(limits.b);
      
      for (let i = 1; i < n; i += 1) {
        const x = limits.a + i * h;
        sum += f(x) * (i % 2 === 0 ? 2 : 4);
      }
      
      const result = (sum * h / 3).toFixed(4);
      setIntegral(result);
    } catch (err) {
      setDerivative('Erro na expressão');
      setIntegral('Erro na expressão');
    }
  };

  useEffect(() => {
    calculateAll();
  }, [expression, limits]);

  return (
    <div>
      <h2 style={{ color: '#ff2a2a', textShadow: '0 0 8px #ff2a2a', marginBottom: '20px' }}>Motor de Cálculo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: '#fff', marginBottom: '10px' }}>Função f(x):</label>
        <input 
          type="text" 
          value={expression} 
          onChange={(e) => setExpression(e.target.value)}
          style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a24', color: '#fff', border: '1px solid #ff2a2a', borderRadius: '4px', fontSize: '1.2rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <div>
          <label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Limite Inferior (a):</label>
          <input type="number" value={limits.a} onChange={(e) => setLimits({ ...limits, a: parseFloat(e.target.value) || 0 })} style={{ padding: '8px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: '#aaa', marginBottom: '5px' }}>Limite Superior (b):</label>
          <input type="number" value={limits.b} onChange={(e) => setLimits({ ...limits, b: parseFloat(e.target.value) || 0 })} style={{ padding: '8px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a24', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ff2a2a' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px' }}>Resultados:</h3>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}><span style={{ color: '#ff2a2a' }}>Derivada f'(x):</span> {derivative}</p>
        <p style={{ fontSize: '1.2rem' }}><span style={{ color: '#ff2a2a' }}>Integral Definida:</span> {integral}</p>
      </div>
    </div>
  );
}

function StatsModule() {
  const [rolls, setRolls] = useState(100);
  const [data, setData] = useState([]);

  const simulateDice = () => {
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < rolls; i += 1) {
      const face = Math.floor(Math.random() * 6);
      counts[face] += 1;
    }
    
    const newData = counts.map((count, index) => ({
      face: `Face ${index + 1}`,
      frequencia: count
    }));
    
    setData(newData);
  };

  useEffect(() => {
    simulateDice();
  }, []);

  return (
    <div>
      <h2 style={{ color: '#ffff00', textShadow: '0 0 8px #ffff00', marginBottom: '20px' }}>Simulador de Lançamento de Dados</h2>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '10px' }}>Número de Lançamentos:</label>
          <input 
            type="number" 
            value={rolls} 
            onChange={(e) => setRolls(parseInt(e.target.value) || 1)}
            style={{ padding: '10px', backgroundColor: '#1a1a24', color: '#fff', border: '1px solid #ffff00', borderRadius: '4px', width: '150px' }}
          />
        </div>
        <button 
          onClick={simulateDice}
          style={{ padding: '10px 20px', backgroundColor: '#ffff00', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Lançar Dados
        </button>
      </div>

      <div style={{ width: '100%', height: '400px', backgroundColor: '#050507', padding: '20px', borderRadius: '8px' }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="face" stroke="#ffff00" />
            <YAxis stroke="#ffff00" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffff00' }} />
            <Bar dataKey="frequencia" fill="#ffff00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
