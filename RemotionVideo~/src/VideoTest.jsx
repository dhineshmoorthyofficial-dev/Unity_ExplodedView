import React from 'react';
import { Composition } from 'remotion';

// Test composition to verify imports work
const TestVideo = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '3rem'
    }}>
      Target Mode Video Test
    </div>
  );
};

export const Video = () => {
  return (
    <>
      <Composition
        id="TestTargetMode"
        component={TestVideo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};