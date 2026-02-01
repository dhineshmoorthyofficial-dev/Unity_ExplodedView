import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export default function UnityScreenshot({ 
  imageSrc, 
  title,
  subtitle,
  zoomEffect = false,
  panEffect = null,
  fadeIn = true,
  scale = 1,
  annotations = []
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Fade in animation
  const opacity = fadeIn 
    ? interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
    : 1;
  
  // Scale animation for zoom effect
  const scaleAnimation = zoomEffect
    ? interpolate(frame, [0, 60], [scale, scale * 1.1], { extrapolateRight: 'clamp' })
    : scale;
  
  // Pan effect (x, y coordinates)
  const translateX = panEffect?.x 
    ? interpolate(frame, [0, 60], [0, panEffect.x], { extrapolateRight: 'clamp' })
    : 0;
  
  const translateY = panEffect?.y 
    ? interpolate(frame, [0, 60], [0, panEffect.y], { extrapolateRight: 'clamp' })
    : 0;
  
  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e1e1e, #2d2d2d)',
      opacity
    }}>
      {/* Title and Subtitle */}
      <div style={{ 
        position: 'absolute', 
        top: 60, 
        left: 60, 
        zIndex: 10,
        color: 'white',
        fontFamily: 'Outfit, sans-serif'
      }}>
        {title && (
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            margin: 0,
            color: '#3498db',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ 
            fontSize: '1.5rem', 
            margin: '10px 0 0 0',
            opacity: 0.9,
            color: '#ecf0f1'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Screenshot Container */}
      <div style={{
        position: 'relative',
        width: '90%',
        height: '80%',
        maxWidth: width * 0.9,
        maxHeight: height * 0.8,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        border: '2px solid rgba(52, 152, 219, 0.3)',
        transform: `scale(${scaleAnimation}) translate(${translateX}px, ${translateY}px)`,
        transformOrigin: 'center'
      }}>
        <img
          src={imageSrc}
          alt={title || "Unity Screenshot"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: '#000'
          }}
        />
        
        {/* Annotations Overlay */}
        {annotations.map((annotation, index) => (
          <Annotation
            key={index}
            {...annotation}
            delay={index * 15}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}

// Annotation Component for callouts
function Annotation({ x, y, text, type = 'callout', delay = 0 }) {
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
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex: 20
      }}
    >
      {type === 'callout' && (
        <div style={{
          background: 'rgba(52, 152, 219, 0.9)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 25,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          {text}
        </div>
      )}
      
      {type === 'arrow' && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 60,
            height: 3,
            background: '#3498db',
            marginRight: -10
          }} />
          <div style={{
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '16px solid #3498db'
          }} />
          <div style={{
            background: '#3498db',
            color: 'white',
            padding: '8px 15px',
            borderRadius: 15,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            marginLeft: 5
          }}>
            {text}
          </div>
        </div>
      )}
    </div>
  );
}