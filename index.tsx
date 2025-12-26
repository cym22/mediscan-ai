import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";

// ----------------------------------------------------------------------
// 常量与配置
// ----------------------------------------------------------------------
const STORAGE_KEY_RESULT = 'mediscan_last_result';
const STORAGE_KEY_CHAT = 'mediscan_chat_history';

// ----------------------------------------------------------------------
// 图标组件 (加大尺寸，加粗线条)
// ----------------------------------------------------------------------
const UploadCloud = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" x2="8" y1="13" y2="13"></line>
    <line x1="16" x2="8" y1="17" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const HeartPulse = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ThumbsUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const Apple = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Speaker = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="9" width="6" height="6" rx="1" />
    <path d="M10 9L17 4V20L10 15" />
    <path d="M21 8C22.6569 9.65685 22.6569 12.3431 21 14" />
  </svg>
);

const SpeakerStop = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="9" width="6" height="6" rx="1" />
    <path d="M10 9L17 4V20L10 15" />
    <line x1="21" y1="9" x2="21" y2="15" />
  </svg>
);

const MessageCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const Send = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ShieldAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Mic = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const Keyboard = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <line x1="6" y1="8" x2="6" y2="8"></line>
    <line x1="10" y1="8" x2="10" y2="8"></line>
    <line x1="14" y1="8" x2="14" y2="8"></line>
    <line x1="18" y1="8" x2="18" y2="8"></line>
    <line x1="6" y1="12" x2="6" y2="12"></line>
    <line x1="10" y1="12" x2="10" y2="12"></line>
    <line x1="14" y1="12" x2="14" y2="12"></line>
    <line x1="18" y1="12" x2="18" y2="12"></line>
    <line x1="7" y1="16" x2="17" y2="16"></line>
  </svg>
);

const Trash = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Pill = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
    <path d="m8.5 8.5 7 7"></path>
  </svg>
);

const Utensils = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
  </svg>
);

// ----------------------------------------------------------------------
// 类型定义
// ----------------------------------------------------------------------
interface UploadedFile {
  file: File;
  preview?: string;
  base64: string;
  mimeType: string;
}

// 模式定义
type AppMode = 'report' | 'medicine' | 'food';

// 1. 体检报告结果
interface AnalysisResult {
  exam_date: string;
  health_score: number;
  overall_summary: string;
  good_news: string[];
  attention_needed: {
    item: string;
    value: string;
    explanation: string;
    advice: string;
    severity: 'low' | 'medium' | 'high';
    follow_up?: {
      timeline: string;
      target_date: string;
      action: string;
    };
  }[];
  diet_lifestyle_guide: string[];
}

// 2. 药品分析结果
interface MedicineResult {
    name: string;
    efficacy: string; // 功效 (治啥的)
    usage: string; // 用法 (怎么吃)
    contraindications: string; // 禁忌 (谁不能吃/别和啥一起吃)
    side_effects_alert: string; // 常见副作用提醒
    summary: string; // 总结
}

// 3. 食品分析结果
interface FoodResult {
    name: string;
    ingredients_analysis: string; // 配料分析 (大白话)
    additives_alert: string[]; // 科技与狠活提醒
    nutrition_alert: {
        sugar: 'low' | 'medium' | 'high';
        salt: 'low' | 'medium' | 'high';
        fat: 'low' | 'medium' | 'high';
    };
    advice_for_elderly: string; // 给老年人的建议 (能不能吃)
    summary: string;
}

// 统一结果类型
type AppResult = 
  | { type: 'report'; data: AnalysisResult }
  | { type: 'medicine'; data: MedicineResult }
  | { type: 'food'; data: FoodResult };

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
}

// ----------------------------------------------------------------------
// 工具函数
// ----------------------------------------------------------------------

