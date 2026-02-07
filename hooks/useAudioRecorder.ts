import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (stream: MediaStream) => {
    try {
      chunksRef.current = [];
      console.log('🎙️ Starting recording with stream:', stream);
      console.log('Stream tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));

      // Validate stream
      if (!stream || !stream.active) {
        throw new Error('Media stream is not active');
      }

      // Try different MIME types with broader compatibility
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
        'audio/wav',
        ''
      ];

      let selectedMimeType = '';
      console.log('🔍 Testing MIME type support:');
      for (const mimeType of mimeTypes) {
        const isSupported = mimeType === '' || MediaRecorder.isTypeSupported(mimeType);
        console.log(`  ${mimeType || '(browser default)'}: ${isSupported ? '✅' : '❌'}`);
        if (isSupported) {
          selectedMimeType = mimeType;
          console.log(`✅ Selected MIME type: ${selectedMimeType || 'browser default'}`);
          break;
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
      console.log('📝 Creating MediaRecorder with options:', options);

      const mediaRecorder = new MediaRecorder(stream, options);
      console.log('✅ MediaRecorder created successfully');
      console.log('MediaRecorder state:', mediaRecorder.state);
      console.log('MediaRecorder MIME type:', mediaRecorder.mimeType);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('📦 Chunk received:', event.data.size, 'bytes, type:', event.data.type);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('⏹️ Recording stopped. Chunks:', chunksRef.current.length);
        if (chunksRef.current.length === 0) {
          console.warn('⚠️ No audio data was recorded');
          setAudioBlob(null);
          return;
        }
        const blob = new Blob(chunksRef.current, {
          type: selectedMimeType || 'audio/webm'
        });
        console.log('🎵 Final blob created:', {
          size: blob.size,
          type: blob.type,
          chunks: chunksRef.current.length
        });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event: any) => {
        console.error('❌ MediaRecorder error event:', event);
        console.error('Error details:', event.error);
        setIsRecording(false);
      };

      // Start recording with time slice for better chunk handling
      console.log('▶️ Starting MediaRecorder...');
      if (mediaRecorder.state !== 'inactive') {
        throw new Error(`MediaRecorder is in ${mediaRecorder.state} state, expected inactive`);
      }
      
      mediaRecorder.start(1000); // Request data every 1 second
      console.log('✅ MediaRecorder.start() called successfully');
      console.log('MediaRecorder state after start:', mediaRecorder.state);
      
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err: any) {
      console.error('❌ Failed to start recording:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to start recording: ';
      if (err.name === 'NotSupportedError') {
        errorMessage += 'Your browser does not support audio recording with the available formats. Please try using Chrome, Edge, or Firefox.';
      } else if (err.name === 'NotAllowedError') {
        errorMessage += 'Microphone access was denied. Please grant permission to use your microphone.';
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearAudio = useCallback(() => {
    console.log('Clearing audio');
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
  };
}
