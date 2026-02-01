import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  title = "Before & After",
  subtitle = "See the dramatic transformation",
  sliderPosition = 0.5,
  autoSlide = true,
  labels = { before: "Before", after: "After" }
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Auto slide animation
  const currentSliderPosition = autoSlide
    ? interpolate(frame, [0, 90, 180], [0, 0.5, 1], { extrapolateRight: 'clamp' })
    : sliderPosition;
  
  // Fade in animation
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      opacity
    }}>
      {/* Title */}
      <div style={{ 
        position: 'absolute', 
        top: 60, 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        opacity: titleOpacity
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          color: '#3498db',
          fontFamily: 'Outfit, sans-serif',
          textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ 
            fontSize: '1.8rem', 
            margin: '15px 0 0 0',
            opacity: 0.9,
            color: '#ecf0f1',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Before/After Container */}
      <div style={{
        position: 'relative',
        width: '85%',
        height: '75%',
        maxWidth: width * 0.85,
        maxHeight: height * 0.75,
        borderRadius: 25,
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
        border: '3px solid rgba(52, 152, 219, 0.4)'
      }}>
        {/* Before Image (Right Side) */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: `${(1 - currentSliderPosition) * 100}%`,
          height: '100%',
          overflow: 'hidden'
        }}>
          <img
            src={afterImage}
            alt="After"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          {/* After Label */}
          <div style={{
            position: 'absolute',
            top: 30,
            right: 30,
            background: 'rgba(46, 204, 113, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 20,
            fontSize: '1.4rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {labels.after}
          </div>
        </div>

        {/* Before Image (Left Side) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${currentSliderPosition * 100}%`,
          height: '100%',
          overflow: 'hidden'
        }}>
          <img
            src={beforeImage}
            alt="Before"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          {/* Before Label */}
          <div style={{
            position: 'absolute',
            top: 30,
            left: 30,
            background: 'rgba(231, 76, 60, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 20,
            fontSize: '1.4rem',
            fontWeight: 'bold',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {labels.before}
          </div>
        </div>

        {/* Slider Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: `${currentSliderPosition * 100}%`,
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, #3498db, #2980b9)',
          boxShadow: '0 0 20px rgba(52, 152, 219, 0.8)',
          zIndex: 5
        }} />

        {/* Slider Handle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${currentSliderPosition * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 6,
          border: '3px solid #3498db'
        }}>
          <div style={{
            width: '30px',
            height: '3px',
            background: '#3498db',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '-5px',
              top: '-4px',
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '8px solid #3498db'
            }} />
            <div style={{
              position: 'absolute',
              right: '-5px',
              top: '-4px',
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '8px solid #3498db'
            }} />
          </div>
        </div>
      </div>

      {/* Instructions */}
      {frame < 120 && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(frame, [90, 120], [1, 0]),
          color: 'white',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.3rem',
          textAlign: 'center'
        }}>
          <div style={{ opacity: 0.8 }}>Watch as the model explodes with Target Mode precision</div>
        </div>
      )}
    </AbsoluteFill>
  );
}