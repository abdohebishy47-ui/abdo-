export const translations = {
  ar: {
    appName: 'OmniAgent',
    appSubtitle: 'وكيل الذكاء الاصطناعي متعدد الأدوات',
    tagline: 'وكيل مستقل مزود بخطوات تفكير، بحث متقدم، تنفيذ كود، وحسابات ذكية',
    nav: {
      workspace: 'مساحة العمل',
      capabilities: 'قدرات الوكيل',
      artifacts: 'المخرجات والملفات',
      sessions: 'الجلسات السابقة',
      share: 'مشاركة ورابط التطبيق',
      getApk: 'تحميل ملف APK',
      newSession: 'جلسة جديدة'
    },
    modes: {
      autonomous: {
        name: 'وكيل عام مستقل',
        desc: 'يحلل الهدف وينفذ الأدوات والبحث والبرمجة تلقائياً'
      },
      research: {
        name: 'بحث استقصائي معمق',
        desc: 'يركز على جمع المعلومات وتدقيق المصادر والبيانات'
      },
      analytics: {
        name: 'تحليل وحسابات رقمية',
        desc: 'معادلات رياضية، توقعات مالية، وإحصائيات دقيقة'
      },
      code: {
        name: 'مطور ومحاكي كود',
        desc: 'كتابة واختبار خوارزميات برمجية في بيئة تشغيلية'
      }
    },
    chat: {
      inputPlaceholder: 'اكتب مهمتك أو استفسارك هنا (مثال: احسب ميزانية إطلاق تطبيق مع تحليل السوق)...',
      send: 'إرسال للمهمة',
      running: 'الوكيل يعمل...',
      starterPromptsTitle: 'مهام مقترحة للبدء السريع:',
      noMessages: 'مرحباً بك في مساحة عمل وكيل الذكاء الاصطناعي',
      noMessagesSub: 'حدد هدفك أو اختر إحدى المهام المقترحة أدناه وسيقوم الوكيل بالتفكير والتنفيذ خطوة بخطوة.',
      sourcesTitle: 'المصادر المرجعية للبحث:',
      copied: 'تم النسخ!',
      copy: 'نسخ الإجابة',
      stepsCount: 'خطوات تفكير',
      toolsCount: 'أدوات منفذة'
    },
    inspector: {
      title: 'مركز المراقبة والتحليل',
      subtitle: 'مسار التفكير واستدعاء الأدوات والمخرجات اللحظية',
      tabs: {
        timeline: 'مسار التفكير (Chain of Thought)',
        tools: 'سجل الأدوات المنفذة',
        artifacts: 'المخرجات والملفات'
      },
      thinking: 'تفكير استراتيجي',
      executingTool: 'استدعاء أداة',
      emptyTimeline: 'ستظهر خطوات تفكير الوكيل وقراراته المنطقية هنا فور بدء المهمة.',
      emptyTools: 'لم يتم استدعاء أدوات حتى الآن.',
      emptyArtifacts: 'لم يتم إنشاء مستندات أو مخرجات مستقلة بعد.',
      toolDetails: 'تفاصيل المدخلات والمخرجات:',
      input: 'المدخلات:',
      output: 'النتيجة:'
    },
    artifacts: {
      title: 'المستندات والمخرجات المكتملة',
      copy: 'نسخ المحتوى',
      download: 'تحميل كملف',
      typeDoc: 'مستند تحليلي',
      typeCode: 'كود برمجي',
      typeTable: 'جدول مقارنة',
      typePlan: 'خطة عمل استراتيجية',
      viewCanvas: 'عرض في اللوحة'
    },
    capabilitiesModal: {
      title: 'أدوات وقدرات وكيل الذكاء الاصطناعي',
      desc: 'تم تزويد الوكيل بمجموعة متكاملة من الأدوات التقنية لتنفيذ المهام المعقدة:',
      tools: [
        {
          name: 'Google Search Grounding',
          badge: 'بحث مباشر',
          desc: 'الوصول إلى أحدث المعلومات على شبكة الإنترنت والتحقق من الحقائق والبيانات الحديثة مع التوثيق والمصادر.'
        },
        {
          name: 'Math & Statistical Evaluator',
          badge: 'محرك حسابي',
          desc: 'حساب المعادلات الرياضية المعقدة، الفائدة المركبة، التقييمات المالية، والتحليلات الإحصائية بدقة عالية.'
        },
        {
          name: 'Sandboxed Code Execution',
          badge: 'بيئة برمجية',
          desc: 'تشغيل كود جافاسكريبت في بيئة آمنة لمعالجة وتصفية مجموعات البيانات واختبار الخوارزميات الحسابية.'
        },
        {
          name: 'Structured Artifact Generator',
          badge: 'مولد مخرجات',
          desc: 'توليد تقارير ماركداون، جداول منظمة، خطط استراتيجية، وأكواد قابلة لإعادة الاستخدام والتحميل مباشرة.'
        }
      ]
    },
    starters: [
      {
        title: 'تحليل سوق التجارة الإلكترونية في الشرق الأوسط',
        prompt: 'ابحث عن أحدث إحصائيات نمو التجارة الإلكترونية في السعودية والإمارات لعام 2026، واعمل لي تقرير مقارن مع خطة استراتيجية للمنافسة.'
      },
      {
        title: 'خطة ميزانية ودراسة جدوى تطبيق SaaS',
        prompt: 'احسب تكاليف إطلاق منصة سحابية (استضافة خوادم، تسويق، فريق مصغر) وتوقع نقطة التعادل المالي بافتراض 500 مشترك بسعر 29 دولار شهرياً.'
      },
      {
        title: 'خوارزمية حساب العائد الاستثماري ROI',
        prompt: 'اكتب وشغّل في بيئة الكود خوارزمية لحساب العائد الاستثماري السنوي المركب لمشروع على مدار 5 سنوات مع نسبة تضخم 4%، مع جدول بالنتائج.'
      },
      {
        title: 'استقصاء تقنيات الذكاء الاصطناعي لخدمة العملاء',
        prompt: 'ابحث عن أفضل ممارسات استخدام الذكاء الاصطناعي التوليدي في الدعم الفني، وأنشئ لي خطة تدفق عمل للمحادثات التلقائية.'
      }
    ]
  },
  en: {
    appName: 'OmniAgent',
    appSubtitle: 'Autonomous Multi-Tool AI Agent',
    tagline: 'Autonomous agent with reasoning chains, live search grounding, code sandbox, and math engine',
    nav: {
      workspace: 'Workspace',
      capabilities: 'Capabilities',
      artifacts: 'Artifacts',
      sessions: 'History',
      share: 'Share & Links',
      getApk: 'Get Android APK',
      newSession: 'New Session'
    },
    modes: {
      autonomous: {
        name: 'Autonomous Agent',
        desc: 'Autonomously plans, investigates, computes, and delivers deliverables'
      },
      research: {
        name: 'Deep Research',
        desc: 'Focuses on factual grounding, citations, and comprehensive reports'
      },
      analytics: {
        name: 'Math & Analytics',
        desc: 'Evaluates formulas, budget projections, and numerical statistics'
      },
      code: {
        name: 'Code Synthesizer',
        desc: 'Writes and tests algorithms inside a sandboxed execution runtime'
      }
    },
    chat: {
      inputPlaceholder: 'Describe your objective or project (e.g., Analyze SaaS launch budget with market research)...',
      send: 'Dispatch Task',
      running: 'Agent Operating...',
      starterPromptsTitle: 'Suggested Autonomous Tasks:',
      noMessages: 'Welcome to OmniAgent Workspace',
      noMessagesSub: 'Enter an objective or choose a starter template below. The agent will formulate a plan, run tools, and report transparently.',
      sourcesTitle: 'Grounded Web Sources:',
      copied: 'Copied!',
      copy: 'Copy Response',
      stepsCount: 'Reasoning Steps',
      toolsCount: 'Tools Invoked'
    },
    inspector: {
      title: 'Inspector & Telemetry',
      subtitle: 'Cognitive reasoning trace, tool calls, and generated deliverables',
      tabs: {
        timeline: 'Reasoning Trace (CoT)',
        tools: 'Executed Tools',
        artifacts: 'Canvas Artifacts'
      },
      thinking: 'Strategic Reasoning',
      executingTool: 'Tool Invocation',
      emptyTimeline: 'Agent cognitive steps and hypotheses will appear here dynamically.',
      emptyTools: 'No tools invoked in this session yet.',
      emptyArtifacts: 'No structured artifacts generated yet.',
      toolDetails: 'Input & Output Payload:',
      input: 'Input:',
      output: 'Output:'
    },
    artifacts: {
      title: 'Delivered Artifacts',
      copy: 'Copy Content',
      download: 'Download File',
      typeDoc: 'Markdown Document',
      typeCode: 'Source Code',
      typeTable: 'Comparative Table',
      typePlan: 'Strategic Plan',
      viewCanvas: 'View in Canvas'
    },
    capabilitiesModal: {
      title: 'Agent Tooling & Capabilities',
      desc: 'The agent possesses specialized real-world execution tools to accomplish complex goals:',
      tools: [
        {
          name: 'Google Search Grounding',
          badge: 'Live Web Search',
          desc: 'Accesses up-to-date web information, verifies market trends and facts, and returns direct source citations.'
        },
        {
          name: 'Math & Statistical Evaluator',
          badge: 'Compute Engine',
          desc: 'Evaluates mathematical formulas, calculates compound interest, financial modeling, and variance with precision.'
        },
        {
          name: 'Sandboxed Code Execution',
          badge: 'Runtime Sandbox',
          desc: 'Runs JavaScript algorithms in an isolated runtime environment to filter datasets and simulate computational problems.'
        },
        {
          name: 'Structured Artifact Generator',
          badge: 'Artifact Canvas',
          desc: 'Emits structured deliverables such as detailed markdown briefs, tabular summaries, project plans, and runnable code.'
        }
      ]
    },
    starters: [
      {
        title: 'MENA E-Commerce Growth Analysis',
        prompt: 'Search for recent e-commerce growth data in Saudi Arabia and the UAE for 2026, compute key CAGR projections, and draft a competitive strategic plan.'
      },
      {
        title: 'SaaS Launch Financial Model & Break-even',
        prompt: 'Calculate a complete financial model for a B2B SaaS startup (cloud infrastructure, marketing, lean team) and calculate the break-even point with 500 users at $29/mo.'
      },
      {
        title: 'Algorithm & ROI Compound Simulation',
        prompt: 'Write and execute an algorithm in the code sandbox to simulate a 5-year investment portfolio with 8% nominal yield adjusted for 4% inflation, outputting a year-by-year table.'
      },
      {
        title: 'AI Customer Service Workflow Plan',
        prompt: 'Investigate the latest architectural patterns for autonomous customer support AI agents, and construct a complete markdown implementation plan.'
      }
    ]
  }
};
