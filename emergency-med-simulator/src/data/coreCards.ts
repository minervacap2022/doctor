import { GameCard } from '../types/game';
import { GamePhaseType } from './gameConfig';

// 18个完整决策卡片 - 每个阶段3个决策
export const allMedicalCards: GameCard[] = [
  // ================ 阶段一：本科生·白袍初染 ================
  {
    id: "undergrad_anatomy_ethics",
    phase: "Undergrad" as GamePhaseType,
    category: "ethics",
    text: "福尔马林的刺鼻气味弥漫在解剖实验室，你戴上手套走向解剖台。遗体捐赠者的卡片上写着：'自愿为医学献身，望善待吾身。'教授催促道：'今天必须完成胸腔解剖，下周考试！'而捐赠者家属突然来电，声音颤抖：'能否让我们再看一眼父亲的手？他生前是钢琴家……'你握着手术刀的手停在半空——是坚持尊重捐赠者意愿，还是为教学进度妥协？",
    left: {
      label: "坚持遗体捐赠者意愿",
      impact: { Benevolence: 3, Clinical: -2, Research: 0, Leadership: 1 },
      addTags: ["仁心医者"]
    },
    right: {
      label: "为教学进度妥协",
      impact: { Benevolence: -2, Clinical: 3, Research: 1, Leadership: -1 },
      addTags: ["华佗在世"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "undergrad_emergency_observation",
    phase: "Undergrad" as GamePhaseType,
    category: "clinical",
    text: "急诊大厅的警报声此起彼伏，一名车祸患者被推进抢救室，鲜血浸透纱布。家属突然冲出人群抓住你的白袍：'医生！求你救救他！'而主治医生大喊：'规培医生！快帮我准备气管插管！'你看着家属含泪的双眼，又瞥见抢救台上患者紫绀的嘴唇——是先安抚家属情绪，还是专注协助医生操作？",
    left: {
      label: "安抚家属情绪",
      impact: { Benevolence: 3, Clinical: -2, Research: 0, Leadership: 1 },
      addTags: ["仁心医者"]
    },
    right: {
      label: "专注协助医生操作",
      impact: { Benevolence: -1, Clinical: 3, Research: 1, Leadership: -1 },
      addTags: ["华佗在世"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "undergrad_academic_misconduct",
    phase: "Undergrad" as GamePhaseType,
    category: "research",
    text: "深夜实验室的荧光灯嗡嗡作响，你核对课题数据时发现异常：导师提供的'原始数据'与实验记录完全不符。隔壁师兄低语：'这数据肯定造假，但举报会毁掉他的院士申请……'电脑屏幕上，造假数据已被用于投稿顶级期刊。你握着举报信的手心冒汗——是匿名举报维护学术正义，还是保持沉默避免冲突？",
    left: {
      label: "匿名举报数据造假",
      impact: { Benevolence: 2, Clinical: 0, Research: 3, Leadership: 2 },
      addTags: ["学术肝帝"]
    },
    right: {
      label: "保持沉默避免冲突",
      impact: { Benevolence: -2, Clinical: 1, Research: -1, Leadership: -2 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },

  // ================ 阶段二：规培医生·生死时速 ================
  {
    id: "intern_child_rescue",
    phase: "Intern" as GamePhaseType,
    category: "clinical",
    text: "儿科监护室里，5岁女孩连着呼吸机，监护仪显示血氧饱和度跌至70%。家属跪地哀求：'放弃吧，孩子太痛苦了！'而主治医生指着CT片：'还有1%手术机会，但可能下不了台。'女孩的手指突然抽搐了一下，仿佛在回应。你站在病床前，听着呼吸机沉重的嘶鸣——是放弃治疗减轻痛苦，还是坚持高风险手术？",
    left: {
      label: "放弃治疗减轻痛苦",
      impact: { Benevolence: 3, Clinical: -3, Research: 0, Leadership: 1 },
      addTags: ["仁心医者"]
    },
    right: {
      label: "坚持高风险手术",
      impact: { Benevolence: -2, Clinical: 4, Research: 1, Leadership: -1 },
      addTags: ["华佗在世"]
    },
    timeCost: 3,
    weight: 1
  },
  {
    id: "intern_resource_allocation",
    phase: "Intern" as GamePhaseType,
    category: "resource",
    text: "暴雨引发的泥石流冲垮了山区卫生院，救护车在泥泞中艰难跋涉，将15名重伤员转运至市医院。急诊大厅瞬间被血腥味和哭喊声淹没：一名8岁孤儿被钢筋贯穿腹部，在担架上抽搐着低喊'妈妈'；三名建筑工人颅内出血，家属跪地哀求'他们全家靠他活命'；还有孕妇胎心骤停、老人多器官衰竭……你作为值班医生，面对仅剩的两间手术室和告急的血库，听到院长嘶吼：'按伤情排序！孤儿没家属签字排最后！'而孤儿冰凉的手突然抓住你的白袍，监护仪发出刺耳的'嘀——'长音。你攥紧沾血的手术安排单，笔尖在'孤儿'和'工人'之间颤抖：",
    left: {
      label: "优先抢救孤儿",
      impact: { Benevolence: 4, Clinical: -2, Research: 0, Leadership: 2 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "按医疗规范排序",
      impact: { Benevolence: -1, Clinical: 2, Research: 0, Leadership: 1 },
      addTags: ["华佗在世"]
    },
    timeCost: 3,
    weight: 1
  },
  {
    id: "intern_paper_authorship",
    phase: "Intern" as GamePhaseType,
    category: "research",
    text: "凌晨三点的实验室，你盯着电脑屏幕上反复修改的论文——这篇关于靶向治疗的突破性研究，是你连续300天泡在细胞房、亲手完成2000次实验的成果。导师的邮件突然弹出：'按学院惯例，我列为第一作者，你排第二。'你想起他曾在组会上承诺'贡献大者为一作'，但走廊里流传着去年学生因争一作被延毕的传闻。同门悄悄塞来一张纸条：'导师用这篇论文申请院士，你闹翻就毁前途。'而你的手机亮起母亲的消息：'家里欠的债等你毕业还。'鼠标悬停在'回复'按钮上，窗外天色泛起鱼肚白，屏幕上通讯作者栏的导师名字像一道枷锁：",
    left: {
      label: "要求第一作者",
      impact: { Benevolence: 1, Clinical: 0, Research: 3, Leadership: 2 },
      addTags: ["学术肝帝"]
    },
    right: {
      label: "默认导师排序",
      impact: { Benevolence: -1, Clinical: 1, Research: -2, Leadership: -2 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },

  // ================ 阶段三：住院医师·暗夜微光 ================
  {
    id: "resident_medical_accident",
    phase: "Resident" as GamePhaseType,
    category: "crisis",
    text: "凌晨三点的重症监护室，心电监护仪的警报声刺破寂静。你负责的72岁患者因术后感染突发多器官衰竭，抢救无效死亡。家属红着眼眶质问：'为什么没按医嘱每小时记录尿量？'你翻看护理记录时手心冒汗——昨晚因急诊手术分流，你确实漏签了两次关键记录。科主任拍着你的肩低语：'就说护士交接班遗漏了，系统流程有漏洞。'而死者女儿颤抖着递来一张泛黄照片：'我爸说你是他见过最负责的医生……'你攥紧那张照片，听见走廊里传来医疗纠纷调解小组的脚步声：",
    left: {
      label: "主动承担责任",
      impact: { Benevolence: 3, Clinical: -2, Research: 0, Leadership: 2 },
      addTags: ["仁心医者"]
    },
    right: {
      label: "推诿至系统漏洞",
      impact: { Benevolence: -3, Clinical: 1, Research: 0, Leadership: -2 },
      addTags: ["臭脸医生"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "resident_rare_disease_research",
    phase: "Resident" as GamePhaseType,
    category: "research",
    text: "实验室培养箱幽蓝的光线下，你盯着培养皿中异常增殖的神经细胞——这是全球仅报道30例的'遗传性感觉自主神经病'样本。院长亲自递来国际罕见病研究联盟的邀请函：'参与多中心临床试验能发顶刊，但需暂停你负责的50例常规患者。'手机突然震动，你主管的罕见病患儿母亲发来语音：'医生，孩子今天又疼得晕过去了……'窗外，实验室的'罕见病攻坚组'横幅在风中猎猎作响，而门诊排班表上密密麻麻的常规患者名字像无声的催促：",
    left: {
      label: "投入临床研究",
      impact: { Benevolence: -2, Clinical: -1, Research: 4, Leadership: 2 },
      addTags: ["学术肝帝"]
    },
    right: {
      label: "聚焦常规诊疗",
      impact: { Benevolence: 3, Clinical: 3, Research: -2, Leadership: -1 },
      addTags: ["仁心医者"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "resident_patient_privacy",
    phase: "Resident" as GamePhaseType,
    category: "ethics",
    text: "科室晨会上，同事展示的'教学视频'让你如坠冰窟——视频里你正在为罕见病患者查体，虽面部打码，但患者手臂特有的'蝶形红斑'和家属方言对话清晰可辨。患者家属的怒吼炸响在走廊：'你们把视频发到两万粉丝的医学号上了！'科主任关掉投影仪冷声道：'内部警告扣绩效就行，闹大了全院评优泡汤。'而视频弹幕里'红斑像外星人'的恶评刺痛你的眼睛。你想起患者签署知情同意书时颤抖的手，此刻手机弹出医疗纠纷律师的短信：'证据已固定，您决定公开追责还是……'",
    left: {
      label: "公开追责泄密者",
      impact: { Benevolence: 3, Clinical: 0, Research: 1, Leadership: 3 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "内部警告处理",
      impact: { Benevolence: -2, Clinical: 1, Research: 0, Leadership: -2 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },

  // ================ 阶段四：主治医师·荆棘王座 ================
  {
    id: "attending_violence_incident",
    phase: "Attending" as GamePhaseType,
    category: "crisis",
    text: "骨伤科诊室突然爆发的嘶吼声撕裂了走廊的宁静。一名患者家属挥舞着病历本砸向你的办公桌，玻璃碎屑溅到你刚做完手术的手上：'我爸术后还能走路，现在瘫痪了！你们这群庸医！'他猛地揪住你白袍的领口，唾沫星子喷在你脸上。保安被人群堵在门外，你瞥见候诊区老人惊恐的眼神和孩童的哭声。手机震动显示科主任的短信：'稳住家属，别激化矛盾，医院在谈赔偿。'而患者家属的拳头已扬起，你闻到他身上浓重的酒气——此刻是后退安抚，还是按下桌下的紧急报警按钮？",
    left: {
      label: "保护患者退让",
      impact: { Benevolence: 3, Clinical: -2, Research: 0, Leadership: -2 },
      addTags: ["仁心医者"]
    },
    right: {
      label: "坚持原则报警",
      impact: { Benevolence: -1, Clinical: 1, Research: 0, Leadership: 3 },
      addTags: ["改革先锋"]
    },
    timeCost: 1,
    weight: 1
  },
  {
    id: "attending_international_cooperation",
    phase: "Attending" as GamePhaseType,
    category: "research",
    text: "瑞士日内瓦大学医学院的邀请函在办公桌上泛着烫金光泽：主导'人工智能辅助脊柱微创手术'跨国研发项目，团队将共享Nature Medicine署名权。你刚结束一台高难度脊柱侧弯矫正术，手机弹出科室群消息：本土团队研发的3D打印椎体置换技术获国家创新奖，急需你牵头临床试验。窗外，年轻医生正围着本土技术模型热烈讨论，而国际邮件提醒你：若48小时内未确认合作，项目将移交德国团队。是飞往日内瓦追逐国际学术影响力，还是留在本土培育技术火种？",
    left: {
      label: "主导技术输出",
      impact: { Benevolence: 1, Clinical: 2, Research: 3, Leadership: 2 },
      addTags: ["学术肝帝"]
    },
    right: {
      label: "专注本土团队建设",
      impact: { Benevolence: 2, Clinical: 2, Research: 1, Leadership: 1 },
      addTags: ["改革先锋"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "attending_insurance_reform",
    phase: "Attending" as GamePhaseType,
    category: "management",
    text: "市医保局会议室的电子屏滚动着DRG支付改革方案：将推行'按病种分值付费'，医院需自付超支费用。院长敲着桌子强调：'各科室必须控制成本！高值耗材使用率压降30%！'你翻看科室账单——晚期癌症患者的靶向药、罕见病儿童的基因疗法，这些'超支项目'正是患者最后的希望。手机震动显示患者家属的语音：'医生，新政策会停药吗？'窗外，医保局横幅'深化支付改革促进分级诊疗'在风中猎猎作响，而科室主任低语：'保住科室奖金，才能救更多人。'此刻你握着笔，在政策反馈表上悬停——是推动普惠方案，还是优先医院生存？",
    left: {
      label: "推动普惠性方案",
      impact: { Benevolence: 4, Clinical: 1, Research: 1, Leadership: 3 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "维持医院收益优先",
      impact: { Benevolence: -3, Clinical: 2, Research: 1, Leadership: -1 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },

  // ================ 阶段五：科室主任·权杖与枷锁 ================
  {
    id: "director_drug_controversy",
    phase: "Director" as GamePhaseType,
    category: "resource",
    text: "药代递来的合同在办公桌上摊开，红色印章旁标注着'回扣比例35%'。新型靶向药能延长晚期肺癌患者生存期8个月，但单疗程费用高达28万。你推开窗，看见走廊尽头一位患者家属正翻着缴费单叹息：'卖房也只够一个疗程'。此时院长来电：'药企承诺赞助医院新大楼，下周签字'。而手机弹出最新研究：国产仿制药疗效达92%，价格仅1/5。药代凑近低语：'主任，签了合同，您团队的国际项目经费我包了'——是撕毁合同推动平价替代，还是接受合作加速引进？",
    left: {
      label: "拒绝回扣平价替代",
      impact: { Benevolence: 4, Clinical: 1, Research: 1, Leadership: 2 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "接受合作加速引进",
      impact: { Benevolence: -3, Clinical: 2, Research: 2, Leadership: -2 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "director_youth_training",
    phase: "Director" as GamePhaseType,
    category: "management",
    text: "晨会结束，年轻医生们顶着黑眼圈围住你：'主任，上周连续3台急诊手术，我们48小时没合眼'。你翻开绩效报表：科室创收达标全靠他们超负荷运转，而规培手册上'每月带教时数'栏仍空白。窗外，医学院见习生正观摩一台基础手术，带教老师却临时被调去创收项目。院长发来通知：青年医生考核与科室创收挂钩。此刻是拨出资源制定带教计划，还是压榨劳动力保住绩效？",
    left: {
      label: "倾注资源带教",
      impact: { Benevolence: 3, Clinical: 2, Research: 1, Leadership: 3 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "压榨劳动力创收",
      impact: { Benevolence: -3, Clinical: 3, Research: 1, Leadership: -2 },
      addTags: ["臭脸医生"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "director_academic_speech",
    phase: "Director" as GamePhaseType,
    category: "research",
    text: "国际学术大会的聚光灯下，你翻到幻灯片第7页——某权威专家的'突破性数据'与你团队实验结果矛盾。台下坐着期刊主编、基金评审和院长，他们刚为该专家颁发终身成就奖。休息时，年轻研究员塞来U盘：'原始数据被篡改了，我们重复实验3次都证伪'。而专家递来合作邀约：'共同署名顶刊，明年院士评选我支持你'。聚光灯再次亮起，主持人念出你的名字——是揭露行业潜规则，还是维护权威共识？",
    left: {
      label: "揭露行业潜规则",
      impact: { Benevolence: 2, Clinical: 0, Research: 3, Leadership: 3 },
      addTags: ["学术肝帝"]
    },
    right: {
      label: "维护权威共识",
      impact: { Benevolence: -1, Clinical: 1, Research: -2, Leadership: -1 },
      addTags: ["头秃主任"]
    },
    timeCost: 2,
    weight: 1
  },

  // ================ 阶段六：院士之路·巅峰抉择 ================
  {
    id: "academician_gene_therapy",
    phase: "Academician" as GamePhaseType,
    category: "research",
    text: "实验室超低温冰箱的蓝光映亮你手中的数据报告——团队研发的基因编辑技术成功治愈了3名晚期罕见病患儿。国际药企代表带着百亿估值合同守在门外：'专利独家授权，您将成为全球首富'。而非洲合作医院的邮件弹窗：刚确诊的百名患儿等不起专利审批'。你盯着冷冻胚胎库中储存的千份样本，想起导师临终嘱托：'技术若锁在专利墙里，就是人类的罪人'。此刻是公开技术造福全球，还是垄断专利掌控未来？",
    left: {
      label: "公开技术造福全球",
      impact: { Benevolence: 4, Clinical: 1, Research: 2, Leadership: 3 },
      addTags: ["不朽丰碑"]
    },
    right: {
      label: "专利垄断谋取暴利",
      impact: { Benevolence: -4, Clinical: 2, Research: 3, Leadership: -2 },
      addTags: ["华佗在世"]
    },
    timeCost: 3,
    weight: 1,
    isRare: true
  },
  {
    id: "academician_resource_reform",
    phase: "Academician" as GamePhaseType,
    category: "management",
    text: "卫健委的改革方案摊在办公桌，红头文件标注着'基层医疗下沉'与'区域医疗中心'双轨并行。你刚从山区义诊归来，村医颤抖着递上锈迹斑斑的血压计：'十年没换新设备了'。而院长电话急促：'三甲扩建计划需您签字，否则院士评审指标全黄'。窗外，直升机正转运一名心梗患者飞往北京——是推动资源下沉拯救十万村医，还是集中资源打造亚洲顶尖急救中心？",
    left: {
      label: "推动基层医疗下沉",
      impact: { Benevolence: 4, Clinical: 1, Research: 1, Leadership: 3 },
      addTags: ["改革先锋"]
    },
    right: {
      label: "集中资源建顶尖中心",
      impact: { Benevolence: -2, Clinical: 3, Research: 2, Leadership: 1 },
      addTags: ["华佗在世"]
    },
    timeCost: 2,
    weight: 1
  },
  {
    id: "academician_nobel_nomination",
    phase: "Academician" as GamePhaseType,
    category: "research",
    text: "斯德哥尔摩的提名函静静躺在加密邮箱，你团队的颠覆性理论挑战了教科书百年结论。助理慌张闯入：'某院士联合期刊主编要求撤稿，否则封杀所有青年学者'。而电脑屏幕上，患者论坛正刷屏：'新疗法救了我儿子，求您公开数据！'你翻出导师的旧笔记：'真理比奖杯重要'。此刻是顶着学术围剿公开理论，还是妥协保守保住学术地位？",
    left: {
      label: "公开颠覆性理论",
      impact: { Benevolence: 3, Clinical: 1, Research: 4, Leadership: 3 },
      addTags: ["不朽丰碑"]
    },
    right: {
      label: "保守维护学术地位",
      impact: { Benevolence: -2, Clinical: 1, Research: -2, Leadership: -1 },
      addTags: ["头秃主任"]
    },
    timeCost: 3,
    weight: 1,
    isRare: true
  }
];

// 导出所有卡片
export const allCards: GameCard[] = [...allMedicalCards];