const triggerHaptic = (duration: number = 20) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const scaleSize = MAX_WIDTH / img.width;
        
        if (scaleSize < 1) {
             canvas.width = MAX_WIDTH;
             canvas.height = img.height * scaleSize;
        } else {
             canvas.width = img.width;
             canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// ----------------------------------------------------------------------
// 动态加载提示组件
// ----------------------------------------------------------------------
const ThinkingIndicator = ({ mode }: { mode: AppMode }) => {
  const [text, setText] = useState("正在看...");
  
  const messagesMap = {
      report: ["正在看报告...", "正在看肝肾功能...", "正在看血脂血糖...", "在思考怎么跟您解释...", "马上就好啦..."],
      medicine: ["正在看这是什么药...", "正在看怎么吃...", "正在查有没有副作用...", "马上就好啦..."],
      food: ["正在看配料表...", "正在找添加剂...", "正在看糖和油多不多...", "马上就好啦..."]
  };

  useEffect(() => {
    const msgs = messagesMap[mode];
    let i = 0;
    setText(msgs[0]);
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setText(msgs[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <span className="inline-block min-w-[150px] text-left">{text}</span>
  );
};

// ----------------------------------------------------------------------
// 日历工具
// ----------------------------------------------------------------------
const addToCalendar = (title: string, description: string, targetDateStr: string) => {
  let targetDate = new Date(targetDateStr);
  if (isNaN(targetDate.getTime())) {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
  }

  const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");
  const dayOf = new Date(targetDate);
  dayOf.setHours(8, 0, 0, 0);
  const dayBefore = new Date(targetDate);
  dayBefore.setDate(dayBefore.getDate() - 1);
  dayBefore.setHours(9, 0, 0, 0);
  
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediScan AI//CN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-1@mediscan.ai`, 
    `DTSTAMP:${formatTime(new Date())}`,
    `DTSTART:${formatTime(dayBefore)}`,
    `DTEND:${formatTime(new Date(dayBefore.getTime() + 60 * 60 * 1000))}`, 
    `SUMMARY:【明天复查提醒】${title}`,
    `DESCRIPTION:温馨提醒：您明天需要进行复查（${description}）。请今天提前准备好医保卡、身份证和过往病历。`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M", 
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-2@mediscan.ai`,
    `DTSTAMP:${formatTime(new Date())}`,
    `DTSTART:${formatTime(dayOf)}`,
    `DTEND:${formatTime(new Date(dayOf.getTime() + 60 * 60 * 1000))}`,
    `SUMMARY:【今天复查】${title}`,
    `DESCRIPTION:今天是建议复查的日子：${description}。祝您检查顺利，身体健康！`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M", 
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `reminder_double_${targetDateStr}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ----------------------------------------------------------------------
// 组件：语音播放按钮 (TTS)
// ----------------------------------------------------------------------
const TTSButton = ({ text, label = "听医生说" }: { text: string; label?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAudio = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {}
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const audioBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      
      sourceRef.current = source;
      setIsPlaying(true);

    } catch (err) {
      console.error("TTS Error", err);
      alert("语音生成失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <button
      onClick={playAudio}
      disabled={loading}
      className={`
        flex items-center px-4 py-2 rounded-full font-bold transition-all shadow-md
        ${isPlaying 
          ? 'bg-red-100 text-red-600 border border-red-200 animate-pulse' 
          : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
        }
      `}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : isPlaying ? (
        <SpeakerStop className="w-6 h-6 mr-2" />
      ) : (
        <Speaker className="w-6 h-6 mr-2" />
      )}
      <span className="text-lg">{isPlaying ? "停止播放" : label}</span>
    </button>
  );
};

// ----------------------------------------------------------------------
// 组件：追问医生 (Follow-up) - 增强版
// ----------------------------------------------------------------------
const AskDoctorSection = ({ contextItem, contextType = '报告' }: { contextItem: string, contextType?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAT + '_' + contextItem);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {}
  }, [contextItem]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_CHAT + '_' + contextItem, JSON.stringify(messages));
    }
  }, [messages, contextItem]);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isProcessingVoice, isOpen]);

  const startRecording = async () => {
    triggerHaptic(50); 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        triggerHaptic(50);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setIsProcessingVoice(true);
        
        try {
            const text = await transcribeAudio(audioBlob);
            if (text && text.trim()) {
                await handleSendMessage(text, audioUrl);
            } else {
                alert("抱歉，没听清，请再试一次");
            }
        } catch (e) {
            console.error("Transcribe failed", e);
            alert("语音识别失败");
        } finally {
            setIsProcessingVoice(false);
            stream.getTracks().forEach(t => t.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error", err);
      alert("请允许访问麦克风才能使用语音输入哦");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const base64Audio = await blobToBase64(audioBlob);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
            {
                role: "user",
                parts: [
                    { inlineData: { mimeType: "audio/webm", data: base64Audio } },
                    { text: "请准确转录这段语音的内容为文字，直接输出汉字，不要加任何标点符号以外的描述。" }
                ]
            }
        ]
    });
    return response.text || "";
  };

  const handleSendMessage = async (text: string, audioUrl?: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: ChatMessage = { role: 'user', text, audioUrl };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyContext = messages.slice(-5).map(m => m.text).join('\n');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { 
            text: `你是一位耐心、亲切的老年病专家。背景：用户正在咨询关于"${contextType} - ${contextItem}"的问题。
            历史对话：${historyContext}
            患者最新问题：${text}
            此工具不做诊断，仅提供建议。
            请用简单的大白话回答（小学文化程度能听懂），字数控制在150字以内，安抚患者情绪并给出建议。` 
          }
        ]
      });
      const answerText = response.text || "抱歉，医生刚才没听清，请再说一遍。";
      setMessages(prev => [...prev, { role: 'model', text: answerText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "网络不太好，请重试。" }]);
    } finally {
      setLoading(false);
    }
  };

  const PlayAudioIcon = ({ url }: { url: string }) => {
     const [playing, setPlaying] = useState(false);
     const audioRef = useRef<HTMLAudioElement | null>(null);
     
     const toggle = () => {
         if(!audioRef.current) {
             audioRef.current = new Audio(url);
             audioRef.current.onended = () => setPlaying(false);
         }
         if(playing) {
             audioRef.current.pause();
             setPlaying(false);
         } else {
             audioRef.current.play();
             setPlaying(true);
         }
     }
     
     return (
         <button onClick={toggle} className="ml-2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors" title="播放我的语音">
            {playing ? <SpeakerStop className="w-5 h-5 text-white" /> : <Speaker className="w-5 h-5 text-white" />}
         </button>
     )
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-4 w-full flex items-center justify-center py-3 bg-orange-50 text-orange-700 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        <span className="text-lg">对这个有疑问？点我问医生</span>
      </button>
    );
  }

  return (
    <div className="mt-4 bg-orange-50 rounded-xl p-4 border border-orange-200 animate-fade-in select-none">
      <div className="flex justify-between items-center mb-4 border-b border-orange-200 pb-2">
          <div className="text-orange-800 font-bold text-lg">👩‍⚕️ 咨询医生</div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 text-sm px-2 py-1">收起</button>
      </div>

      <div className="flex flex-col gap-4 mb-4 max-h-[350px] overflow-y-auto pr-1">
         {messages.length === 0 && (
             <div className="text-center text-gray-400 text-sm py-4">
                 您可以问：这个怎么吃？这个能经常吃吗？
             </div>
         )}
         
         {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`
                    max-w-[85%] p-3 rounded-2xl text-lg relative
                    ${msg.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-none shadow-md' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                    }
                 `}>
                     <div className="flex items-center gap-2">
                        <span className="leading-relaxed">{msg.text}</span>
                        {msg.audioUrl && <PlayAudioIcon url={msg.audioUrl} />}
                     </div>
                     {msg.role === 'model' && (
                         <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                            <TTSButton text={msg.text} label="听" />
                         </div>
                     )}
                 </div>
             </div>
         ))}
         
         {isProcessingVoice && (
             <div className="flex justify-end">
                 <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-2xl rounded-tr-none text-sm animate-pulse flex items-center">
                     <span className="mr-2">👂</span> 正在识别语音...
                 </div>
             </div>
         )}
         {loading && (
             <div className="flex justify-start">
                 <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-tl-none text-sm flex items-center">
                     <span className="mr-2">🤔</span> 医生正在思考...
                 </div>
             </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 items-end">
        <button 
            onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
            className="p-3 rounded-full bg-white border border-gray-300 text-gray-500 active:bg-gray-100 h-[50px] w-[50px] flex items-center justify-center shrink-0 shadow-sm"
        >
            {inputMode === 'text' ? <Mic className="w-6 h-6" /> : <Keyboard className="w-6 h-6" />}
        </button>

        <div className="flex-1">
            {inputMode === 'text' ? (
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="输入您的问题..."
                    className="w-full p-3 h-[50px] rounded-lg border border-orange-200 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-inner"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                />
            ) : (
                <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                    className={`
                        w-full h-[50px] rounded-lg font-bold text-lg border select-none transition-all flex items-center justify-center
                        ${isRecording 
                            ? 'bg-green-500 text-white border-green-600 shadow-inner scale-98' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
                        }
                    `}
                >
                    {isRecording ? "正在听... (松开发送)" : "按住 说话"}
                </button>
            )}
        </div>

        {inputMode === 'text' && (
            <button 
            onClick={() => handleSendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            className="bg-orange-500 text-white h-[50px] w-[60px] rounded-lg font-bold flex items-center justify-center hover:bg-orange-600 disabled:bg-gray-300 shrink-0 shadow-sm"
            >
            <Send className="w-6 h-6" />
            </button>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 组件：免责声明弹窗
// ----------------------------------------------------------------------
const DisclaimerModal = ({ onAgree }: { onAgree: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-5">
           <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">使用前必读</h2>
        
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100 max-h-[50vh] overflow-y-auto">
          <p className="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
            您好！为了您的健康负责，请您在开始前务必了解：
          </p>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-2 text-xl">•</span>
              <span>本工具<strong>不是医生</strong>，分析结果仅供参考，<strong>不能用来治病</strong>。</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-2 text-xl">•</span>
              <span>AI 可能会看走眼，<strong>绝对不能代替专业医生的诊断</strong>。</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-bold mr-2 text-xl">•</span>
              <span>如果身体不舒服，或者报告上有严重的问题，<strong>请一定要去医院找大夫看</strong>。</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onAgree}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center"
        >
          <CheckCircle className="w-6 h-6 mr-2" />
          我已阅读，同意并继续
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [activeMode, setActiveMode] = useState<AppMode>('report');
  
  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AppResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoredFromCache, setRestoredFromCache] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage (Mode aware)
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem(STORAGE_KEY_RESULT + '_' + activeMode);
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        // Basic validation
        if(parsed.type === activeMode) {
             setResult(parsed);
             setRestoredFromCache(true);
        }
      } else {
        setResult(null);
        setRestoredFromCache(false);
      }
    } catch (e) {
      console.error("Failed to load cache", e);
    }
  }, [activeMode]);

  // Save to LocalStorage
  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY_RESULT + '_' + activeMode, JSON.stringify(result));
    }
  }, [result, activeMode]);

  const switchMode = (mode: AppMode) => {
      setActiveMode(mode);
      setPdfFile(null);
      setImageFiles([]);
      setError(null);
      // Result loading handled by useEffect
  }

  const clearCache = () => {
    if (confirm("确定要清空之前的记录吗？")) {
      localStorage.removeItem(STORAGE_KEY_RESULT + '_' + activeMode);
      setResult(null);
      setRestoredFromCache(false);
      setPdfFile(null);
      setImageFiles([]);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError("请找家里人帮忙上传PDF格式的体检报告哦。");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setPdfFile({ file, base64, mimeType: file.type });
      setError(null);
    } catch (err) { setError("文件读取失败了，请重试。"); }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newImages: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const base64 = await compressImage(file);
        newImages.push({ file, preview: URL.createObjectURL(file), base64, mimeType: 'image/jpeg' });
      } catch (err) { console.error("读取图片失败", file.name); }
    }
    setImageFiles(prev => [...prev, ...newImages]);
    setError(null);
  };

  const removeImage = (index: number) => setImageFiles(prev => prev.filter((_, i) => i !== index));
  const removePdf = () => { setPdfFile(null); if (pdfInputRef.current) pdfInputRef.current.value = ''; };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeReports = async () => {
    if (!pdfFile && imageFiles.length === 0) {
      setError("爷爷奶奶，请先上传照片哦。");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY_RESULT + '_' + activeMode); 

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelId = "gemini-3-flash-preview"; 
      
      const parts = [];
      if (pdfFile) parts.push({ inlineData: { mimeType: pdfFile.mimeType, data: pdfFile.base64 } });
      for (const img of imageFiles) parts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } });

      let prompt = "";
      
      if (activeMode === 'report') {
          prompt = `您是一位贴心的家庭医生。请分析上传的体检报告，返回JSON：
          {
            "exam_date": "YYYY-MM-DD",
            "health_score": 数字(0-100),
            "overall_summary": "亲切总结",
            "good_news": ["好消息1", "好消息2"],
            "attention_needed": [
               {
                 "item": "指标名",
                 "value": "数值",
                 "severity": "low/medium/high",
                 "explanation": "大白话解释",
                 "advice": "建议",
                 "follow_up": { "timeline": "6个月后", "action": "复查项目", "target_date": "YYYY-MM-DD" }
               }
            ],
            "diet_lifestyle_guide": ["建议1"]
          }`;
      } else if (activeMode === 'medicine') {
          prompt = `您是一位药剂师。请识别图片中的药品（药盒或说明书）。请用通俗易懂的大白话（老人能听懂）返回JSON：
          {
             "name": "药品名称",
             "efficacy": "这药是治什么病的（简单说）",
             "usage": "怎么吃（饭前饭后？一次几片？看说明书总结）",
             "contraindications": "什么人绝对不能吃？",
             "side_effects_alert": "可能会有什么不舒服（如头晕、犯困）",
             "summary": "给老人的温馨提示"
          }`;
      } else if (activeMode === 'food') {
          prompt = `您是一位营养师。请识别图片中的食品（配料表或包装）。请用通俗易懂的大白话返回JSON：
          {
             "name": "食品名称",
             "ingredients_analysis": "这里面主要是什么东西（大白话）",
             "additives_alert": ["防腐剂xx", "增味剂xx"],
             "nutrition_alert": {
                "sugar": "low/medium/high",
                "salt": "low/medium/high",
                "fat": "low/medium/high"
             },
             "advice_for_elderly": "老人能经常吃吗？为什么？",
             "summary": "一句话总结建议"
          }`;
      }

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });

      const jsonText = response.text;
      if (jsonText) {
        const data = JSON.parse(jsonText);
        setResult({ type: activeMode, data } as AppResult);
      }

    } catch (err: any) {
      console.error(err);
      setError("网络稍微有点卡，请再试一次按钮。");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  // ----------------------------------------------------------------------
  // 渲染不同的结果卡片
  // ----------------------------------------------------------------------
  
  const renderMedicineResult = (data: MedicineResult) => (
      <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{data.name}</h3>
              <p className="text-xl text-blue-800">{data.summary}</p>
              <div className="mt-4 flex justify-end"><TTSButton text={`关于${data.name}。${data.summary}。主要治：${data.efficacy}。用法：${data.usage}。特别注意：${data.contraindications}`} /></div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
             <h4 className="flex items-center text-xl font-bold text-green-700 mb-3"><CheckCircle className="mr-2"/> 治啥的？</h4>
             <p className="text-lg text-gray-700 leading-relaxed">{data.efficacy}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
             <h4 className="flex items-center text-xl font-bold text-orange-700 mb-3"><CalendarIcon className="mr-2"/> 怎么吃？</h4>
             <p className="text-lg text-gray-700 leading-relaxed">{data.usage}</p>
          </div>

          <div className="bg-red-50 rounded-3xl p-6 shadow-md border-l-8 border-red-500">
             <h4 className="flex items-center text-xl font-bold text-red-700 mb-3"><ShieldAlert className="mr-2"/> 千万注意（禁忌）</h4>
             <p className="text-lg text-red-900 leading-relaxed font-bold">{data.contraindications}</p>
             <p className="text-base text-red-700 mt-2">副作用提醒：{data.side_effects_alert}</p>
          </div>
          
          <AskDoctorSection contextItem={data.name} contextType="药品" />
      </div>
  );

  const renderFoodResult = (data: FoodResult) => (
      <div className="space-y-6">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-orange-900 mb-2">{data.name}</h3>
              <p className="text-xl text-orange-800">{data.summary}</p>
              <div className="mt-4 flex justify-end"><TTSButton text={`关于${data.name}。${data.summary}。成分：${data.ingredients_analysis}。老人建议：${data.advice_for_elderly}`} /></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
              {[
                  { label: '糖', level: data.nutrition_alert.sugar, color: data.nutrition_alert.sugar === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' },
                  { label: '盐', level: data.nutrition_alert.salt, color: data.nutrition_alert.salt === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' },
                  { label: '油', level: data.nutrition_alert.fat, color: data.nutrition_alert.fat === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' },
              ].map((nut, idx) => (
                  <div key={idx} className={`rounded-2xl p-4 ${nut.color}`}>
                      <div className="text-lg font-bold">{nut.label}</div>
                      <div className="text-sm mt-1">{nut.level === 'high' ? '高⚠️' : nut.level === 'medium' ? '适中' : '低✅'}</div>
                  </div>
              ))}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
             <h4 className="flex items-center text-xl font-bold text-gray-800 mb-3"><Utensils className="mr-2"/> 这里面是啥？</h4>
             <p className="text-lg text-gray-700 leading-relaxed">{data.ingredients_analysis}</p>
             {data.additives_alert.length > 0 && (
                 <div className="mt-4 bg-gray-100 p-3 rounded-xl">
                     <span className="text-gray-500 text-sm">科技提醒：</span>
                     <div className="flex flex-wrap gap-2 mt-2">
                         {data.additives_alert.map((a, i) => (
                             <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{a}</span>
                         ))}
                     </div>
                 </div>
             )}
          </div>

          <div className="bg-green-50 rounded-3xl p-6 shadow-md border-l-8 border-green-500">
             <h4 className="flex items-center text-xl font-bold text-green-800 mb-3"><ThumbsUp className="mr-2"/> 老人能吃吗？</h4>
             <p className="text-lg text-green-900 leading-relaxed font-bold">{data.advice_for_elderly}</p>
          </div>

          <AskDoctorSection contextItem={data.name} contextType="食品" />
      </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-gray-50 font-sans">
      
      {!hasAgreed && <DisclaimerModal onAgree={() => setHasAgreed(true)} />}

      <header className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-white">
            <HeartPulse className="w-10 h-10" />
            <h1 className="text-2xl font-bold tracking-wider">健康小助手</h1>
          </div>
          <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-bold">
              Google API 版
          </div>
        </div>
      </header>

      {/* 模式切换器 - 优化版 */}
      <div className="bg-white shadow-md sticky top-[80px] z-10 py-4">
          <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-3 gap-4">
                  {/* 按钮 1: 查体检 (Primary) */}
                  <button 
                    onClick={() => switchMode('report')}
                    className={`
                        relative flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200
                        ${activeMode === 'report' 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105 z-10' 
                            : 'bg-white border-blue-100 text-gray-500 hover:bg-blue-50'
                        }
                    `}
                  >
                      {activeMode === 'report' && (
                          <div className="absolute -top-3 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-sm animate-bounce">
                              最常用
                          </div>
                      )}
                      <FileText className={`w-12 h-12 mb-2 ${activeMode === 'report' ? 'text-white' : 'text-blue-500'}`} />
                      <span className="text-xl font-black tracking-wide">查体检</span>
                  </button>
                  
                  {/* 按钮 2: 看药品 */}
                  <button 
                    onClick={() => switchMode('medicine')}
                    className={`
                        flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200
                        ${activeMode === 'medicine' 
                            ? 'bg-green-600 border-green-600 text-white shadow-xl scale-105 z-10' 
                            : 'bg-white border-green-100 text-gray-500 hover:bg-green-50'
                        }
                    `}
                  >
                      <Pill className={`w-12 h-12 mb-2 ${activeMode === 'medicine' ? 'text-white' : 'text-green-500'}`} />
                      <span className="text-xl font-black tracking-wide">看药品</span>
                  </button>

                  {/* 按钮 3: 看食品 */}
                  <button 
                    onClick={() => switchMode('food')}
                    className={`
                        flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200
                        ${activeMode === 'food' 
                            ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-105 z-10' 
                            : 'bg-white border-orange-100 text-gray-500 hover:bg-orange-50'
                        }
                    `}
                  >
                      <Utensils className={`w-12 h-12 mb-2 ${activeMode === 'food' ? 'text-white' : 'text-orange-500'}`} />
                      <span className="text-xl font-black tracking-wide">看食品</span>
                  </button>
              </div>
          </div>
      </div>

      <main className={`max-w-4xl mx-auto px-4 py-8 space-y-8 transition-all duration-500 ${!hasAgreed ? 'blur-sm pointer-events-none select-none h-screen overflow-hidden' : ''}`}>
        
        {restoredFromCache && result && !isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex justify-between items-center animate-fade-in">
             <span className="text-blue-800 font-medium">✨ 上次查的结果还在呢</span>
             <button onClick={clearCache} className="text-sm bg-white text-gray-500 border px-3 py-1 rounded-full flex items-center shadow-sm">
               <Trash className="w-4 h-4 mr-1" /> 清除
             </button>
          </div>
        )}

        {/* 欢迎语 (根据模式变化) */}
        <section className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
             {activeMode === 'report' && "体检报告看不懂？"}
             {activeMode === 'medicine' && "这药怎么吃？"}
             {activeMode === 'food' && "这东西能吃吗？"}
          </h2>
          <p className="text-xl text-gray-600">
             {activeMode === 'report' && "拍照上传，我给您讲明白"}
             {activeMode === 'medicine' && "拍药盒或说明书，帮您把关"}
             {activeMode === 'food' && "拍包装配料表，帮您看看"}
          </p>
        </section>

        {/* 上传区域 */}
        {!result && (
          <div className="grid md:grid-cols-2 gap-8">
            {activeMode === 'report' && (
                <div className={`
                relative rounded-3xl border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 h-80
                ${pdfFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}
                `}>
                {!pdfFile ? (
                    <>
                    <FileText className="w-20 h-20 text-gray-400 mb-4" />
                    <p className="text-2xl font-bold text-gray-700 mb-2">上传 PDF</p>
                    <button 
                        onClick={() => pdfInputRef.current?.click()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-lg"
                    >
                        选文件
                    </button>
                    </>
                ) : (
                    <>
                    <FileText className="w-20 h-20 text-blue-600 mb-4" />
                    <p className="text-xl font-bold text-blue-900 line-clamp-2 px-4 text-center">{pdfFile.file.name}</p>
                    <button onClick={removePdf} className="mt-6 px-6 py-3 bg-red-100 text-red-700 text-lg font-bold rounded-full flex items-center">
                        <X className="w-6 h-6 mr-2" /> 删除
                    </button>
                    </>
                )}
                <input type="file" ref={pdfInputRef} onChange={handlePdfUpload} accept="application/pdf" className="hidden" />
                </div>
            )}

            <div className={`
              ${activeMode !== 'report' ? 'md:col-span-2' : ''}
              relative rounded-3xl border-4 border-dashed transition-all duration-300 flex flex-col p-6 h-80
              ${imageFiles.length > 0 ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-white hover:border-teal-400'}
            `}>
              {imageFiles.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  {activeMode === 'medicine' ? <Pill className="w-20 h-20 text-gray-400 mb-4"/> : 
                   activeMode === 'food' ? <Utensils className="w-20 h-20 text-gray-400 mb-4"/> :
                   <ImageIcon className="w-20 h-20 text-gray-400 mb-4" />}
                  
                  <p className="text-2xl font-bold text-gray-700 mb-2">
                      {activeMode === 'medicine' ? "拍药盒 / 说明书" : activeMode === 'food' ? "拍配料表 / 包装" : "拍化验单"}
                  </p>
                  <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-xl font-bold rounded-full shadow-lg"
                  >
                    拍 照
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {imageFiles.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={img.preview} alt="预览" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-2 bg-red-500 text-white rounded-full shadow-md"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-teal-300 rounded-xl text-teal-600"
                    >
                      <UploadCloud className="w-10 h-10 mb-2" />
                      <span className="text-lg font-bold">加一张</span>
                    </button>
                  </div>
                  <div className="mt-4 text-center text-teal-800 text-lg font-bold">
                    已选 {imageFiles.length} 张照片
                  </div>
                </div>
              )}
              <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-100 border-l-8 border-red-500 rounded-r-xl">
            <p className="text-xl text-red-800 font-bold">{error}</p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          {!result && (
              <button
                onClick={analyzeReports}
                disabled={isAnalyzing || (!pdfFile && imageFiles.length === 0)}
                className={`
                  w-full sm:w-auto px-12 py-6 rounded-full text-2xl font-bold shadow-xl transition-all transform
                  ${isAnalyzing || (!pdfFile && imageFiles.length === 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isAnalyzing ? <ThinkingIndicator mode={activeMode} /> : "开始帮我看"}
              </button>
          )}
          {result && !isAnalyzing && (
              <button 
                  onClick={clearCache} 
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full shadow"
              >
                  🔄 拍新的
              </button>
          )}
        </div>

        {/* 结果展示区域 */}
        {result && (
          <div ref={resultRef} className="animate-fade-in pb-12">
             {result.type === 'report' && (
                 <>
                    {/* 复用之前的体检报告 UI */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-100 mb-8">
                        <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-8 flex flex-col items-start gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
                            <div className={`
                                w-32 h-32 rounded-full flex items-center justify-center border-8 shadow-inner bg-white shrink-0
                                ${result.data.health_score >= 80 ? 'border-green-500 text-green-600' : 'border-orange-500 text-orange-600'}
                            `}>
                                <span className="text-5xl font-black">{result.data.health_score}</span>
                                <span className="text-xl font-bold mt-2 ml-1">分</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">解读总结</h3>
                                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                {result.data.overall_summary}
                                </p>
                            </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <TTSButton text={result.data.overall_summary} />
                            </div>
                        </div>
                    </div>

                    {result.data.attention_needed && result.data.attention_needed.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center text-2xl font-bold text-gray-800 px-2 py-2">
                            <AlertTriangle className="w-8 h-8 mr-3 text-orange-500" />
                            这几个指标要留心：
                            </h3>
                            {result.data.attention_needed.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-6 shadow-lg border-l-8 border-l-orange-500 border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-gray-800">{item.item}</span>
                                    {item.value && <span className="text-lg text-gray-500 mt-1">数值: {item.value}</span>}
                                </div>
                                {item.severity === 'high' && (
                                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-lg font-bold">建议就医</span>
                                )}
                                {item.severity === 'medium' && (
                                    <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-lg font-bold">需关注</span>
                                )}
                                </div>
                                
                                <div className="bg-gray-50 p-5 rounded-2xl mb-4">
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    <span className="font-bold text-blue-600 mr-2">啥意思？</span>
                                    {item.explanation}
                                </p>
                                </div>

                                <div className="flex items-start mb-4">
                                <div className="bg-green-100 p-2 rounded-full mr-3 mt-1 shrink-0">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-xl text-gray-800 font-medium leading-relaxed">
                                    <span className="font-bold text-green-700">咋办：</span>
                                    {item.advice}
                                </p>
                                </div>

                                {item.follow_up && (
                                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse-slow">
                                    <div>
                                    <p className="text-lg font-bold text-blue-800 flex items-center">
                                        <CalendarIcon className="w-6 h-6 mr-2" />
                                        重要提醒：
                                    </p>
                                    <p className="text-blue-700 mt-1">建议 <strong>{item.follow_up.timeline}</strong> (约 {item.follow_up.target_date}) 做：{item.follow_up.action}</p>
                                    </div>
                                    <button
                                    onClick={() => addToCalendar(`${item.follow_up?.timeline}复查${item.item}`, item.follow_up?.action || "", item.follow_up?.target_date || "")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-colors flex flex-col items-center"
                                    >
                                    <span className="text-sm">存入</span>
                                    <span className="text-xs">日历</span>
                                    </button>
                                </div>
                                )}

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <TTSButton text={`关于${item.item}。${item.explanation}。建议：${item.advice}。${item.follow_up ? '请注意，建议' + item.follow_up.timeline + '复查' : ''}`} />
                                </div>

                                <AskDoctorSection contextItem={item.item + "，数值" + (item.value || "") + "，情况：" + item.explanation} contextType="体检指标" />
                            </div>
                            ))}
                        </div>
                    )}
                 </>
             )}

             {result.type === 'medicine' && renderMedicineResult(result.data)}
             {result.type === 'food' && renderFoodResult(result.data)}

          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);