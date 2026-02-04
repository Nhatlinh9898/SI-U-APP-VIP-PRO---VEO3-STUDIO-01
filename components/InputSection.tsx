import React from 'react';
import { ScriptOptions, Genre, AestheticStyle, MusicStyle, VoiceCharacter } from '../types';
import { Sparkles, Settings2 } from 'lucide-react';

interface InputSectionProps {
  options: ScriptOptions;
  setOptions: (options: ScriptOptions) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  options,
  setOptions,
  userInput,
  setUserInput,
  onGenerate,
  loading,
}) => {
  const handleChange = (field: keyof ScriptOptions, value: string) => {
    setOptions({ ...options, [field]: value });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <Settings2 className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Cấu Hình Sản Xuất (Production Config)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Genre */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Thể loại (Genre)</label>
          <select
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={options.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            {Object.values(Genre).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Aesthetic */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Phong cách hình ảnh (Visual)</label>
          <select
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={options.aesthetic}
            onChange={(e) => handleChange('aesthetic', e.target.value)}
          >
             {Object.values(AestheticStyle).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Music */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Âm nhạc (Score)</label>
          <select
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={options.music}
            onChange={(e) => handleChange('music', e.target.value)}
          >
             {Object.values(MusicStyle).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Voice Style */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Giọng nhân vật (Voice)</label>
            <select
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={options.voiceStyle}
                onChange={(e) => handleChange('voiceStyle', e.target.value)}
            >
                {Object.values(VoiceCharacter).map((v) => (
                <option key={v} value={v}>{v}</option>
                ))}
            </select>
        </div>

         {/* Setting - Text Input */}
         <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Bối cảnh (Setting)</label>
          <input
            type="text"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="VD: Trạm vũ trụ bỏ hoang năm 2099..."
            value={options.setting}
            onChange={(e) => handleChange('setting', e.target.value)}
          />
        </div>

        {/* Abilities - Text Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Kỹ năng nhân vật (Abilities)</label>
          <input
            type="text"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="VD: Bắn cung, Hack máy tính siêu cấp..."
            value={options.characterAbility}
            onChange={(e) => handleChange('characterAbility', e.target.value)}
          />
        </div>

        {/* Advanced Controls Row */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-purple-400 uppercase">Tinh chỉnh Visual</label>
                <input
                    type="text"
                    className="w-full bg-gray-900/30 border border-gray-700 rounded-md p-2 text-xs text-white placeholder-gray-600"
                    placeholder="VD: High contrast, volumetric lighting..."
                    value={options.visualControls}
                    onChange={(e) => handleChange('visualControls', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold text-purple-400 uppercase">Tinh chỉnh Audio</label>
                <input
                    type="text"
                    className="w-full bg-gray-900/30 border border-gray-700 rounded-md p-2 text-xs text-white placeholder-gray-600"
                    placeholder="VD: Fast tempo, heavy bass..."
                    value={options.musicControls}
                    onChange={(e) => handleChange('musicControls', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold text-purple-400 uppercase">Tinh chỉnh Voice</label>
                <input
                    type="text"
                    className="w-full bg-gray-900/30 border border-gray-700 rounded-md p-2 text-xs text-white placeholder-gray-600"
                    placeholder="VD: Slow pace, emotional..."
                    value={options.voiceControls}
                    onChange={(e) => handleChange('voiceControls', e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="space-y-3">
        <label className="flex items-center justify-between">
            <span className="text-sm font-bold text-white uppercase">Ý tưởng cốt lõi (Core Concept)</span>
            <span className="text-xs text-gray-400">{userInput.length}/10000 ký tự</span>
        </label>
        <textarea
          className="w-full h-48 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-base text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Nhập ý tưởng phim, tiểu thuyết, hoặc tóm tắt câu chuyện của bạn tại đây. Hệ thống sẽ tự động chuyển hóa thành kịch bản chuyên nghiệp..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          maxLength={10000}
        ></textarea>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading || !userInput.trim()}
          className={`
            group relative px-12 py-4 rounded-full text-lg font-bold uppercase tracking-widest text-white shadow-lg overflow-hidden transition-all
            ${loading || !userInput.trim() ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-transparent hover:scale-105'}
          `}
        >
          {(!loading && userInput.trim()) && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 group-hover:animate-pulse"></div>
          )}
          <span className="relative flex items-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang Kiến Tạo...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Kích Hoạt Studio
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default InputSection;
