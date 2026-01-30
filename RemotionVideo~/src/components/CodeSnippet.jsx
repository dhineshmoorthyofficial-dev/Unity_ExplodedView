import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export default function CodeSnippet({ title, code, language = 'csharp' }) {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 15], [0, 1]);
    const scale = interpolate(frame, [0, 15], [0.95, 0.975]);

    return (
        <div style={{
            opacity,
            transform: `scale(${scale})`,
            background: '#1e1e1e',
            padding: 30,
            borderRadius: 15,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid #333',
            color: '#d4d4d4',
            fontFamily: 'Consolas, monospace',
            width: '80%',
            margin: '0 auto'
        }}>
            <div style={{ color: '#3498db', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: 20 }}>{title}</div>
            <pre style={{ margin: 0, fontSize: '1.1rem', lineScale: 1.5 }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}
