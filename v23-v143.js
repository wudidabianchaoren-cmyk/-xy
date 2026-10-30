(() => {
  "use strict";

  const projectWorks = [
    {
      cn: "回不去的乡",
      en: "Distant Homeland",
      type: "AI Short Film",
      summary: "一枚关于土地、背影和黄昏的影像记忆信号。",
      copy: "时代记忆、土地和背影被压成一枚缓慢发光的记忆信号。镜头穿过黄昏、道路和远山，但不替乡愁作出解释。",
      role: "以短片方式测试私人记忆如何被 AI 影像重新组织，作为整个档案的情感起点。",
      goal: "让乡土题材摆脱说明文字，依靠道路、远山和人物背影建立可被观看者自行补全的时间感。",
      tools: "Midjourney / Runway / 剪辑节奏测试 / 声音采样草案",
      output: "短片镜头序列、主视觉方向、黄昏地平线镜头组和未完成声音样本。",
      reflection: "最有效的部分不是复原故乡，而是让画面保持距离。距离本身成为叙事。",
      symbols: "树、路、人物背影、黄昏、远山",
      motion: "低速向地平线推进，每一次靠近都被记忆轻微拉回。",
      process: "从乡土关键词、镜头构图到 AI 短片节奏测试。",
      edge: "保留未完成的家庭影像、废弃镜头与声音采样。",
      processSteps: ["Memory seed", "Rural image prompts", "Slow camera tests", "Sound residue"],
      fragments: ["乡土远景", "桥上凝视", "黄昏背影"],
      image: "./assets/works/rural-field.png",
      images: [
        "./assets/works/rural-field.png",
        "./assets/works/rural-bridge.png",
        "./assets/works/rural-dusk.png"
      ]
    },
    {
      cn: "东方玄幻",
      en: "Oriental Fantasy",
      type: "Scene Design",
      summary: "宫殿、红衣和权力关系组成一条持续收紧的中轴线。",
      copy: "宫殿、红衣与对峙关系被组织成一条持续收紧的中轴线。它不是静止的设定图，而是一种正在逼近的戏剧压力。",
      role: "把人物关系、建筑轴线和镜头压力合并为场景设计样本，测试东方幻想题材的空间叙事。",
      goal: "建立一个可继续扩展的宫廷场景系统，让角色不只是站在画面里，而是被空间关系挤压。",
      tools: "Midjourney / Blender reference blockout / Runway motion test / Photoshop paintover",
      output: "主场景设定、角色站位草图、运动镜头预演和色彩结构板。",
      reflection: "红衣角色必须成为空间力量的一部分，而不是视觉中心的装饰符号。",
      symbols: "红衣、王座、宫灯、金色木构、对称轴",
      motion: "镜头像穿过宫门，红色信号在空间中心持续逼近。",
      process: "角色设定、场景搭建、运动测试与镜头压力校正。",
      edge: "继续扩展为角色关系图和可航行的场景结构。",
      processSteps: ["Court axis", "Character pressure", "Motion blocking", "World extension"],
      fragments: ["宫殿双强", "崖边相遇", "竹林材质"],
      image: "./assets/works/xianxia-duel.png",
      images: [
        "./assets/works/xianxia-duel.png",
        "./assets/works/xianxia-cliff.png",
        "./assets/works/bamboo-forest.png"
      ]
    },
    {
      cn: "雨夜与红",
      en: "Wet Oriental Classicism",
      type: "Color Study",
      summary: "蓝灰雨幕吞没红色焦点，形成冷暖冲突的色彩样本。",
      copy: "蓝灰雨幕和红色焦点构成色彩矛盾。这个节点像一场湿润、发光、有深度的雨，冷色环境不断吞没暖色信号。",
      role: "作为色彩和材质研究节点，保存雨、反射、红色焦点在 AI 影像中的可复用方法。",
      goal: "把东方古典气质从符号堆叠中抽离出来，用湿度、反射和低照度完成情绪建模。",
      tools: "Midjourney / Stable Diffusion reference pass / Runway rain motion / DaVinci color check",
      output: "冷暖色彩样本、雨幕层级测试、反射材质参考和红色焦点控制方案。",
      reflection: "红色越少越有力量。真正撑起画面的，是蓝灰环境里不断变化的湿度。",
      symbols: "雨、红灯、剑光、湿地反射、蓝灰色",
      motion: "雨线按深度分层，红色光源在接近时产生反射拖尾。",
      process: "冷光设定、红色焦点控制、雨幕速度和地面反射测试。",
      edge: "发展为可复用的东方影像色彩方法样本。",
      processSteps: ["Blue-grey field", "Red source test", "Rain depth", "Reflection library"],
      fragments: ["雨幕层", "红色焦点", "湿地反射"],
      image: "./assets/works/rain-palace.png",
      images: [
        "./assets/works/rain-palace.png",
        "./assets/works/xianxia-duel.png",
        "./assets/works/bamboo-forest.png"
      ]
    },
    {
      cn: "骸骨之岸",
      en: "Echoes of the Abyss",
      type: "Film Concept",
      summary: "黑海、白瞳和骨骸形成一段没有幸存者的灾难史诗。",
      copy: "黑海、白瞳、骨骸和雾共同形成一段灾难史诗。观众不是站在岸边观看，而是在缓慢沉入这段没有幸存者的历史。",
      role: "保存更黑暗、更宏观的电影概念实验，测试尺度、雾层和史前遗迹如何承载叙事重量。",
      goal: "让灾难感不依赖怪物或情节说明，而由海面高度、远处结构和白色凝视共同生成。",
      tools: "Midjourney / Runway camera drift / After Effects fog pass / 叙事关键词板",
      output: "世界观轮廓、主视觉、低机位海面运动测试和遗迹尺度样本。",
      reflection: "越解释越小。这个项目需要保留大量不可知区域，让观看者先感到历史压力。",
      symbols: "黑海、白瞳、骨骸、雾、灾难遗迹",
      motion: "镜头低贴海面漂移，远处结构在雾中逐层显露。",
      process: "情绪图、世界观轮廓、尺度测试与运动预演。",
      edge: "保留无法解释的史前痕迹，让故事继续向未知生长。",
      processSteps: ["Abyss mood", "Scale study", "Fog reveal", "Unknown history"],
      fragments: ["崖边雾海", "雨夜深场", "未知边界"],
      image: "./assets/works/xianxia-cliff.png",
      images: [
        "./assets/works/xianxia-cliff.png",
        "./assets/works/rain-palace.png",
        "./assets/works/rural-dusk.png"
      ]
    },
    {
      cn: "民俗符号",
      en: "Northeast Ritual System",
      type: "Symbol Archive",
      summary: "器物、布料、火与烟组成仍在生长的东北民俗视觉语法。",
      copy: "器物、布料、火、烟和供桌不再作为装饰出现，而是被保存为一套仍在生长的东北民俗视觉语法。",
      role: "把地域经验、民俗器物和影像符号拆解成可检索的视觉档案，作为后续作品的素材系统。",
      goal: "避免把民俗简化成奇观，转而保存器物关系、使用痕迹和仪式空间的真实秩序。",
      tools: "田野关键词 / 图像采样 / Midjourney variation / 符号关系表",
      output: "符号索引、器物视觉样本、烟火运动参考和地域叙事素材库。",
      reflection: "这个节点最需要克制。符号越有来处，画面越不需要夸张。",
      symbols: "祭祀器物、布料、火、烟、供桌",
      motion: "烟雾向上生长，器物在暗部中被短暂照亮后再次隐去。",
      process: "田野关键词、器物采样、符号拆解与镜头组合。",
      edge: "持续补充地域资料，避免符号被简化成表面奇观。",
      processSteps: ["Field words", "Object sampling", "Symbol split", "Living archive"],
      fragments: ["竹林材质", "乡土肌理", "雨夜器物"],
      image: "./assets/works/bamboo-forest.png",
      images: [
        "./assets/works/bamboo-forest.png",
        "./assets/works/rural-field.png",
        "./assets/works/rain-palace.png"
      ]
    }
  ];

  if (document.title.includes("V31")) {
    const journeyProjects = [
      {
        cn: "云岭开境",
        en: "Opening Cloud Ridge",
        type: "World Key Visual",
        summary: "山谷、云海和远处奇树构成西游视觉宇宙的第一张入口图。",
        copy: "这张图不再承担旧作品的乡土叙事，而是作为整个西游视觉作品集的开场：巨幅山体、瀑布、云雾和远处的异形树共同建立一个可以继续进入的神话地形。",
        role: "作为首页和作品集总入口，确定世界尺度、空气湿度和绿色生命感。",
        goal: "让观众第一眼进入一个真正有体量的视觉宇宙，而不是看到模板化图片列表。",
        tools: "Midjourney / visual development / cinematic composition",
        output: "入口主视觉、世界观远景、图像流第一节点。",
        reflection: "最重要的是保留纵深和呼吸感，文字只做坐标，不抢画面。",
        symbols: "云海、瀑布、山体、奇树、远景入口",
        motion: "适合缓慢推进、云层漂移和纵深视差。",
        process: "从宏观地形到章节入口，先建立视觉世界的尺度。",
        edge: "后续可扩展为完整世界地图和镜头开场。",
        processSteps: ["World scale", "Cloud depth", "Entrance frame", "Archive node"],
        fragments: ["山谷入口", "瀑布纵深", "云海远景"],
        image: "./assets/journey/journey-mountain-valley.png",
        images: ["./assets/journey/journey-mountain-valley.png", "./assets/journey/mist-palace-dusk.png", "./assets/journey/sky-palace-blue.png"]
      },
      {
        cn: "雾宫残影",
        en: "Mist Palace Residue",
        type: "Palace Atmosphere",
        summary: "粉橙天光中的宫殿剪影，建立天宫秩序和远处压力。",
        copy: "这张图的重点不是建筑细节，而是雾层把宫殿压成若隐若现的权力轮廓。它适合作为作品里的秩序段落，和山野、竹林形成对照。",
        role: "建立天宫/宫阙一类场景的色彩和空间压力。",
        goal: "把宫殿从装饰符号变成被雾和距离控制的叙事空间。",
        tools: "Midjourney / color mood study / film still reference",
        output: "宫殿气氛样张、粉橙冷雾色彩方案。",
        reflection: "建筑越模糊，秩序感反而越强。",
        symbols: "宫殿、雾、粉橙天光、剪影",
        motion: "适合雾层横移和轻微显影。",
        process: "以低对比远景测试神话建筑的压迫感。",
        edge: "可继续发展成天宫章节。",
        processSteps: ["Silhouette", "Fog layer", "Order pressure", "Color field"],
        fragments: ["雾宫远景", "粉橙天光", "建筑剪影"],
        image: "./assets/journey/mist-palace-dusk.png",
        images: ["./assets/journey/mist-palace-dusk.png", "./assets/journey/cloud-stairway-01.png", "./assets/journey/cloud-stairway-02.png"]
      },
      {
        cn: "天阶迷雾",
        en: "Cloud Stairway I",
        type: "Spatial Concept",
        summary: "云雾吞没阶梯，形成不可抵达的神性方向。",
        copy: "阶梯不是道路，而是一种持续向上却无法抵达的空间秩序。画面里的雾遮住终点，让观众只能感到方向，而不能完全确认目的地。",
        role: "测试垂直通道、雾层和神性距离之间的关系。",
        goal: "让空间本身成为叙事，不依赖人物解释。",
        tools: "Midjourney / atmosphere blocking",
        output: "天阶空间概念、雾层结构样张。",
        reflection: "神话空间需要保留不可抵达感。",
        symbols: "阶梯、云雾、栏杆、上升方向",
        motion: "适合阶梯慢推和雾层吞没。",
        process: "从通道构图转向心理距离。",
        edge: "后续可与人物朝圣动作结合。",
        processSteps: ["Vertical path", "Fog cover", "Sacred distance", "Slow reveal"],
        fragments: ["天阶", "迷雾", "上行"],
        image: "./assets/journey/cloud-stairway-01.png",
        images: ["./assets/journey/cloud-stairway-01.png", "./assets/journey/cloud-stairway-02.png", "./assets/journey/sky-palace-blue.png"]
      },
      {
        cn: "云上宫阙",
        en: "Cloud Stairway II",
        type: "Spatial Concept",
        summary: "高处楼阁被云层遮蔽，像正在显影的神话建筑。",
        copy: "这张图与天阶迷雾形成一组：同样是上升空间，但这里更强调楼阁和云之间的遮挡关系，适合做章节转场。",
        role: "补充天宫空间的第二种显影方式。",
        goal: "让建筑从雾里缓慢出现，而不是一次性展示完整设定。",
        tools: "Midjourney / spatial variation",
        output: "云上楼阁、转场视觉样本。",
        reflection: "遮挡比完整展示更有想象空间。",
        symbols: "楼阁、云层、阶梯、悬置空间",
        motion: "适合从暗处横移到亮处。",
        process: "以同题变体筛选更强的叙事角度。",
        edge: "可作为天宫段落的中景。",
        processSteps: ["Variant", "Obscure", "Reveal", "Transition"],
        fragments: ["云上楼阁", "栏杆", "遮蔽"],
        image: "./assets/journey/cloud-stairway-02.png",
        images: ["./assets/journey/cloud-stairway-02.png", "./assets/journey/cloud-stairway-01.png", "./assets/journey/mist-palace-dusk.png"]
      },
      {
        cn: "青空神域",
        en: "Blue Sky Palace",
        type: "Macro World View",
        summary: "冷蓝云海中的宫殿群，承担世界观宏观章节。",
        copy: "它把建筑从单个宫殿扩展成神域群落。蓝色雾气降低现实感，让空间像浮在云海上方。",
        role: "作为宏观世界观和神域尺度的视觉证据。",
        goal: "让作品集有大尺度空间，而不是只停留在单张气氛图。",
        tools: "Midjourney / aerial composition",
        output: "神域远景、冷蓝色彩系统。",
        reflection: "大空间需要弱化细节，突出整体气流。",
        symbols: "云海、宫殿群、蓝光、远景",
        motion: "适合空中横移和云海流动。",
        process: "从宫殿剪影扩展到世界群落。",
        edge: "后续可变成章节地图。",
        processSteps: ["Aerial scale", "Blue fog", "Palace group", "World map"],
        fragments: ["云海", "神域", "远景"],
        image: "./assets/journey/sky-palace-blue.png",
        images: ["./assets/journey/sky-palace-blue.png", "./assets/journey/journey-mountain-valley.png", "./assets/journey/mist-palace-dusk.png"]
      },
      {
        cn: "暖竹光径",
        en: "Warm Bamboo Path",
        type: "Bamboo Passage",
        summary: "低机位竹林和暖光通道，承担行进与呼吸感。",
        copy: "这张图是你截图里提到的重点页面。它不应该被点击后弹成同一张图，而应该在原位置完成切换和呼吸动效，像一个可继续走进去的场景。",
        role: "作为竹林段落的温暖入口，平衡前面神域的冷雾。",
        goal: "让观众感觉自己正在经过竹林，而不是查看一页图片。",
        tools: "Midjourney / light study / forest passage",
        output: "竹林通道、暖光材质样本。",
        reflection: "暖光需要控制，过亮会失去神秘感。",
        symbols: "竹子、光束、草地、水面、通道",
        motion: "适合点击切换、光束漂移和轻微推进。",
        process: "从材质和光线建立可进入的路径。",
        edge: "后续可接入风、叶片和水面微动。",
        processSteps: ["Path", "Warm beam", "Bamboo depth", "Breathing motion"],
        fragments: ["暖光", "竹径", "水面"],
        image: "./assets/journey/bamboo-sun-path.png",
        images: ["./assets/journey/bamboo-sun-path.png", "./assets/journey/warm-bamboo-glade.png", "./assets/journey/dark-bamboo-tall.png"]
      },
      {
        cn: "鹤洞遗骨",
        en: "Crane Cave Skull",
        type: "Abyss Relic",
        summary: "洞穴、巨骨、水面和孤舟构成危险遗迹。",
        copy: "这张图把神话从明亮场景拉入遗迹和危险。巨骨并不是单纯奇观，而是世界曾经发生过什么的痕迹。",
        role: "作为危险、古老和遗迹章节的视觉锚点。",
        goal: "给作品集加入更黑暗的空间重量。",
        tools: "concept art reference / cinematic archive",
        output: "遗迹场景、洞穴光线、水面反射样本。",
        reflection: "遗迹最有效的地方在于它不解释过去。",
        symbols: "巨骨、洞穴、孤舟、水面、瀑布",
        motion: "适合水面波动和光束落下。",
        process: "从奇观图像转向叙事遗迹。",
        edge: "可扩展为妖洞/古战场段落。",
        processSteps: ["Relic", "Water", "Cave light", "Unknown past"],
        fragments: ["巨骨", "孤舟", "洞穴"],
        image: "./assets/journey/crane-cave-skull.jpg",
        images: ["./assets/journey/crane-cave-skull.jpg", "./assets/journey/horror-bamboo-01.png", "./assets/journey/snow-campfire.png"]
      },
      {
        cn: "高竹幽径",
        en: "Tall Dark Bamboo",
        type: "Tension Passage",
        summary: "高密竹林形成压迫纵深，进入更紧张的段落。",
        copy: "画面中的竹子像墙一样竖起，通道被压窄。它适合从温暖竹林切入危险、迷失或追逐。",
        role: "建立竹林的压迫版本。",
        goal: "让同一类场景产生不同情绪，而不是只重复竹林素材。",
        tools: "Midjourney / dark forest mood",
        output: "冷暗竹林、纵深通道样本。",
        reflection: "密度是这张图的主要叙事工具。",
        symbols: "高竹、暗绿、窄路、湿地",
        motion: "适合左右视差和前景遮挡。",
        process: "从竹林材质转向心理压迫。",
        edge: "可作为追逐段落。",
        processSteps: ["Density", "Narrow path", "Dark green", "Pressure"],
        fragments: ["高竹", "幽径", "压迫"],
        image: "./assets/journey/dark-bamboo-tall.png",
        images: ["./assets/journey/dark-bamboo-tall.png", "./assets/journey/cold-bamboo-concept.png", "./assets/journey/horror-bamboo-01.png"]
      },
      {
        cn: "雪原孤火",
        en: "Snow Campfire",
        type: "Cold Shelter",
        summary: "冷色雪林里的火光，制造孤立与临时庇护。",
        copy: "这张图不是西游常规想象，但它能给长途行进加入停顿和寒冷。火光是唯一暖色，人物即使不出现也能感到危险。",
        role: "作为旅途中段的冷色停靠点。",
        goal: "建立视觉节奏里的低温段落。",
        tools: "film reference / mood study",
        output: "雪林、火光、夜色样本。",
        reflection: "越空的画面越需要准确的色温关系。",
        symbols: "雪、火、森林、夜色、孤立",
        motion: "适合火星上升和雪面微光。",
        process: "用冷暖对比建立停顿。",
        edge: "可发展为夜宿章节。",
        processSteps: ["Cold field", "Fire point", "Shelter", "Pause"],
        fragments: ["雪原", "孤火", "夜林"],
        image: "./assets/journey/snow-campfire.png",
        images: ["./assets/journey/snow-campfire.png", "./assets/journey/forest-dusk-red-01.png", "./assets/journey/forest-dusk-red-02.png"]
      },
      {
        cn: "恐竹夜行",
        en: "Horror Bamboo Night",
        type: "Dark Bamboo",
        summary: "湿冷竹林空镜强调低照度和恐惧氛围。",
        copy: "它和暖竹光径是反面：同样是竹林，但光线从邀请变成拒绝，路径从通道变成陷阱。",
        role: "建立竹林恐惧段落。",
        goal: "让场景之间有明确的情绪转场。",
        tools: "film still reference / low light study",
        output: "夜竹林、低照度、湿冷材质样本。",
        reflection: "恐怖感来自看不清，而不是堆元素。",
        symbols: "夜竹、冷雾、水洼、暗路",
        motion: "适合慢速横移和前景掠过。",
        process: "从暖光变体转为暗场压力。",
        edge: "可接入音效和微动。",
        processSteps: ["Low light", "Wet ground", "Bamboo wall", "Fear"],
        fragments: ["夜行", "冷雾", "湿地"],
        image: "./assets/journey/horror-bamboo-01.png",
        images: ["./assets/journey/horror-bamboo-01.png", "./assets/journey/cold-bamboo-concept.png", "./assets/journey/dark-bamboo-tall.png"]
      },
      {
        cn: "冷竹压境",
        en: "Cold Bamboo Concept",
        type: "Material Study",
        summary: "冷调竹林和水面反光，适合实验材质与气氛层。",
        copy: "这张图的价值在材质：竹子、水面、苔藓和灰绿色空气形成统一的冷调系统，可作为实验章节的核心样本。",
        role: "作为材质和气氛研究节点。",
        goal: "把竹林从背景变成可以被研究的视觉系统。",
        tools: "Midjourney / material board",
        output: "冷调竹林材质板、水面反射样本。",
        reflection: "材质统一后，画面才会显得成熟。",
        symbols: "冷绿、竹、水面、苔藓",
        motion: "适合水面反光和雾层流动。",
        process: "拆分材质关系并沉淀为系统。",
        edge: "可作为实验目录入口。",
        processSteps: ["Material", "Reflection", "Cold tone", "System"],
        fragments: ["冷绿", "水面", "竹材质"],
        image: "./assets/journey/cold-bamboo-concept.png",
        images: ["./assets/journey/cold-bamboo-concept.png", "./assets/journey/horror-bamboo-01.png", "./assets/journey/warm-bamboo-glade.png"]
      },
      {
        cn: "林晚赤云",
        en: "Red Dusk Forest I",
        type: "Color Turn",
        summary: "红色晚云穿透林线，形成章节色彩转折。",
        copy: "这张图适合做从冷竹林转向情绪高潮的过渡。红色不是装饰，而是整组作品的情绪升温。",
        role: "作为色彩转折和情绪升温节点。",
        goal: "用自然天光完成章节转场。",
        tools: "color study / dusk forest reference",
        output: "赤云色彩样本、森林剪影。",
        reflection: "红色出现得越克制，转折越明显。",
        symbols: "赤云、树影、晚光、剪影",
        motion: "适合云层扩散和树影轻晃。",
        process: "用色彩而不是说明文字推进情绪。",
        edge: "可接入高潮前段。",
        processSteps: ["Dusk", "Red cloud", "Silhouette", "Turn"],
        fragments: ["赤云", "林线", "晚光"],
        image: "./assets/journey/forest-dusk-red-01.png",
        images: ["./assets/journey/forest-dusk-red-01.png", "./assets/journey/forest-dusk-red-02.png", "./assets/journey/snow-campfire.png"]
      },
      {
        cn: "赤云远林",
        en: "Red Dusk Forest II",
        type: "Color Climax",
        summary: "橙红云团与剪影森林，适合作为高潮前远景。",
        copy: "相比林晚赤云，这张更宏大、更像异象。它可以成为作品集最后几章的色彩高潮。",
        role: "为整组视觉建立高潮前的远景信号。",
        goal: "把自然景观推向神话异象。",
        tools: "color mood / wide composition",
        output: "橙红云团、远林剪影、异象远景。",
        reflection: "高潮不是更多元素，而是更强的光色秩序。",
        symbols: "橙红云、远林、雾、异象",
        motion: "适合云团缓慢膨胀。",
        process: "用大面积色块建立末段张力。",
        edge: "可接入终章或预告段。",
        processSteps: ["Climax color", "Wide cloud", "Forest scale", "Signal"],
        fragments: ["赤云", "远林", "异象"],
        image: "./assets/journey/forest-dusk-red-02.png",
        images: ["./assets/journey/forest-dusk-red-02.png", "./assets/journey/forest-dusk-red-01.png", "./assets/journey/journey-mountain-valley.png"]
      },
      {
        cn: "暖竹晨光",
        en: "Warm Bamboo Glade",
        type: "Breathing End",
        summary: "明亮暖调竹林，为作品保留可呼吸的回落段。",
        copy: "这张图让整组作品从压迫和神话空间里回到光线、植物和空气。它不是结尾，而是下一轮继续进入的缓冲。",
        role: "作为舒缓段落和可呼吸的视觉出口。",
        goal: "让作品集不只紧张，也有回落和停顿。",
        tools: "Midjourney / warm light study",
        output: "暖竹林、晨光、轻盈空气样本。",
        reflection: "成熟的作品集需要节奏，不是每张都用力。",
        symbols: "晨光、竹林、草地、水面、微尘",
        motion: "适合微粒漂浮和光线缓慢变化。",
        process: "用亮度和空气感结束一组视觉段落。",
        edge: "可作为下一轮作品入口。",
        processSteps: ["Breath", "Warm light", "Soft exit", "Next entry"],
        fragments: ["晨光", "暖竹", "回落"],
        image: "./assets/journey/warm-bamboo-glade.png",
        images: ["./assets/journey/warm-bamboo-glade.png", "./assets/journey/bamboo-sun-path.png", "./assets/journey/journey-mountain-valley.png"]
      }
    ];
    projectWorks.splice(0, projectWorks.length, ...journeyProjects);
  }

  const works = [
    {
      cn: "作品",
      en: "Works",
      type: "Moving Image Archive",
      summary: document.title.includes("V31") ? "影像项目与场景练习，在这里逐一展开。" : "五件影像作品被收进一个可继续进入的深空档案。",
      copy: document.title.includes("V31") ? "从后西游记到乡土归途，进入作品，观看画面、过程与创作笔记。" : "作品不是首页上的五个并列功能，而是数字展览中的一个完整章节。这里保存已经形成的影像，也保存它们仍未结束的部分。",
      role: document.title.includes("V31") ? "整理影像项目、场景练习与各自的制作过程。" : "把 AI 短片、场景设计、色彩研究、电影概念和民俗符号组织成可进入的作品档案。",
      goal: document.title.includes("V31") ? "让每张图拥有自己的标题、说明、片段和记忆空间，避免旧说明套在新图上。" : "每件作品拥有独立的记忆空间、过程记录和未完成边界。",
      tools: "影像生成 / 镜头设计 / 剪辑 / 声音 / 视觉研究",
      output: document.title.includes("V31") ? "十四个图像章节、对应说明、视觉片段和横向浏览关系。" : "五件作品、过程片段、视觉符号和后续扩展方向。",
      reflection: document.title.includes("V31") ? "这版重点是让图片本身成为作品集主体，文字只负责建立观看顺序。" : "作品章节持续接收新的项目，不把当前五件作品误当成整个网站。",
      edge: document.title.includes("V31") ? "下一轮继续加入每张图的生成过程、版本对照和视频化动效。" : "后续接入每件作品的真实主视觉、剧照和视频。",
      processSteps: ["Enter archive", "Select a signal", "Read memory", "Return to field"],
      fragments: ["影像作品", "过程档案", "未完成边界"],
      items: projectWorks.map((project) => ({
        title: project.cn,
        meta: `${project.en} / ${project.type}`,
        note: project.summary,
        detail: project
      }))
    },
    {
      cn: "阅读",
      en: "Reading",
      type: "Book Constellation",
      summary: "书籍不按完成清单排列，而是组成持续改变连接的阅读星图。",
      copy: "阅读章节保存影响创作判断的书、文章和图像资料。它关注一本书如何改变观看方式，而不只是记录是否读完。",
      role: "建立电影、艺术、设计、叙事和技术阅读之间的连接。",
      goal: "让阅读笔记能够反向连接到作品、实验和学习轨迹。",
      tools: "摘录 / 视觉笔记 / 关键词关系 / 创作映射",
      output: "阅读星图、书目索引、关键概念和作品关联。",
      reflection: "当前书目为结构示例，正式版本将替换为真实阅读记录。",
      edge: "增加时间、主题和作品之间的多向筛选。",
      processSteps: ["Encounter", "Underline", "Connect", "Revisit"],
      fragments: ["电影语言", "观看方式", "艺术与感知"],
      items: [
        { title: "观看之道", meta: "示例书目 / Visual Culture", note: "图像如何被观看语境重新定义。" },
        { title: "电影语言的语法", meta: "示例书目 / Film Language", note: "镜头、调度与剪辑如何建立空间关系。" },
        { title: "艺术与视知觉", meta: "示例书目 / Perception", note: "视觉组织、平衡和运动感的知觉基础。" },
        { title: "故事", meta: "示例书目 / Narrative", note: "叙事结构如何控制期待、压力与释放。" }
      ]
    },
    {
      cn: "学习",
      en: "Learning",
      type: "Learning Orbit",
      summary: "技能、课程和练习形成轨道，展示能力如何被反复训练出来。",
      copy: "学习章节不展示证书墙，而是展示理解如何发生。每条轨道都包含输入、练习、失败、修正和能够进入作品的结果。",
      role: "保存 AI 影像、三维空间、镜头语言、色彩和声音的学习轨迹。",
      goal: "让技能与真实作品建立关系，避免学习记录变成工具名称堆叠。",
      tools: "课程 / 临摹 / 小型练习 / 复盘 / 项目验证",
      output: "阶段轨道、练习节点、方法总结和下一步目标。",
      reflection: "学习内容会随着项目需要重新排序，不按软件目录组织。",
      edge: "补充真实课程、练习截图与阶段性能力图。",
      processSteps: ["Input", "Practice", "Failure", "Transfer"],
      fragments: ["AI 影像", "三维空间", "镜头与声音"],
      items: [
        { title: "AI 影像生成", meta: "Prompt / Consistency / Motion", note: "从单张图像推进到连续镜头和视觉一致性。" },
        { title: "三维空间", meta: "Blender / Camera / Lighting", note: "建立尺度、镜头和光线共同工作的空间意识。" },
        { title: "镜头语言", meta: "Composition / Rhythm", note: "用景别、运动和剪辑控制观看路径。" },
        { title: "色彩与声音", meta: "Color / Atmosphere", note: "让色温、环境声和节奏成为叙事结构。" }
      ]
    },
    {
      cn: "实验",
      en: "Experiments",
      type: "Process Laboratory",
      summary: "失败镜头、动作测试和视觉方法在这里保留为可继续使用的实验样本。",
      copy: "实验章节保存那些尚未成为作品、却已经改变方法的尝试。它允许失败被看见，也允许同一个问题被多次重做。",
      role: "把运动、材质、生成逻辑和交互试验保存为独立样本。",
      goal: "让失败版本和过程判断成为作品集的重要部分。",
      tools: "Motion test / Shader / Edit study / Interaction prototype",
      output: "短循环、材质样本、废弃镜头和可复用方法。",
      reflection: "实验不以完成度排序，而以它是否产生了新的判断排序。",
      edge: "接入可直接播放的小型实验和版本对照。",
      processSteps: ["Question", "Prototype", "Break", "Reuse"],
      fragments: ["运动测试", "材质样本", "失败版本"],
      items: [
        { title: "镜头漂移测试", meta: "Camera Study 01", note: "低频推进、惯性回落和空间压迫的组合。" },
        { title: "雨幕深度测试", meta: "Material Study 02", note: "不同速度与焦段下的雨层分离。" },
        { title: "字符解体测试", meta: "Type Motion 03", note: "文字作为物质而非平面标签的交互实验。" },
        { title: "暗物质表面", meta: "Shader Study 04", note: "用流动噪声和边缘散射建立未知物体。" }
      ]
    },
    {
      cn: "关于",
      en: "About",
      type: "Personal Coordinate",
      summary: "创作者的方向、方法和仍未命名的未来被保存为一组开放坐标。",
      copy: "关于不是履历终点，而是这座数字展览的坐标说明。它解释创作从哪里出发、目前如何工作，以及哪些方向仍然未知。",
      role: "连接个人经验、创作方法、合作方式和未来计划。",
      goal: "让观众理解作品之间共同的观看方式，而不是只读取项目列表。",
      tools: "观察 / 采集 / 生成 / 剪辑 / 反思",
      output: "创作陈述、方法坐标、阶段时间线和联系入口。",
      reflection: "身份保持开放，方法会随着新的作品继续改变。",
      edge: "加入真实履历、合作项目和联系方式。",
      processSteps: ["Observe", "Collect", "Transform", "Remain open"],
      fragments: ["创作方向", "方法坐标", "未来信号"],
      items: [
        { title: "创作方向", meta: "Moving image / AI / Memory", note: "关注影像、记忆、地域经验与生成技术的关系。" },
        { title: "工作方法", meta: "Research / Make / Reflect", note: "从资料采集到视觉实验，再回到叙事判断。" },
        { title: "开放合作", meta: "Film / Art / Digital Exhibition", note: "面向影像、艺术与数字展览的共同创作。" }
      ]
    }
  ];

  const boundaryChapter = {
    cn: "开放边界",
    en: "Open Boundary",
    type: "Future Signals",
    summary: "当前地图抵达边缘，但仍保留可继续生长的远处信号。",
    copy: "边界不是总结页，而是一组尚未完全命名的坐标。它把下一阶段真正需要补齐的素材、过程和未来航线暴露出来，让作品集保持未完成的生命感。",
    role: "把作品集的下一轮生长方向变成可读取的档案节点，而不是隐藏在开发清单里。",
    goal: "让观众在离开展览前看到系统仍然开放：素材会被替换，失败会被保存，新的作品会从远处信号进入当前宇宙。",
    tools: "真实影像素材 / 版本对照 / 过程记录 / 未来项目规划",
    output: "三组开放信号：素材接入、失败版本库和未来航线。",
    reflection: "最好的结尾不负责关闭故事，只负责让下一次进入变得合理。",
    edge: "当真实素材、失败镜头和下一件作品出现时，这一层会继续改变坐标。",
    processSteps: ["Expose edge", "Attach evidence", "Keep failure", "Name next signal"],
    fragments: ["素材证据", "失败回声", "未来航线"],
    items: [
      {
        title: "真实素材接入",
        meta: "Stills / Video / Image Evidence",
        note: "把五件作品的主视觉、剧照和片段视频接入当前记忆舱，替换太空裁切占位。"
      },
      {
        title: "失败版本库",
        meta: "Rejected Shots / Process Memory",
        note: "把废弃镜头、失败提示词和错误判断保存为可阅读的过程证据。"
      },
      {
        title: "未来航线",
        meta: "Unnamed Work / Next Orbit",
        note: "为下一件尚未命名的作品预留远处信号，让作品集不以当前五章为终点。"
      }
    ]
  };

  const visualStates = [
    {
      form: 0,
      explode: 0,
      tint: [1.03, 1.0, .93],
      exposure: 1,
      phase: 0,
      lens: .22,
      object: { x: .88, y: .56, z: .15, scale: 1.02 },
      phaseName: "Condensed matter / resting"
    },
    {
      form: 1,
      explode: .14,
      tint: [.9, .95, 1.05],
      exposure: .94,
      phase: 1.35,
      lens: .34,
      object: { x: -.5, y: .08, z: -.15, scale: .78 },
      phaseName: "Reading field / slow accretion"
    },
    {
      form: 2,
      explode: .2,
      tint: [.8, .95, 1.08],
      exposure: 1.03,
      phase: 2.8,
      lens: .46,
      object: { x: .78, y: .16, z: -.38, scale: .78 },
      phaseName: "Learning field / orbital pulse"
    },
    {
      form: 3,
      explode: .3,
      tint: [.68, .78, .88],
      exposure: .78,
      phase: 4.4,
      lens: .56,
      object: { x: -.7, y: -.24, z: -.42, scale: .7 },
      phaseName: "Experiment field / turbulence"
    },
    {
      form: .55,
      explode: .12,
      tint: [1.06, .88, .67],
      exposure: .92,
      phase: 6,
      lens: .38,
      object: { x: .18, y: .1, z: -.72, scale: .68 },
      phaseName: "Personal field / open coordinate"
    }
  ];

  const formLabels = [
    "Condensed / 凝聚",
    "Accretion / 吸积",
    "Turbulence / 湍流",
    "Expansion / 膨胀"
  ];

  const glyphShiftMap = new Map([
    ["脑", "腦"],
    ["海", "海"],
    ["宇", "宇"],
    ["宙", "宙"],
    ["回", "迴"],
    ["不", "不"],
    ["去", "去"],
    ["的", "的"],
    ["乡", "鄉"],
    ["东", "東"],
    ["方", "方"],
    ["玄", "玄"],
    ["幻", "幻"],
    ["雨", "雨"],
    ["夜", "夜"],
    ["与", "與"],
    ["红", "紅"],
    ["骸", "骸"],
    ["骨", "骨"],
    ["之", "之"],
    ["岸", "岸"],
    ["民", "民"],
    ["俗", "俗"],
    ["符", "符"],
    ["号", "號"]
    ,["作", "作"]
    ,["品", "品"]
    ,["阅", "閱"]
    ,["读", "讀"]
    ,["学", "學"]
    ,["习", "習"]
    ,["实", "實"]
    ,["验", "驗"]
    ,["关", "關"]
    ,["于", "於"]
  ]);

  function cubicBezier(x1, y1, x2, y2) {
    const sample = (a1, a2, value) =>
      ((1 - 3 * a2 + 3 * a1) * value + (3 * a2 - 6 * a1)) * value * value +
      3 * a1 * value;
    const slope = (a1, a2, value) =>
      3 * (1 - 3 * a2 + 3 * a1) * value * value +
      2 * (3 * a2 - 6 * a1) * value +
      3 * a1;

    return (progress) => {
      let estimate = progress;
      for (let index = 0; index < 5; index += 1) {
        const currentSlope = slope(x1, x2, estimate);
        if (Math.abs(currentSlope) < .0001) break;
        estimate -= (sample(x1, x2, estimate) - progress) / currentSlope;
        estimate = Math.max(0, Math.min(1, estimate));
      }
      return sample(y1, y2, estimate);
    };
  }

  const materialEase = {
    standard: cubicBezier(.4, 0, .2, 1),
    enter: cubicBezier(0, 0, .2, 1),
    exit: cubicBezier(.4, 0, 1, 1),
    sharp: cubicBezier(.4, 0, .6, 1)
  };

  const viewportWidth = () =>
    Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
  const viewportHeight = () =>
    Math.round(window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight);
  const isCompactViewport = () =>
    window.matchMedia("(max-width: 720px)").matches || viewportWidth() < 720;

  const stage = document.getElementById("stage");
  const voyage = document.getElementById("voyage");
  const loader = document.getElementById("loader");
  const entryGate = document.getElementById("entryGate");
  const entryButton = document.getElementById("entryButton");
  const workNav = document.getElementById("workNav");
  const indexOverlay = document.getElementById("indexOverlay");
  const memoryOverlay = document.getElementById("memoryOverlay");
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursorLabel");
  const shockwave = document.getElementById("shockwave");
  const backgroundRipple = document.getElementById("backgroundRipple");
  const authorityField = document.getElementById("authorityField");
  const objectPrompt = document.getElementById("objectPrompt");
  const phaseCode = document.getElementById("phaseCode");
  const phaseStatus = document.getElementById("phaseStatus");
  const fallback = document.getElementById("fallback");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lenis = null;
  let activeWork = 0;
  let lastFocus = null;
  let travelProgress = 0;
  let scrollVelocity = 0;
  let backgroundAwakeTimer = 0;
  let hoverMorphTimer = 0;
  let interactionTimeline = null;
  let renderer;
  let objectScene;
  let objectCamera;
  let backgroundScene;
  let backgroundCamera;
  let backgroundMaterial;
  let backgroundReady = false;
  let clock;
  let objectGroup;
  let shardMesh;
  let shardData = [];
  let shardShapes = [];
  let core;
  let coreGlow;
  let orbitLines = [];
  let armillaryRings = [];
  let ringNodes = [];
  let coreShell;
  let matterSurfaceMaterial;
  let coronaShell;
  let coronaMaterial;
  let objectHalo;
  let objectHaloData = [];
  let travelDust;
  let travelDustData = [];
  let hitTarget;
  let raycaster;
  let warmLight;
  let coldLight;
  let isObjectHover = false;
  let pointerReady = false;
  let currentBaseForm = 0;
  let currentBaseExplode = 0;
  let workLetterControllers = [];
  let heroLetterControllers = [];
  let magneticControllers = [];
  let lineSidebarTargets = [];
  let experienceEntered = false;
  let layoutRevealed = false;
  const revealedWorks = new Set();

  const pointer = new THREE.Vector2(8, 8);
  const pointerSmooth = new THREE.Vector2(0, 0);
  const pointerUv = new THREE.Vector2(.5, .5);
  const pointerUvSmooth = new THREE.Vector2(.5, .5);
  const previousPointer = new THREE.Vector2(.5, .5);
  const objectTarget = { x: .62, y: -.34, z: .15, scale: .88 };
  const objectState = {
    form: 0,
    explode: 0,
    energy: .2,
    hover: 0,
    spin: 0
  };
  const rippleState = { value: 0 };
  const authorityState = {
    value: 0,
    speed: 0,
    hold: 0
  };
  const ringState = {
    spread: 0,
    aperture: 0,
    twist: 0
  };
  const tempObject = new THREE.Object3D();
  const tempPosition = new THREE.Vector3();
  const tempPositionB = new THREE.Vector3();
  const tempQuaternion = new THREE.Quaternion();
  const tempQuaternionB = new THREE.Quaternion();
  const tempScale = new THREE.Vector3();
  const tempEuler = new THREE.Euler();
  const tempColor = new THREE.Color();

  const backgroundVertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const backgroundFragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uRippleCenter;
    uniform vec3 uTint;
    uniform float uTime;
    uniform float uScroll;
    uniform float uVelocity;
    uniform float uLens;
    uniform float uRipple;
    uniform float uPhase;
    uniform float uExposure;
    uniform float uImageAspect;
    uniform float uAuthority;
    uniform float uPointerSpeed;
    uniform float uHold;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv) {
      float screenAspect = uResolution.x / uResolution.y;
      vec2 result = uv;
      if (screenAspect < uImageAspect) {
        result.x = (uv.x - .5) * (screenAspect / uImageAspect) + .5;
      } else {
        result.y = (uv.y - .5) * (uImageAspect / screenAspect) + .5;
      }
      return result;
    }

    float hash21(vec2 value) {
      value = fract(value * vec2(123.34, 456.21));
      value += dot(value, value + 45.32);
      return fract(value.x * value.y);
    }

    float valueNoise(vec2 point) {
      vec2 cell = floor(point);
      vec2 local = fract(point);
      local = local * local * (3.0 - 2.0 * local);
      float a = hash21(cell);
      float b = hash21(cell + vec2(1.0, 0.0));
      float c = hash21(cell + vec2(0.0, 1.0));
      float d = hash21(cell + vec2(1.0, 1.0));
      return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
    }

    float flowNoise(vec2 point) {
      float value = 0.0;
      float amplitude = .55;
      for (int octave = 0; octave < 4; octave++) {
        value += valueNoise(point) * amplitude;
        point = point * 2.03 + vec2(7.1, 3.8);
        amplitude *= .5;
      }
      return value;
    }

    mat2 rotateField(float angle) {
      float sine = sin(angle);
      float cosine = cos(angle);
      return mat2(cosine, -sine, sine, cosine);
    }

    float deepStarLayer(vec2 point, float density, float threshold) {
      vec2 cell = floor(point * density);
      vec2 local = fract(point * density) - .5;
      float seed = hash21(cell);
      float radius = mix(.022, .075, hash21(cell + 17.4));
      float star = 1.0 - smoothstep(0.0, radius, length(local));
      return star * step(threshold, seed);
    }

    float meteorTrace(vec2 uv, float cycle, vec2 origin, vec2 direction) {
      vec2 head = origin + direction * cycle;
      vec2 delta = uv - head;
      vec2 normal = vec2(-direction.y, direction.x);
      float lineDistance = abs(dot(delta, normal));
      float along = dot(delta, normalize(direction));
      float tail = smoothstep(-.23, -.015, along) * (1.0 - smoothstep(-.01, .018, along));
      return (1.0 - smoothstep(.0, .0022, lineDistance)) * tail;
    }

    void main() {
      vec2 screenUv = vUv;
      vec2 uv = coverUv(screenUv);
      float aspect = uResolution.x / uResolution.y;
      float breath = sin(uTime * .19 + uPhase) * .5 + .5;

      vec2 cameraDrift = vec2(
        sin(uTime * .031 + uPhase),
        cos(uTime * .026 + uPhase * .7)
      ) * .0026;
      float cameraScale = .994 - uScroll * .034 - breath * .006 - uAuthority * .0085;
      uv = (uv - .5) * cameraScale + .5;
      uv += cameraDrift + vec2(uScroll * .009, -uScroll * .003);

      vec2 mouseDelta = screenUv - uMouse;
      mouseDelta.x *= aspect;
      float mouseDistance = length(mouseDelta);
      vec2 mouseDirection = normalize(mouseDelta + vec2(.0001));
      float controlCore = exp(-mouseDistance * mouseDistance * 34.0);
      float controlHalo = exp(-pow(mouseDistance - .19, 2.0) * 145.0);
      float lensField = controlCore * uLens * uAuthority;

      // Keep the photographic layer stable: only a tightly bounded radial compression is allowed.
      uv -= mouseDirection * lensField * (.0038 + uHold * .0032);

      vec2 rippleDelta = screenUv - uRippleCenter;
      rippleDelta.x *= aspect;
      float rippleDistance = length(rippleDelta);
      float ring = sin(rippleDistance * 54.0 - uTime * 8.2) *
        exp(-rippleDistance * 6.4) * uRipple;
      uv += normalize(rippleDelta + vec2(.0001)) * ring * .0024;

      float velocityOffset = clamp(abs(uVelocity) * .000018, 0.0, .0014);
      float chroma = controlHalo * uAuthority * .0022 + velocityOffset;
      vec2 chromaDirection = mouseDirection * chroma;
      vec3 centerSample = texture2D(uTexture, clamp(uv, vec2(.001), vec2(.999))).rgb;
      float redSample = texture2D(uTexture, clamp(uv + chromaDirection, vec2(.001), vec2(.999))).r;
      float blueSample = texture2D(uTexture, clamp(uv - chromaDirection, vec2(.001), vec2(.999))).b;
      vec3 color = vec3(redSample, centerSample.g, blueSample);

      vec2 flowPoint = screenUv * vec2(3.4, 2.2);
      flowPoint += vec2(uTime * .018, -uTime * .011) + uPhase * .17;
      float slowFlow = flowNoise(flowPoint);
      float fineFlow = flowNoise(flowPoint * 2.7 - vec2(uTime * .026, 0.0));
      float volume = (slowFlow - .48) * .055 + (fineFlow - .5) * .018;
      color += vec3(.14, .25, .27) * volume;

      vec2 skyPoint = screenUv - vec2(.68, .48);
      skyPoint.x *= aspect;
      vec2 farField = rotateField(uTime * .0018) * skyPoint;
      vec2 nearField = rotateField(-uTime * .0031) * skyPoint;
      float farStars = deepStarLayer(farField + vec2(.71, .46), 118.0, .991);
      float nearStars = deepStarLayer(nearField + vec2(.67, .51), 76.0, .986);
      float starPulse = .58 + sin(uTime * .47 + hash21(floor(farField * 90.0)) * 15.0) * .22;
      color += vec3(.58, .68, .7) * farStars * starPulse * .34;
      color += vec3(.78, .72, .6) * nearStars * .24;

      float meteorCycleA = fract((uTime + 1.8) / 17.0);
      float meteorWindowA = smoothstep(.08, .11, meteorCycleA) *
        (1.0 - smoothstep(.16, .2, meteorCycleA));
      float meteorA = meteorTrace(
        screenUv,
        meteorCycleA * 7.4,
        vec2(-.18, .78),
        normalize(vec2(.92, -.38))
      ) * meteorWindowA;
      float meteorCycleB = fract((uTime + 11.0) / 29.0);
      float meteorWindowB = smoothstep(.1, .125, meteorCycleB) *
        (1.0 - smoothstep(.17, .21, meteorCycleB));
      float meteorB = meteorTrace(
        screenUv,
        meteorCycleB * 6.8,
        vec2(.18, 1.08),
        normalize(vec2(.74, -.66))
      ) * meteorWindowB;
      color += vec3(.72, .82, .83) * meteorA * .74;
      color += vec3(.82, .72, .56) * meteorB * .42;

      float authorityShade = uAuthority * (.07 + uHold * .045);
      color *= 1.0 - authorityShade * (1.0 - controlCore * .6);
      float foldContour = exp(-pow(mouseDistance - .125, 2.0) * 620.0) * uAuthority;
      color *= 1.0 - controlCore * uAuthority * (.13 + uHold * .08);
      color += vec3(.78, .64, .42) * controlHalo * uAuthority * .075;
      color += vec3(.46, .69, .71) * foldContour * .12;
      color += vec3(.32, .48, .5) * abs(ring) * .075;

      float pulseLight = abs(ring) * .15 + controlCore * uPointerSpeed * .08;
      color *= uTint * uExposure * (1.0 + breath * .018 + pulseLight);

      float vignette = smoothstep(.48, 1.05, length((screenUv - .5) * vec2(.9, 1.0)));
      color *= 1.0 - vignette * (.1 + uAuthority * .08);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothStep(value) {
    return value * value * (3 - 2 * value);
  }

  function buildInterface() {
    const indexList = document.getElementById("indexList");
    workNav.innerHTML = "";
    indexList.innerHTML = "";

    works.forEach((work, index) => {
      const navButton = document.createElement("button");
      navButton.type = "button";
      navButton.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><span>${work.cn}</span>`;
      navButton.setAttribute("aria-label", `前往章节：${work.cn}`);
      navButton.addEventListener("click", (event) => {
        event.preventDefault();
        scrollToWork(index, { immediate: true });
      });
      workNav.appendChild(navButton);

      const indexButton = document.createElement("button");
      indexButton.type = "button";
      indexButton.className = "index-work";
      indexButton.innerHTML = `
        <span class="number">${String(index + 1).padStart(2, "0")}</span>
        <span class="title">${work.cn}</span>
        <span class="meta">${work.en} / ${work.type}<br>${work.summary}</span>
        <span class="arrow">→</span>
      `;
      indexButton.addEventListener("click", () => {
        closeIndex(false, () => scrollToWork(index, { immediate: true }));
      });
      indexList.appendChild(indexButton);
    });

    setActiveWork(0, false);
  }

  function splitIntoWords(element) {
    const text = element.textContent.trim();
    let parts;
    if (window.Intl?.Segmenter) {
      parts = [...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text)]
        .map((item) => item.segment);
    } else {
      parts = text.match(/[\u3400-\u9fff]{1,2}|[A-Za-z0-9]+|[^\s]/g) || [text];
    }
    element.innerHTML = parts.map((part) =>
      `<span class="reveal-word">${part.replace(/ /g, "&nbsp;")}</span>`
    ).join("");
  }

  function createMosaic(target, columns = 7, rows = 3) {
    target.querySelector(":scope > .mosaic-grid")?.remove();
    target.classList.add("mosaic-shell");
    const grid = document.createElement("span");
    grid.className = "mosaic-grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    for (let index = 0; index < columns * rows; index += 1) {
      grid.appendChild(document.createElement("i"));
    }
    target.appendChild(grid);
    return [...grid.children];
  }

  function addMosaicReveal(timeline, target, position = 0) {
    const tiles = createMosaic(target);
    gsap.set(target, { filter: "blur(12px)", opacity: .28 });
    gsap.set(tiles, {
      opacity: () => .42 + Math.random() * .5,
      scale: () => .55 + Math.random() * .75
    });
    timeline
      .to(target, {
        filter: "blur(0px)",
        opacity: 1,
        duration: .82,
        ease: materialEase.enter
      }, position)
      .to(tiles, {
        opacity: 0,
        scale: .15,
        duration: .62,
        stagger: { amount: .72, from: "random" },
        ease: materialEase.exit
      }, position + .08)
      .set(tiles, { display: "none" });
  }

  function prepareRevealSystem() {
    gsap.set([".topbar", ".hero", ".work-nav", ".object-prompt", ".ambient-status"], {
      autoAlpha: 0
    });
    gsap.set(".spatial-grid i", { scaleY: 0, transformOrigin: "top" });
    gsap.set("#workPanel", { autoAlpha: 0 });
  }

  function revealMainLayout() {
    if (layoutRevealed) return;
    layoutRevealed = true;
    const timeline = gsap.timeline();
    const titleLetters = [...document.querySelectorAll(".hero-char i")];
    const copyWords = [...document.querySelectorAll(".hero-copy .reveal-word")];

    gsap.set([".topbar", ".hero", ".work-nav", ".object-prompt", ".ambient-status"], {
      autoAlpha: 1
    });

    timeline
      .to(".spatial-grid i", {
        scaleY: 1,
        duration: 1.15,
        stagger: { each: .045, from: "edges" },
        ease: materialEase.enter
      }, 0)
      .fromTo(".brand", {
        x: -52,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: .78,
        ease: materialEase.enter
      }, .12)
      .fromTo(".index-trigger", {
        x: 46,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .62,
        ease: materialEase.enter
      }, .24)
      .fromTo(".hero-kicker", {
        x: 74,
        opacity: 0,
        clipPath: "inset(0 0 0 100%)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0 0 0%)",
        duration: .86,
        ease: materialEase.enter
      }, .3);

    titleLetters.forEach((letter, index) => {
      const variants = [
        { from: { yPercent: 118, rotate: 7, opacity: 0 }, duration: .82 },
        { from: { x: 68, filter: "blur(11px)", opacity: 0 }, duration: .92 },
        { from: { scale: 1.42, filter: "blur(8px)", opacity: 0 }, duration: .78 },
        { from: { y: -54, x: -18, rotate: -5, opacity: 0 }, duration: .88 }
      ];
      const variant = variants[index % variants.length];
      timeline.fromTo(letter, variant.from, {
        x: 0,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: variant.duration,
        ease: index % 2 ? materialEase.standard : materialEase.enter
      }, .42 + index * .085);
    });

    timeline
      .fromTo(".hero-index", {
        y: 34,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: .58,
        ease: materialEase.enter
      }, .86)
      .fromTo(".hero-coordinate > span:first-child", {
        x: -28,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .52,
        ease: materialEase.enter
      }, .92)
      .fromTo(".hero-coordinate i", {
        scaleX: 0,
        transformOrigin: "right"
      }, {
        scaleX: 1,
        duration: .72,
        ease: materialEase.standard
      }, .88)
      .fromTo(".hero-coordinate > span:last-child", {
        x: 36,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .6,
        ease: materialEase.enter
      }, 1.02);

    timeline.fromTo(".hero-copy", {
      y: 14,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: .48,
      ease: materialEase.enter
    }, .88);

    timeline
      .fromTo(".work-nav button", {
        x: (index) => index % 2 ? 38 : -26,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0
      }, {
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: .66,
        stagger: .065,
        ease: materialEase.enter
      }, 1.18)
      .fromTo(["#objectPrompt", ".ambient-status"], {
        opacity: 0,
        y: 18
      }, {
        opacity: 1,
        y: 0,
        duration: .56,
        stagger: .16,
        ease: materialEase.enter
      }, 1.34);
  }

  function revealWork(index) {
    if (!experienceEntered || revealedWorks.has(index)) return;
    revealedWorks.add(index);
    const panel = document.getElementById("workPanel");
    const title = document.getElementById("workTitle");
    const letters = [...title.querySelectorAll(".work-letter")];
    const timeline = gsap.timeline();

    gsap.set(panel, { autoAlpha: 1, y: 0 });
    timeline
      .fromTo("#workSequence", {
        x: -42,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: .7,
        ease: materialEase.enter
      }, 0);

    letters.forEach((letter, letterIndex) => {
      const variants = [
        { x: 70, opacity: 0, filter: "blur(10px)" },
        { yPercent: 125, opacity: 0, rotate: 6 },
        { scale: 1.5, opacity: 0, filter: "blur(8px)" },
        { x: -44, y: -20, opacity: 0 }
      ];
      timeline.fromTo(letter, variants[(letterIndex + index) % variants.length], {
        x: 0,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: .72 + letterIndex * .045,
        ease: letterIndex % 2 ? materialEase.standard : materialEase.enter
      }, .14 + letterIndex * .07);
    });

    addMosaicReveal(timeline, title, .08);

    timeline
      .fromTo("#workMeta", {
        x: 46,
        opacity: 0,
        filter: "blur(6px)"
      }, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: .72,
        ease: materialEase.enter
      }, .5)
      .fromTo(".enter-work", {
        y: 22,
        opacity: 0,
        clipPath: "inset(0 0 100% 0)"
      }, {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: .62,
        ease: materialEase.enter
      }, .68);
  }

  function setWorkTitle(text) {
    const title = document.getElementById("workTitle");
    title.setAttribute("aria-label", text);
    title.innerHTML = [...text].map((character) => `<span class="work-letter">${character}</span>`).join("");
    buildLetterControllers();
  }

  function setActiveWork(index, animate = true) {
    if (index === activeWork && animate) {
      if (stage.classList.contains("has-work")) revealWork(index);
      return;
    }
    activeWork = index;
    const work = works[index];
    const state = visualStates[index];

    [...workNav.children].forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    const updateText = () => {
      document.getElementById("workSequence").textContent =
        `Chapter ${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
      setWorkTitle(work.cn);
      document.getElementById("workMeta").textContent = `${work.en} / ${work.type}`;
      document.getElementById("workSummary").textContent = work.summary;
    };

    updateText();

    stage.classList.remove("layout-0", "layout-1", "layout-2", "layout-3", "layout-4");
    stage.classList.add(`layout-${index}`);
    stage.dataset.work = String(index);
    applyVisualState(state, animate);
    if (animate && stage.classList.contains("has-work")) {
      if (revealedWorks.has(index)) {
        gsap.set("#workPanel", { autoAlpha: 1, x: 0, y: 0 });
      } else {
        revealWork(index);
      }
    }
  }

  function applyVisualState(state, animate) {
    currentBaseForm = state.form;
    currentBaseExplode = state.explode;
    const duration = animate && !reducedMotion ? .9 : 0;

    gsap.to(objectTarget, {
      ...state.object,
      duration,
      ease: materialEase.standard
    });
    gsap.to(ringState, {
      aperture: .08 + state.lens * .22,
      spread: state.explode * .26,
      twist: ringState.twist + (animate ? .48 : 0),
      duration,
      ease: materialEase.standard
    });

    if (backgroundMaterial) {
      gsap.to(backgroundMaterial.uniforms.uTint.value, {
        x: state.tint[0],
        y: state.tint[1],
        z: state.tint[2],
        duration: duration || .01,
        ease: materialEase.standard
      });
      gsap.to(backgroundMaterial.uniforms.uExposure, {
        value: state.exposure,
        duration: duration || .01,
        ease: materialEase.standard
      });
      gsap.to(backgroundMaterial.uniforms.uPhase, {
        value: state.phase,
        duration: duration || .01,
        ease: materialEase.standard
      });
      if (!isObjectHover) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: state.lens,
          duration: duration || .01,
          ease: materialEase.standard
        });
      }
    }

    phaseCode.textContent = `Form ${String(Math.round(state.form) + 1).padStart(2, "0")}`;
    phaseStatus.textContent = state.phaseName;

    if (!shardMesh || isObjectHover) return;
    interactionTimeline?.kill();
    interactionTimeline = gsap.timeline();
    interactionTimeline
      .to(objectState, {
        explode: Math.max(.78, currentBaseExplode),
        energy: .85,
        duration: animate ? .34 : 0,
        ease: materialEase.exit
      })
      .to(objectState, {
        form: currentBaseForm,
        duration: animate ? .72 : 0,
        ease: materialEase.standard
      })
      .to(objectState, {
        explode: currentBaseExplode,
        energy: .28,
        duration: animate ? .56 : 0,
        ease: materialEase.enter
      });
  }

  function scrollToWork(index, options = {}) {
    const safeIndex = Math.max(0, Math.min(works.length - 1, index));
    const progress = .08 + ((safeIndex + .5) / works.length) * .92;
    const target = voyage.offsetTop + progress * Math.max(0, voyage.offsetHeight - window.innerHeight);
    setActiveWork(safeIndex, true);
    if (options.immediate && lenis) {
      lenis.scrollTo(target, { immediate: true, force: true });
    } else if (options.immediate) {
      window.scrollTo(0, target);
    } else if (lenis) {
      lenis.scrollTo(target, { duration: 1.45 });
    } else {
      window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
    }
    window.ScrollTrigger?.update();
  }

  function openIndex(trigger) {
    lastFocus = trigger;
    indexOverlay.classList.add("is-open");
    lenis?.stop();
    gsap.fromTo(indexOverlay, { clipPath: "inset(0 0 100% 0)" }, {
      clipPath: "inset(0 0 0% 0)",
      duration: reducedMotion ? 0 : .85,
      ease: "power4.inOut"
    });
    gsap.fromTo(".index-work", { y: 20, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: reducedMotion ? 0 : .58,
      stagger: .055,
      delay: reducedMotion ? 0 : .32,
      ease: "power3.out"
    });
    document.getElementById("indexClose").focus();
  }

  function closeIndex(restoreFocus = true, onClosed = null) {
    const finish = () => {
      indexOverlay.classList.remove("is-open");
      indexOverlay.style.clipPath = "";
      lenis?.start();
      if (restoreFocus) lastFocus?.focus();
      onClosed?.();
    };

    if (reducedMotion) {
      finish();
    } else {
      gsap.to(indexOverlay, {
        clipPath: "inset(100% 0 0 0)",
        duration: .65,
        ease: "power3.inOut",
        onComplete: finish
      });
    }
  }

  function setMemoryImages(source) {
    const fallback = "./assets/space-hero.png";
    const images = source.images?.length ? source.images : [source.image || fallback, fallback, fallback];
    const mainImage = document.querySelector(".memory-image img");
    mainImage.src = source.image || images[0] || fallback;
    mainImage.alt = source.cn || source.en || "作品影像";
    document.querySelectorAll("#memoryFragments figure").forEach((figure, index) => {
      const image = figure.querySelector("img");
      image.src = images[index] || images[0] || fallback;
      image.alt = source.fragments?.[index] || source.cn || "作品片段";
    });
  }

  function normalizeMemoryDetail(chapter, item) {
    if (item.detail) return item.detail;
    return {
      cn: item.title,
      en: item.meta,
      type: chapter.type,
      copy: item.note,
      role: item.note,
      goal: chapter.goal,
      tools: chapter.tools,
      output: chapter.output,
      reflection: chapter.reflection,
      edge: chapter.edge,
      image: item.image || chapter.image,
      images: item.images || chapter.images,
      fragments: chapter.fragments,
      processSteps: chapter.processSteps
    };
  }

  function setMemorySelection(chapter, index) {
    const selectedIndex = Number(index);
    const item = chapter.items[selectedIndex];
    if (!item) return;
    const detail = normalizeMemoryDetail(chapter, item);
    memoryOverlay.dataset.signal = "selected";
    document.querySelectorAll("[data-memory-index]").forEach((node) => {
      node.classList.toggle("is-active", Number(node.dataset.memoryIndex) === selectedIndex);
    });
    document.getElementById("memoryKicker").textContent = `${detail.type} / ${detail.en || chapter.en}`;
    document.getElementById("memoryTitle").textContent = detail.cn;
    document.getElementById("memoryEnglish").textContent = detail.en || item.meta;
    document.getElementById("memoryDescription").textContent = detail.copy;
    document.getElementById("memoryRole").textContent = detail.role;
    document.getElementById("memoryGoal").textContent = detail.goal;
    document.getElementById("memoryTools").textContent = detail.tools;
    document.getElementById("memoryOutput").textContent = detail.output;
    document.getElementById("memoryReflection").textContent = detail.reflection;
    document.getElementById("memoryEdge").textContent = detail.edge;
    setMemoryImages(detail);
    document.querySelectorAll("#memoryFragments figcaption").forEach((caption, fragmentIndex) => {
      caption.textContent = detail.fragments?.[fragmentIndex] ||
        `Archive fragment ${String(fragmentIndex + 1).padStart(2, "0")}`;
    });
    document.querySelectorAll("#memoryProcessAxis span").forEach((step, stepIndex) => {
      const label = detail.processSteps?.[stepIndex] || chapter.processSteps[stepIndex];
      step.innerHTML = `<b>${String(stepIndex + 1).padStart(2, "0")}</b>${label}`;
    });

    memoryOverlay.classList.remove("scan-active");
    void memoryOverlay.offsetWidth;
    memoryOverlay.classList.add("scan-active");

    gsap.fromTo(
      [".memory-title-rail > *", ".memory-description", ".memory-facts > div", ".memory-process-axis span"],
      { y: 10, opacity: .35 },
      {
        y: 0,
        opacity: 1,
        duration: .42,
        stagger: .025,
        ease: "power3.out",
        overwrite: true
      }
    );
  }

  function renderMemoryMap(chapter) {
    const map = document.getElementById("memoryMap");
    map.innerHTML = `<div class="memory-map-core">${chapter.en}<br>${String(chapter.items.length).padStart(2, "0")} signals</div>`;
    chapter.items.forEach((item, index) => {
      const angle = -Math.PI / 2 + index / chapter.items.length * Math.PI * 2;
      const x = 50 + Math.cos(angle) * 34;
      const y = 50 + Math.sin(angle) * 36;
      const line = document.createElement("i");
      line.className = "memory-map-line";
      line.style.setProperty("--line-angle", `${angle * 180 / Math.PI}deg`);
      line.style.setProperty("--line-length", `${Math.hypot(x - 50, y - 50) * .95}%`);
      map.appendChild(line);

      const node = document.createElement("button");
      node.type = "button";
      node.className = "memory-node";
      node.dataset.index = String(index + 1).padStart(2, "0");
      node.dataset.memoryIndex = String(index);
      node.style.setProperty("--node-x", `${x.toFixed(2)}%`);
      node.style.setProperty("--node-y", `${y.toFixed(2)}%`);
      node.setAttribute("aria-label", `读取信号：${item.title}`);
      node.innerHTML = `
        <span class="memory-node-label">
          <strong>${item.title}</strong>
          <small>${item.meta}</small>
        </span>
      `;
      node.addEventListener("click", () => setMemorySelection(chapter, index));
      map.appendChild(node);
    });
  }

  function renderMemorySamples(chapter) {
    const strip = document.getElementById("memorySampleStrip");
    strip.innerHTML = "";
    chapter.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-sample";
      button.dataset.memoryIndex = String(index);
      button.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${item.title}</strong>
        <small>${item.note}</small>
      `;
      button.addEventListener("click", () => setMemorySelection(chapter, index));
      strip.appendChild(button);
    });
  }

  function renderChapterLedger(chapter) {
    const ledger = document.getElementById("chapterLedger");
    ledger.innerHTML = "";
    chapter.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.memoryIndex = String(index);
      button.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${item.title}</strong>
        <small>${item.meta}</small>
        <i>↗</i>
      `;
      button.addEventListener("click", () => setMemorySelection(chapter, index));
      ledger.appendChild(button);
    });
  }

  function populateMemoryChapter(chapter, ordinal, signalLabel, frameCode) {
    document.getElementById("memorySignal").textContent = signalLabel;
    document.getElementById("memoryFrameCode").textContent = frameCode;
    document.getElementById("memoryOrdinal").textContent = ordinal;
    document.getElementById("memoryKicker").textContent = `${chapter.type} / ${chapter.en}`;
    document.getElementById("memoryTitle").textContent = chapter.cn;
    document.getElementById("memoryEnglish").textContent = chapter.en;
    document.getElementById("memoryDescription").textContent = chapter.copy;
    document.getElementById("memoryRole").textContent = chapter.role;
    document.getElementById("memoryGoal").textContent = chapter.goal;
    document.getElementById("memoryTools").textContent = chapter.tools;
    document.getElementById("memoryOutput").textContent = chapter.output;
    document.getElementById("memoryReflection").textContent = chapter.reflection;
    document.getElementById("memoryEdge").textContent = chapter.edge;
    setMemoryImages(chapter);
    document.querySelectorAll("#memoryFragments figcaption").forEach((caption, index) => {
      caption.textContent = chapter.fragments[index] || `Fragment / ${String(index + 1).padStart(2, "0")}`;
    });
    document.querySelectorAll("#memoryProcessAxis span").forEach((step, index) => {
      const label = chapter.processSteps[index] || step.textContent;
      step.innerHTML = `<b>${String(index + 1).padStart(2, "0")}</b>${label}`;
    });
    memoryOverlay.dataset.signal = "overview";
    renderMemoryMap(chapter);
    renderMemorySamples(chapter);
    renderChapterLedger(chapter);
  }

  function openMemory(trigger) {
    const work = works[activeWork];
    const ordinal = String(activeWork + 1).padStart(2, "0");
    lastFocus = trigger;
    populateMemoryChapter(
      work,
      ordinal,
      `Exhibition chapter ${ordinal}`,
      `Living archive / ${ordinal}`
    );
    memoryOverlay.dataset.work = String(activeWork + 1);
    memoryOverlay.classList.add("is-open");
    memoryOverlay.classList.remove("scan-active");
    void memoryOverlay.offsetWidth;
    memoryOverlay.classList.add("scan-active");
    lenis?.stop();

    gsap.timeline()
      .fromTo(memoryOverlay, { clipPath: "inset(100% 0 0 0)" }, {
        clipPath: "inset(0% 0 0 0)",
        duration: reducedMotion ? 0 : .95,
        ease: "power4.inOut"
      })
      .fromTo(".memory-image img", { scale: 1.2, xPercent: -4 }, {
        scale: 1.03,
        xPercent: 0,
        duration: reducedMotion ? 0 : 1.35,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.7")
      .fromTo(".memory-title-rail > *", {
        yPercent: 90,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .8,
        stagger: .08,
        ease: "power4.out"
      }, reducedMotion ? 0 : "-=1.05")
      .fromTo(".memory-fragments figure", {
        clipPath: "inset(100% 0 0 0)",
        y: 24
      }, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: reducedMotion ? 0 : .75,
        stagger: .1,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.72")
      .fromTo(".memory-body > *", { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .65,
        stagger: .06,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=1");
    document.getElementById("memoryClose").focus();
  }

  function openBoundarySignal(index, trigger) {
    lastFocus = trigger;
    const ordinal = "06";
    populateMemoryChapter(
      boundaryChapter,
      ordinal,
      `Boundary signal ${String(index + 1).padStart(2, "0")}`,
      `Open edge / ${ordinal}`
    );
    memoryOverlay.dataset.work = "boundary";
    setMemorySelection(boundaryChapter, index);
    memoryOverlay.classList.add("is-open");
    memoryOverlay.classList.remove("scan-active");
    void memoryOverlay.offsetWidth;
    memoryOverlay.classList.add("scan-active");
    lenis?.stop();

    gsap.timeline()
      .fromTo(memoryOverlay, { clipPath: "inset(100% 0 0 0)" }, {
        clipPath: "inset(0% 0 0 0)",
        duration: reducedMotion ? 0 : .95,
        ease: "power4.inOut"
      })
      .fromTo(".memory-image img", { scale: 1.2, xPercent: -4 }, {
        scale: 1.03,
        xPercent: 0,
        duration: reducedMotion ? 0 : 1.35,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.7")
      .fromTo(".memory-title-rail > *", {
        yPercent: 90,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .8,
        stagger: .08,
        ease: "power4.out"
      }, reducedMotion ? 0 : "-=1.05")
      .fromTo(".memory-fragments figure", {
        clipPath: "inset(100% 0 0 0)",
        y: 24
      }, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: reducedMotion ? 0 : .75,
        stagger: .1,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.72")
      .fromTo(".memory-body > *", { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .65,
        stagger: .06,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=1");
    document.getElementById("memoryClose").focus();
  }

  function closeMemory() {
    const finish = () => {
      memoryOverlay.classList.remove("is-open");
      memoryOverlay.classList.remove("scan-active");
      memoryOverlay.style.clipPath = "";
      lenis?.start();
      lastFocus?.focus();
    };

    if (reducedMotion) {
      finish();
    } else {
      gsap.to(memoryOverlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: .68,
        ease: "power3.inOut",
        onComplete: finish
      });
    }
  }

  function makeParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 30);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(.18, "rgba(210,230,232,.82)");
    glow.addColorStop(.58, "rgba(180,204,208,.14)");
    glow.addColorStop(1, "rgba(180,204,208,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  function initThree() {
    if (!window.THREE) {
      fallback.classList.add("is-visible");
      return;
    }

    if (document.body.dataset.universeRenderer === "off") {
      const canvas = document.getElementById("universe");
      if (canvas) canvas.hidden = true;
      return;
    }

    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("universe"),
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.45));
    renderer.setSize(viewportWidth(), viewportHeight());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();

    initBackgroundScene();
    initObjectScene();
    resizeThree();
    renderer.setAnimationLoop(renderThree);
  }

  function initBackgroundScene() {
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./assets/space-hero.png",
      (texture) => {
        texture.colorSpace = THREE.NoColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        backgroundMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(viewportWidth(), viewportHeight()) },
            uMouse: { value: new THREE.Vector2(.5, .5) },
            uRippleCenter: { value: new THREE.Vector2(.5, .5) },
            uTint: { value: new THREE.Vector3(1.03, 1, .93) },
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uVelocity: { value: 0 },
            uLens: { value: .22 },
            uRipple: { value: 0 },
            uPhase: { value: 0 },
            uExposure: { value: 1 },
            uImageAspect: { value: 1680 / 720 },
            uAuthority: { value: 0 },
            uPointerSpeed: { value: 0 },
            uHold: { value: 0 }
          },
          vertexShader: backgroundVertexShader,
          fragmentShader: backgroundFragmentShader,
          depthTest: false,
          depthWrite: false
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), backgroundMaterial);
        backgroundScene.add(plane);
        backgroundReady = true;
        stage.classList.add("webgl-ready");
        applyVisualState(visualStates[activeWork], false);
      },
      undefined,
      () => {
        fallback.classList.add("is-visible");
      }
    );
  }

  function initObjectScene() {
    objectScene = new THREE.Scene();
    objectCamera = new THREE.PerspectiveCamera(46, viewportWidth() / viewportHeight(), .1, 100);
    objectCamera.position.set(0, 0, 7);

    objectScene.add(new THREE.AmbientLight(0x829295, 1.35));
    const frontLight = new THREE.DirectionalLight(0xc4d1d1, 2.25);
    frontLight.position.set(0, 1, 5);
    objectScene.add(frontLight);
    warmLight = new THREE.PointLight(0x9d876b, 12, 28);
    warmLight.position.set(3.5, -1, 3.6);
    objectScene.add(warmLight);
    coldLight = new THREE.PointLight(0x728f93, 11, 28);
    coldLight.position.set(-3.8, 2.7, 2.2);
    objectScene.add(coldLight);

    createShardObject();
    objectGroup.visible = false;
    createTravelDust();
  }

  function quaternionForPosition(position, twist = 0) {
    tempObject.position.copy(position);
    tempObject.up.set(0, 1, 0);
    tempObject.lookAt(position.clone().multiplyScalar(2.2));
    tempObject.rotateZ(twist);
    return tempObject.quaternion.clone();
  }

  function createShapeData(count) {
    const shapes = [[], [], [], []];

    for (let index = 0; index < count; index++) {
      const band = index % 3;
      const bandIndex = Math.floor(index / 3);
      const bandCount = Math.ceil(count / 3);
      const theta = bandIndex / bandCount * Math.PI * 2 + band * .16;
      const radius = [.48, .61, .74][band];
      const seedPosition = new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        Math.sin(theta * 2 + band) * .08
      );
      seedPosition.applyEuler(new THREE.Euler(
        [.18, 1.12, .72][band],
        [.82, -.38, .28][band],
        [.12, .52, -.66][band]
      ));

      const haloBand = index % 3;
      const haloIndex = Math.floor(index / 3);
      const haloCount = Math.ceil(count / 3);
      const angle = haloIndex / haloCount * Math.PI * 2 + haloBand * .09;
      const haloRadius = [.72, .96, 1.2][haloBand];
      const haloPosition = new THREE.Vector3(
        Math.cos(angle) * haloRadius,
        Math.sin(angle) * haloRadius * .68,
        (haloBand - 1) * .17 + Math.sin(angle * 2.0) * .06
      );

      const petal = index % 8;
      const petalLayer = Math.floor(index / 8);
      const petalAngle = petal / 8 * Math.PI * 2 + petalLayer * .11;
      const petalRadius = .5 + petalLayer * .2;
      const bloomPosition = new THREE.Vector3(
        Math.cos(petalAngle) * petalRadius,
        Math.sin(petalAngle) * petalRadius,
        Math.sin(petalAngle * 2) * .24 + (petalLayer - 1) * .09
      );

      const spiralRatio = index / count;
      const spiralAngle = spiralRatio * Math.PI * 5.2;
      const constellationPosition = new THREE.Vector3(
        (spiralRatio - .5) * 2.35,
        Math.sin(spiralAngle) * .58,
        Math.cos(spiralAngle) * .42
      );

      const positions = [seedPosition, haloPosition, bloomPosition, constellationPosition];
      positions.forEach((position, shapeIndex) => {
        shapes[shapeIndex].push({
          position,
          quaternion: quaternionForPosition(position, theta + shapeIndex * .23)
        });
      });
    }
    return shapes;
  }

  function createShardObject() {
    objectGroup = new THREE.Group();

    const matterVertexShader = `
      uniform float uTime;
      uniform float uEnergy;
      uniform float uForm;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vFlow;
      varying float vDepth;

      float matterFlow(vec3 point) {
        float first = sin(point.x * 4.2 + uTime * .42);
        float second = sin(point.y * 5.1 - uTime * .31 + point.z * 2.7);
        float third = cos(point.z * 6.4 + uTime * .24 - point.x * 2.2);
        return (first + second + third) / 3.0;
      }

      void main() {
        float flow = matterFlow(position);
        float pulse = sin(uTime * .74 + position.y * 3.0) * .018;
        float deformation = flow * (.09 + uEnergy * .095) + pulse;
        vec3 displaced = position + normal * deformation;
        displaced.x *= 1.0 + sin(uTime * .19 + uForm) * .045;
        displaced.y *= .88 + cos(uTime * .16 + uForm * .7) * .055;
        displaced.z *= .94 + sin(uTime * .22 + 1.4) * .04;
        vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(cameraPosition - worldPosition.xyz);
        vFlow = flow;
        vDepth = displaced.z;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `;

    const matterFragmentShader = `
      uniform float uTime;
      uniform float uEnergy;
      uniform vec3 uCold;
      uniform vec3 uWarm;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vFlow;
      varying float vDepth;

      void main() {
        vec3 normalDirection = normalize(vNormal);
        float fresnel = pow(1.0 - abs(dot(normalDirection, normalize(vView))), 2.15);
        float sideLight = dot(normalDirection, normalize(vec3(-.55, .72, .44))) * .5 + .5;
        float ridge = smoothstep(.48, .86, vFlow * .5 + .5);
        float strata = .5 + .5 * sin(vFlow * 23.0 + vDepth * 17.0 - uTime * .22);
        float flowLight = vFlow * .5 + .5;
        float mineral = smoothstep(.7, .9, flowLight * .58 + strata * .42);
        vec3 deep = vec3(.045, .1, .118);
        vec3 color = deep + uCold * (sideLight * .25 + flowLight * .12);
        color = mix(color, uCold, fresnel * .58 + ridge * .14);
        color = mix(color, uWarm, mineral * (.045 + uEnergy * .08));
        color *= .88 + flowLight * .18;
        color += uCold * fresnel * (.12 + uEnergy * .16);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    matterSurfaceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: .2 },
        uForm: { value: 0 },
        uCold: { value: new THREE.Color(0x6f969c) },
        uWarm: { value: new THREE.Color(0xa88762) }
      },
      vertexShader: matterVertexShader,
      fragmentShader: matterFragmentShader,
      transparent: false,
      depthWrite: true
    });

    coreShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.78, 3),
      matterSurfaceMaterial
    );
    objectGroup.add(coreShell);
    shardMesh = coreShell;

    core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.54, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b1519,
        emissive: 0x061014,
        emissiveIntensity: .12,
        roughness: .58,
        metalness: .62,
        clearcoat: .12,
        clearcoatRoughness: .5
      })
    );
    core.visible = false;
    objectGroup.add(core);

    const coronaVertexShader = `
      uniform float uTime;
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        float drift = sin(position.y * 7.0 + uTime * .32) * .018;
        vec3 displaced = position + normal * drift * (1.0 + uEnergy);
        vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(cameraPosition - worldPosition.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `;

    const coronaFragmentShader = `
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.4);
        vec3 color = mix(vec3(.12, .22, .25), vec3(.48, .62, .63), rim);
        gl_FragColor = vec4(color, rim * (.045 + uEnergy * .07));
      }
    `;

    coronaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: .2 }
      },
      vertexShader: coronaVertexShader,
      fragmentShader: coronaFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });
    coronaShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.9, isCompactViewport() ? 2 : 3),
      coronaMaterial
    );
    objectGroup.add(coronaShell);

    coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    }));
    objectGroup.add(coreGlow);

    createObjectHalo();

    hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 24, 16),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false
      })
    );
    objectGroup.add(hitTarget);
    objectGroup.position.set(objectTarget.x, objectTarget.y, objectTarget.z);
    objectScene.add(objectGroup);
  }

  function createObjectHalo() {
    const count = isCompactViewport() ? 420 : 920;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    objectHaloData = [];

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = .84 + Math.pow(Math.random(), .72) * 1.28;
      const height = (Math.random() - .5) * (.045 + radius * .075);
      const eccentricity = .58 + Math.random() * .18;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = height;
      positions[index * 3 + 2] = Math.sin(angle) * radius * eccentricity;
      const warmth = clamp(1.22 - radius * .3, .08, .72);
      tempColor.setRGB(
        .38 + warmth * .34,
        .52 + warmth * .08,
        .55 - warmth * .2
      );
      colors[index * 3] = tempColor.r;
      colors[index * 3 + 1] = tempColor.g;
      colors[index * 3 + 2] = tempColor.b;
      objectHaloData.push({
        angle,
        radius,
        height,
        eccentricity,
        phase: Math.random() * Math.PI * 2,
        speed: .08 + Math.random() * .22
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    objectHalo = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        map: makeParticleTexture(),
        color: 0xa9bbba,
        vertexColors: false,
        size: .034,
        transparent: true,
        opacity: .72,
        alphaTest: .012,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    objectHalo.frustumCulled = false;
    objectHalo.rotation.set(.96, 0, -.18);
    objectGroup.add(objectHalo);
  }

  function createTravelDust() {
    const count = isCompactViewport() ? 300 : 620;
    const positions = new Float32Array(count * 3);
    travelDustData = [];
    for (let index = 0; index < count; index++) {
      const x = (Math.random() - .5) * 15;
      const y = (Math.random() - .5) * 9;
      const depth = Math.random() * 24;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = 4 - depth;
      travelDustData.push({
        x,
        y,
        depth,
        speed: .32 + Math.random() * .7,
        phase: Math.random() * Math.PI * 2
      });
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    travelDust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        map: makeParticleTexture(),
        color: 0xc3d2d4,
        size: .032,
        transparent: true,
        opacity: .28,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    objectScene.add(travelDust);
  }

  function updateTravelDust(time) {
    if (!travelDust) return;
    const positions = travelDust.geometry.attributes.position.array;
    const authority = authorityState.value;
    const pointerX = pointerSmooth.x * 5.8;
    const pointerY = pointerSmooth.y * 3.3;

    travelDustData.forEach((data, index) => {
      const dx = data.x - pointerX;
      const dy = data.y - pointerY;
      const radius = Math.max(.25, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const influence = Math.exp(-radius * .19) * authority;
      const twist = influence * (1.15 + authorityState.hold * 1.4);
      const drift = Math.sin(time * .3 + data.phase) * .035;

      positions[index * 3] = pointerX + Math.cos(angle + twist) * radius + drift;
      positions[index * 3 + 1] = pointerY + Math.sin(angle + twist) * radius - drift;
      positions[index * 3 + 2] =
        4 - ((data.depth + time * data.speed * (.42 + authority * 7.5)) % 24);
    });

    travelDust.geometry.attributes.position.needsUpdate = true;
    travelDust.material.size = .03 + authority * .026 + authorityState.hold * .018;
    travelDust.material.opacity = .2 + authority * .46 +
      clamp(Math.abs(scrollVelocity) / 90, 0, .24);
  }

  function updateObjectHalo(time) {
    if (!objectHalo) return;
    const positions = objectHalo.geometry.attributes.position.array;
    const expansion = 1 + objectState.explode * .34 + objectState.energy * .045;

    objectHaloData.forEach((data, index) => {
      const speed = data.speed * (.34 + objectState.energy * .75);
      const angle = data.angle + time * speed + objectState.spin * .22;
      const radius = data.radius * expansion *
        (1 + Math.sin(time * .24 + data.phase) * .018);
      const formWave = Math.sin(angle * (2 + Math.round(objectState.form)) + data.phase) *
        objectState.form * .012;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] =
        data.height * (1 + objectState.explode * 2.1) +
        Math.sin(time * .46 + data.phase) * .012 +
        formWave;
      positions[index * 3 + 2] = Math.sin(angle) * radius * data.eccentricity;
    });

    objectHalo.geometry.attributes.position.needsUpdate = true;
    objectHalo.material.opacity = .42 + objectState.energy * .24;
    objectHalo.material.size = .026 + objectState.energy * .016;
    objectHalo.rotation.y = Math.sin(time * .11) * .08;
    objectHalo.rotation.x = .96 + Math.sin(time * .12) * .045;
    objectHalo.rotation.z = -.18 + Math.sin(time * .16) * .035;
  }

  function updateArmillary(time) {
    if (!coreShell || !matterSurfaceMaterial || !coronaMaterial) return;
    matterSurfaceMaterial.uniforms.uTime.value = time;
    matterSurfaceMaterial.uniforms.uEnergy.value = objectState.energy;
    matterSurfaceMaterial.uniforms.uForm.value = objectState.form;
    coronaMaterial.uniforms.uTime.value = time;
    coronaMaterial.uniforms.uEnergy.value = objectState.energy;

    coreShell.rotation.x = time * .055 + Math.sin(time * .19) * .08;
    coreShell.rotation.y = -time * .09 - ringState.twist * .025;
    coreShell.rotation.z = Math.sin(time * .14) * .08;
    const shellPulse = 1 + Math.sin(time * .72) * .028 + ringState.aperture * .045;
    coreShell.scale.set(
      shellPulse * (1.03 + objectState.form * .018),
      shellPulse * (.9 - objectState.form * .015),
      shellPulse * .96
    );
    coronaShell.rotation.y = time * .035;
    coronaShell.scale.setScalar(1 + Math.sin(time * .51) * .026 + objectState.energy * .025);
  }

  function updateShardInstances(time) {
    if (!matterSurfaceMaterial) return;
    matterSurfaceMaterial.uniforms.uTime.value = time;
  }

  function setObjectHover(next) {
    if (next === isObjectHover || !shardMesh) return;
    isObjectHover = next;
    stage.classList.toggle("object-hover", next);
    cursor.classList.toggle("is-object", next);
    if (next) {
      stage.classList.remove("authority-active");
      gsap.to(authorityState, {
        value: .08,
        speed: 0,
        hold: 0,
        duration: .45,
        ease: "power3.out"
      });
    } else if (pointerReady) {
      stage.classList.add("authority-active");
    }
    clearTimeout(hoverMorphTimer);
    interactionTimeline?.kill();

    if (next) {
      cursorLabel.textContent = "Disturb matter / 点击换相";
      cursorLabel.style.opacity = "1";
      objectPrompt.textContent = "Matter field responding";
      phaseStatus.textContent = "Density and flow are changing";
      stage.style.setProperty("--energy", "1");
      if (backgroundMaterial) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: 1.15,
          duration: .5,
          ease: "power3.out"
        });
        gsap.to(backgroundMaterial.uniforms.uExposure, {
          value: visualStates[activeWork].exposure + .07,
          duration: .55,
          ease: "power2.out"
        });
      }

      const hoverForms = [1, 2, 3, 2, 1];
      const targetForm = hoverForms[activeWork];
      interactionTimeline = gsap.timeline();
      interactionTimeline
        .to(objectState, {
          hover: 1,
          energy: 1,
          explode: 1,
          duration: .48,
          ease: materialEase.exit
        })
        .to(ringState, {
          spread: .78,
          aperture: .92,
          twist: ringState.twist + 1.05,
          duration: .48,
          ease: materialEase.exit
        }, "<")
        .add(() => {
          objectHalo.material.color.set(0x8fbec2);
        })
        .add(() => {
          phaseCode.textContent = "Reassembly";
          phaseStatus.textContent = formLabels[Math.round(targetForm)];
        })
        .to(objectState, {
          form: targetForm,
          explode: .12,
          spin: objectState.spin + 1,
          duration: .9,
          ease: materialEase.standard
        })
        .to(ringState, {
          spread: .18,
          aperture: .48,
          duration: .9,
          ease: materialEase.standard
        }, "<");
    } else {
      cursorLabel.style.opacity = "0";
      objectPrompt.textContent = "Approach / disturb matter";
      phaseCode.textContent = `Form ${String(Math.round(currentBaseForm) + 1).padStart(2, "0")}`;
      phaseStatus.textContent = visualStates[activeWork].phaseName;
      stage.style.setProperty("--energy", String(.2 + currentBaseExplode));
      if (backgroundMaterial) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: visualStates[activeWork].lens,
          duration: .85,
          ease: "power2.out"
        });
        gsap.to(backgroundMaterial.uniforms.uExposure, {
          value: visualStates[activeWork].exposure,
          duration: .8,
          ease: "power2.out"
        });
      }

      interactionTimeline = gsap.timeline();
      interactionTimeline
        .to(objectState, {
          explode: .88,
          energy: .75,
          duration: .3,
          ease: materialEase.exit
        })
        .to(ringState, {
          spread: .66,
          aperture: .74,
          duration: .3,
          ease: materialEase.exit
        }, "<")
        .add(() => {
          objectHalo.material.color.set(0x86aeb2);
        })
        .to(objectState, {
          form: currentBaseForm,
          duration: .66,
          ease: materialEase.standard
        })
        .to(objectState, {
          explode: currentBaseExplode,
          energy: .28,
          hover: 0,
          duration: .58,
          ease: materialEase.enter
        })
        .to(ringState, {
          spread: 0,
          aperture: 0,
          duration: .58,
          ease: materialEase.enter
        }, "<");
    }
  }

  function cycleObjectForm() {
    if (!shardMesh || reducedMotion) return;
    interactionTimeline?.kill();
    const nextForm = (Math.round(objectState.form) + 1) % 4;
    phaseCode.textContent = "Manual morph";
    phaseStatus.textContent = formLabels[nextForm];
    interactionTimeline = gsap.timeline();
    interactionTimeline
      .to(objectState, {
        explode: 1.15,
        energy: 1,
        duration: .34,
        ease: materialEase.exit
      })
      .to(ringState, {
        spread: .9,
        aperture: 1,
        twist: ringState.twist + 1.55,
        duration: .34,
        ease: materialEase.exit
      }, "<")
      .add(() => {
        objectHalo.material.color.set(nextForm === 2 ? 0xcaa46f : 0x8fbec2);
      })
      .to(objectState, {
        form: nextForm,
        spin: objectState.spin + 1.4,
        duration: .75,
        ease: materialEase.standard
      })
      .to(objectState, {
        explode: .18,
        energy: .82,
        duration: .62,
        ease: materialEase.enter
      })
      .to(ringState, {
        spread: .12,
        aperture: .44,
        duration: .62,
        ease: materialEase.enter
      }, "<");
    pulseBackground(pointerUv.x, pointerUv.y, .75);
  }

  function pulseBackground(x, y, strength = 1) {
    if (!backgroundMaterial || reducedMotion) return;
    backgroundMaterial.uniforms.uRippleCenter.value.set(x, y);
    gsap.killTweensOf(rippleState);
    rippleState.value = strength;
    backgroundMaterial.uniforms.uRipple.value = strength;
    gsap.to(rippleState, {
      value: 0,
      duration: 1.45,
      ease: "expo.out",
      onUpdate: () => {
        backgroundMaterial.uniforms.uRipple.value = rippleState.value;
      }
    });
    gsap.fromTo(backgroundRipple, {
      x: x * viewportWidth(),
      y: (1 - y) * viewportHeight(),
      scale: .2,
      opacity: .8
    }, {
      scale: 9,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });
  }

  function pulseObjectScreen() {
    if (!objectGroup || !objectCamera) return;
    const projected = objectGroup.position.clone().project(objectCamera);
    const x = (projected.x * .5 + .5) * viewportWidth();
    const y = (-projected.y * .5 + .5) * viewportHeight();
    gsap.fromTo(shockwave, {
      x,
      y,
      scale: .2,
      opacity: .9
    }, {
      scale: 7,
      opacity: 0,
      duration: 1.1,
      ease: "power2.out"
    });
  }

  function renderThree() {
    if (!renderer || document.hidden || document.body.classList.contains("standalone-archive-open")) return;
    const time = clock.getElapsedTime();
    pointerSmooth.lerp(pointer, .045);
    pointerUvSmooth.lerp(pointerUv, authorityState.hold ? .28 : .09);

    if (backgroundReady && backgroundMaterial) {
      backgroundMaterial.uniforms.uTime.value = time;
      backgroundMaterial.uniforms.uMouse.value.copy(pointerUvSmooth);
      backgroundMaterial.uniforms.uScroll.value = travelProgress;
      backgroundMaterial.uniforms.uVelocity.value +=
        (scrollVelocity - backgroundMaterial.uniforms.uVelocity.value) * .08;
      backgroundMaterial.uniforms.uAuthority.value +=
        (authorityState.value - backgroundMaterial.uniforms.uAuthority.value) * .12;
      backgroundMaterial.uniforms.uPointerSpeed.value +=
        (authorityState.speed - backgroundMaterial.uniforms.uPointerSpeed.value) * .18;
      backgroundMaterial.uniforms.uHold.value +=
        (authorityState.hold - backgroundMaterial.uniforms.uHold.value) * .14;
    }

    const mobile = isCompactViewport();
    const targetX = mobile ? 0 : objectTarget.x;
    const targetY = mobile ? -.48 : objectTarget.y;
    const autonomousX = Math.sin(time * .43 + activeWork * .7) * (mobile ? .035 : .085);
    const autonomousY = Math.sin(time * .61 + .8) * (mobile ? .045 : .11);
    const autonomousDepth = Math.cos(time * .37 + activeWork) * .07;
    objectGroup.position.x +=
      (targetX + autonomousX +
        pointerSmooth.x * (isObjectHover ? .22 : .045) - objectGroup.position.x) * .045;
    objectGroup.position.y +=
      (targetY + autonomousY +
        pointerSmooth.y * (isObjectHover ? .15 : .035) - objectGroup.position.y) * .045;
    objectGroup.position.z +=
      (objectTarget.z + autonomousDepth - objectGroup.position.z) * .045;
    const mobileScale = mobile ? .72 : 1;
    const autonomousBreath = 1 + Math.sin(time * .92) * .045;
    const scale = objectTarget.scale * mobileScale * autonomousBreath *
      (1 + objectState.energy * .035);
    objectGroup.scale.setScalar(scale);
    objectGroup.rotation.x += .0015 + objectState.energy * .0012;
    objectGroup.rotation.y += .0022 + objectState.energy * .0016;
    objectGroup.rotation.z = Math.sin(time * .28 + activeWork) * .12;

    updateShardInstances(time);
    updateArmillary(time);
    updateObjectHalo(time);
    core.rotation.x = time * .18;
    core.rotation.y = -time * .23;
    const corePulse = .88 + Math.sin(time * .82) * .045 + objectState.energy * .12;
    core.scale.set(
      corePulse * .9,
      corePulse * .68,
      corePulse * .82
    );
    core.material.emissiveIntensity = .015 + objectState.energy * .045;
    coreGlow.material.opacity = 0;
    coreGlow.scale.setScalar(.25);
    orbitLines.forEach((line, index) => {
      line.rotation.z += .0006 * (index + 1) * (1 + objectState.energy * 3);
      line.material.opacity = .04 + objectState.energy * .12;
    });

    warmLight.intensity = 8 + objectState.energy * 8;
    coldLight.intensity = 7 + objectState.energy * 7;
    updateTravelDust(time);
    travelDust.rotation.z = travelProgress * .06 + time * .012;

    if (pointerReady && experienceEntered) {
      objectScene.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, objectCamera);
      setObjectHover(raycaster.intersectObject(hitTarget, false).length > 0);
    }

    objectCamera.position.x += (pointerSmooth.x * .045 - objectCamera.position.x) * .04;
    objectCamera.position.y += (pointerSmooth.y * .03 - objectCamera.position.y) * .04;

    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    if (backgroundReady) {
      renderer.render(backgroundScene, backgroundCamera);
      renderer.clearDepth();
    }
    renderer.render(objectScene, objectCamera);
  }

  function resizeThree() {
    if (!renderer || !objectCamera) return;
    const width = viewportWidth();
    const height = viewportHeight();
    objectCamera.aspect = width / height;
    objectCamera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompactViewport() ? 1.2 : 1.45));
    renderer.setSize(width, height);
    if (backgroundMaterial) {
      backgroundMaterial.uniforms.uResolution.value.set(width, height);
    }
  }

  function buildLetterController(element, radius, strength) {
    element.dataset.glyph = element.textContent;
    element.dataset.baseGlyph = element.textContent;
    element.style.setProperty("--proximity", "0");
    return {
      element,
      radius,
      strength,
      isInside: false,
      xTo: gsap.quickTo(element, "x", { duration: .6, ease: "power3" }),
      yTo: gsap.quickTo(element, "y", { duration: .6, ease: "power3" }),
      rotateTo: gsap.quickTo(element, "rotation", { duration: .6, ease: "power3" }),
      scaleTo: gsap.quickTo(element, "scale", { duration: .55, ease: "power3" })
    };
  }

  function disturbGlyph(controller, force) {
    const element = controller.element;
    if (force < .62 || element.dataset.shifting === "true") return;
    const baseGlyph = element.dataset.baseGlyph || element.textContent;
    const shiftedGlyph = glyphShiftMap.get(baseGlyph) || baseGlyph;
    element.dataset.shifting = "true";
    element.classList.add("is-glyph-shifting");

    gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        element.textContent = baseGlyph;
        element.dataset.glyph = baseGlyph;
        element.classList.remove("is-glyph-shifting");
        window.setTimeout(() => {
          element.dataset.shifting = "false";
        }, 720);
      }
    })
      .to(element, {
        x: `+=${(Math.random() - .5) * 22}`,
        y: `+=${(Math.random() - .5) * 18}`,
        rotation: (Math.random() - .5) * 18,
        scale: 1.18,
        opacity: .45,
        filter: "blur(3px)",
        duration: .18,
        ease: materialEase.exit
      })
      .add(() => {
        element.textContent = shiftedGlyph;
        element.dataset.glyph = shiftedGlyph;
      })
      .to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: .48,
        ease: "elastic.out(1, .58)"
      });
  }

  function buildLetterControllers() {
    heroLetterControllers = [...document.querySelectorAll(".hero-char i")]
      .map((element) => buildLetterController(element, 190, 14));
    workLetterControllers = [...document.querySelectorAll(".work-letter")]
      .map((element) => buildLetterController(element, 135, 9));
  }

  function buildMagneticControllers() {
    magneticControllers = [...document.querySelectorAll(".brand, .index-trigger, .enter-work")].map((element) => ({
      element,
      xTo: gsap.quickTo(element, "x", { duration: .55, ease: "power3" }),
      yTo: gsap.quickTo(element, "y", { duration: .55, ease: "power3" })
    }));
  }

  function buildLineSidebarTargets() {
    lineSidebarTargets = [...document.querySelectorAll(".work-nav button, .boundary-signals button")].map((element) => ({
      element,
      radius: element.closest(".boundary-signals") ? 170 : 118
    }));
  }

  function updateLineSidebarResponse(clientY) {
    lineSidebarTargets.forEach(({ element, radius }) => {
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(clientY - centerY);
      const rawForce = distance < radius ? 1 - distance / radius : 0;
      const force = smoothStep(rawForce);
      element.style.setProperty("--line-proximity", force.toFixed(3));
    });
  }

  function updateTextResponse(clientX, clientY) {
    updateLineSidebarResponse(clientY);

    [...heroLetterControllers, ...workLetterControllers].forEach((controller) => {
      const rect = controller.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - clientX;
      const dy = centerY - clientY;
      const distance = Math.hypot(dx, dy);
      const force = distance < controller.radius ? 1 - distance / controller.radius : 0;
      const angle = Math.atan2(dy, dx);
      controller.xTo(Math.cos(angle) * force * controller.strength);
      controller.yTo(Math.sin(angle) * force * controller.strength);
      controller.rotateTo(Math.cos(angle) * force * 3.6);
      controller.scaleTo(1 + force * .085);
      controller.element.style.setProperty("--proximity", force.toFixed(3));
      const entered = force > .66 && !controller.isInside;
      controller.isInside = force > .34;
      if (entered) disturbGlyph(controller, force);
    });

    magneticControllers.forEach((controller) => {
      const rect = controller.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const force = distance < 120 ? 1 - distance / 120 : 0;
      controller.xTo(dx * force * .12);
      controller.yTo(dy * force * .12);
    });
  }

  function finishExperienceEntry(navigate = true) {
    experienceEntered = true;
    document.body.classList.add("experience-entered");
    entryGate.setAttribute("aria-hidden", "true");
    entryGate.style.display = "none";
    if (objectGroup) objectGroup.visible = true;
    lenis?.start();
    revealMainLayout();
    if (navigate) window.requestAnimationFrame(() => {
      if (document.body.classList.contains("home-architecture-only")) {
        if (lenis) lenis.scrollTo(voyage.offsetTop, { immediate: true, force: true });
        else window.scrollTo(0, voyage.offsetTop);
      } else scrollToWork(0, { immediate: true });
    });
  }

  function enterExperience() {
    if(document.body.dataset.skipEntryGate==='true'){finishExperienceEntry();return;}
    if (experienceEntered || entryGate.dataset.state === "entering") return;
    entryGate.dataset.state = "entering";
    entryGate.style.pointerEvents = "none";
    const entryCharacters = [...entryGate.querySelectorAll(".entry-title-line i")];
    const fieldLines = [...entryGate.querySelectorAll(".entry-field i")];
    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        finishExperienceEntry();
        gsap.fromTo(objectState, {
          energy: .72,
          explode: .2
        }, {
          energy: .28,
          explode: currentBaseExplode,
          duration: .9,
          ease: materialEase.enter
        });
      }
    });

    timeline
      .to(".entry-axis, .entry-code", {
        opacity: 0,
        y: -8,
        duration: .28,
        ease: materialEase.exit
      }, 0)
      .to(fieldLines, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: (index) => index % 2 ? "left" : "right",
        duration: .48,
        stagger: .035,
        ease: materialEase.standard
      }, 0);

    entryCharacters.forEach((character, index) => {
      timeline.to(character, {
        x: (index - 1.5) * 26,
        y: index % 2 ? -18 : 18,
        scale: 1.06,
        opacity: 0,
        duration: .46,
        ease: materialEase.exit
      }, .08 + index * .025);
    });

    timeline
      .to(".entry-title small", {
        x: 28,
        opacity: 0,
        duration: .3,
        ease: materialEase.exit
      }, .08)
      .to(entryGate, {
        opacity: 0,
        scale: 1.018,
        duration: .62,
        ease: materialEase.enter
      }, .28);
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    stage.classList.add("layout-0");

    if (window.Lenis && !reducedMotion) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        virtualScroll: (data) => window.__v31SandEntryGate ? window.__v31SandEntryGate(data) : true
      });
      window.__v31Lenis = lenis;
      lenis.on("scroll", (event) => {
        scrollVelocity = event.velocity;
        ScrollTrigger.update();
      });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    ScrollTrigger.create({
      trigger: voyage,
      start: "top top",
      end: "bottom bottom",
      scrub: reducedMotion ? false : .78,
      onUpdate: (self) => {
        travelProgress = self.progress;
        stage.classList.toggle("has-work", self.progress > .085);
        const normalized = clamp((self.progress - .08) / .92, 0, .999);
        const index = Math.min(works.length - 1, Math.floor(normalized * works.length));
        if (index !== activeWork) setActiveWork(index, true);
        else if (self.progress > .085) revealWork(index);
        gsap.set("#progressLine", { scaleX: self.progress });
      }
    });

    gsap.to("#hero", {
      y: -76,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: voyage,
        start: "top top",
        end: "15% top",
        scrub: .72
      }
    });

    gsap.from(".boundary > *", {
      y: (index) => index % 2 ? 54 : 30,
      x: (index) => index % 2 ? 0 : 42,
      opacity: 0,
      filter: (index) => index === 1 ? "blur(12px)" : "blur(0px)",
      duration: 1,
      stagger: .13,
      ease: materialEase.enter,
      scrollTrigger: {
        trigger: "#boundary",
        start: "top 75%",
        once: true
      }
    });

    gsap.timeline({
      onComplete: () => loader.setAttribute("aria-hidden", "true")
    })
      .to("#loaderLine", {
        scaleX: 1,
        duration: .72,
        ease: materialEase.standard
      })
      .to(loader, {
        yPercent: -100,
        duration: .78,
        ease: materialEase.standard
      });
  }

  function bindEvents() {
    const cursorX = gsap.quickTo(cursor, "x", { duration: .16, ease: "power3" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: .16, ease: "power3" });
    const labelX = gsap.quickTo(cursorLabel, "x", { duration: .2, ease: "power3" });
    const labelY = gsap.quickTo(cursorLabel, "y", { duration: .2, ease: "power3" });
    const authorityX = gsap.quickTo(authorityField, "x", { duration: .28, ease: "power3" });
    const authorityY = gsap.quickTo(authorityField, "y", { duration: .28, ease: "power3" });
    let chapterWheelLocked = false;

    window.addEventListener("pointermove", (event) => {
      pointerReady = true;
      const width = viewportWidth();
      const height = viewportHeight();
      pointer.x = event.clientX / width * 2 - 1;
      pointer.y = -(event.clientY / height * 2 - 1);
      pointerUv.set(event.clientX / width, 1 - event.clientY / height);
      stage.style.setProperty("--pointer-x", pointer.x.toFixed(4));
      stage.style.setProperty("--pointer-y", pointer.y.toFixed(4));
      document.documentElement.style.setProperty("--space-x", `${(pointer.x * 9).toFixed(2)}px`);
      document.documentElement.style.setProperty("--space-y", `${(-pointer.y * 7).toFixed(2)}px`);
      document.documentElement.style.setProperty("--space-x-reverse", `${(-pointer.x * 6).toFixed(2)}px`);
      document.documentElement.style.setProperty("--space-y-reverse", `${(pointer.y * 5).toFixed(2)}px`);
      const speed = pointerUv.distanceTo(previousPointer);
      previousPointer.copy(pointerUv);
      cursor.style.opacity = "1";
      cursorX(event.clientX);
      cursorY(event.clientY);
      labelX(event.clientX);
      labelY(event.clientY);
      authorityX(event.clientX);
      authorityY(event.clientY);
      if (!experienceEntered) return;
      updateTextResponse(event.clientX, event.clientY);

      stage.classList.add("background-awake");
      clearTimeout(backgroundAwakeTimer);
      backgroundAwakeTimer = setTimeout(() => stage.classList.remove("background-awake"), 650);

      if (backgroundMaterial && !isObjectHover) {
        const overInterface = Boolean(event.target.closest("button, .memory-overlay, .index-overlay"));
        if (!overInterface) {
          stage.classList.add("authority-active");
          gsap.to(authorityState, {
            value: clamp(.24 + speed * 11, .24, .86),
            speed: clamp(speed * 18, 0, 1),
            duration: .18,
            ease: "power2.out",
            overwrite: true
          });
          clearTimeout(authorityState.decayTimer);
          authorityState.decayTimer = setTimeout(() => {
            if (!authorityState.hold && !isObjectHover) {
              gsap.to(authorityState, {
                value: .18,
                speed: 0,
                duration: .85,
                ease: "power3.out"
              });
            }
          }, 150);
        }

        const baseLens = visualStates[activeWork].lens;
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: Math.min(1.2, baseLens + .28 + speed * 5),
          duration: .22,
          ease: "power2.out",
          overwrite: true
        });
        clearTimeout(backgroundMaterial.userData?.lensTimer);
        backgroundMaterial.userData = backgroundMaterial.userData || {};
        backgroundMaterial.userData.lensTimer = setTimeout(() => {
          if (!isObjectHover) {
            gsap.to(backgroundMaterial.uniforms.uLens, {
              value: baseLens,
              duration: 1.1,
              ease: "power2.out"
            });
          }
        }, 180);
      }
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      cursor.style.opacity = "0";
      cursorLabel.style.opacity = "0";
      pointerReady = false;
      lineSidebarTargets.forEach(({ element }) => {
        element.style.setProperty("--line-proximity", "0");
      });
      setObjectHover(false);
      stage.classList.remove("authority-active");
      gsap.to(authorityState, {
        value: 0,
        speed: 0,
        hold: 0,
        duration: .8,
        ease: "power3.out"
      });
    });

    window.addEventListener("pointerdown", (event) => {
      if (
        !experienceEntered ||
        document.body.classList.contains("standalone-archive-open") ||
        event.button !== 0 ||
        isObjectHover ||
        event.target.closest("button") ||
        indexOverlay.classList.contains("is-open") ||
        memoryOverlay.classList.contains("is-open")
      ) {
        return;
      }
      stage.classList.add("authority-active");
      gsap.to(authorityState, {
        value: 1,
        speed: 1,
        hold: 1,
        duration: .22,
        ease: "power3.out",
        overwrite: true
      });
      pulseBackground(pointerUv.x, pointerUv.y, 1.35);
    });

    window.addEventListener("pointerup", () => {
      if (!experienceEntered) return;
      if (!authorityState.hold) return;
      gsap.to(authorityState, {
        value: .28,
        speed: .08,
        hold: 0,
        duration: .95,
        ease: "expo.out",
        overwrite: true
      });
    });

    window.addEventListener("wheel", (event) => {
      if (document.body.dataset.homeArchitectureOnly === "true") return;
      if (
        !experienceEntered ||
        event.target.closest?.(".experience-console") ||
        indexOverlay.classList.contains("is-open") ||
        memoryOverlay.classList.contains("is-open") ||
        document.querySelector(".image-popout.is-open")
      ) return;

      const start = voyage.offsetTop;
      const end = start + Math.max(0, voyage.offsetHeight - window.innerHeight);
      if (window.scrollY < start - 2 || window.scrollY > end + 2) return;
      if (Math.abs(event.deltaY) < 10) return;

      const direction = Math.sign(event.deltaY);
      const next = Math.max(0, Math.min(works.length - 1, activeWork + direction));
      event.preventDefault();
      event.stopImmediatePropagation();
      if (chapterWheelLocked) return;

      if (next !== activeWork) {
        scrollToWork(next, { immediate: true });
      } else if (direction > 0 && activeWork === works.length - 1) {
        const flow = document.getElementById("workFlow");
        if (flow && lenis) lenis.scrollTo(flow.offsetTop, { duration: .8, force: true });
        else if (flow) window.scrollTo({ top: flow.offsetTop, behavior: "smooth" });
      }

      chapterWheelLocked = true;
      window.setTimeout(() => { chapterWheelLocked = false; }, 620);
    }, { passive: false, capture: true });

    window.addEventListener("click", (event) => {
      if (!experienceEntered) return;
      if (event.target.closest("button") || indexOverlay.classList.contains("is-open") || memoryOverlay.classList.contains("is-open")) {
        return;
      }
      if (isObjectHover) {
        cycleObjectForm();
        pulseObjectScreen();
      } else {
        pulseBackground(pointerUv.x, pointerUv.y, 1.4);
        gsap.fromTo(authorityState, {
          value: 1,
          speed: 1
        }, {
          value: .22,
          speed: 0,
          duration: 1.25,
          ease: "expo.out",
          overwrite: true
        });
      }
    });

    window.addEventListener("resize", () => {
      resizeThree();
      buildLetterControllers();
      buildMagneticControllers();
      buildLineSidebarTargets();
      window.ScrollTrigger?.refresh();
    });

    document.getElementById("homeButton").addEventListener("click", () => {
      scrollToWork(0, { immediate: true });
    });
    document.getElementById("indexTrigger").addEventListener("click", (event) => openIndex(event.currentTarget));
    document.getElementById("indexClose").addEventListener("click", () => closeIndex(true));
    document.getElementById("enterWork").addEventListener("click", (event) => openMemory(event.currentTarget));
    document.querySelectorAll("[data-boundary-signal]").forEach((button) => {
      button.addEventListener("click", (event) => {
        openBoundarySignal(Number(event.currentTarget.dataset.boundarySignal), event.currentTarget);
      });
    });
    document.getElementById("memoryClose").addEventListener("click", closeMemory);
    entryGate.addEventListener("click", enterExperience);
    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (memoryOverlay.classList.contains("is-open")) closeMemory();
      else if (indexOverlay.classList.contains("is-open")) closeIndex(true);
    });
  }

  function bindImageChapterCuts() {
    const cut = document.getElementById("imageCut");
    const chapters = [...document.querySelectorAll(".image-chapter")];
    if (!cut || !chapters.length || reducedMotion) return;
    let current = -1;
    let timer = 0;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = chapters.indexOf(visible.target);
      if (index < 0 || index === current) return;
      current = index;
      cut.querySelector("span").textContent = `Memory cut ${String(index + 1).padStart(2, "0")}`;
      cut.classList.add("is-active");
      clearTimeout(timer);
      timer = window.setTimeout(() => cut.classList.remove("is-active"), 320);
    }, { threshold: [.58] });
    chapters.forEach((chapter) => observer.observe(chapter));
  }

  function init() {
    if (window.__v31InterfaceReady) return;
    if (!window.THREE || !window.gsap || !window.ScrollTrigger) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
      return;
    }
    buildInterface();
    prepareRevealSystem();
    initThree();
    initMotion();
    buildLetterControllers();
    buildMagneticControllers();
    buildLineSidebarTargets();
    bindEvents();
    bindImageChapterCuts();
    window.__v31InterfaceReady = true;
    window.__v31ResumeExperience = () => {
      if (!experienceEntered) finishExperienceEntry(false);
      else lenis?.start();
    };
    if (document.body.dataset.returnedFromChild === "true") window.__v31ResumeExperience();
    window.addEventListener("pageshow", event => {
      if (event.persisted && experienceEntered) lenis?.start();
    });
  }

  if (document.body.dataset.openingComplete === "true") {
    init();
  } else if (document.title.includes("V31") && document.getElementById("countdownPrelude")) {
    window.addEventListener("v31:opening-complete", init, { once: true });
  } else {
    if (document.readyState === "complete") init();
    else window.addEventListener("load", init, { once: true });
  }
  window.addEventListener("v31:archive-open", () => renderer?.setAnimationLoop(null));
  window.addEventListener("v31:archive-close", () => renderer?.setAnimationLoop(renderThree));
  setTimeout(() => {
    if (!window.THREE || !window.gsap) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
    }
  }, 5000);
})();
