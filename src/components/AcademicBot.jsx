import React, { useState, useRef, useEffect } from 'react';

export default function AcademicBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            text: "مرحباً بك في Pathify! أنا مساعدك الأكاديمي، يمكنني مساعدتك في الخدمات التالية (اضغط على السؤال المطلوب):", 
            isBot: true,
            showOptions: true 
        }
    ]);
    const [loading, setLoading] = useState(false);
    
    // المراجع الخاصة بالتحكم الدقيق في حركة التمرير
    const messagesEndRef = useRef(null);
    const answerRef = useRef(null);

    // دالة التمرير التلقائي لفقاعة الإجابة فور ظهورها
    useEffect(() => {
        if (answerRef.current) {
            answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [messages]); // تعمل فور تغير المصفوفة وظهور الإجابة

    // تمرير مبدئي عند فتح الشات لأول مرة
    useEffect(() => {
        if (isOpen && messages.length === 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [isOpen]);

    const botQuestions = [
        // 1. قسم تسجيل المقررات
        {
            id: 1,
            questionAr: "كيف أقوم بتسجيل المقررات الدراسية؟",
            answerAr: "يمكنك تسجيل المواد عبر الانتقال إلى صفحة 'المقررات الدراسية' (Courses) واختيار المواد المتاحة لمستواك الدراسي الحالي ثم الضغط على تأكيد التسجيل."
        },
        {
            id: 2,
            questionAr: "لماذا لا تظهر لي مادة معينة في قائمة التسجيل؟",
            answerAr: "المقررات تظهر بناءً على مستواك الدراسي الحالي والترم النشط، أو قد تكون المادة غير مفعّلة حالياً من قِبل مسؤول شؤون الطلاب (Admin)."
        },
        // 2. قسم تشكيل الفرق والمشاريع
        {
            id: 3,
            questionAr: "ما هو الحد الأقصى لأعضاء فريق مشروع التخرج؟",
            answerAr: "الحد الأقصى لتشكيل فريق مشروع التخرج هو 6 طلاب فقط كحد أقصى وفقاً للائحة الأكاديمية."
        },
        {
            id: 4,
            questionAr: "كيف أقوم بإنشاء فريق جديد على النظام؟",
            answerAr: "يمكنك إنشاء فريق من خلال الانتقال إلى لوحة التحكم الخاصة بك ثم الضغط على 'بناء فريق' (Create Team) وإضافة زملائك بواسطة أرقامهم الأكاديمية."
        },
        {
            id: 5,
            questionAr: "هل يمكنني الانضمام لأكثر من فريق؟",
            answerAr: "لا، يسمح النظام لكل طالب بالانضمام إلى فريق مشروع تخرج واحد فقط، ولا يمكن التسجيل في فريق آخر إلا بعد مغادرة الفريق الحالي أو حذفه."
        },
        {
            id: 6,
            questionAr: "كيف أقدم فكرة مشروع التخرج? ",
            answerAr: "بعد اكتمال فريقك، يقوم قائد الفريق بالدخول إلى صفحة 'تقديم الفكرة' وكتابة عنوان المشروع ووصفه التفصيلي ثم الضغط على إرسال."
        },
        {
            id: 7,
            questionAr: "ماذا يحدث إذا تم رفض فكرة المشروع؟",
            answerAr: "في حال رفض الفكرة من المشرفين، يظل هيكل فريقك ثابتاً كما هو. يمكنك الدخول وتعديل حقول العنوان والوصف وإعادة إرسال المقترح مجدداً."
        },
        {
            id: 8,
            questionAr: "كيف أعرف أن المشروع تم قبوله نهائياً؟",
            answerAr: "ستتغير حالة المشروع في لوحة تحكم الفريق إلى 'مقبول' (Approved) فور اعتماد الطلب من المسؤول الأعلى (Super Admin)، ويتم توليد معرف فريد للمشروع (Project ID)."
        },
        {
            id: 9,
            questionAr: "ما هي مراحل الموافقة على المشروع؟",
            answerAr: "يمر المشروع بـ 3 مراحل اعتماد متتالية: موافقة المشرف الداخلي، ثم موافقة المشرف الخارجي، وأخيراً الاعتماد النهائي من المسؤول الأعلى (Super Admin)."
        },
        // 3. قسم الملف الشخصي
        {
            id: 10,
            questionAr: "كيف يمكنني تعديل بيانات ملفي الشخصي؟",
            answerAr: "يمكنك تعديل بياناتك الشخصية، تحديث كلمة المرور، أو تغيير الصورة الشخصية عبر الانتقال إلى صفحة 'الملف الشخصي' (Profile) من القائمة الجانبية ثم الضغط على حفظ التغييرات."
        }
    ];

    const handleOptionClick = (questionObj) => {
        if (loading) return;

        // 1. إظهار سؤال المستخدم فوراً
        setMessages(prev => [...prev, { text: questionObj.questionAr, isBot: false }]);
        setLoading(true);

        // 2. إظهار الإجابة بعد 300ms ووسمها بـ isAnswer
        setTimeout(() => {
            setMessages(prev => [...prev, { text: questionObj.answerAr, isBot: true, isAnswer: true }]);
            setLoading(false);

            // 3. إظهار قائمة الأسئلة مجدداً بعد ثانية بدون أي تأثير على السكرول
            setTimeout(() => {
                setMessages(prev => [
                    ...prev, 
                    { 
                        text: "هل لديك استفسار آخر؟ يمكنك الاختيار من القائمة مجدداً:", 
                        isBot: true, 
                        showOptions: true 
                    }
                ]);
            }, 1000);

        }, 300);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans" style={{ direction: 'rtl' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3d6c8a] text-white shadow-xl hover:bg-[#2d526b] transition-all transform active:scale-95 text-2xl"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[370px] h-[500px] rounded-[20px] bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col transition-all duration-300">
                    <div className="bg-[#3d6c8a] p-3.5 text-white text-center shadow-sm">
                        <h3 className="text-base font-bold">Pathify Assistant</h3>
                        <p className="text-[10px] text-slate-200">الدعم الأكاديمي السريع</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
                        {messages.map((msg, index) => {
                            // التحقق مما إذا كانت هذه هي أحدث إجابة مضافة لربط الـ Ref بها
                            const isNewAnswer = msg.isAnswer && index === messages.length - 1;

                            return (
                                <div 
                                    key={index} 
                                    className="space-y-2"
                                    ref={isNewAnswer ? answerRef : null} // ربط الـ Ref بالإجابة فقط
                                >
                                    <div className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] rounded-[16px] px-3.5 py-2 text-xs shadow-sm leading-relaxed ${
                                            msg.isBot 
                                                ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100 text-right' 
                                                : 'bg-[#3d6c8a] text-white rounded-tl-none text-right'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>

                                    {msg.isBot && msg.showOptions && (
                                        <div className="flex flex-col gap-1.5 pr-2 pl-4 transition-all animate-fadeIn">
                                            {botQuestions.map((q) => (
                                                <button
                                                    key={q.id}
                                                    onClick={() => handleOptionClick(q)}
                                                    disabled={loading}
                                                    className="w-full text-right bg-white text-[#3d6c8a] border border-[#3d6c8a]/20 hover:bg-[#3d6c8a]/5 text-[11px] px-3 py-2 rounded-xl shadow-xs transition-all font-medium active:scale-[0.99] disabled:opacity-60"
                                                >
                                                    🔹 {q.questionAr}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-400 rounded-[16px] rounded-tr-none px-3.5 py-2 text-[11px] border border-slate-100 shadow-sm animate-pulse">
                                    جاري جلب الرد...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
                        يرجى اختيار أحد الأسئلة المتاحة في القائمة العلوية للاستعلام الفوري.
                    </div>
                </div>
            )}
        </div>
    );
}