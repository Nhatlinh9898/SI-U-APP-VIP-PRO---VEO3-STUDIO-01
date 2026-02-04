import { GoogleGenAI, Modality } from "@google/genai";
import { ScriptOptions } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Prompt for Script Generation (Based on User's Framework)
const SYSTEM_INSTRUCTION = `
Bạn là AI Screenwriter + Director + Storyboard Supervisor + Style Composer + Content Librarian (Linh Master AI).
NHIỆM VỤ: Chuyển đổi ý tưởng thành kịch bản phim cho VEO3/Sora.

FORMAT OUTPUT BẮT BUỘC (MARKDOWN):
# 🧾 LIBRARY ENTRY
- **ID:** [Tạo ID duy nhất]
- **TITLE:** [Tên tác phẩm ấn tượng]
- **GENRE:** [Thể loại]
- **TAGS:** [Hashtags]
- **SUMMARY:** [Tóm tắt ngắn gọn]

# 👤 CHARACTER BIBLE
(Liệt kê nhân vật chính với chi tiết: Tuổi, Ngoại hình, Trang phục, Giọng nói, Tính cách)

# 🎬 SERIES STRUCTURE
- **Series Title:** ...
- **Season 1:**
  - **Episode 1:** [Tên tập]
    - **Chapter 1:** [Tên chương]

# 📽️ KỊCH BẢN CHI TIẾT (FORMAT SCRIPT)
**[SCENE 1]** [BỐI CẢNH - THỜI GIAN]
**Visual:** [Mô tả hình ảnh chi tiết cho AI Video, góc máy, ánh sáng, màu sắc]
**Audio:** [Âm nhạc, SFX]
**Action:** [Hành động nhân vật]
**Dialogue:**
[Tên]: [Lời thoại]

---
TUÂN THỦ NGHIÊM NGẶT CÁC TINH CHỈNH CỦA NGƯỜI DÙNG VỀ PHONG CÁCH, ÂM NHẠC, VÀ GIỌNG NÓI.
`;

export const generateScript = async (
  userInput: string,
  options: ScriptOptions
): Promise<string> => {
  try {
    const userPrompt = `
Nội dung người dùng: ${userInput}

Tùy chọn cấu hình:
- Thể loại: ${options.genre}
- Phong cách thẩm mỹ: ${options.aesthetic}
- Phong cách âm nhạc: ${options.music}
- Bối cảnh: ${options.setting}
- Giọng nói nhân vật: ${options.voiceStyle}
- Khả năng nhân vật: ${options.characterAbility}
- Tinh chỉnh hình ảnh: ${options.visualControls}
- Tinh chỉnh âm nhạc: ${options.musicControls}
- Tinh chỉnh giọng nói: ${options.voiceControls}

Hãy tạo:
1. Library Entry
2. Character Bible
3. Series Structure
4. Kịch bản chi tiết (Chapter 1)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Use Pro for complex reasoning
      contents: userPrompt, // Pass string directly for simpler request
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Không thể tạo nội dung. Vui lòng thử lại.";
  } catch (error) {
    console.error("Lỗi khi tạo kịch bản:", error);
    throw new Error("Đã xảy ra lỗi khi kết nối với Siêu Trí Tuệ. Vui lòng kiểm tra API Key.");
  }
};

export const generateSpeech = async (
  text: string,
  speaker: 'male' | 'female',
  speed: number
): Promise<string> => {
  try {
    // Map speaker to Gemini TTS voices
    // Using generic names as placeholders, check documentation for exact preview voice names if changed.
    const voiceName = speaker === 'male' ? 'Fenrir' : 'Kore';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
        throw new Error("Không nhận được dữ liệu âm thanh.");
    }

    return base64Audio; 
  } catch (error) {
    console.error("Lỗi Voice Studio:", error);
    throw error;
  }
};