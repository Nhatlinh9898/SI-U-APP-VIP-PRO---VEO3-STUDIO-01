import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileText } from 'lucide-react';

interface ResultViewProps {
  content: string;
}

const ResultView: React.FC<ResultViewProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-0 overflow-hidden shadow-2xl animate-fade-in mt-8 border border-purple-500/30">
      <div className="bg-gray-900/80 p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white uppercase text-sm md:text-base">Kịch Bản & Hồ Sơ (Studio Output)</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-xs text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <div className="p-6 md:p-8 max-h-[800px] overflow-y-auto bg-gray-900/30">
        <div className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-strong:text-pink-300 prose-p:text-gray-300 prose-li:text-gray-300 leading-relaxed font-light">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
