import React from 'react';
import { Composition, AbsoluteFill, Sequence, Series, interpolate, useCurrentFrame } from 'remotion';
import FolderTree from './components/FolderTree';
import CodeSnippet from './components/CodeSnippet';
import DocChip from './components/DocChip';
import data from './data/folderMap.json';

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
  const opacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <h1 style={{ color: 'white', fontSize: '5rem', fontFamily: 'Outfit, sans-serif' }}>
        Unity <span style={{ color: '#3498db' }}>Exploded View</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '2rem', marginTop: 20 }}>
        Project Architecture & Overview
      </p>
    </AbsoluteFill>
  );
};

const MainVideo = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Series>
        <Series.Sequence durationInFrames={90}>
          <TitleScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={150}>
          <AbsoluteFill style={{ padding: 60 }}>
            <FolderTree data={data} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <CodeSnippet
              title="Runtime Component"
              code="public class ExplodedView : MonoBehaviour"
            />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <CodeSnippet
              title="Editor Tooling"
              code="[CustomEditor(typeof(ExplodedView))]\npublic class ExplodedViewEditor : Editor"
            />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <AbsoluteFill style={{ padding: 100, justifyContent: 'center' }}>
            <DocChip icon="📖" title="User Manual" text="Detailed guide for configuring your 3D models." />
            <DocChip icon="🛠️" title="package.json" text="Standard Unity UPM manifest for easy installation." />
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const Video = () => {
  const totalDuration = 90 + 150 + 120 + 120 + 120; // 600 frames = 20 seconds
  return (
    <>
      <Composition
        id="ExplodedViewExplainer"
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
