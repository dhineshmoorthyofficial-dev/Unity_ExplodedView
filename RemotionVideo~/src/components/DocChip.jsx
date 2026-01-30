import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export default function DocChip({ title, text, icon }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 12 }
    });

    return (
        <div style={{
            transform: `scale(${scale})`,
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            padding: 25,
            borderRadius: 20,
            color: 'white',
            boxShadow: '0 15px 35px rgba(52, 152, 219, 0.3)',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 500,
            margin: '20px auto'
        }}>
            {icon && <div style={{ fontSize: '2.5rem', marginRight: 20 }}>{icon}</div>}
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 5 }}>{title}</div>
                <div style={{ opacity: 0.9 }}>{text}</div>
            </div>
        </div>
    );
}
