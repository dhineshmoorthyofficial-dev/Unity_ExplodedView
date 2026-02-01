import React from 'react';
import { Composition, AbsoluteFill, Sequence, Series, interpolate, useCurrentFrame } from 'remotion';
import UnityScreenshot from './components/UnityScreenshot';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import InspectorScenePair from './components/InspectorScenePair';
import CodeSnippet from './components/CodeSnippet';
import DocChip from './components/DocChip';
import data from './data/folderMap.json';

// Import screenshots using relative paths
import inspectorView from './assets/unity-screenshots/target-mode/inspector-view.png';
import sceneViewBefore from './assets/unity-screenshots/target-mode/scene-view-before.png';
import sceneViewAfter from './assets/unity-screenshots/target-mode/scene-view-after.png';

const Background = () => {
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      zIndex: -1
    }} />
  );
};

const TitleScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 50, 60], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <h1 style={{ color: 'white', fontSize: '5rem', fontFamily: 'Outfit, sans-serif' }}>
        Unity <span style={{ color: '#3498db' }}>Exploded View</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '2rem', marginTop: 20 }}>
        Target Mode Demo - Precision Control
      </p>
    </AbsoluteFill>
  );
};

const TargetModeIntro = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.9, 1]);

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      opacity,
      transform: `scale(${scale})`
    }}>
      <div style={{ 
        textAlign: 'center', 
        color: 'white', 
        fontFamily: 'Outfit, sans-serif',
        maxWidth: '80%'
      }}>
        <h2 style={{ 
          fontSize: '3.5rem', 
          color: '#e74c3c',
          margin: '0 0 30px 0',
          textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
        }}>
          🎯 Target Mode
        </h2>
        <p style={{ 
          fontSize: '1.8rem', 
          lineHeight: 1.5,
          opacity: 0.9,
          margin: '0 0 40px 0'
        }}>
          Place invisible target objects for precise control over part movement.<br/>
          Perfect for technical diagrams and assembly instructions.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '50px'
        }}>
          <div style={{
            background: 'rgba(52, 152, 219, 0.2)',
            border: '2px solid #3498db',
            borderRadius: 20,
            padding: '30px 40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎮</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Manual Placement</div>
          </div>
          <div style={{
            background: 'rgba(46, 204, 113, 0.2)',
            border: '2px solid #2ecc71',
            borderRadius: 20,
            padding: '30px 40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📐</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Precise Control</div>
          </div>
          <div style={{
            background: 'rgba(241, 196, 15, 0.2)',
            border: '2px solid #f1c40f',
            borderRadius: 20,
            padding: '30px 40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Tech Diagrams</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MainVideo = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Series>
        {/* Title Scene - 60 frames */}
        <Series.Sequence durationInFrames={60}>
          <TitleScene />
        </Series.Sequence>

        {/* Target Mode Introduction - 90 frames */}
        <Series.Sequence durationInFrames={90}>
          <TargetModeIntro />
        </Series.Sequence>

        {/* Inspector Configuration - 120 frames */}
        <Series.Sequence durationInFrames={120}>
          <InspectorScenePair
            inspectorImage={inspectorView}
            sceneImage={sceneViewAfter}
            title="Configure Target Mode in Inspector"
            annotations={[
              { 
                target: 'inspector', 
                x: 50, 
                y: 35, 
                text: "Target Mode Selected", 
                type: 'highlight',
                color: '#e74c3c'
              },
              { 
                target: 'inspector', 
                x: 50, 
                y: 60, 
                text: "Explosion Strength", 
                type: 'arrow',
                color: '#3498db'
              },
              { 
                target: 'scene', 
                x: 70, 
                y: 40, 
                text: "Parts Move to Targets", 
                type: 'highlight',
                color: '#2ecc71'
              }
            ]}
          />
        </Series.Sequence>

        {/* Before/After Comparison - 180 frames */}
        <Series.Sequence durationInFrames={180}>
          <BeforeAfterSlider
            beforeImage={sceneViewBefore}
            afterImage={sceneViewAfter}
            title="Target Mode Transformation"
            subtitle="Watch as parts move to precise target positions"
            labels={{ before: "🚗 Assembled State", after: "🎯 Target Mode Exploded" }}
          />
        </Series.Sequence>

        {/* After State Showcase - 120 frames */}
        <Series.Sequence durationInFrames={120}>
          <UnityScreenshot
            imageSrc={sceneViewAfter}
            title="Target Mode Exploded View"
            subtitle="Each part moves to its designated target position"
            zoomEffect={true}
            annotations={[
              { x: 25, y: 30, text: "Precise Positioning", type: 'callout', delay: 30 },
              { x: 75, y: 50, text: "Clean Separation", type: 'callout', delay: 45 },
              { x: 50, y: 70, text: "Technical Diagram Ready", type: 'callout', delay: 60 }
            ]}
          />
        </Series.Sequence>

        {/* Benefits & Features - 120 frames */}
        <Series.Sequence durationInFrames={120}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              padding: '0 100px'
            }}>
              <DocChip 
                icon="🎯" 
                title="Perfect for Technical Documentation" 
                text="Create clear assembly instructions with precise part positioning." 
              />
              <DocChip 
                icon="⚙️" 
                title="Full Control" 
                text="Manually place target objects for exact part movement control." 
              />
              <DocChip 
                icon="📐" 
                title="Professional Results" 
                text="Generate publication-quality exploded views for manuals and guides." 
              />
            </div>
          </AbsoluteFill>
        </Series.Sequence>

        {/* Call to Action - 90 frames */}
        <Series.Sequence durationInFrames={90}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
              textAlign: 'center', 
              color: 'white', 
              fontFamily: 'Outfit, sans-serif'
            }}>
              <h2 style={{ 
                fontSize: '4rem', 
                color: '#3498db',
                margin: '0 0 40px 0'
              }}>
                Try Target Mode Today
              </h2>
              <div style={{
                background: 'rgba(46, 204, 113, 0.9)',
                border: '3px solid #27ae60',
                borderRadius: 15,
                padding: '25px 40px',
                display: 'inline-block',
                margin: '20px 0',
                boxShadow: '0 15px 40px rgba(46, 204, 113, 0.4)'
              }}>
                <p style={{ 
                  fontSize: '2.2rem', 
                  opacity: 1,
                  margin: '0 0 15px 0',
                  fontWeight: 'bold'
                }}>
                  📦 Download Unity Package
                </p>
                <p style={{ 
                  fontSize: '1.8rem', 
                  opacity: 0.95,
                  margin: '0 0 20px 0',
                  fontFamily: 'monospace'
                }}>
                  github.com/DhineshMoorthy-gamedev/Unity_ExplodedView
                </p>
                <div style={{
                  background: 'white',
                  color: '#27ae60',
                  padding: '15px 30px',
                  borderRadius: 10,
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  ⬇️ Free Download
                </div>
              </div>
              <p style={{ 
                fontSize: '1.5rem', 
                opacity: 0.8,
                margin: '30px 0 0 0'
              }}>
                Start creating professional exploded views in minutes
              </p>
            </div>
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const Video = () => {
  const totalDuration = 60 + 90 + 120 + 180 + 120 + 120 + 90; // 780 frames = 26 seconds
  return (
    <>
      <Composition
        id="TargetModeExplainer"
        component={MainVideo}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

export default Video;
