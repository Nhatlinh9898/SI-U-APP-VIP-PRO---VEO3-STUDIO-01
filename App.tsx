import React, { useState } from 'react';
import { ScriptOptions, Genre, AestheticStyle, MusicStyle, VoiceCharacter } from './types';
import { generateScript } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultView from './components/ResultView';
import VoiceStudio from './components/VoiceStudio';
import { Bot, Layers, Menu, Database } from 'lucide-react';

// Default Options
const defaultOptions: ScriptOptions = {
  genre: Genre.SCIFI_HARD,
  aesthetic: AestheticStyle.CINEMATIC_4K,
  music: MusicStyle.EPIC_ORCHESTRAL,
  setting: '',
  voiceStyle: VoiceCharacter.FEMALE_WARM,
  characterAbility: '',
  visualControls: '',
  musicControls: '',
  voiceControls: '',
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [options, setOptions] = useState<ScriptOptions>(defaultOptions);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateScript(userInput, options);
      setGeneratedContent(result);
    } catch (error) {
      alert("Hệ thống đang quá tải hoặc gặp lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-purple-500 selection:text-white">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f13]/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
                 {/* Left spacer or menu icon */}
                 <Menu className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
            </div>

            {/* CENTER TITLE - MASSIVE */}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter vip-gradient-text text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    SIÊU APP VIP PRO
                </h1>
                <p className="text-[10px] md:text-xs text-gray-400 tracking-[0.3em] uppercase mt-1">
                    VEO3 STUDIO ARCHITECT
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* Right icons */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* HERO SECTION */}
        <div className="text-center mb-12 animate-fade-in-down">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                Biến ý tưởng thành <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kiệt Tác Điện Ảnh</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
                Hệ thống AI Master Linh đã sẵn sàng. Hãy nhập dữ liệu đầu vào, tinh chỉnh các biến số nghệ thuật và để hệ thống kiến tạo kịch bản phim, cấu trúc series và giọng đọc đỉnh cao cho VEO3/Sora.
            </p>
        </div>

        {/* INPUT FORM */}
        <InputSection 
            options={options}
            setOptions={setOptions}
            userInput={userInput}
            setUserInput={setUserInput}
            onGenerate={handleGenerate}
            loading={loading}
        />

        {/* RESULTS AREA */}
        {generatedContent && (
            <div className="space-y-8 pb-12">
                <ResultView content={generatedContent} />
                <VoiceStudio scriptContent={generatedContent} />
                
                {/* MOCK LIBRARY SAVE */}
                <div className="flex justify-center pt-8">
                     <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest">
                        <Database className="w-4 h-4" />
                        Đã lưu vào thư viện (Demo)
                     </button>
                </div>
            </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-600 text-xs border-t border-gray-900 mt-20">
        <p>POWERED BY GEMINI 3.0 PRO & 2.5 TTS • LINH MASTER AI ARCHITECTURE</p>
      </footer>
    </div>
  );
};

export default App;
