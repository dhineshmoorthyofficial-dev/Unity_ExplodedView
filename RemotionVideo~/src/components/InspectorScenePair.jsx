import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export default function InspectorScenePair({ 
  inspectorImage, 
  sceneImage, 
  title,
  annotations = [],
  showConnections = true
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Fade in animation
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  // Slide in animation
  const inspectorX = interpolate(frame, [0, 40], [-100, 0], { extrapolateRight: 'clamp' });
  const sceneX = interpolate(frame, [0, 40], [100, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      opacity
    }}>
      {/* Title */}
      <div style={{ 
        position: 'absolute', 
        top: 50, 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        opacity: titleOpacity
      }}>
        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: 'bold', 
          margin: 0,
          color: '#3498db',
          fontFamily: 'Outfit, sans-serif',
          textShadow: '2px 2px 6px rgba(0,0,0,0.6)'
        }}>
          {title || "Inspector Configuration & Scene Result"}
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        width: '95%',
        height: '85%',
        maxWidth: width * 0.95,
        maxHeight: height * 0.85
      }}>
        {/* Inspector View */}
        <div style={{
          position: 'relative',
          flex: 1,
          height: '90%',
          transform: `translateX(${inspectorX}px)`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          border: '2px solid rgba(52, 152, 219, 0.3)',
          background: '#1e1e1e'
        }}>
          {/* Inspector Label */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(52, 152, 219, 0.9)',
            color: 'white',
            padding: '15px 20px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            zIndex: 5,
            textAlign: 'center',
            borderBottom: '2px solid rgba(255,255,255,0.2)'
          }}>
            🔧 Inspector View
          </div>

          {/* Inspector Image */}
          <div style={{ paddingTop: '60px', height: '100%' }}>
            <img
              src={inspectorImage}
              alt="Inspector Configuration"
              style={{
                width: '100%',
                height: 'calc(100% - 60px)',
                objectFit: 'contain',
                backgroundColor: '#2d2d30'
              }}
            />
          </div>

          {/* Inspector Annotations */}
          {annotations.filter(a => a.target === 'inspector').map((annotation, index) => (
            <Annotation key={`inspector-${index}`} {...annotation} />
          ))}
        </div>

        {/* Scene View */}
        <div style={{
          position: 'relative',
          flex: 1,
          height: '90%',
          transform: `translateX(${sceneX}px)`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          border: '2px solid rgba(46, 204, 113, 0.3)',
          background: '#1a1a1a'
        }}>
          {/* Scene Label */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(46, 204, 113, 0.9)',
            color: 'white',
            padding: '15px 20px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            zIndex: 5,
            textAlign: 'center',
            borderBottom: '2px solid rgba(255,255,255,0.2)'
          }}>
            🎮 Scene View
          </div>

          {/* Scene Image */}
          <div style={{ paddingTop: '60px', height: '100%' }}>
            <img
              src={sceneImage}
              alt="Scene Result"
              style={{
                width: '100%',
                height: 'calc(100% - 60px)',
                objectFit: 'contain',
                backgroundColor: '#0a0a0a'
              }}
            />
          </div>

          {/* Scene Annotations */}
          {annotations.filter(a => a.target === 'scene').map((annotation, index) => (
            <Annotation key={`scene-${index}`} {...annotation} />
          ))}
        </div>
      </div>

      {/* Connection Lines (Optional) */}
      {showConnections && frame > 60 && (
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3
        }}>
          {connections.map((connection, index) => (
            <ConnectionLine
              key={index}
              {...connection}
              delay={index * 20}
              width={width}
              height={height}
            />
          ))}
        </svg>
      )}

      {/* Bottom Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1.2rem',
        textAlign: 'center',
        opacity: frame > 90 ? interpolate(frame, [90, 120], [1, 0]) : 1
      }}>
        <div style={{ opacity: 0.8 }}>
          Configure in the Inspector → See results in the Scene
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Annotation Component
function Annotation({ x, y, text, type = 'highlight', delay = 0, color = '#3498db' }) {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame - delay,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  const scale = interpolate(
    frame - delay,
    [0, 20],
    [0.8, 1],
    { extrapolateRight: 'clamp' }
  );

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y + 10}%`, // Offset for the header
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex: 20
      }}
    >
      {type === 'highlight' && (
        <div style={{
          background: color,
          color: 'white',
          padding: '10px 18px',
          borderRadius: 20,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap'
        }}>
          {text}
        </div>
      )}
      
      {type === 'arrow' && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 50,
            height: 3,
            background: color,
            marginRight: -8
          }} />
          <div style={{
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '12px solid ' + color
          }} />
          <div style={{
            background: color,
            color: 'white',
            padding: '8px 15px',
            borderRadius: 15,
            fontSize: '1rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            marginLeft: 8
          }}>
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

// Connection Line Component
function ConnectionLine({ startX, startY, endX, endY, delay = 0, width, height }) {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame - delay,
    [0, 30],
    [0, 0.7],
    { extrapolateRight: 'clamp' }
  );
  
  const strokeDashoffset = interpolate(
    frame - delay,
    [0, 60],
    [100, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <g opacity={opacity}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3498db"
          />
        </marker>
      </defs>
      <path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke="#3498db"
        strokeWidth="3"
        fill="none"
        strokeDasharray="10, 5"
        strokeDashoffset={strokeDashoffset}
        markerEnd="url(#arrowhead)"
        opacity={0.8}
      />
    </g>
  );
}

// Default connection data
const connections = [
  {
    startX: 0.25,
    startY: 0.6,
    endX: 0.75,
    endY: 0.4,
    delay: 80
  }
];