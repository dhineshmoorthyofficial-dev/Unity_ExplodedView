import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

const FileIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 10, color: '#3498db'}}>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
);

const FolderIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 10, color: '#f1c40f'}}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

const TreeItem = ({ item, depth = 0, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    const opacity = interpolate(
        frame - (index * 5),
        [0, 20],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    const xOffset = interpolate(
        frame - (index * 5),
        [0, 20],
        [-20, 0],
        { extrapolateRight: 'clamp' }
    );

    return (
        <div style={{ 
            opacity, 
            transform: `translateX(${xOffset}px)`,
            marginLeft: depth * 30,
            display: 'flex',
            alignItems: 'center',
            marginBottom: 12,
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.2rem',
            color: '#ecf0f1'
        }}>
            {item.type === 'dir' ? <FolderIcon /> : <FileIcon />}
            <span style={{ fontWeight: item.type === 'dir' ? 'bold' : 'normal' }}>
                {item.name}
            </span>
            {item.description && (
                <span style={{ opacity: 0.6, fontSize: '0.9rem', marginLeft: 15, fontStyle: 'italic' }}>
                    — {item.description}
                </span>
            )}
        </div>
    );
};

const RenderTree = ({ items, depth = 0, offset = 0 }) => {
    let currentOffset = offset;
    return (
        <>
            {items.map((item, i) => {
                const myIndex = currentOffset++;
                return (
                    <React.Fragment key={item.name}>
                        <TreeItem item={item} depth={depth} index={myIndex} />
                        {item.children && (
                            <RenderTree items={item.children} depth={depth + 1} offset={currentOffset} />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default function FolderTree({ data }) {
    return (
        <div style={{ padding: 40, background: 'rgba(0,0,0,0.4)', borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h1 style={{ color: '#3498db', marginBottom: 40, fontFamily: 'Outfit, sans-serif' }}>Project Structure</h1>
            <RenderTree items={[data.root]} />
        </div>
    );
}
