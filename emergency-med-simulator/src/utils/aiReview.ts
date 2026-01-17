// GLM AI 毒舌评价生成器
export interface GameReviewData {
  endingTitle: string;
  endingDescription: string;
  keyChoices: string[];
  cardHistory: Array<{
    cardId: string;
    choice: string;
    actualChoice: string;
  }>;
}

// 生成AI毒舌评价
export async function generateAIReview(gameData: GameReviewData): Promise<string> {
  const apiKey = "4a4b4f0a035947afad5c37753da3255c.TRlWSbpVYfpA1Zf3";
  const model = "glm-4-flash"; // 免费模型
  
  // 分析关键选择
  const choiceAnalysis = analyzeChoices(gameData.keyChoices);
  
  const prompt = `你是一个毒舌但幽默的AI评论家，专门评价医学生涯模拟游戏。请根据以下游戏数据，生成一段简短的、刻薄幽默、讽刺属性很高的评价：

游戏结局：${gameData.endingTitle}
结局描述：${gameData.endingDescription}
关键选择路径：${gameData.keyChoices.join('-')}
选择分析：${choiceAnalysis}

要求：
1. 简短（50字以内）
2. 刻薄幽默
3. 讽刺属性高
4. 针对玩家的具体选择路径进行调侃
5. 语言要犀利但不过分
6. 重点分析选择背后的逻辑和结果

请直接输出评价内容，不要加引号或其他格式。`;

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI评价生成失败:', error);
    // 返回默认的毒舌评价
    return getDefaultReview(gameData);
  }
}

// 分析选择路径
function analyzeChoices(choices: string[]): string {
  const choiceMeanings = {
    'A': '理想主义选择',
    'B': '现实主义选择'
  };
  
  const analysis = choices.map((choice, index) => {
    const meanings = ['解剖伦理', '患儿抢救', '罕见病研究', '医闹处理', '药物争议', '基因治疗'];
    return `${meanings[index] || `第${index + 1}个决策`}: ${choiceMeanings[choice as keyof typeof choiceMeanings] || choice}`;
  });
  
  return analysis.join('; ');
}

// 默认评价（当API调用失败时使用）
function getDefaultReview(gameData: GameReviewData): string {
  const reviews = [
    "恭喜你，成功证明了随机点击也能通关医学模拟器！",
    "你的选择路径就像心电图一样，毫无规律可言。",
    "从本科生到院士，你只用了18个决策就完成了别人一辈子的工作，真是医学界的奇迹！",
    "你的决策风格让我想起了急诊科的混乱现场——什么都想要，什么都得不到。",
    "恭喜解锁'佛系医者'成就：随缘治病，随缘升职，随缘获奖。",
    "你的选择路径完美诠释了什么叫'理想很丰满，现实很骨感'。",
    "从你的决策来看，你更适合去当算命先生而不是医生。",
    "你的医学生涯就像过山车，只是没有安全带。"
  ];
  
  return reviews[Math.floor(Math.random() * reviews.length)];
}
