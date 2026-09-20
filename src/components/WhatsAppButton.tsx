import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, ShieldAlert } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    {
      text: "مرحباً بك في لاڤيدا بروبيرتز! كيف يمكن لمستشارنا الاستثماري مساعدتك اليوم؟",
      isBot: true
    }
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { text, isBot: false }];
    setMessages(updatedMessages);
    setUserInput("");

    // Simulate bot/real estate automated response
    setTimeout(() => {
      let response = "يسعدنا جداً اهتمامك. تم تحويل هذا المستند للمستشار المالي المختص وسيقوم بالتواصل معك عبر الواتساب فوراً لمناقشة التفاصيل!";
      
      if (text.includes("سكني") || text.includes("فندق")) {
        response = "بالنسبة للاستثمار السكني والفندقي، تتوفر لدينا وحدات مميزة جداً في التجمع الخامس والعاصمة الإدارية بعوائد إيجارية مضمونة تبدأ من 10% سنوياً. يرجى ترك اسمك في نموذج الاتصال وسنرسل لك البروشور والأسعار!";
      } else if (text.includes("تجاري") || text.includes("شرك")) {
        response = "المشاريع التجارية والإدارية تتوفر بمساحات تبدأ من 45 متر بتسهيلات ممتازة في الشيخ زايد والتجمع الخامس. يرجى ترك اسمك في نموذج الموقع وسيتواصل معك مدير القطاع التجاري فوراً.";
      } else if (text.includes("ساحل") || text.includes("بحر")) {
        response = "شاليهات وفيلات الساحل الشمالي ورأس الحكمة والجونة متوفرة الآن بمقدمات تبدأ من 5% وأقساط تصل إلى 8 سنوات مع تشطيب كامل الترا سوبر لوكس وموقع مباشر على البحر.";
      }

      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 1000);
  };

  const suggestions = [
    "الاستفسار عن المشاريع السكنية الفندقية",
    "الفرص الاستثمارية الإدارية والتجارية",
    "مشاريع الساحل الشمالي ورأس الحكمة"
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      
      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-emerald-500/20 active:scale-95 transition-all outline-none"
        aria-label="اتصل بنا عبر الواتساب"
      >
        <MessageSquare className="h-6 w-6 fill-white text-emerald-500" />
      </motion.button>

      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 left-0 w-[calc(100vw-3rem)] max-w-[360px] bg-white rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden text-right flex flex-col font-sans"
          >
            {/* Header */}
            <div className="bg-[#001d2f] text-white p-4 flex flex-row-reverse justify-between items-center shrink-0">
              <div className="flex flex-row-reverse items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center p-1 font-bold text-white shrink-0">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">مستشار لاڤيدا العقاري</h4>
                  <span className="text-[10px] text-secondary-fixed block">● متصل الآن ومستعد لخدمتك</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body messages area */}
            <div className="flex-1 max-h-[240px] overflow-y-auto p-4 space-y-3 bg-surface/50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  } text-xs`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed text-right font-medium ${
                      msg.isBot
                        ? "bg-[#f0eded] text-[#1c1b1b]"
                        : "bg-[#25D366] text-white rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggesters Panel */}
            <div className="p-3 border-t bg-surface-container-low shrink-0 space-y-2">
              <span className="text-[10px] text-on-surface-variant font-bold block pb-1">
                اضغط على خيار جاهز للاستفسار فوراً:
              </span>
              <div className="flex flex-col gap-1.5 align-right">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="text-right text-[11px] text-primary hover:text-secondary font-semibold bg-white border border-outline-variant/30 px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer block"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard inputs area */}
            <div className="p-3 border-t flex flex-row-reverse items-center gap-2 bg-white shrink-0">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(userInput)}
                className="w-full bg-surface-container-low text-xs p-2.5 rounded-lg border border-outline-variant/30 outline-none focus:border-[#25D366]"
                placeholder="اكتب رسالتك الاستشارية هنا..."
              />
              <button
                onClick={() => handleSendMessage(userInput)}
                className="p-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-all cursor-pointer shadow-md"
              >
                <Send className="h-4 w-4 transform rotate-180" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
