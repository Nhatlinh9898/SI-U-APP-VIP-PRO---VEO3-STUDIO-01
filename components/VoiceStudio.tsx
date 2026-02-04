import React, { useState, useRef, useEffect } from 'react';
import { Mic2, Play, Pause, Download, Volume2, AlertCircle } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { VoiceConfig } from '../types';

interface VoiceStudioProps {
  scriptContent: string;
}

// Helper to decode raw PCM data from Gemini (16-bit little-endian)
const decodeAudioData = (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1
): AudioBuffer => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert Int16 to Float32 [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
};

// Helper to create a WAV blob from AudioBuffer for downloading
const bufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferOut = new ArrayBuffer(length);
    const view = new DataView(bufferOut);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this example)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for(i = 0; i < buffer.numberOfChannels; i++)
        channels.push(buffer.getChannelData(i));

    while(pos < buffer.length) {
        for(i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
            view.setInt16(44 + offset, sample, true); // write 16-bit sample
            offset += 2;
        }
        pos++;
    }

    // helper
    function setUint16(data: number) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data: number) {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    return new Blob([bufferOut], { type: "audio/wav" });
}

const VoiceStudio: React.FC<VoiceStudioProps> = ({ scriptContent }) => {
  const [textToRead, setTextToRead] = useState('');
  const [config, setConfig] = useState<VoiceConfig>({ speaker: 'female', speed: 1.0 });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Truncate initial text if too long, or just grab the first chunk
    if (scriptContent) {
        setTextToRead(scriptContent.slice(0, 500) + "...");
    }
  }, [scriptContent]);

  const handleGenerateAudio = async () => {
    if (!textToRead.trim()) return;

    setIsLoading(true);
    setError(null);
    stopAudio();

    try {
      const base64Audio = await generateSpeech(textToRead, config.speaker, config.speed);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      }
      
      const ctx = audioContextRef.current;
      
      // Decode Base64 to Uint8Array
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode RAW PCM data manually
      const audioBuffer = decodeAudioData(bytes, ctx, 24000, 1);
      audioBufferRef.current = audioBuffer;
      
      // Create WAV blob for download from the buffer
      const blob = bufferToWav(audioBuffer);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Play immediately
      playBuffer(audioBuffer);

    } catch (err) {
      console.error(err);
      setError("Không thể tạo giọng nói. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    
    stopAudio();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = config.speed;
    source.connect(audioContextRef.current.destination);
    source.start(0);
    
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => setIsPlaying(false);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
        if (audioBufferRef.current) {
            playBuffer(audioBufferRef.current);
        } else if (audioUrl) {
            handleGenerateAudio(); 
        }
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 mt-8 border border-pink-500/30">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <Mic2 className="w-6 h-6 text-pink-400" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Voice Studio Pro</h2>
        <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30">TTS Engine 2.5</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Văn bản cần đọc (Script Snippet)</label>
                <textarea 
                    className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                    value={textToRead}
                    onChange={(e) => setTextToRead(e.target.value)}
                    placeholder="Dán một đoạn hội thoại hoặc mô tả vào đây để nghe thử..."
                />
            </div>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Giọng đọc (Voice)</label>
                    <select 
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none"
                        value={config.speaker}
                        onChange={(e) => setConfig({...config, speaker: e.target.value as 'male' | 'female'})}
                    >
                        <option value="male">Nam - Trầm ấm (Expert)</option>
                        <option value="female">Nữ - Truyền cảm (Muse)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Tốc độ (Speed)</label>
                    <select 
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none"
                        value={config.speed}
                        onChange={(e) => setConfig({...config, speed: parseFloat(e.target.value)})}
                    >
                        <option value="0.5">0.5x (Chậm)</option>
                        <option value="1.0">1.0x (Chuẩn)</option>
                        <option value="1.25">1.25x (Nhanh)</option>
                        <option value="1.5">1.5x (Rất nhanh)</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={isPlaying ? togglePlayback : handleGenerateAudio}
                    disabled={isLoading || (!textToRead && !audioBufferRef.current)}
                    className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                        <><Pause className="w-5 h-5" /> Dừng Lại</>
                    ) : (
                        <><Volume2 className="w-5 h-5" /> {audioBufferRef.current ? "Nghe Lại" : "Đọc Ngay (Preview)"}</>
                    )}
                </button>
                
                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-2 rounded">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {audioUrl && (
                    <a 
                        href={audioUrl} 
                        download="voice_studio_output.wav"
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <Download className="w-4 h-4" /> Tải Audio về máy
                    </a>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudio;