import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// Initialize Socket.IO client
const socket = io('http://localhost:3000');

export default function Call() {
  const [roomId, setRoomId] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [status, setStatus] = useState('Enter a Room ID to start or join a call');
  const [isCaller, setIsCaller] = useState(false); // Track if this peer is the caller
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // Initialize WebRTC peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
        console.log('ICE candidate sent:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch((e) => console.error('Remote video play error:', e));
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setStatus('Connected to peer!');
      }
    };

    pc.onsignalingstatechange = () => {
      console.log('Signaling state:', pc.signalingState);
    };

    return pc;
  };

  // Start the video call
  const startCall = async () => {
    if (!roomId) {
      alert('Please enter a room ID');
      return;
    }

    peerConnectionRef.current = createPeerConnection();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Local stream obtained:', stream);
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
        console.log('Track added to peer connection:', track);
      });
      setIsInCall(true);
      socket.emit('join', roomId);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera/microphone. Check permissions.');
    }
  };

  // Assign local stream to video element
  useEffect(() => {
    if (isInCall && localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch((e) => console.error('Local video play error:', e));
      console.log('Local stream assigned to video element');
    }
  }, [isInCall]);

  // Handle signaling events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socket.on('created', (id) => {
      console.log(`Room ${id} created, waiting for peer`);
      setStatus(`Room ${id} created. Share this Room ID (${id}) with another user to join!`);
      setIsCaller(true); // This peer is the caller
    });

    socket.on('joined', (id) => {
      console.log(`Joined room ${id}`);
      setStatus(`Joined room ${id}. Connecting...`);
      setIsCaller(false); // This peer is the callee
    });

    socket.on('ready', async () => {
      console.log('Peers ready');
      if (isCaller && peerConnectionRef.current && localStreamRef.current) {
        console.log('Starting signaling as caller');
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('offer', { roomId, offer });
          console.log('Offer created and sent:', offer);
        } catch (error) {
          console.error('Error creating/sending offer:', error);
        }
      } else if (isCaller) {
        console.error('Caller setup incomplete: peer connection or stream missing');
      } else {
        console.log('Waiting for offer as callee');
      }
    });

    socket.on('offer', async (offer) => {
      console.log('Offer received:', offer);
      if (!isCaller && peerConnectionRef.current && localStreamRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          console.log('Remote description set with offer');
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', { roomId, answer });
          console.log('Answer created and sent:', answer);
        } catch (error) {
          console.error('Error handling offer or creating answer:', error);
        }
      } else {
        console.error('Offer received but not in callee role or setup incomplete');
      }
    });

    socket.on('answer', async (answer) => {
      console.log('Answer received:', answer);
      if (isCaller && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log('Remote description set with answer');
        } catch (error) {
          console.error('Error setting answer:', error);
        }
      } else {
        console.error('Answer received but not in caller role');
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
          console.log('ICE candidate added:', candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    socket.on('bye', () => {
      console.log('Peer disconnected');
      setStatus('Peer disconnected');
      endCall();
    });

    socket.on('full', (id) => {
      console.log(`Room ${id} is full`);
      alert(`Room ${id} is full`);
      setIsInCall(false);
      setStatus(`Room ${id} is full. Try a different Room ID.`);
    });

    return () => {
      socket.off('connect');
      socket.off('created');
      socket.off('joined');
      socket.off('ready');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('bye');
      socket.off('full');
    };
  }, [roomId, isCaller]);

  // End the call
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log('Peer connection closed');
    }
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
      console.log('Local stream stopped');
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      console.log('Remote stream cleared');
    }
    socket.disconnect();
    setIsInCall(false);
    setIsCaller(false);
    setStatus('Call ended. Enter a Room ID to start or join another call.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>WebRTC Video Call</h1>
      <p style={{ marginBottom: '10px' }}>{status}</p>

      {!isInCall ? (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button
            onClick={startCall}
            style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none' }}
          >
            Join Call
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={endCall}
            style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none' }}
          >
            End Call
          </button>
        </div>
      )}

      {isInCall && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Local Video (You)</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                maxWidth: '400px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                background: '#000',
              }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Remote Video (Peer)</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                maxWidth: '400px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                background: '#000',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}