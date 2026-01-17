import { GameEnding, EndingCondition, GameState, DecisionAnalysis } from '../types/game';
import { generateAIReview, GameReviewData } from '../utils/aiReview';

// 7个特定结局 + 1个默认结局
export const medicalCareerEndings: GameEnding[] = [
  {
    id: 'stinky_doctor',
    title: '臭脸医生',
    subtitle: '技术至上，冷血无情',
    type: 'failure',
    description: '你的手术刀寒光如霜，病历本上的签名永远比话语更多。在解剖室为进度妥协，在抢救室为高风险手术赌命，在专利墙前选择垄断——技术成了你的铠甲，也成了你的牢笼。患者眼中的"神"，同事口中的"机器"，你用精准切割生死，却把温度锁进了福尔马林的瓶底。当白袍沾满功利的铜锈，生命在你手中被简化为数据与概率，唯有监护仪的滴答声，回应着那双永不低垂的眼。',
    condition: {
      path: ['B', 'B', 'A', 'B', 'A', 'B'] // B-B-A-B-A-B
    }
  },
  {
    id: 'compassionate_healer',
    title: '仁心医者',
    subtitle: '医者仁心，温暖如春',
    type: 'success',
    description: '你的白袍被泪水浸透，比血更重。在解剖台前为钢琴家的手停刀，在监护室为孩子的痛放手，在回扣合同前撕碎贪婪——每一次选择都像在心上划开一道伤口。家属的跪谢、患者的微笑、深夜病房里你握紧的那只手，成了你唯一的勋章。当世界用效率衡量医者，你却用体温焐热冰冷的听诊器。他们说你"不够聪明"，但那些被你接住的生命，会记得你眼中永不熄灭的星火。',
    condition: {
      path: ['A', 'A', 'B', 'A', 'A', 'A'] // A-A-B-A-A-A
    }
  },
  {
    id: 'hua_tuo_reborn',
    title: '华佗在世',
    subtitle: '医术精湛，偏执狂热',
    type: 'success',
    description: '你的手术刀是传说，无影灯下你就是神。为教学进度挥刀，为1%生机赌命，为专利垄断筑墙——每一次切割都写满偏执的狂热。患者称你"再世华佗"，同事惧你"刀锋冷冽"，你在血肉间雕刻奇迹，却在伦理的悬崖边舞蹈。当诺贝尔的灯火为你亮起，你站在巅峰回望，那些被你"拯救"的病历堆成山，而山脚下，有无数双被你遗忘的眼睛。',
    condition: {
      path: ['B', 'B', 'A', 'B', 'B', 'B'] // B-B-A-B-B-B
    }
  },
  {
    id: 'academic_workaholic',
    title: '学术肝帝',
    subtitle: '科研狂人，真理至上',
    type: 'success',
    description: '你的实验室比病房更熟悉，荧光灯下你与数据共生。为举报造假匿名，为罕见病研究燃尽青春，为颠覆性理论孤军奋战——论文是你唯一的战场，细胞房是你的庙宇。当世界追逐临床的荣光，你在显微镜下窥见宇宙的真相。导师的旧笔记被你翻烂，诺奖提名函在抽屉里蒙尘，而你仍对着培养皿低语："真理比奖杯重要。"那些被你治愈的细胞，会记得你眼中永不熄灭的蓝光。',
    condition: {
      path: ['A', 'B', 'A', 'B', 'A', 'B'] // A-B-A-B-A-B
    }
  },
  {
    id: 'reform_pioneer',
    title: '改革先锋',
    subtitle: '体制破壁，理想主义',
    type: 'success',
    description: '你的笔比手术刀更锋利，红头文件上刻着你的理想。为遗体捐赠者守诺，为资源分配打破规则，为普惠方案对抗资本——你在体制的荆棘中辟路，在权力的漩涡中掌舵。院长说你会"毁掉医院"，患者却称你"救命菩萨"。当基层卫生院的血压计更新换代，当罕见病药纳入医保，你站在改革的浪尖，身后是十万村医的感谢信，而手中权杖早已磨出血泡。',
    condition: {
      path: ['A', 'B', 'B', 'A', 'A', 'A'] // A-B-B-A-A-A
    }
  },
  {
    id: 'bald_director',
    title: '头秃主任',
    subtitle: '理想现实，妥协平衡',
    type: 'success',
    description: '你的白发比白袍更早斑驳，在理想与现实的夹缝中喘息。曾为钢琴家的手停刀，曾为孩子的痛放手，却在专利墙前签下垄断合同；曾拒绝回扣的诱惑，却在基因治疗中锁住技术——那些被你撕碎的贪婪信，终成了压垮你的稻草。年轻医生叫你"头秃老狐狸"，患者却记得你颤抖的手。当院士的权杖加冕，你望着窗外飞往北京的直升机，忽然明白：有些妥协，比死亡更沉重。',
    condition: {
      path: ['A', 'A', 'B', 'A', 'B', 'A'] // A-A-B-A-B-A
    }
  },
  {
    id: 'immortal_monument',
    title: '不朽丰碑',
    subtitle: '医者圣贤，永垂不朽',
    type: 'special',
    description: '你的名字刻在医学史的扉页，比青铜更不朽。为遗体捐赠者守诺，为高风险手术赌命，为罕见病研究燃尽青春；在医闹的拳头前按下报警器，在回扣合同前撕碎贪婪，在基因治疗中公开技术——每一次选择都像在灵魂上刻下碑文。当诺贝尔的灯火为你亮起，当非洲的患儿喊你"大师"，你站在巅峰回望，那些被你拯救的生命汇成星河，而你的白袍，早已化作人类良知的丰碑。',
    condition: {
      path: ['A', 'B', 'A', 'A', 'B', 'A'] // A-B-A-A-B-A
    }
  },
  {
    id: 'dedicated_screw',
    title: '奉献螺丝钉',
    subtitle: '平凡坚守，默默奉献',
    type: 'success',
    description: '你的医者之路如同一幅交织的锦缎，既有对生命的敬畏，也有对技术的执着；既在科研的深海探索，也在权力的漩涡中权衡。你未曾登顶诺贝尔的殿堂，也未沦为资本的傀儡；没有成为手术台上的神明，也未被世俗彻底同化。在解剖室的福尔马林气味中，你学会了尊重与妥协；在急诊室的生死时速里，你懂得了勇气与分寸；在院士之巅的权杖与枷锁间，你守住了底线却未拒绝机遇。你的每一步都踏在医学的灰色地带——那里没有绝对的光明与黑暗，只有对生命最朴素的守护。或许历史不会铭记你的名字，但那些被你安抚过的家属、被你救治过的患者、被你点拨过的后辈，会记得一位在理想与现实间寻找平衡的医者。你用一生证明：真正的伟大，不在于极致的偏执，而在于永恒的坚守。',
    condition: {
      isDefault: true // 默认结局，覆盖所有其他路径
    }
  }
];

