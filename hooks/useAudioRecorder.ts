import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (stream: MediaStream) => {
    try {
      chunksRef.current = [];
      console.log('Starting recording with stream:', stream);

      // Try different MIME types until one works
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        ''
      ];

      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (mimeType === '' || MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('✅ Selected MIME type:', selectedMimeType || 'browser default');
          break;
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
      console.log('Creating MediaRecorder with options:', options);

      const mediaRecorder = new MediaRecorder(stream, options);
      console.log('MediaRecorder created successfully');

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('📦 Chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = () => {
        console.log('⏹️ Recording stopped. Chunks:', chunksRef.current.length);
        const blob = new Blob(chunksRef.current, {
          type: selectedMimeType || 'audio/webm'
        });
        console.log('🎵 Final blob:', blob.size, 'bytes');
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event: any) => {
        console.error('❌ MediaRecorder error:', event);
        console.error('Error details:', event.error);
        setIsRecording(false);
      };

      console.log('Starting MediaRecorder...');
      mediaRecorder.start();
      console.log('✅ MediaRecorder started!');
      
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err: any) {
      console.error('❌ Failed to start recording:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      alert('Failed to start recording: ' + err.message);
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
