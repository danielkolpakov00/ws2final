import React from "react";
import ResultList from "../components/ResultList";

const SavedCollectionPage = ({ savedTracks, onSaveTrack }) => {
  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflow: 'auto'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontFamily: 'Tahoma, sans-serif',
        marginBottom: '20px',
        color: '#003399',
        textShadow: '1px 1px 1px rgba(255,255,255,0.7)'
      }}>
        Saved Tracks
      </h1>
      
      {savedTracks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          padding: '10px'
        }}>
          {savedTracks.map((track, index) => (
            <div 
              key={`${track.name}-${index}`} 
              style={{
                background: 'linear-gradient(to bottom, #FFFFFF, #F0F0F0)',
                border: '2px solid #FFFFFF',
                borderBottom: '2px solid #A9A9A9',
                borderRight: '2px solid #A9A9A9',
                borderRadius: '3px',
                padding: '15px',
                boxShadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #808080',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <h3 style={{
                fontSize: '16px',
                fontFamily: 'Tahoma, sans-serif',
                fontWeight: 'bold',
                color: '#000080'
              }}>
                {typeof track.name === 'string' ? track.name : ''}
              </h3>
              
              <p style={{
                fontSize: '14px',
                fontFamily: 'Tahoma, sans-serif',
                color: '#444'
              }}>
                {typeof track.artist === 'string' ? track.artist : 
                 (track.artist && track.artist.name) || ''}
              </p>
              
              <a 
                href={track.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(to bottom, #2584ff 0%, #2584ff 5%, #1159d5 8%, #1159d5 95%, #0b47a8 100%)',
                  color: 'white',
                  padding: '4px 8px',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  fontSize: '12px',
                  fontFamily: 'Tahoma, sans-serif',
                  textAlign: 'center',
                  border: '1px solid #0842a0',
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2)',
                  textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
                  marginTop: 'auto'
                }}
              >
                View on Last.fm
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(to bottom, #FFFFFF, #F0F0F0)',
          border: '2px solid #FFFFFF',
          borderBottom: '2px solid #A9A9A9',
          borderRight: '2px solid #A9A9A9',
          borderRadius: '3px',
          fontFamily: 'Tahoma, sans-serif',
          color: '#666',
          fontSize: '14px'
        }}>
          No saved tracks found.
        </div>
      )}
    </div>
  );
};

export default SavedCollectionPage;