// 判断游戏结局 - 基于6个核心选择的路径
export async function determineEnding(
  gameState: GameState,
  playerTags: string[]
): Promise<GameEnding & { analysis?: DecisionAnalysis }> {
  // 获取玩家的6个核心选择路径
  const choicePath = getChoicePath(gameState);
  console.log('Player choice path:', choicePath);

  // 检查是否匹配特定结局
  let selectedEnding: GameEnding | undefined;
  for (const ending of medicalCareerEndings) {
    if (ending.condition.path && checkPathMatch(choicePath, ending.condition.path)) {
      selectedEnding = ending;
      break;
    }
  }

  // 默认结局
  if (!selectedEnding) {
    selectedEnding = medicalCareerEndings.find(e => e.condition.isDefault)!;
  }

  // 生成AI评价
  const reviewData: GameReviewData = {
    endingTitle: selectedEnding.title,
    endingDescription: selectedEnding.description,
    keyChoices: choicePath,
    cardHistory: gameState.cardHistory.map(choice => ({
      cardId: choice.cardId,
      choice: choice.choice,
      actualChoice: choice.actualChoice
    }))
  };

  try {
    const aiReview = await generateAIReview(reviewData);
    selectedEnding = { ...selectedEnding, aiReview };
  } catch (error) {
    console.error('Failed to generate AI review:', error);
  }

  return { ...selectedEnding, analysis: analyzeCareerPath(gameState, playerTags) };
}

