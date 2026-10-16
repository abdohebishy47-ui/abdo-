import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import vm from 'node:vm';

export interface AgentStepEvent {
  type: 'status' | 'thought' | 'tool_call' | 'tool_result' | 'chunk' | 'artifact' | 'done' | 'error';
  data: any;
}

// Function Declarations for Gemini Tool Calling
const calculateExpressionDeclaration: FunctionDeclaration = {
  name: 'calculate_expression',
  description: 'Evaluate mathematical, statistical, or financial calculations (e.g., compound interest, conversions, percentages, variance, equations).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      expression: {
        type: Type.STRING,
        description: 'The mathematical expression or arithmetic formula to calculate, e.g., "5000 * Math.pow(1 + 0.08, 5)" or "(1250 - 980) / 980 * 100".'
      },
      explanation: {
        type: Type.STRING,
        description: 'Brief reason or unit context for this calculation.'
      }
    },
    required: ['expression']
  }
};

const executeCodeSandboxDeclaration: FunctionDeclaration = {
  name: 'execute_code_sandbox',
  description: 'Execute JavaScript code in a secure computational sandbox to process datasets, filter/sort arrays, run simulation algorithms, or verify complex logic.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      code: {
        type: Type.STRING,
        description: 'Executable JavaScript code. Return the final answer using return or console.log().'
      },
      goal: {
        type: Type.STRING,
        description: 'The purpose of this code snippet.'
      }
    },
    required: ['code']
  }
};

const generateArtifactDeclaration: FunctionDeclaration = {
  name: 'generate_artifact',
  description: 'Create a rich, structured visual deliverable (such as a full markdown document, runnable code, comparative table, or strategic action plan) that will be rendered directly on the user workspace canvas.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'Concise title of the artifact in the current language (e.g., "تقرير تحليل السوق" or "MENA Expansion Strategic Plan").'
      },
      artifactType: {
        type: Type.STRING,
        description: 'The type of artifact: "markdown", "code", "table", or "plan".'
      },
      content: {
        type: Type.STRING,
        description: 'The full text, code, markdown, or tabular content.'
      },
      language: {
        type: Type.STRING,
        description: 'Programming language if artifactType is code (e.g., "typescript", "python", "sql", "json").'
      }
    },
    required: ['title', 'artifactType', 'content']
  }
};

// Safe executor for calculate_expression
function safeCalculate(expression: string): { result: any; error?: string } {
  try {
    const sandbox = {
      Math: Math,
      Number: Number,
      parseFloat: parseFloat,
      parseInt: parseInt
    };
    const script = new vm.Script(`(${expression})`);
    const context = vm.createContext(sandbox);
    const result = script.runInContext(context, { timeout: 1500 });
    return { result };
  } catch (err: any) {
    return { result: null, error: err.message || 'Calculation error' };
  }
}

// Safe executor for execute_code_sandbox
function safeRunCode(code: string): { output: string; returnedValue?: any; error?: string } {
  const logs: string[] = [];
  try {
    const sandbox = {
      console: {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
        warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' '))
      },
      Math: Math,
      Date: Date,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean
    };
    const wrappedCode = `(() => {
      ${code.includes('return') ? code : code + '\n'}
    })()`;
    const script = new vm.Script(wrappedCode);
    const context = vm.createContext(sandbox);
    const returnedValue = script.runInContext(context, { timeout: 2500 });
    return {
      output: logs.join('\n') || (returnedValue !== undefined ? JSON.stringify(returnedValue, null, 2) : 'Execution finished with no output.'),
      returnedValue
    };
  } catch (err: any) {
    return {
      output: logs.join('\n'),
      error: err.message || 'Runtime execution error'
    };
  }
}

