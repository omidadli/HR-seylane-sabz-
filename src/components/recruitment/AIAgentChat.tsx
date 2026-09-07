import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage, Candidate, JobPosting } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Mail,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Radar as RadarIcon,
  RefreshCw,
} from 'lucide-react';

interface AIAgentChatProps {
  candidates: Candidate[];
  jobs: JobPosting[];
  activeJobId?: string;
  onApproveEmailDraft?: (draft: any) => void;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({
  candidates,
  jobs,
  activeJobId,
  onApproveEmailDraft,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      text: `سلام و احترام. من دستیار هوشمند استخدام و سنجش شایستگی‌های سازمان شما (مبتنی بر مدل Gemini با قابلیت فراخوانی ابزارها) هستم.

من می‌توانم درخواست‌های استخدامی شما را به زبان فارسی تحلیل و اجرا کنم:
• تحلیل شرح شغل و استخراج معیارهای وزنی
• ارزیابی و امتیازدهی به رزومه‌ها با ذکر نقل‌قول مستقیم از متن رزومه
• دسته‌بندی کارجویان: اولویت مصاحبه (+۷) / نیازمند بررسی (۵-۷) / رد اولیه (<۵)
• مقایسه تطبیقی نامزدها در قالب جدول و نمودار چندمحوره رادار
• نگارش پیش‌نویس محترمانه ایمیل دعوت یا رد (هرگز ارسال خودکار نمی‌شود، فقط برای تایید شماست)`,
      timestamp: '۱۰:۳۰',
      suggestedActions: [
        'مقایسه کاندیداهای موقعیت فرانت‌اند در نمودار رادار',
        'تحلیل موقعیت شغلی و استخراج معیارهای وزنی',
        'تنظیم پیش‌نویس ایمیل دعوت برای نیلوفر رضوانی',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [approvedDraftIds, setApprovedDraftIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: AgentMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          jobId: activeJobId || 'job-1',
        }),
      });

      if (!res.ok) throw new Error('پاسخی از سرور دریافت نشد');
      const data = await res.json();

      const agentMsg: AgentMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: data.text || 'پاسخ پردازش شد.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        radarData: data.radarData,
        emailDraftPreview: data.emailDraftPreview,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const errorMsg: AgentMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'agent',
        text: 'متاسفانه در پردازش درخواست خطایی رخ داد. لطفاً دوباره تلاش نمایید.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDraft = (msgId: string, draft: any) => {
    setApprovedDraftIds((prev) => [...prev, msgId]);
    if (onApproveEmailDraft) onApproveEmailDraft(draft);
  };

  // Helper to format radar chart data for Recharts
  const prepareRechartsData = (radarData: NonNullable<AgentMessage['radarData']>) => {
    return radarData.criteria.map((crit) => {
      const row: any = { criterion: crit };
      radarData.candidates.forEach((candName) => {
        row[candName] = radarData.scores[candName]?.[crit] || 6.5;
      });
      return row;
    });
  };

  const radarColors = ['#059669', '#2563eb', '#d97706', '#9333ea'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[720px] overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200 backdrop-blur-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              <span>دستیار هوشمند استخدام (Gemini AI Agent)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-normal">
                Function Calling Active
              </span>
            </div>
            <div className="text-xs text-emerald-200/80">
              ارزیابی رزومه، امتیازدهی، مقایسه رادار و تنظیم پیش‌نویس ایمیل
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSend('معیارهای اصلی شغل فعلی را دوباره استخراج کن')}
          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحلیل مجدد شاخص‌ها</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAgent ? 'mr-0 ml-auto' : 'mr-auto ml-0 flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isAgent
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-700 text-white shadow-xs'
                }`}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-3 flex-1">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isAgent
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>

                  <div
                    className={`mt-2 text-[10px] text-left font-medium ${
                      isAgent ? 'text-slate-400' : 'text-emerald-200'
                    }`}
                  >
                    {toPersianDigits(msg.timestamp)}
                  </div>
                </div>

                {/* Optional Radar Chart Visualization */}
                {msg.radarData && (
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
                      <RadarIcon className="w-4 h-4 text-emerald-600" />
                      <span>نمودار رادار مقایسه تطبیقی شایستگی‌ها:</span>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={prepareRechartsData(msg.radarData)}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis
                            dataKey="criterion"
                            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Vazirmatn' }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#cbd5e1" />
                          {msg.radarData.candidates.map((candName, idx) => (
                            <Radar
                              key={candName}
                              name={candName}
                              dataKey={candName}
                              stroke={radarColors[idx % radarColors.length]}
                              fill={radarColors[idx % radarColors.length]}
                              fillOpacity={0.25}
                            />
                          ))}
                          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Vazirmatn', paddingTop: '10px' }} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quick Comparative Table */}
                    <div className="mt-3 overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-right text-[11px]">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="p-2 font-bold">شاخص ارزیابی</th>
                            {msg.radarData.candidates.map((c) => (
                              <th key={c} className="p-2 font-bold text-center">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {msg.radarData.criteria.map((crit) => (
                            <tr key={crit} className="hover:bg-slate-50/70">
                              <td className="p-2 font-medium">{crit}</td>
                              {msg.radarData!.candidates.map((cand) => (
                                <td key={cand} className="p-2 text-center font-bold text-emerald-800">
                                  {toPersianDigits(msg.radarData!.scores[cand]?.[crit] || '-')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Optional Email Draft Card (NEVER auto-sent) */}
                {msg.emailDraftPreview && (
                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span>پیش‌نویس ایمیل سازمانی (آماده بررسی و تایید مدیر)</span>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        پیش‌نویس تاییدنشده
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">گیرنده:</span>{' '}
                        {msg.emailDraftPreview.candidateName} ({msg.emailDraftPreview.candidateEmail})
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">موضوع ایمیل:</span>{' '}
                        {msg.emailDraftPreview.subject}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {msg.emailDraftPreview.body}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>ایمیل به صورت خودکار ارسال نمی‌شود و نیاز به تایید دارد.</span>
                      </div>

                      <button
                        type="button"
                        disabled={approvedDraftIds.includes(msg.id)}
                        onClick={() => handleApproveDraft(msg.id, msg.emailDraftPreview)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          approvedDraftIds.includes(msg.id)
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                          {approvedDraftIds.includes(msg.id)
                            ? 'تایید و در کارتابل ارسال ثبت شد'
                            : 'تایید پیش‌نویس'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(action)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-600">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>دستیار هوشمند Gemini در حال تحلیل و اجرای ابزارهاست...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="دستور یا پرسش خود را به فارسی بنویسید (مثلاً: کارجویان برتر را با هم مقایسه کن)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>ارسال</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