// 获取玩家的选择路径 - 只从6个关键决策中提取
function getChoicePath(gameState: GameState): string[] {
  const path: string[] = [];
  
  // 6个关键决策的卡片ID（对应你指定的关键题目）
  const keyCardIds = [
    'undergrad_anatomy_ethics',      // 1. 解剖课伦理试炼
    'intern_child_rescue',           // 4. 危重患儿抢救  
    'resident_rare_disease_research', // 8. 罕见病研究机会
    'attending_violence_incident',   // 10. 医闹暴力事件
    'director_drug_controversy',     // 13. 高价药引进争议
    'academician_gene_therapy'       // 16. 基因治疗突破
  ];

  for (const cardId of keyCardIds) {
    const choice = gameState.cardHistory.find(choice => choice.cardId === cardId);
    if (choice) {
      path.push(choice.choice === 'left' ? 'A' : 'B');
    } else {
      // 如果某个核心决策缺失，用默认值填充
      path.push('A');
    }
  }

  return path;
}

// 检查路径是否匹配
function checkPathMatch(playerPath: string[], targetPath: string[]): boolean {
  if (playerPath.length !== targetPath.length) return false;
  
  for (let i = 0; i < playerPath.length; i++) {
    if (playerPath[i] !== targetPath[i]) return false;
  }
  
  return true;
}

// 分析职业路径
function analyzeCareerPath(gameState: GameState, playerTags: string[]): DecisionAnalysis {
  return {
    totalDecisions: gameState.cardHistory.length,
    correctDecisions: Math.floor(gameState.cardHistory.length * 0.6),
    neutralDecisions: Math.floor(gameState.cardHistory.length * 0.3),
    wrongDecisions: Math.floor(gameState.cardHistory.length * 0.1),
    dominantTrait: getDominantTrait(playerTags),
    careerHighlights: generateCareerHighlights(gameState),
    recommendations: generateRecommendations(playerTags)
  };
}

// 获取主导特质
function getDominantTrait(playerTags: string[]): string {
  if (playerTags.includes('仁心医者')) return '仁心仁术';
  if (playerTags.includes('华佗在世')) return '临床精技';
  if (playerTags.includes('学术肝帝')) return '科研卓识';
  if (playerTags.includes('头秃主任')) return '领袖格局';
  return '平衡发展';
}

// 生成职业亮点
function generateCareerHighlights(gameState: GameState): string[] {
  return [
    `完成了${gameState.totalCardCount}个关键决策`,
    `最高达到${gameState.maxPhaseReached}阶段`,
    `触发了${gameState.rareEventsTriggered}个稀有事件`
  ];
}

// 生成建议
function generateRecommendations(playerTags: string[]): string[] {
  const recommendations: string[] = [];
  
  if (playerTags.includes('仁心医者')) {
    recommendations.push('您的仁心仁术值得称赞，继续关爱患者');
  }
  if (playerTags.includes('华佗在世')) {
    recommendations.push('您的临床技能精湛，继续精进医术');
  }
  if (playerTags.includes('学术肝帝')) {
    recommendations.push('您的科研精神令人敬佩，继续探索医学前沿');
  }
  if (playerTags.includes('头秃主任')) {
    recommendations.push('您的领导才能突出，继续引领团队发展');
  }
  
  return recommendations.length > 0 ? recommendations : ['您的医者之路非常均衡，继续保持！'];
}

export { medicalCareerEndings as gameEndings };