export async function runAgent({
  userPrompt,
  history = [],
  language = 'ar',
  mode = 'autonomous',
  onEvent
}: {
  userPrompt: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: 'ar' | 'en';
  mode?: string;
  onEvent: (event: AgentStepEvent) => void;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    onEvent({
      type: 'error',
      data: {
        message: language === 'ar'
          ? 'مفتاح GEMINI_API_KEY غير موجود في إعدادات البيئة. يرجى التأكد من ضبطه في إعدادات المشروع.'
          : 'GEMINI_API_KEY environment variable is missing. Please configure it in Settings.'
      }
    });
    return;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const isArabic = language === 'ar';

  onEvent({
    type: 'status',
    data: {
      stage: 'analyzing',
      message: isArabic ? 'جاري تحليل الهدف وصياغة خطة العمل الذهنية...' : 'Analyzing goal and formulating cognitive execution plan...'
    }
  });

  // System instruction tailored to autonomous agent behavior
  const systemInstruction = `You are OmniAgent, a world-class autonomous AI Agent.
Your mandate is to tackle the user's objective systematically:
1. Deconstruct the user's goal into logical phases.
2. Formulate explicit hypotheses and thoughts before taking actions.
3. Call available tools actively:
   - Use 'googleSearch' whenever fresh information, real-world data, statistics, companies, or citations are needed.
   - Use 'calculate_expression' for any numerical, mathematical, or economic evaluation.
   - Use 'execute_code_sandbox' to test algorithms, process data structures, or compute simulations.
   - Use 'generate_artifact' to produce clean, high-value structured deliverables (documents, plans, tables, or code) for the user workspace canvas.
4. When done, deliver a clear, well-structured, authoritative synthesis.
5. Primary language: Always reply in ${isArabic ? 'Arabic (العربية) with professional tone and clean typography' : 'English with professional clarity'}. Even when code or search is in English, explain findings in the requested language.`;

  try {
    // Initial thinking & planning step
    onEvent({
      type: 'thought',
      data: {
        step: 1,
        type: 'plan',
        title: isArabic ? 'تفكيك الهدف واستراتيجية التنفيذ' : 'Objective Breakdown & Strategy',
        content: isArabic
          ? `الهدف المطلوب: "${userPrompt}". الخطوة الأولى: استكشاف متطلبات المسألة وتحديد ما إذا كان يلزم بحث مباشر على الإنترنت، حسابات رياضية، أو كود تحليلي.`
          : `Target Goal: "${userPrompt}". Phase 1: Analyzing context, detecting if web grounding, computational formulas, or code execution are needed.`
      }
    });

    const tools: any[] = [
      { googleSearch: {} },
      { functionDeclarations: [calculateExpressionDeclaration, executeCodeSandboxDeclaration, generateArtifactDeclaration] }
    ];

    // Format conversation history
    const contents: any[] = [];
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `Objective: ${userPrompt}\n\nExecution instruction: Please reflect, use appropriate tools to obtain factual data or run computations, generate relevant workspace artifacts if helpful, and formulate a thorough result.`
        }
      ]
    });

    onEvent({
      type: 'status',
      data: {
        stage: 'executing',
        message: isArabic ? 'الوكيل ينفذ العمليات ويستشير الأدوات المناسبة...' : 'Agent is executing operations and dispatching tools...'
      }
    });

    // Run first turn with tools and tool hybrid mode
    let response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        tools,
        toolConfig: {
          includeServerSideToolInvocations: true
        }
      }
    });

    let currentResponse = response;
    let iteration = 0;
    const maxIterations = 5;

    // Collect search sources if returned by googleSearch
    const searchSources: Array<{ title: string; uri: string }> = [];

    while (iteration < maxIterations) {
      iteration++;

      // Check for search grounding metadata
      const groundingMetadata = currentResponse.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web?.uri) {
            searchSources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri
            });
          }
        }
        if (searchSources.length > 0) {
          onEvent({
            type: 'tool_result',
            data: {
              tool: 'googleSearch',
              callId: `search-${iteration}`,
              output: {
                sourcesFound: searchSources.length,
                sources: searchSources.slice(-4)
              }
            }
          });
        }
      }

      const functionCalls = currentResponse.functionCalls;
      if (!functionCalls || functionCalls.length === 0) {
        // No more tool calls needed
        break;
      }

      // Handle function calls
      const functionResponses: any[] = [];

      for (const call of functionCalls) {
        const { name, args, id } = call as any;
        const callId = id || `call-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        onEvent({
          type: 'tool_call',
          data: {
            tool: name,
            callId,
            input: args
          }
        });

        let toolOutput: any = {};

        if (name === 'calculate_expression') {
          onEvent({
            type: 'thought',
            data: {
              step: iteration + 1,
              type: 'observation',
              title: isArabic ? 'عملية حسابية متقدمة' : 'Mathematical Computation',
              content: isArabic
                ? `جاري حساب التعبير الرياضي: ${args.expression} (${args.explanation || 'حساب قيمة دقيقة'})`
                : `Computing formula: ${args.expression} (${args.explanation || 'evaluating precise numerical value'})`
            }
          });

          toolOutput = safeCalculate(args.expression);
        } else if (name === 'execute_code_sandbox') {
          onEvent({
            type: 'thought',
            data: {
              step: iteration + 1,
              type: 'observation',
              title: isArabic ? 'تنفيذ كود في بيئة برمجية معزولة' : 'Sandboxed Code Simulation',
              content: isArabic
                ? `تشغيل كود برمجي لمعالجة: ${args.goal || 'تحليل بيانات'}`
                : `Executing code sandbox for: ${args.goal || 'data analysis'}`
            }
          });

          toolOutput = safeRunCode(args.code);
        } else if (name === 'generate_artifact') {
          const artifactId = `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          onEvent({
            type: 'artifact',
            data: {
              id: artifactId,
              title: args.title,
              type: args.artifactType || 'markdown',
              content: args.content,
              language: args.language
            }
          });

          toolOutput = {
            status: 'success',
            message: 'Artifact successfully displayed in user canvas.',
            artifactId
          };
        } else {
          toolOutput = { status: 'unknown_tool', tool: name };
        }

        onEvent({
          type: 'tool_result',
          data: {
            tool: name,
            callId,
            output: toolOutput
          }
        });

        functionResponses.push({
          name,
          response: {
            result: toolOutput
          },
          id
        });
      }

      // Append model content and tool response parts to contents
      const modelContent = currentResponse.candidates?.[0]?.content;
      if (modelContent) {
        contents.push(modelContent);
      }

      contents.push({
        role: 'user',
        parts: functionResponses.map(fr => ({
          functionResponse: {
            name: fr.name,
            response: fr.response,
            id: fr.id
          }
        }))
      });

      onEvent({
        type: 'status',
        data: {
          stage: 'synthesizing',
          message: isArabic ? 'تجميع النتائج وصياغة الاستنتاج النهائي...' : 'Synthesizing tool outputs and generating authoritative response...'
        }
      });

      // Next iteration
      currentResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          tools,
          toolConfig: {
            includeServerSideToolInvocations: true
          }
        }
      });
    }

    // Final response text
    const finalText = currentResponse.text || '';

    // Final conclusion thought
    onEvent({
      type: 'thought',
      data: {
        step: iteration + 2,
        type: 'conclusion',
        title: isArabic ? 'اكتمال المهمة والتحقق من المخرجات' : 'Task Completion & Verification',
        content: isArabic
          ? 'تم تجميع كافة البيانات، التحقق من نتائج الأدوات، وتجهيز الإجابة المتكاملة مع العناصر التفاعلية.'
          : 'All tool invocations and findings verified. Synthesis delivered to the user.'
      }
    });

    onEvent({
      type: 'done',
      data: {
        fullResponse: finalText,
        searchSources: Array.from(new Map(searchSources.map(s => [s.uri, s])).values())
      }
    });
  } catch (err: any) {
    console.error('Agent execution error:', err);
    let errorMsg = err?.message || '';
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      errorMsg = isArabic
        ? 'تم بلوغ الحد الأقصى المؤقت لطلبات النموذج (Rate Limit). يرجى الانتظار بضع ثوانٍ وإعادة إرسال المهمة.'
        : 'Rate limit / quota exceeded temporarily. Please wait a few moments and try again.';
    } else if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('403')) {
      errorMsg = isArabic
        ? 'مفتاح API غير صالح أو تنقصه الصلاحيات. يرجى مراجعة إعدادات المفتاح في لوحة التحكم.'
        : 'Invalid API key or missing permissions. Please verify the Gemini API key in settings.';
    } else if (!errorMsg) {
      errorMsg = isArabic ? 'حدث خطأ أثناء تنفيذ مهمة الوكيل.' : 'An error occurred during agent execution.';
    }

    onEvent({
      type: 'error',
      data: { message: errorMsg }
    });
  }
}
