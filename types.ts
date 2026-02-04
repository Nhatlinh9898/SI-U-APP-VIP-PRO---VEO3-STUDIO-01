export interface AppState {
  view: 'create' | 'library';
  loading: boolean;
  processingAudio: boolean;
  generatedScript: string | null;
  generatedAudioUrl: string | null;
}

export interface ScriptOptions {
  genre: string;
  aesthetic: string;
  music: string;
  setting: string;
  voiceStyle: string;
  characterAbility: string;
  visualControls: string;
  musicControls: string;
  voiceControls: string;
}

export interface VoiceConfig {
  speaker: 'male' | 'female';
  speed: number;
}

// Enums for dropdowns
export enum Genre {
  SCIFI_HARD = "Khoa học Viễn tưởng (Hard Sci-Fi)",
  MYSTERY_DETECTIVE = "Trinh thám / Bí ẩn (Mystery)",
  THRILLER_PSYCHO = "Kinh dị tâm lý (Psychological Thriller)",
  FANTASY_MYTH = "Thần thoại / Giả tưởng (Fantasy)",
  CYBERPUNK = "Cyberpunk / Dystopian",
  HISTORICAL_DRAMA = "Dã sử / Cổ trang (Historical)",
  ROMANCE_SLICE = "Lãng mạn / Đời thường (Slice of Life)",
  ACTION_MECHA = "Hành động / Mecha",
  DOCUMENTARY_TRAVEL = "Tài liệu du lịch (Travel Doc)",
  FASHION_ART = "Fashion Film / Art House"
}

export enum AestheticStyle {
  CINEMATIC_4K = "Điện ảnh 4K (Cinematic)",
  FILM_NOIR = "Phim đen trắng (Film Noir)",
  NEON_VAPORWAVE = "Neon Vaporwave",
  RETRO_VHS = "Retro VHS 90s",
  ANIME_SHINKAI = "Anime (Style Makoto Shinkai)",
  WATERCOLOR = "Màu nước (Watercolor)",
  GOTHIC_DARK = "Gothic Dark Fantasy",
  MINIMALIST = "Tối giản (Minimalist)",
  FUTURISTIC_CLEAN = "Tương lai sạch (Clean Future)",
  GRITTY_REALISM = "Hiện thực trần trụi (Gritty)"
}

export enum MusicStyle {
  EPIC_ORCHESTRAL = "Hùng tráng (Epic Orchestral)",
  SYNTHWAVE = "Điện tử (Synthwave)",
  LOFI_CHILL = "Lofi Chill / Thư giãn",
  HORROR_AMBIENT = "Kinh dị (Dark Ambient)",
  JAZZ_NOIR = "Jazz Noir",
  ROCK_INTENSE = "Rock cường độ cao",
  TRADITIONAL_ASIAN = "Nhạc cụ dân tộc Á Đông",
  TECHNO_BEAT = "Techno / Industrial",
  PIANO_EMOTIONAL = "Piano cảm xúc",
  SILENCE_FX = "Im lặng + Tiếng động (ASMR)"
}

export enum VoiceCharacter {
  MALE_DEEP = "Nam - Trầm ấm / Doanh nhân",
  FEMALE_WARM = "Nữ - Truyền cảm / Nàng thơ",
  MALE_AGGRESSIVE = "Nam - Mạnh mẽ / Chiến binh",
  FEMALE_NEWS = "Nữ - BTV Thời sự / Sắc sảo",
  ROBOTIC = "Giọng Robot / AI",
  ELDERLY = "Người già / Kể chuyện cổ tích"
}
