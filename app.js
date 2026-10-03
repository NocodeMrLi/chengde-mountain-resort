const { guide: voiceGuide } = await import(assetUrlForModule('guide.js'));
const { installDepthRain } = await import(assetUrlForModule('weather.js'));
await import(assetUrlForModule('feedback.js'));
function assetUrlForModule(path){const u=new URL(path,import.meta.url);const h=window.__ASSET_HASHES__?.[path];if(h)u.searchParams.set('v',h);return u.href;}
const $ = (id) => document.getElementById(id);
const assetUrl = (path) => {
  const url = new URL(path, import.meta.url);
  const fingerprint = window.__ASSET_HASHES__?.[path];
  if (fingerprint) url.searchParams.set('v', fingerprint);
  return url.href;
};

const spots = [
  { id:'shuixin', name:'水心榭', area:'下湖 · 水心榭', subtitle:'四面皆景，水光与山色相接。', description:'水心榭位于下湖与银湖之间，始建于康熙年间，南北两端各有牌坊。它既让人从湖面通行，也让游人停在水中央观看四周景色。画中把亭榭、堤岸与远山组织为连续视线；建筑细部为写意绘制，并非今日实景测绘。', panel:0, x:.105, y:.46, icon:'◇' },
  { id:'dike', name:'芝径云堤', area:'湖区 · 芝径云堤', subtitle:'长堤如芝，浮于水上。', description:'芝径云堤借鉴杭州西湖苏堤，长堤曲折分作三支，连起环碧、如意洲与月色江声。沿堤前行，脚下道路不断改变水面、洲岛和远山的观看角度。画中堤线着重表现游园节奏，不能用作实地路线图。', panel:0, x:.335, y:.52, icon:'⌁' },
  { id:'yanyu', name:'烟雨楼', area:'青莲岛 · 烟雨楼', subtitle:'青莲岛上，楼阁临水。', description:'烟雨楼建于乾隆四十五年，借鉴浙江嘉兴南湖的同名楼阁。楼阁面阔五间、分为两层，临水视野开阔；晴时可看湖山层次，细雨中楼影与岸线渐入烟岚。近景画面重在表达这一临水关系，并非现状照片。', panel:0, x:.645, y:.39, icon:'✦' },
  { id:'jinshan', name:'金山', area:'湖东 · 金山', subtitle:'山石叠起，殿阁随势而上。', description:'金山岛仿镇江金山寺的意趣营造，山体经人工堆筑，建筑顺山势逐层升高。岛上的镜水云岑与天宇咸畅属于康熙三十六景，最高处还有三层上帝阁。画面把石阶、爬山廊与层层屋檐连成登高视线，细部以写意方式呈现。', panel:2, x:.35, y:.24, icon:'✦' },
  { id:'moon', name:'月色江声', area:'洲岛 · 月色江声', subtitle:'古松掩映，庭院清幽。', description:'月色江声始建于康熙四十三年，名称借用苏轼《赤壁赋》的意境。洲岛上的院落一重接一重，由游廊串联；书斋、休憩空间与临水视线相互交织。画卷着重表现庭院与水面的清幽关系，不标注精确旧址。', panel:2, x:.81, y:.47, icon:'◇' },
  { id:'lizheng', name:'丽正门', area:'宫殿区 · 丽正门', subtitle:'从御园正门，走入山庄。', description:'丽正门是避暑山庄正门，初建于康熙年间，乾隆十九年重修，并列为乾隆三十六景之首。门额以多种文字书写园名，从门楼进入后，宫殿的端整与园林的舒展逐渐转换。画面是依据建筑特征的写意绘制，不作现状测量。', panel:3, x:.15, y:.46, icon:'◇' },
  { id:'danbo', name:'澹泊敬诚', area:'宫殿区 · 澹泊敬诚殿', subtitle:'朴素殿宇，静看湖山。', description:'澹泊敬诚殿始建于康熙五十年，乾隆十九年以楠木改建，是山庄正宫的重要殿宇。清帝曾在此举行庆典、接受朝觐，并接见边疆首领与外国使节。朴素木构与严整空间共同体现其礼仪性；数字近景不等同实地建筑细部。', panel:3, x:.62, y:.35, icon:'✦' },
  { id:'wanshu', name:'万树园', area:'平原区 · 万树园', subtitle:'千树成林，草木自宽。', description:'万树园位于山庄北部平原区，疏林与草场交接，呈现有别于湖区的开阔北方原野。清代皇帝曾在这一带设宴，接见王公、各族首领和外国使节。画中保留林地与空地的尺度感，具体树木分布并非历史复原。', panel:4, x:.35, y:.51, icon:'⌁' },
  { id:'wenjin', name:'文津阁', area:'平原区 · 文津阁', subtitle:'书藏林泉，阁映清池。', description:'文津阁建于乾隆三十九年，借鉴宁波天一阁，是为收藏《四库全书》营造的藏书楼。外观看似两层，内部另设暗层以利避光；阁前池水兼顾园景和防火。画卷呈现书阁、池水、假山的关系，建筑细节仍为写意。', panel:4, x:.84, y:.44, icon:'✦' },
  { id:'simian', name:'四面云山', area:'山峦区 · 四面云山', subtitle:'登临高处，四面皆云山。', description:'四面云山亭位于山庄高处，为十六柱、单檐攒尖顶的方亭。亭外山岭远近叠落，登高后视线可向多个方向舒展；清代皇帝也曾在此赋诗。数字区域和近景强调登高望远，不提供真实步道或坐标。', panel:5, x:.72, y:.37, icon:'✦' },
  { id:'chuifeng', name:'锤峰落照', area:'园外借景 · 锤峰落照', subtitle:'夕阳西下，磬锤峰如剪影。', description:'锤峰落照是山庄园内望向园外磬锤峰的借景。山峰位于武烈河东侧，因形似敲磬之锤得名；夕照让峰影轮廓尤为醒目。画中的远峰依据山形写意创作，不表示山庄园内可以步行抵达峰顶。', panel:5, x:.95, y:.19, icon:'◇' }
];
const spotViewpoints={
  shuixin:'观赏时可先找南北两端的牌坊，再沿檐口望向左右水面，体会一座榭怎样把通行的路变成四面取景的地方。',
  dike:'沿着三支堤线从近处追到洲岛，留意堤与水之间时分时合的边界；正是这些转折，让同一片湖面不断呈现新的远近。',
  yanyu:'可以从湖面向上看石岸、底层廊柱和二层栏杆的层次，再比较晴日与细雨时楼身轮廓的变化。画中静止游人和画舫只用于提示尺度。',
  jinshan:'先看山脚与湖水的交接，再循登山廊追到高处屋檐；建筑不是平排在岸边，而是借层层高差带出望湖的视线。',
  moon:'沿南北游廊想象一重重院落的次序，再回望水边的开口，体会书斋空间为何能同时保持内向的安静与临水的开阔。',
  lizheng:'从门额、门洞和院墙看它的入口秩序，再把视线移向门后山水；“入园”在这里也是从礼仪空间走向游赏空间。',
  danbo:'把视线放在殿前宽阔的台阶、木柱和屋檐上：克制的装饰与规整的院落共同烘托出接见与典礼场所的庄重。',
  wanshu:'看疏林之间留下的大块空地，以及树群如何围出开阔的活动场所；平原的气息与湖区细密的亭台很不一样。',
  wenjin:'先比较外观两层与内部暗层的关系，再看阁前池水。藏书、遮光和防火的需求，与园林观赏并置在同一处空间里。',
  simian:'试着从亭周的不同方向看近山和远岭：四面都可入画，是题名最直观的体验。画中的上山路径只表示登高过程。',
  chuifeng:'辨认园内林岭和园外孤峰两重空间，再看斜阳如何压出峰的剪影。借景让视线越过园界，数字画面并不暗示可从此处登峰。'
};

const scene = $('scene');
const world = $('world');
const experience = $('experience');
installDepthRain(experience,$('depthPortal'),$('regionPortal'));
const hotspotLayer = $('hotspotLayer');
const spotNav = $('spotNav');
const navButtons = new Map();
const hotspotButtons = new Map();
const visited = new Set();
const ratios = [2048 / 768, 1983 / 793, 1774 / 887, 1983 / 793, 1983 / 793, 1983 / 793];
// Each line is a walkable strip surveyed against the corresponding painting.
// Gaps between strips (water, rockwork and walls) are deliberately impassable.
const walkSurfaces={
  lakeWest:{panel:0,points:[[.075,.646],[.12,.637],[.17,.633],[.225,.646]]},
  lakeBridge:{panel:0,points:[[.305,.525],[.345,.538],[.395,.55]]},
  lakeTerrace:{panel:0,points:[[.54,.603],[.6,.603],[.66,.606],[.735,.604]]},
  eastBridge:{panel:2,points:[[.08,.53],[.135,.531],[.19,.537]]},
  eastShore:{panel:2,points:[[.555,.602],[.625,.61],[.7,.612],[.77,.615],[.845,.617],[.93,.64],[1.03,.67]]},
  palaceCourt:{panel:3,points:[[.08,.66],[.145,.67],[.25,.68],[.4,.68],[.6,.675],[.83,.67],[.9,.68]]},
  plainsPath:{panel:4,points:[[.08,.72],[.23,.71],[.4,.755],[.58,.77],[.75,.73],[.9,.7]]},
  mountainSteps:{panel:5,points:[[.12,.95],[.24,.94],[.34,.88],[.43,.82],[.51,.77],[.6,.685],[.68,.57],[.735,.49],[.79,.42]]}
};
const zoneStarts = {lake:0,palace:5,plains:7,mountain:9};
const zonePanels = {lake:0,palace:3,plains:4,mountain:5};
const destinationArt={
  shuixin:['near-shuixin.webp','湖上亭榭 · 近景','观榭','63%','44%'],
  dike:['near-dike.webp','长堤水色 · 近景','观堤','54%','51%'],
  yanyu:['near-yanyu.webp','青莲岛 · 烟雨楼近景','观楼','59%','38%'],
  jinshan:['near-jinshan.webp','湖东金山 · 近景','登高','63%','32%'],
  moon:['near-moon.webp','月色江声 · 近景','观院','61%','42%'],
  lizheng:['near-lizheng.webp','宫殿区 · 丽正门近景','观门','53%','46%'],
  danbo:['near-danbo.webp','宫殿区 · 澹泊敬诚近景','观殿','59%','38%'],
  wanshu:['near-wanshu.webp','平原区 · 万树园近景','观林','54%','49%'],
  wenjin:['near-wenjin.webp','平原区 · 文津阁近景','观阁','62%','39%'],
  simian:['simian-square-near.webp','山峦区 · 四面云山近景','登亭','75%','38%'],
  chuifeng:['chuifeng-borrowed-near.webp','园外借景 · 磬锤峰','观峰','73%','28%'],
  deer:['near-deer.webp','平原区 · 梅花鹿观察','观鹿','59%','47%']
};
const guideScripts={
  shuixin:{lines:['先留意亭榭两边的水面。水心榭正处在下湖与银湖之间，始建于康熙年间。','南北两端各有牌坊，建筑既供人经过，也让人停下来观景。顺着檐口望出去，看看亭子怎样把四周湖山收进来。']},
  dike:{lines:['顺着长堤的曲线看，湖面被分出远近不同的层次。芝径云堤借鉴杭州西湖苏堤，分成三支。','它连接环碧、如意洲与月色江声，形态像舒展的灵芝。走在这里，堤岸既是脚下的路，也改变着看水、看岛的角度。']},
  yanyu:{lines:['先看楼阁与湖面的关系。烟雨楼的妙处，就在临水而立的开阔。','它建于乾隆四十五年，借鉴浙江嘉兴南湖的同名楼阁。两层楼向四面展开视野，把不同方向的湖山都纳入眼前。']},
  jinshan:{lines:['把目光从水边向上移，金山岛的建筑随着山势一层层展开。','这座岛仿镇江金山寺营造，山体经人工堆筑。岛上的镜水云岑和天宇咸畅列入康熙三十六景，制高处还有三层上帝阁。']},
  moon:{lines:['先沿着临水院落看一看，房屋不是一眼望尽，而是一重接着一重。','月色江声始建于康熙四十三年，名字借用了苏轼《赤壁赋》的意境。岛上有书斋，也有休憩的居所，水与庭院相连，格外清静。']},
  lizheng:{lines:['先看门楼与院墙的轮廓，这就是山庄正门丽正门。','它初建于康熙年间，乾隆十九年重修，被列为乾隆三十六景的第一景。从这里入园，宫殿的端整与湖山的舒展便接在同一幅画卷里。']},
  danbo:{lines:['把目光停在殿宇和木构上。澹泊敬诚殿沉静朴素，却是山庄重要的礼仪空间。','大殿始建于康熙五十年，乾隆十九年以楠木改建。清帝曾在这里举行庆典、接受朝觐，也接见边疆首领与外国使节。']},
  wanshu:{lines:['看树木之间留出的大块开阔地，万树园让山庄显出北方原野的气息。','这里位于平原区，草场与林地相接。清代皇帝曾在这一带设宴，接见王公、各族首领和外国使节。眼前疏朗的空间，也曾容纳隆重的交往场面。']},
  wenjin:{lines:['先看文津阁的外观：能看到两层楼，内部却另藏一层。','它建于乾隆三十九年，借鉴宁波天一阁，是为收藏《四库全书》营造的藏书楼。暗层有利于避光，阁前水池也兼顾防火，园景中藏着实用的心思。']},
  simian:{lines:['把视线放远，看看山岭怎样一层层延伸。四面云山亭建在山庄高处，以单檐方亭收拢一处停驻的空间。','亭子由十六根柱子支撑，屋顶收拢到尖顶。清代皇帝曾在这里登高赋诗。我们也换几个方向看看，体会这座山地园林的尺度。']},
  chuifeng:{lines:['先把目光越过园内山林，望向园外的磬锤峰。锤峰落照是山庄里的观景点，借的主景正是这座山峰。','磬锤峰俗称棒槌山，位于武烈河东侧。康熙因它形似敲磬的锤而赐名。眼前的近景依据山形写意创作，让我们细看它独特的轮廓。']},
  deer:{lines:['林缘的梅花鹿有时停步觅食，有时抬头警觉。','请在画中安静地观察，不追逐，也不惊扰它们。']}
};
const lamps = [
  {panel:0,x:.55,y:.49},{panel:0,x:.62,y:.49},{panel:0,x:.7,y:.49},
  {panel:0,x:.62,y:.38},{panel:0,x:.7,y:.38},
  {panel:2,x:.35,y:.13},{panel:2,x:.7,y:.48},{panel:2,x:.84,y:.48},
  {panel:3,x:.58,y:.39},{panel:3,x:.65,y:.39},{panel:4,x:.84,y:.38},{panel:5,x:.72,y:.33}
];
const lampElements = lamps.map(()=>{const element=document.createElement('span');element.className='lamp';$('lampLayer').append(element);return element;});
// Feet follow surveyed walkable details in the paintings. Static clusters keep
// the waterside calm; only one short walker route is active per populated area.
const staticPainting=true;
const ambientPeople = [
  {panel:0,x:.165,y:.634,size:.035,art:'person-pavilion-pair-lossless.webp',direction:1},
  {panel:0,x:.58,y:.603,size:.024,art:'person-blue-man-lossless.webp',direction:1},
  {panel:0,x:.646,y:.604,size:.033,art:'person-terrace-pair-lossless.webp',direction:1},
  {panel:3,x:.475,y:.71,size:.024,art:'person-blue-man-lossless.webp',direction:-1},
  {panel:3,x:.84,y:.7,size:.030,art:'person-blue-woman-lossless.webp',direction:1},
  {panel:3,x:.573,y:.676,size:.029,art:'person-ochre-woman-lossless.webp',direction:-1},
  {panel:3,start:.285,end:.395,path:[[.285,.68],[.395,.68]],size:.038,speed:.011,art:'person-blue-man-lossless.webp',direction:1},
  {panel:3,x:.792,y:.682,size:.039,art:'person-green-man-lossless.webp',direction:-1},
  {panel:4,start:.48,end:.54,path:[[.48,.752],[.54,.764]],size:.029,speed:.008,art:'person-ochre-woman-lossless.webp',direction:-1},
  {panel:5,x:.663,y:.565,size:.027,art:'person-green-man-lossless.webp',direction:1},
  {panel:5,x:.743,y:.484,size:.024,art:'person-blue-woman-lossless.webp',direction:-1}
].filter(person=>person.panel!==0).map((person)=>{
  const element=document.createElement('span');element.className='ambient-person';
  element.classList.toggle('moving',Boolean(person.path));
  element.classList.toggle('stationary',!person.path);
  const img=document.createElement('img');img.dataset.art=assetUrl(`art/${person.art}`);img.decoding='async';img.alt='';img.draggable=false;element.append(img);
  $('peopleLayer').append(element);
  const index=$('peopleLayer').children.length;
  element.style.setProperty('--sway-duration',`${.67+(index%5)*.15}s`);
  element.style.setProperty('--sway-delay',`${-(index*137%900)}ms`);
  return {...person,element,worldX:0,left:0,right:0,restUntil:0,nextRest:3600+index*850,phase:index*.73};
});
const deerHerd = [
  {kind:'stag',path:[[.205,.592],[.265,.602]],x:.235,size:.052,speed:.008,direction:1,state:'alert',phase:.4},
  {kind:'doe',path:[[.315,.615],[.365,.622]],x:.34,size:.042,speed:.006,direction:-1,state:'graze',phase:1.7},
  {kind:'doe',path:[[.485,.708],[.545,.722]],x:.51,size:.044,speed:.007,direction:1,state:'alert',phase:2.6},
  {kind:'stag',path:[[.675,.68],[.725,.691]],x:.7,size:.052,speed:.008,direction:-1,state:'graze',phase:3.8}
].map((deer,index)=>{
  const element=document.createElement('button');element.type='button';element.className=`deer deer-${deer.kind}`;
  element.setAttribute('aria-label','轻点梅花鹿，观察它的反应');
  const names=deer.kind==='stag'?['alert','graze','walk']:['alert','graze'];
  for(const pose of names){const img=document.createElement('img');img.dataset.art=assetUrl(`art/deer-${deer.kind}-${pose}-lossless.webp`);img.decoding='async';img.className=`deer-pose deer-${pose}`;img.alt='';img.draggable=false;element.append(img);}
  const ear=document.createElement('i');ear.className='deer-ear';element.append(ear);
  const look=document.createElement('span');look.className='deer-look';look.textContent='近看';element.append(look);
  $('deerLayer').append(element);
  const creature={...deer,element,left:0,right:0,worldX:0,stateUntil:performance.now()+2700+index*1100,lastEar:0,cooldown:0};
  element.addEventListener('click',(event)=>{
    event.stopPropagation();
    if(event.target===look||performance.now()<creature.selectedUntil){openDepth('deer',creature);return;}
    const now=performance.now();if(now<creature.cooldown)return;
    creature.cooldown=now+1700;creature.state='alert';creature.stateUntil=now+1700;
    creature.earUntil=now+320;creature.lastEar=now;
    const near=Math.abs(creature.worldX-walkerWorldX)<height*.52;
    if(near&&Math.random()<.65){
      creature.direction=creature.worldX>=walkerWorldX?1:-1;
      creature.startRunAt=now+420;creature.fleeUntil=now+1600;
      showToast('鹿儿抬头，轻步避开');
    }else showToast('鹿儿停步，警觉地竖起双耳');
    element.classList.add('selected');
    creature.selectedUntil=now+5000;
    element.setAttribute('aria-label','再次轻点梅花鹿，近看鹿影');
    setTimeout(()=>{element.classList.remove('selected');element.setAttribute('aria-label','轻点梅花鹿，观察它的反应');},5000);
  });
  return creature;
});
const treePatches = [
  {panel:0,x:.235,y:.27,w:.11,h:.18,strength:.95,phase:.2,art:'yan-yu-lake-clean.webp'},
  {panel:0,x:.775,y:.33,w:.13,h:.2,strength:1.4,phase:1.1,art:'yan-yu-lake-clean.webp'},
  {panel:3,x:.44,y:.02,w:.21,h:.2,strength:.35,phase:2.1,art:'palace-hall.webp'},
  {panel:4,x:.4,y:.405,w:.16,h:.19,strength:1,phase:1.7,art:'plains-wenyuan-clean.webp'},
  {panel:4,x:.74,y:.33,w:.13,h:.18,strength:.4,phase:2.9,art:'plains-wenyuan-clean.webp'},
  {panel:5,x:.46,y:.45,w:.19,h:.17,strength:.5,phase:3.5,art:'mountain-view.webp'}
].filter(tree=>tree.panel!==0).map((tree)=>{
  const element=document.createElement('span');element.className='tree-canopy';
  element.style.backgroundImage=`url('${assetUrl(`art/${tree.art}`)}')`;
  $('treeLayer').append(element);return {...tree,element};
});
let entered = false;
let zoom = 1;
let height = 0;
let widths = ratios.map(()=>0);
let panelStarts = ratios.map(()=>0);
let totalWidth = 0;
let bridgeX = 0;
let panelTwoX = 0;
let overlap = 0;
let offset = 0;
let targetOffset = 0;
let dragging = false;
let pointerX = 0;
let pointerY = 0;
let pointerOffset = 0;
let lastDragTime = 0;
let lastDragX = 0;
let velocity = 0;
let activeSpot = null;
let lastFrame = performance.now();
let moveDir = 0;
let walkerWorldX = 0;
let walkerSurfaceId = 'lakeTerrace';
let walkTargetX = null;
let boating = false;
let boatDir = 1;
let boatWorldX = 0;
let boatCruiseCenter = 0;
let boatPhase = 'cruise';
let boatPaused = false;
let boatDockX = 0;
let boatLandingX = 0;
let boatTripDirection = 1;
let boatPhaseTime = 5000;
let boatSailStartX = 0;
let boardingStartX = 0;
let boardingProgress = 0;
let boatLandingFootX = 0;
let boatLandingSurfaceId = 'eastShore';
let boatStartSurfaceId = 'lakeTerrace';
let boatStartFootX = 0;
let boatDockWaterY = .64;
let boatLandingWaterY = .64;
let night = false;
let raining = false;
let suppressClickUntil = 0;
let toastTimer;
let music;
let musicEnvelopeTimer;
let soundRequested=false;
let soundSerial=0;
let guideKey=null;
let guideSpeaking=false;
const weatherCanvas = $('weatherCanvas');
const rainContext = weatherCanvas.getContext('2d');
let rainDrops = [];
let rainSplashes = [];
let rainLevel = 0;
let rainElapsed = 0;
let screenDpr = 1;
let depthState='closed';
let depthSerial=0;
let depthTimer;
let depthSavedView=null;
let depthCurrent=null;
let lastDepthCloseAt=-Infinity;
let closeDeerNextAt=0;
let depthFocusReturn=null;
let depthRetryTarget=null;
let travelScale=1;
let travelOrigin={x:.5,y:.5};
const activePointers=new Map();
let pinchStart=null;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const backgroundControls=['#scene','.topbar','.zone-nav','.bottom-ui','.story-panel','.progress-track','.keyboard-hint'];
function setBackgroundInert(value){
  for(const selector of backgroundControls){const element=document.querySelector(selector);if(element)element.inert=value;}
}
const debugEnabled=new URLSearchParams(location.search).get('debug')==='1';
let debugOverlay,debugWalker,debugDeer=[],debugPeople=[],debugWater;
if(debugEnabled){
  debugOverlay=document.createElementNS('http://www.w3.org/2000/svg','svg');
  debugOverlay.setAttribute('class','spatial-debug');
  debugOverlay.setAttribute('aria-hidden','true');
  world.append(debugOverlay);
  const svg=(name,attrs={})=>{
    const element=document.createElementNS('http://www.w3.org/2000/svg',name);
    for(const [key,value] of Object.entries(attrs))element.setAttribute(key,String(value));
    debugOverlay.append(element);return element;
  };
  debugWalker=svg('circle',{r:7,fill:'#f5c550',stroke:'#2e2117','stroke-width':2});
  debugWater=svg('line',{stroke:'#35d6ff','stroke-width':3,'stroke-dasharray':'8 4'});
  debugDeer=deerHerd.map(()=>svg('circle',{r:5,fill:'#96f179',stroke:'#183527','stroke-width':2}));
  debugPeople=ambientPeople.map(()=>svg('circle',{r:4,fill:'#ffa768',stroke:'#4a2718','stroke-width':1.5}));
}

function newDrop(fromTop=false){
  const depth=Math.random();
  return {x:Math.random()*scene.clientWidth,y:fromTop?-30-Math.random()*scene.clientHeight:Math.random()*scene.clientHeight,
    vx:-38-depth*88+(Math.random()-.5)*75,vy:270+depth*430,length:5+depth*13+Math.random()*6,
    width:.36+depth*.64,alpha:.09+depth*.25,depth};
}
function resizeWeather(){
  screenDpr=Math.min(2,window.devicePixelRatio||1);
  weatherCanvas.width=Math.max(1,Math.round(scene.clientWidth*screenDpr));
  weatherCanvas.height=Math.max(1,Math.round(scene.clientHeight*screenDpr));
  rainContext.setTransform(screenDpr,0,0,screenDpr,0,0);
  rainDrops=Array.from({length:Math.min(1800,Math.max(600,Math.floor(scene.clientWidth*scene.clientHeight/460)))},()=>newDrop());
  rainSplashes=[];
}
function drawRain(dt){
  if(reducedMotion.matches||document.hidden||!$('regionPortal').hidden||!$('depthPortal').hidden){rainContext.clearRect(0,0,scene.clientWidth,scene.clientHeight);return;}
  rainElapsed=raining?rainElapsed+dt:0;
  const target=raining ? clamp(rainElapsed/950,0,1) : 0;
  rainLevel+=(target-rainLevel)*Math.min(1,dt*.006);
  const w=scene.clientWidth,h=scene.clientHeight;
  rainContext.clearRect(0,0,w,h);
  if(rainLevel<.008)return;
  const count=Math.floor(rainDrops.length*rainLevel);
  rainContext.lineCap='round';
  const gust=Math.sin(performance.now()*.00047)*14;
  for(let i=0;i<count;i++){
    const d=rainDrops[i];d.x+=(d.vx+gust)*dt/1000;d.y+=d.vy*dt/1000;
    if(d.y>h+20||d.x<-20)rainDrops[i]=newDrop(true);
    rainContext.strokeStyle=night?`rgba(223,230,220,${d.alpha*.9})`:`rgba(86,111,116,${d.alpha})`;
    rainContext.lineWidth=d.width;
    rainContext.shadowColor=night?'#c5d6d8':'#b7cac9';rainContext.shadowBlur=d.depth>0.63?1.4:0;
    rainContext.beginPath();rainContext.moveTo(d.x,d.y);
    rainContext.lineTo(d.x-(d.vx+gust)/d.vy*d.length,d.y-d.length);
    rainContext.stroke();
  }
  rainContext.shadowBlur=0;
  if(offset+scene.clientWidth*.5<panelStarts[3]){
    for(let i=0;i<Math.min(4,Math.floor(rainLevel*dt*.15));i++){
      rainSplashes.push({x:Math.random()*w,y:h*(.59+Math.random()*.23),age:0});
    }
    if(rainSplashes.length>150)rainSplashes.splice(0,rainSplashes.length-150);
  }
  rainSplashes=rainSplashes.filter((s)=>s.age<660);
  for(const s of rainSplashes){
    s.age+=dt;const t=s.age/660;
    rainContext.strokeStyle=night?`rgba(217,228,222,${(1-t)*.67})`:`rgba(68,106,111,${(1-t)*.61})`;
    rainContext.lineWidth=1.15;
    rainContext.beginPath();rainContext.ellipse(s.x,s.y,2+t*11,1+t*3.2,0,0,Math.PI*2);rainContext.stroke();
  }
}

function triggerWaterEffect(x,y){
  const mark=document.createElement('span');mark.className='touch-ripple';
  mark.style.left=`${x}px`;mark.style.top=`${y}px`;
  $('screenEffects').append(mark);
  setTimeout(()=>mark.remove(),1350);
}

function layoutArtTargets(){ /* Artwork targets are positioned after the core scene has loaded. */ }
function layoutDebug(){
  if(!debugEnabled)return;
  debugOverlay.setAttribute('width',totalWidth);
  debugOverlay.setAttribute('height',height);
  debugOverlay.setAttribute('viewBox',`0 0 ${totalWidth} ${height}`);
  debugOverlay.querySelectorAll('.debug-static').forEach((element)=>element.remove());
  const svg=(name,attrs)=>{
    const element=document.createElementNS('http://www.w3.org/2000/svg',name);
    element.setAttribute('class','debug-static');
    for(const [key,value] of Object.entries(attrs))element.setAttribute(key,String(value));
    debugOverlay.insertBefore(element,debugWalker);
    return element;
  };
  const exclusions=[
    {panel:0,points:[[.24,.63],[.54,.63],[.54,.92],[.24,.92]]},
    {panel:0,points:[[.75,.63],[.99,.63],[.99,.92],[.75,.92]]},
    {panel:2,points:[[.2,.56],[.54,.56],[.54,.9],[.2,.9]]},
    {panel:2,points:[[.55,.655],[.88,.655],[.88,.9],[.55,.9]]},
    {panel:4,points:[[.38,.39],[.57,.39],[.57,.62],[.38,.62]]},
    {panel:4,points:[[.76,.51],[.99,.51],[.99,.69],[.76,.69]]}
  ];
  for(const area of exclusions){
    svg('polygon',{points:area.points.map(([x,y])=>`${panelStarts[area.panel]+widths[area.panel]*x},${height*y}`).join(' '),
      fill:'#ff4b5070',stroke:'#e63639','stroke-width':2});
  }
  for(const [id,surface] of Object.entries(walkSurfaces)){
    const points=surface.points.map(([x,y])=>`${panelStarts[surface.panel]+widths[surface.panel]*x},${height*y}`).join(' ');
    svg('polyline',{points,fill:'none',stroke:'#16443faa','stroke-width':20,'stroke-linecap':'round','stroke-linejoin':'round'});
    svg('polyline',{points,fill:'none',stroke:'#7af5ce','stroke-width':3,'stroke-dasharray':'10 5'});
    const [x,y]=surface.points[0];
    const label=svg('text',{x:panelStarts[surface.panel]+widths[surface.panel]*x,y:height*y-17,fill:'#153d31','font-size':14,'font-weight':'bold'});
    label.textContent=id;
  }
  for(const deer of deerHerd){
    svg('polyline',{points:deer.path.map(([x,y])=>`${panelStarts[4]+widths[4]*x},${height*y}`).join(' '),
      fill:'none',stroke:'#a6ff67','stroke-width':3,'stroke-dasharray':'6 4'});
  }
  for(const person of ambientPeople)if(person.path)
    svg('polyline',{points:person.path.map(([x,y])=>`${panelStarts[person.panel]+widths[person.panel]*x},${height*y}`).join(' '),
      fill:'none',stroke:'#ffae77','stroke-width':3,'stroke-dasharray':'6 4'});
}
function renderDebug(walkerFootY,waterY,boatWidth){
  if(!debugEnabled)return;
  debugWalker.setAttribute('cx',walkerWorldX);debugWalker.setAttribute('cy',walkerFootY*height);
  debugWater.setAttribute('x1',boatWorldX-boatWidth*.36);debugWater.setAttribute('x2',boatWorldX+boatWidth*.36);
  debugWater.setAttribute('y1',waterY*height);debugWater.setAttribute('y2',waterY*height);
  deerHerd.forEach((deer,index)=>{
    debugDeer[index].setAttribute('cx',deer.worldX);
    debugDeer[index].setAttribute('cy',paintedPathY(deer.path,deer.x)*height);
  });
  ambientPeople.forEach((person,index)=>{
    debugPeople[index].setAttribute('cx',person.worldX);
    debugPeople[index].setAttribute('cy',(person.path?paintedPathY(person.path,(person.worldX-panelStarts[person.panel])/widths[person.panel]):person.y)*height);
  });
}

function clamp(value,min,max){ return Math.min(max,Math.max(min,value)); }
function paintedPathY(path,x){
  for(let i=1;i<path.length;i++)if(x<=path[i][0]){
    const t=clamp((x-path[i-1][0])/(path[i][0]-path[i-1][0]),0,1);
    return path[i-1][1]+(path[i][1]-path[i-1][1])*t;
  }
  return path.at(-1)[1];
}
function maxOffset(){ return Math.max(0,totalWidth-scene.clientWidth); }
function spotX(spot){ return panelStarts[spot.panel] + widths[spot.panel]*spot.x; }
function surfaceX(id,fraction){const surface=walkSurfaces[id];return panelStarts[surface.panel]+widths[surface.panel]*fraction;}
function surfaceBounds(id){const points=walkSurfaces[id].points;return [surfaceX(id,points[0][0]),surfaceX(id,points.at(-1)[0])];}
function surfaceY(id,x){const surface=walkSurfaces[id];return paintedPathY(surface.points,(x-panelStarts[surface.panel])/widths[surface.panel]);}
function mooringWaterline(id){return {lakeWest:.686,lakeTerrace:.656,eastShore:.653}[id]??.66;}
function routeY(x){return surfaceY(walkerSurfaceId,x);}
function nearestSurface(x,preferred){
  if(preferred&&walkSurfaces[preferred]){
    const [left,right]=surfaceBounds(preferred);
    if(x>=left&&x<=right)return preferred;
  }
  return Object.keys(walkSurfaces).reduce((best,id)=>{
    const [left,right]=surfaceBounds(id);
    const distance=Math.max(left-x,0,x-right);
    const [bestLeft,bestRight]=surfaceBounds(best);
    return distance<Math.max(bestLeft-x,0,x-bestRight)?id:best;
  },'lakeTerrace');
}
function placeWalker(id,x){
  walkerSurfaceId=id;
  const [left,right]=surfaceBounds(id);
  walkerWorldX=clamp(x,left,right);
  walkTargetX=null;
}
function walkBounds(){
  return surfaceBounds(walkerSurfaceId);
}

function layout(preserveCenter = true){
  const previousCenter = offset + scene.clientWidth / 2;
  const previousTotal = totalWidth;
  height = scene.clientHeight * zoom;
  widths = ratios.map((r)=>r*height);
  overlap = height*.32;
  panelStarts=[0];
  for(let i=1;i<widths.length;i++)panelStarts[i]=panelStarts[i-1]+widths[i-1]-overlap;
  bridgeX=panelStarts[1];panelTwoX=panelStarts[2];
  totalWidth=panelStarts.at(-1)+widths.at(-1);
  world.style.width = `${totalWidth}px`;
  world.style.height = `${height}px`;
  world.style.top = `${(scene.clientHeight-height)/2}px`;
  world.style.transformOrigin=`${totalWidth*travelOrigin.x}px ${height*travelOrigin.y}px`;
  world.style.setProperty('--bridge-x',`${bridgeX}px`);
  world.style.setProperty('--panel-two-x',`${panelTwoX}px`);
  world.style.setProperty('--palace-x',`${panelStarts[3]}px`);
  world.style.setProperty('--plains-x',`${panelStarts[4]}px`);
  world.style.setProperty('--mountain-x',`${panelStarts[5]}px`);
  world.style.setProperty('--overlap',`${overlap}px`);
  world.style.setProperty('--join-x',`${panelTwoX+overlap/2}px`);
  $('hotspotLayer').style.width = `${totalWidth}px`;
  $('hotspotLayer').style.height = `${height}px`;
  for(const spot of spots){
    const button = hotspotButtons.get(spot.id);
    if(button){button.style.left=`${spotX(spot)}px`;button.style.top=`${spot.y*height}px`;}
  }
  lamps.forEach((lamp,index)=>{
    lampElements[index].style.left=`${panelStarts[lamp.panel]+widths[lamp.panel]*lamp.x}px`;
    lampElements[index].style.top=`${height*lamp.y}px`;
  });
  for(const person of ambientPeople){
    const oldFraction=person.right>person.left?clamp((person.worldX-person.left)/(person.right-person.left),0,1):.5;
    person.left=panelStarts[person.panel]+widths[person.panel]*(person.start??person.x);
    person.right=panelStarts[person.panel]+widths[person.panel]*(person.end??person.x);
    person.worldX=person.path?(previousTotal&&preserveCenter?person.left+(person.right-person.left)*oldFraction:(person.left+person.right)*.5):person.left;
    person.element.style.height=`${height*person.size}px`;
    person.element.style.top=`${height*(person.path?paintedPathY(person.path,(person.worldX-panelStarts[person.panel])/widths[person.panel]):person.y)}px`;
  }
  for(const deer of deerHerd){
    deer.left=panelStarts[4]+widths[4]*deer.path[0][0];
    deer.right=panelStarts[4]+widths[4]*deer.path.at(-1)[0];
    deer.worldX=panelStarts[4]+widths[4]*deer.x;
    deer.element.style.width=`${height*deer.size*1.5}px`;
    deer.element.style.height=`${height*deer.size}px`;
    deer.element.style.top=`${height*paintedPathY(deer.path,deer.x)}px`;
  }
  for(const tree of treePatches){
    const px=widths[tree.panel]*tree.x,py=height*tree.y;
    tree.element.style.left=`${panelStarts[tree.panel]+px}px`;
    tree.element.style.top=`${py}px`;
    tree.element.style.width=`${widths[tree.panel]*tree.w}px`;
    tree.element.style.height=`${height*tree.h}px`;
    tree.element.style.backgroundSize=`${widths[tree.panel]}px ${height}px`;
    tree.element.style.backgroundPosition=`-${px}px -${py}px`;
  }
  if(preserveCenter && previousTotal){ offset=clamp(previousCenter/previousTotal*totalWidth-scene.clientWidth/2,0,maxOffset()); }
  else { offset=clamp(spotX(spots[2])-scene.clientWidth*.52,0,maxOffset()); }
  walkerWorldX = previousTotal && preserveCenter ? walkerWorldX/previousTotal*totalWidth : spotX(spots[2]);
  walkerSurfaceId=nearestSurface(walkerWorldX,walkerSurfaceId);
  walkerWorldX=clamp(walkerWorldX,...surfaceBounds(walkerSurfaceId));
  if(previousTotal&&preserveCenter){
    const scale=totalWidth/previousTotal;
    boatWorldX*=scale;boatCruiseCenter*=scale;boatDockX*=scale;
    boatLandingX*=scale;boatLandingFootX*=scale;boatStartFootX*=scale;
    boatSailStartX*=scale;boardingStartX*=scale;
  }else{
    boatWorldX=widths[0]*.89;boatCruiseCenter=boatWorldX;
    boatLandingFootX=surfaceX('eastShore',.7);
    boatLandingX=boatLandingFootX-height*.1;
  }
  $('boat').style.width=`${height*.39}px`;
  $('walker').style.height=`${height*.047}px`;
  resizeWeather();
  layoutArtTargets();
  layoutDebug();
  targetOffset=offset;
  render();
  window.dispatchEvent(new CustomEvent('chengde-layout',{detail:{height,widths:[...widths],panelStarts:[...panelStarts]}}));
}

function render(){
  offset=clamp(offset,0,maxOffset());
  world.style.transform=`translate3d(${-offset}px,0,0) scale(${travelScale})`;
  experience.dataset.boatPhase=boatPhase;
  experience.dataset.walkSurface=walkerSurfaceId;
  experience.dataset.walkX=walkerWorldX.toFixed(2);
  experience.dataset.cameraX=offset.toFixed(2);
  const sailProgress=boatPhase==='sail'?clamp((boatWorldX-boatSailStartX)/(boatLandingX-boatSailStartX),0,1):0;
  let waterY=.725;
  if(boatPhase==='approach'){
    const distance=clamp(Math.abs(boatDockX-boatWorldX)/(height*.7),0,1);
    waterY=boatDockWaterY*(1-distance)+.725*distance;
  }else if(['dock','board'].includes(boatPhase))waterY=boatDockWaterY;
  else if(['disembark','moored'].includes(boatPhase))waterY=boatLandingWaterY;
  else if(boatPhase==='sail')waterY=boatDockWaterY*(1-sailProgress)+boatLandingWaterY*sailProgress+Math.sin(Math.PI*sailProgress)*.075;
  experience.classList.toggle('boarding',boating&&(boatPhase==='board'||boatPhase==='disembark'));
  const deckY=waterY-.025;
  let walkerFootY=routeY(walkerWorldX);
  if(boatPhase==='board')walkerFootY=surfaceY(boatStartSurfaceId,boatStartFootX)*(1-boardingProgress)+deckY*boardingProgress;
  else if(boatPhase==='sail')walkerFootY=deckY;
  else if(boatPhase==='disembark')walkerFootY=deckY*(1-boardingProgress)+surfaceY(boatLandingSurfaceId,boatLandingFootX)*boardingProgress;
  $('walker').style.left=`${walkerWorldX}px`;
  $('walker').style.top=`${walkerFootY*height}px`;
  $('boat').style.left=`${boatWorldX}px`;
  const boatWidth=height*(boatPhase==='cruise'?.39:.31);
  $('boat').style.top=`${height*waterY-boatWidth*.328}px`;
  $('boat').style.width=`${boatWidth}px`;
  renderDebug(walkerFootY,waterY,boatWidth);
  $('boat').classList.toggle('reverse',boatTripDirection<0);
  for(const person of ambientPeople){
    if(person.worldX>offset-scene.clientWidth&&person.worldX<offset+scene.clientWidth*2)loadDeferredArt(person.element);
    person.element.style.left=`${person.worldX}px`;
    if(person.path)person.element.style.top=`${paintedPathY(person.path,(person.worldX-panelStarts[person.panel])/widths[person.panel])*height}px`;
    person.element.classList.toggle('reverse',person.direction<0);
    person.element.classList.toggle('resting',Boolean(person.path)&&performance.now()<person.restUntil);
  }
  for(const deer of deerHerd){
    if(deer.worldX>offset-scene.clientWidth&&deer.worldX<offset+scene.clientWidth*2)loadDeferredArt(deer.element);
    deer.element.style.left=`${deer.worldX}px`;
    deer.element.style.top=`${paintedPathY(deer.path,deer.x)*height}px`;
    deer.element.classList.toggle('reverse',deer.direction<0);
    deer.element.dataset.pose=deer.pose||deer.state;
  }
  document.querySelector('.cloud-one').style.marginLeft=`${-offset*.027}px`;
  document.querySelector('.cloud-two').style.marginLeft=`${offset*.018}px`;
  const progress=maxOffset() ? offset/maxOffset() : 0;
  $('progressFill').style.width=`${progress*100}%`;
  $('progressThumb').style.left=`calc(${progress*100}% - ${progress*10}px)`;
  const middle=offset+scene.clientWidth*.5;
  const nearest=spots.reduce((best,spot)=>Math.abs(spotX(spot)-middle)<Math.abs(spotX(best)-middle)?spot:best,spots[0]);
  $('regionName').textContent=nearest.area;
  const activeZone=middle<panelStarts[3]?'lake':middle<panelStarts[4]?'palace':middle<panelStarts[5]?'plains':'mountain';
  document.querySelectorAll('[data-zone]').forEach((button)=>button.classList.toggle('active',button.dataset.zone===activeZone));
}

function loadDeferredArt(root){
  if(root.dataset.artReady==='true')return;
  for(const image of root.querySelectorAll('img[data-art]')){image.src=image.dataset.art;delete image.dataset.art;}
  root.dataset.artReady='true';
}

function showToast(message){
  const toast=$('toast');toast.textContent=message;toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
}

function closeDepth(immediate=false){
  if(depthState==='closed')return;
  if(depthState==='pending')immediate=true;
  stopGuide();
  lastDepthCloseAt=performance.now();
  depthSerial++;
  clearTimeout(depthTimer);
  const portal=$('depthPortal');
  $('depthLoading').hidden=true;
  portal.classList.add('closing');
  $('depthGuard').hidden=true;
  $('depthInfo').hidden=true;
  depthState='closing';
  const restore=()=>{
    portal.hidden=true;portal.classList.remove('closing');depthState='closed';depthCurrent=null;
    $('depthGuard').hidden=true;
    setBackgroundInert(false);
    travelScale=1;render();
    if(!reducedMotion.matches){setTimeout(()=>experience.classList.remove('depth-travel'),850);}
    else experience.classList.remove('depth-travel');
    if(depthSavedView){
      placeWalker(depthSavedView.walkerSurfaceId,depthSavedView.walkerWorldX);
      targetOffset=depthSavedView.offset;velocity=0;
      depthSavedView=null;
    }
    if(depthFocusReturn?.isConnected&&!depthFocusReturn.closest('[hidden]'))depthFocusReturn.focus({preventScroll:true});
    else scene.focus({preventScroll:true});
    depthFocusReturn=null;
  };
  travelScale=1;render();
  if(immediate||reducedMotion.matches){portal.classList.remove('open','clear-mist','ready');restore();}
  else{
    requestAnimationFrame(()=>{if(depthState==='closing')portal.classList.remove('open','clear-mist','ready');});
    depthTimer=setTimeout(restore,760);
  }
}

function openDepth(target,creature=deerHerd[0]){
  if(depthState!=='closed')closeDepth(true);
  const serial=++depthSerial;
  const key=typeof target==='string'?target:target.id;
  const art=destinationArt[key];if(!art)return;
  const spot=typeof target==='string'?null:target;
  const focusX=spot?spotX(spot):creature.worldX;
  const focusY=spot?spot.y*height:paintedPathY(creature.path,creature.x)*height;
  depthFocusReturn=document.activeElement instanceof HTMLElement?document.activeElement:scene;
  depthRetryTarget=target;
  $('depthError').hidden=true;
  depthState='pending';depthCurrent=key;
  $('depthGuard').hidden=false;
  $('depthLoading').textContent=`正在走近${spot?.name||'画中景点'}…`;
  $('depthLoading').hidden=false;
  setBackgroundInert(true);
  $('depthLoading').focus({preventScroll:true});
  if(boating)setBoating(false);
  depthSavedView={offset,walkerWorldX,walkerSurfaceId};
  closeStory();
  const desired=clamp(focusX-scene.clientWidth*.58,0,maxOffset());
  const shift=Math.abs(desired-offset);
  travelOrigin={x:focusX/totalWidth,y:focusY/height};
  world.style.transformOrigin=`${focusX}px ${focusY}px`;
  experience.classList.add('depth-travel');
  travelScale=reducedMotion.matches?1:1.12;
  targetOffset=desired;velocity=0;
  const foreground=key==='chuifeng'||key==='simian'?'hammer-foreground-lossless.webp':
    ['shuixin','dike','yanyu','jinshan','moon'].includes(key)?'lake-foreground-lossless.webp':
    ['lizheng','danbo'].includes(key)?'palace-foreground-lossless.webp':'plains-foreground-lossless.webp';
  const begin=()=>{
    if(serial!==depthSerial||depthState!=='pending')return;
    const portal=$('depthPortal');
    $('depthLoading').hidden=true;
    portal.hidden=false;portal.classList.remove('open','clear-mist','ready','closing');
    portal.classList.toggle('yanyu-close',key==='yanyu');
    portal.style.setProperty('--origin-x',`${clamp(focusX-offset,30,scene.clientWidth-30)}px`);
    portal.style.setProperty('--origin-y',`${clamp(focusY,35,scene.clientHeight-35)}px`);
    portal.style.setProperty('--depth-image',`url('${assetUrl(`art/${art[0]}`)}')`);
    portal.style.setProperty('--target-x',art[3]);portal.style.setProperty('--target-y',art[4]);
    $('depthForeground').src=assetUrl(`art/${foreground}`);
    $('depthKicker').textContent=art[1];
    $('depthAction').textContent=art[2];
    $('depthInfoKicker').textContent=art[1];
    $('depthInfoTitle').textContent=key==='deer'?'梅花鹿':key==='chuifeng'?'磬锤峰':spot.name;
    $('depthInfoBody').textContent=key==='deer'?'平原林缘的梅花鹿会停步、觅食，也会警觉地抬头。观察它们时宜保持距离，不追逐惊扰。':`${spot.description}\n\n观赏重点：${spotViewpoints[key]}`;
    $('depthInfo').hidden=true;
    $('depthCloud').textContent=key==='deer'?'静观鹿影　↗':'拨云观景　↗';
    $('depthCloud').setAttribute('aria-pressed','false');
    portal.classList.toggle('deer-close',key==='deer');
    if(key==='deer')loadDeferredArt($('depthDeer'));
    portal.classList.toggle('peak-close',key==='chuifeng');
    prepareGuide(key);
    if(key==='deer'){$('depthDeer').dataset.pose='alert';closeDeerNextAt=performance.now()+2400;}
    depthState='opening';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(serial!==depthSerial||depthState!=='opening')return;
      portal.classList.add('open');$('depthBack').focus({preventScroll:true});
      if(spot){
        visited.add(spot.id);
        $('visitedCount').textContent=String(visited.size).padStart(2,'0');
        window.dispatchEvent(new CustomEvent('chengde-spot-visited',{detail:{name:spot.name}}));
      }
    }));
    depthTimer=setTimeout(()=>{if(depthState==='opening'){depthState='open';portal.classList.add('ready');}},reducedMotion.matches?30:1700);
  };
  const preload=(src)=>new Promise((resolve,reject)=>{
    const image=new Image();
    const timeout=setTimeout(()=>reject(new Error(`Image timed out: ${src}`)),9000);
    image.onload=async()=>{
      try{
        await image.decode?.();
        if(!image.naturalWidth||!image.naturalHeight)throw new Error(`Image empty: ${src}`);
        clearTimeout(timeout);resolve();
      }catch(error){clearTimeout(timeout);reject(error);}
    };
    image.onerror=()=>{clearTimeout(timeout);reject(new Error(`Image failed: ${src}`));};
    image.src=src;
  });
  Promise.all([
    preload(assetUrl(`art/${art[0]}`)),preload(assetUrl(`art/${foreground}`)),
    ...(key==='deer'?[...$('depthDeer').querySelectorAll('img')].map(image=>preload(image.dataset.art||image.src)):[]),
    new Promise((resolve)=>setTimeout(resolve,reducedMotion.matches?30:shift>scene.clientWidth*.35?850:90))
  ]).then(begin).catch(()=>{
    if(serial!==depthSerial||depthState!=='pending')return;
    depthState='closed';depthCurrent=null;
    $('depthGuard').hidden=true;
    $('depthLoading').hidden=true;
    travelScale=1;render();
    experience.classList.remove('depth-travel');
    setBackgroundInert(true);
    $('depthError').hidden=false;
    $('depthRetry').focus({preventScroll:true});
  });
}

function showSpot(spot, move=true, enterDepth=true){
  if(depthState==='closing')closeDepth(true);
  if(boating && move)setBoating(false);
  activeSpot=spot;
  if(move&&enterDepth){openDepth(spot);return;}
  $('storyIndex').textContent=`湖山其${['一','二','三','四','五','六','七','八','九','十','十一'][spots.indexOf(spot)]}`;
  $('storyTitle').textContent=spot.name;
  $('storySubtitle').textContent=spot.subtitle;
  $('storyDescription').textContent=spot.description;
  $('storyPanel').classList.add('open');
  for(const [id,button] of navButtons)button.classList.toggle('active',id===spot.id);
  for(const [id,button] of hotspotButtons)button.classList.toggle('active',id===spot.id);
  if(move){
    placeWalker(nearestSurface(spotX(spot),walkerSurfaceId),spotX(spot));
    targetOffset=clamp(spotX(spot)-scene.clientWidth*.5,0,maxOffset());velocity=0;
    experience.classList.add('traveler-visible');
  }
}

function closeStory(){
  $('storyPanel').classList.remove('open');
  activeSpot=null;
  for(const button of navButtons.values())button.classList.remove('active');
  for(const button of hotspotButtons.values())button.classList.remove('active');
}

function createNavigation(){
  for(const spot of spots){
    const hotspot=document.createElement('button');
    hotspot.type='button';hotspot.className='hotspot';
    hotspot.setAttribute('aria-label',`探索${spot.name}`);
    hotspot.innerHTML=`<span class="hotspot-dot" aria-hidden="true">${spot.icon}</span><span class="hotspot-name">${spot.name}</span>`;
    hotspot.addEventListener('click',(event)=>{event.stopPropagation();if(performance.now()<suppressClickUntil)return;showSpot(spot);});
    hotspotLayer.append(hotspot);hotspotButtons.set(spot.id,hotspot);
    const nav=document.createElement('button');nav.type='button';nav.textContent=spot.name;
    nav.dataset.spot=spot.id;
    nav.addEventListener('click',()=>showSpot(spot));
    spotNav.append(nav);navButtons.set(spot.id,nav);
  }
}

function setBoating(value,startX){
  if(value&&!['lakeWest','lakeTerrace','eastShore'].includes(walkerSurfaceId)){
    showToast('请先到湖岸步道候船');
    return;
  }
  boating=value;
  experience.classList.toggle('boating',boating);
  $('boatBtn').classList.toggle('active',boating);
  $('boatBtn').setAttribute('aria-pressed',String(boating));
  if(boating){
    moveDir=0;walkTargetX=null;experience.classList.remove('walking');
    if(startX!==undefined)boatWorldX=clamp(startX,25,totalWidth-25);
    boatPaused=false;boatPhase='approach';boatPhaseTime=0;
    boatTripDirection=walkerSurfaceId==='eastShore'?-1:1;
    boatStartSurfaceId=walkerSurfaceId;
    boatStartFootX=walkerWorldX;
    boatLandingSurfaceId=boatTripDirection>0?'eastShore':walkerSurfaceId==='lakeWest'?'lakeWest':'lakeTerrace';
    boatLandingFootX=boatTripDirection>0?surfaceX('eastShore',.7):surfaceX(boatLandingSurfaceId,boatLandingSurfaceId==='lakeWest'?.17:.66);
    boatDockX=walkerWorldX-boatTripDirection*height*.1;
    boatLandingX=boatLandingFootX-boatTripDirection*height*.1;
    boatDockWaterY=mooringWaterline(boatStartSurfaceId);
    boatLandingWaterY=mooringWaterline(boatLandingSurfaceId);
    boardingStartX=walkerWorldX;boardingProgress=0;
    $('boatBtn').querySelector('small').textContent='暂停';
    $('walkLeft').disabled=true;$('walkRight').disabled=true;
    closeStory();showToast('画舫正向岸边驶来');
  }else{
    if(['board','sail','disembark'].includes(boatPhase)){
      const atStart=Math.abs(boatWorldX-boatDockX)<Math.abs(boatWorldX-boatLandingX);
      placeWalker(atStart?boatStartSurfaceId:boatLandingSurfaceId,atStart?boatStartFootX:boatLandingFootX);
      boatWorldX=atStart?boatDockX:boatLandingX;
      if(atStart)boatLandingWaterY=boatDockWaterY;
      targetOffset=clamp(walkerWorldX-scene.clientWidth*.52,0,maxOffset());
    }
    boatPaused=false;boatPhase='moored';boatPhaseTime=0;boardingProgress=0;
    boatCruiseCenter=boatWorldX;
    experience.classList.remove('aboard','walking');
    $('boatBtn').querySelector('small').textContent='呼船';
    $('walkLeft').disabled=false;$('walkRight').disabled=false;
    showToast('泊舟上岸');
  }
}

function toggleBoatJourney(){
  if(!boating){setBoating(true);return;}
  boatPaused=!boatPaused;
  $('boatBtn').querySelector('small').textContent=boatPaused?'续行':'暂停';
  showToast(boatPaused?'画舫暂泊，可再点继续':'画舫继续向前');
}

function setNight(value){
  night=value;experience.classList.toggle('night',night);
  if(!night)experience.classList.remove('lights-awake');
  $('nightBtn').classList.toggle('active',night);
  $('nightBtn').setAttribute('aria-pressed',String(night));
  $('nightBtn').setAttribute('aria-label',night?'切换至白昼':'切换至夜景');
  $('nightBtn').querySelector('small').textContent=night?'白昼':'夜游';
  $('weatherText').textContent=`${raining?'雨':'晴'} · ${night?'夜色':'午后'}`;
  showToast(night?'月色入湖，万籁俱静':'日光重临，湖山如画');
}

function setRaining(value){
  raining=value;experience.classList.toggle('raining',raining);
  rainElapsed=0;
  $('rainBtn').classList.toggle('active',raining);
  $('rainBtn').setAttribute('aria-pressed',String(raining));
  $('rainBtn').setAttribute('aria-label',raining?'关闭烟雨':'开启烟雨');
  $('rainBtn').querySelector('small').textContent=raining?'放晴':'烟雨';
  $('weatherText').textContent=`${raining?'雨':'晴'} · ${night?'夜色':'午后'}`;
  showToast(raining?'风起湖面，细雨将至':'云开雨霁，湖光清明');
}

function updateSoundButton(enabled){
  $('soundBtn').setAttribute('aria-pressed',String(enabled));
  $('soundBtn').setAttribute('aria-label',enabled?'关闭音乐':'开启音乐');
  $('soundBtn').querySelector('.label').textContent=enabled?'音乐开':'音乐关';
  $('soundBtn').querySelector('.control-glyph').textContent=enabled?'♫':'♪';
}

function updateMusicEnvelope(){
  if(!music||music.paused)return;
  const start=clamp(music.currentTime/3,0,1);
  const end=Number.isFinite(music.duration)?clamp((music.duration-music.currentTime)/6,0,1):1;
  music.volume=.22*Math.min(start,end)*(guideSpeaking?.28:1);
}

function stopGuide(){
  voiceGuide.stop();guideSpeaking=false;
  $('guideCaption').hidden=true;$('guideCaption').textContent='';
  $('guideReplay').hidden=true;$('guidePlay').textContent='▶ 听讲解';
  $('depthPortal').classList.remove('guide-active');updateMusicEnvelope();
}
function prepareGuide(key){
  stopGuide();guideKey=key;
  $('guideTitle').textContent=key==='deer'?'静观鹿影':`随景解说 · ${spots.find((spot)=>spot.id===key)?.name||''}`;
}
function showGuideText(){
  $('depthInfo').hidden=true;$('depthPortal').classList.add('guide-active');
  $('guideCaption').hidden=false;$('guideCaption').textContent=guideScripts[guideKey]?.lines.join('')||'';
}
function toggleGuide(){if(!guideScripts[guideKey])return;showGuideText();voiceGuide.play(guideKey);}
function startGuide(){if(!guideScripts[guideKey])return;showGuideText();voiceGuide.play(guideKey,{replay:true});}
window.addEventListener('chengde-guide-state',({detail})=>{
  guideSpeaking=detail.speaking;updateMusicEnvelope();
  if(detail.key!==guideKey)return;
  $('guidePlay').textContent=detail.label;$('guideReplay').hidden=detail.mode==='idle'||detail.mode==='loading'||detail.mode==='error';
});

function ensureMusic(){
  if(music)return;
  music=$('siteMusic');music.volume=0;
  music.addEventListener('error',()=>{
    soundRequested=false;clearInterval(musicEnvelopeTimer);updateSoundButton(false);
    showToast('音乐加载失败，请稍后重试');
  });
}

async function toggleSound(){
  ensureMusic();
  const serial=++soundSerial;
  if(soundRequested){
    soundRequested=false;music.pause();music.volume=0;
    clearInterval(musicEnvelopeTimer);updateSoundButton(false);
    showToast('已静音');return;
  }
  try{
    soundRequested=true;
    await music.play();
    if(serial!==soundSerial||!soundRequested){music.pause();return;}
    clearInterval(musicEnvelopeTimer);
    updateMusicEnvelope();
    musicEnvelopeTimer=setInterval(updateMusicEnvelope,100);
    updateSoundButton(true);
    showToast('平沙落雁 · 古琴');
  }catch{
    if(serial!==soundSerial)return;
    soundRequested=false;clearInterval(musicEnvelopeTimer);updateSoundButton(false);
    showToast('请再次点击开启音乐');
  }
}

function setMoving(direction){
  if(boating)return;
  moveDir=direction;
  if(direction!==0){walkTargetX=null;velocity=0;experience.classList.add('traveler-visible');}
  experience.classList.toggle('walking',direction!==0||walkTargetX!==null);
}

function stepWalk(direction,distance=220){
  if(boating)return;
  const [left,right]=walkBounds();
  walkTargetX=clamp(walkerWorldX+direction*distance,left,right);
  velocity=0;experience.classList.add('traveler-visible','walking');
}

function followX(worldX){
  const screenX=worldX-offset;
  if(screenX>scene.clientWidth*.65)targetOffset=clamp(worldX-scene.clientWidth*.65,0,maxOffset());
  else if(screenX<scene.clientWidth*.32)targetOffset=clamp(worldX-scene.clientWidth*.32,0,maxOffset());
}

function animate(now){
  const dt=Math.min(50,now-lastFrame);lastFrame=now;
  if(!entered||document.hidden||!$('regionPortal').hidden){requestAnimationFrame(animate);return;}
  if(depthCurrent==='deer'&&depthState!=='closed'&&now>=closeDeerNextAt){
    const deer=$('depthDeer');
    deer.dataset.pose=deer.dataset.pose==='graze'?'alert':'graze';
    closeDeerNextAt=now+2200+Math.random()*2700;
    if(deer.dataset.pose==='alert'&&Math.random()<.45){deer.classList.add('flick');setTimeout(()=>deer.classList.remove('flick'),300);}
  }
  for(const person of ambientPeople){
    if(staticPainting)continue;
    if(!person.path)continue;
    if(now>=person.nextRest&&now>=person.restUntil){
      person.restUntil=now+2200+Math.random()*4200;
      person.nextRest=person.restUntil+5200+Math.random()*7400;
    }
    if(now<person.restUntil)continue;
    person.worldX+=person.direction*person.speed*dt;
    if(person.worldX>=person.right){person.worldX=person.right;person.direction=-1;person.restUntil=now+1600+Math.random()*2600;}
    if(person.worldX<=person.left){person.worldX=person.left;person.direction=1;person.restUntil=now+1600+Math.random()*2600;}
  }
  for(const deer of deerHerd){
    if(deer.startRunAt&&now>=deer.startRunAt){deer.state='walk';deer.stateUntil=deer.fleeUntil;deer.startRunAt=0;}
    if(now>=deer.stateUntil){
      if(deer.state==='walk')deer.state=Math.random()<.56?'graze':'alert';
      else if(deer.state==='graze')deer.state=Math.random()<.62?'alert':'walk';
      else deer.state=Math.random()<.56?'walk':'graze';
      deer.stateUntil=now+(deer.state==='walk'?1300+Math.random()*1200:2500+Math.random()*3300);
    }
    const stepping=deer.state==='walk'&&((now/680+deer.phase)%1)<.55;
    deer.pose=deer.state==='walk'?(stepping&&deer.kind==='stag'?'walk':'alert'):deer.state;
    if(stepping){
      deer.worldX+=deer.direction*deer.speed*(now<(deer.fleeUntil||0)?2.2:1)*dt;
      if(deer.worldX>=deer.right||deer.worldX<=deer.left){
        deer.worldX=clamp(deer.worldX,deer.left,deer.right);deer.direction*=-1;
        deer.state='alert';deer.stateUntil=now+1800+Math.random()*1500;
      }
      deer.x=(deer.worldX-panelStarts[4])/widths[4];
    }
    if(now-deer.lastEar>5800&&Math.random()<dt*.000024){deer.earUntil=now+240;deer.lastEar=now;}
    deer.element.classList.toggle('ear-flick',now<(deer.earUntil||0));
  }
  const windBase=raining?-1.6:-.28;
  for(const tree of treePatches){
    const wind=windBase+Math.sin(now*.00082+tree.phase)*.48+Math.sin(now*.00147+tree.phase*.8)*.18;
    tree.element.style.transform=`translateX(${wind*tree.strength*2.6}px) rotate(${wind*tree.strength*.28}deg)`;
  }
  if(!dragging){
    if(!staticPainting&&boating&&!boatPaused){
      if(boatPhase==='approach'){
        const distance=boatDockX-boatWorldX;
        boatWorldX+=Math.sign(distance)*Math.min(Math.abs(distance),dt*.2);
        if(boatWorldX-offset>scene.clientWidth*.76)targetOffset=clamp(boatWorldX-scene.clientWidth*.76,0,maxOffset());
        else if(boatWorldX-offset<scene.clientWidth*.36)targetOffset=clamp(boatWorldX-scene.clientWidth*.36,0,maxOffset());
        if(Math.abs(distance)<2){boatPhase='dock';boatPhaseTime=0;showToast('画舫已靠岸，请登船');}
      }else if(boatPhase==='dock'){
        boatPhaseTime+=dt;
        if(boatPhaseTime>650){boatPhase='board';boatPhaseTime=0;experience.classList.add('aboard');}
      }else if(boatPhase==='board'){
        boardingProgress=clamp(boardingProgress+dt/1450,0,1);
        walkerWorldX=boardingStartX+(boatWorldX-boardingStartX)*boardingProgress;
        if(boardingProgress>=1){boatPhase='sail';boatSailStartX=boatWorldX;showToast(boatTripDirection>0?'舟行湖上，向金山而去':'舟行湖上，向烟雨楼而去');}
      }else if(boatPhase==='sail'){
        boatWorldX=clamp(boatWorldX+boatTripDirection*dt*.23,0,totalWidth);
        walkerWorldX=boatWorldX;
        followX(boatWorldX);
        if((boatTripDirection>0&&boatWorldX>=boatLandingX)||(boatTripDirection<0&&boatWorldX<=boatLandingX)){
          boatWorldX=boatLandingX;walkerWorldX=boatWorldX;
          boatPhase='disembark';boatPhaseTime=0;boardingProgress=0;
          experience.classList.remove('aboard');experience.classList.add('walking','traveler-visible');
          showToast(boatTripDirection>0?'东岸将至，准备登岸':'西岸将至，准备登岸');
        }
      }else if(boatPhase==='disembark'){
        boatPhaseTime+=dt;
        boardingProgress=clamp(boatPhaseTime/1550,0,1);
        walkerWorldX=boatWorldX+(boatLandingFootX-boatWorldX)*boardingProgress;
        followX(walkerWorldX);
        if(boardingProgress>=1){
          placeWalker(boatLandingSurfaceId,boatLandingFootX);
          boating=false;boatPhase='moored';boatPhaseTime=0;boatCruiseCenter=boatWorldX;
          experience.classList.remove('boating','aboard','walking');
          $('boatBtn').classList.remove('active');$('boatBtn').setAttribute('aria-pressed','false');
          $('boatBtn').querySelector('small').textContent='呼船';
          $('walkLeft').disabled=false;$('walkRight').disabled=false;
          showToast(boatTripDirection>0?'已至东岸，可沿亭边步道行走':'已至西岸，可沿湖边步道行走');
        }
      }
    }else if(!staticPainting&&!boating && boatPhase==='cruise'){
      boatPhaseTime+=dt;
      boatWorldX+=boatDir*dt*.043;
      if(boatWorldX>boatCruiseCenter+height*.1)boatDir=-1;
      if(boatWorldX<boatCruiseCenter-height*.1)boatDir=1;
    }
    if(!staticPainting&&!boating && (moveDir||walkTargetX!==null)){
      const direction=moveDir||Math.sign(walkTargetX-walkerWorldX);
      const step=direction*dt*.19;
      const [left,right]=walkBounds();
      walkerWorldX=clamp(walkerWorldX+step,left,right);
      const lakePalaceJoin=surfaceX('palaceCourt',.145);
      if(direction>0&&walkerSurfaceId==='eastShore'&&walkerWorldX>=lakePalaceJoin)walkerSurfaceId='palaceCourt';
      else if(direction<0&&walkerSurfaceId==='palaceCourt'&&walkerWorldX<=lakePalaceJoin)walkerSurfaceId='eastShore';
      if(walkTargetX!==null&&Math.abs(walkTargetX-walkerWorldX)<=Math.abs(step)+1){walkerWorldX=walkTargetX;walkTargetX=null;}
      experience.classList.toggle('walking',moveDir!==0||walkTargetX!==null);
      followX(walkerWorldX);
    }
    if(!boating&&!moveDir&&walkTargetX===null&&Math.abs(velocity)>.02){
      offset+=velocity*dt;
      velocity*=Math.pow(.89,dt/16);
      targetOffset=offset;
    }else if(Math.abs(targetOffset-offset)>.2){offset+=(targetOffset-offset)*Math.min(.2,dt*.009);}
    else{offset=targetOffset;velocity=0;}
    render();
  }
  drawRain(dt);
  requestAnimationFrame(animate);
}

function bindEvents(){
  const nav=$('spotNav');
  const updateNavHint=()=>nav.parentElement.classList.toggle('at-end',nav.scrollLeft+nav.clientWidth>=nav.scrollWidth-6);
  nav.addEventListener('scroll',updateNavHint,{passive:true});
  window.addEventListener('resize',updateNavHint);
  requestAnimationFrame(updateNavHint);
  function enterScene(spotId){
    if(entered)return;entered=true;
    experience.classList.remove('is-hidden');
    layout(false);
    experience.classList.add('traveler-visible');
    $('intro').classList.add('leaving');
    $('skipEntryBtn').hidden=false;
    let finished=false;
    const finishEnter=()=>{
      if(finished)return;finished=true;
      $('skipEntryBtn').hidden=true;
      $('intro').hidden=true;scene.focus({preventScroll:true});
      if(spotId){const destination=spots.find((s)=>s.id===spotId);if(destination)showSpot(destination);}
      else showToast('按住画卷，慢慢游赏');
    };
    $('skipEntryBtn').onclick=finishEnter;
    setTimeout(finishEnter,reducedMotion.matches?0:1050);
  }
  function returnOverview(){
    if(entered&&performance.now()-lastDepthCloseAt<1200)return;
    closeDepth(true);
    setMoving(0);if(boating)setBoating(false);closeStory();
    $('intro').hidden=false;$('intro').classList.remove('leaving');entered=false;
    $('enterBtn').focus({preventScroll:true});
  }
  $('enterBtn').addEventListener('click',()=>enterScene());
  document.querySelectorAll('[data-enter-spot]').forEach((button)=>button.addEventListener('click',()=>enterScene(button.dataset.enterSpot)));
  const zoneEntryX={lake:.18,palace:.32,plains:.60,mountain:.58};
  const zoneSurface={lake:'lakeWest',palace:'palaceCourt',plains:'plainsPath',mountain:'mountainSteps'};
  document.querySelectorAll('[data-zone]').forEach((button)=>button.addEventListener('click',()=>{
    const zone=button.dataset.zone;
    showSpot(spots[zoneStarts[zone]],true,false);
    placeWalker(zoneSurface[zone],panelStarts[zonePanels[zone]]+widths[zonePanels[zone]]*zoneEntryX[zone]);
  }));
  $('depthBack').addEventListener('click',()=>closeDepth());
  $('depthRetry').addEventListener('click',()=>{
    $('depthError').hidden=true;setBackgroundInert(false);
    const source=depthFocusReturn;
    const savedView=depthSavedView;
    if(depthRetryTarget){openDepth(depthRetryTarget);depthFocusReturn=source;depthSavedView=savedView;}
  });
  $('depthErrorBack').addEventListener('click',()=>{
    $('depthError').hidden=true;setBackgroundInert(false);
    if(depthSavedView){targetOffset=depthSavedView.offset;velocity=0;}
    depthSavedView=null;
    if(depthFocusReturn?.isConnected)depthFocusReturn.focus({preventScroll:true});
    else scene.focus({preventScroll:true});
    depthFocusReturn=null;
  });
  $('sceneRetry').addEventListener('click',()=>location.reload());
  document.querySelectorAll('.art-panel').forEach((image)=>image.addEventListener('error',()=>{
    $('sceneLoadError').hidden=false;
    setBackgroundInert(true);
    $('sceneRetry').focus({preventScroll:true});
  }));
  $('depthPeak').addEventListener('click',()=>{stopGuide();$('depthInfo').hidden=false;});
  $('guidePlay').addEventListener('click',toggleGuide);
  $('guideReplay').addEventListener('click',startGuide);
  $('depthInfoClose').addEventListener('click',()=>{$('depthInfo').hidden=true;});
  $('depthCloud').addEventListener('click',()=>{
    const portal=$('depthPortal');portal.classList.toggle('clear-mist');
    const clear=portal.classList.contains('clear-mist');
    $('depthCloud').textContent=clear?'云开见景 · 复云':'拨云观景　↗';
    $('depthCloud').setAttribute('aria-pressed',String(clear));
  });
  $('depthPortal').addEventListener('pointermove',(event)=>{
    if(depthState!=='open'||reducedMotion.matches)return;
    const portal=$('depthPortal');
    const x=clamp((event.clientX/portal.clientWidth-.5)*2,-1,1);
    const y=clamp((event.clientY/portal.clientHeight-.5)*2,-1,1);
    portal.style.setProperty('--parallax-back-x',`${-x*8}px`);
    portal.style.setProperty('--parallax-back-y',`${-y*5}px`);
    portal.style.setProperty('--parallax-front-x',`${x*15}px`);
    portal.style.setProperty('--parallax-front-y',`${y*9}px`);
  });
  $('depthDeer').addEventListener('click',()=>{
    const deer=$('depthDeer');deer.dataset.pose='alert';closeDeerNextAt=performance.now()+2000;
    deer.classList.remove('flick');requestAnimationFrame(()=>deer.classList.add('flick'));
    setTimeout(()=>deer.classList.remove('flick'),300);
  });
  $('homeBtn').addEventListener('click',returnOverview);
  $('storyHomeBtn').addEventListener('click',returnOverview);
  $('closeStory').addEventListener('click',closeStory);
  $('nextSpotBtn').addEventListener('click',()=>showSpot(spots[(spots.indexOf(activeSpot)+1)%spots.length]));
  $('nightBtn').addEventListener('click',()=>setNight(!night));
  $('rainBtn').addEventListener('click',()=>setRaining(!raining));
  $('soundBtn').addEventListener('click',toggleSound);
  $('zoomInBtn').addEventListener('click',()=>{zoom=clamp(zoom+.15,.85,1.45);layout();showToast(`画卷 ${Math.round(zoom*100)}%`);});
  $('zoomOutBtn').addEventListener('click',()=>{zoom=clamp(zoom-.15,.85,1.45);layout();showToast(`画卷 ${Math.round(zoom*100)}%`);});
  let helpReturnFocus=null,helpBackground=new Map();
  function openHelp(source){
    if(!$('helpDialog').hidden)return;
    helpReturnFocus=source;
    helpBackground=new Map([...$('app').children].filter(node=>node!==$('helpDialog')).map(node=>[node,node.inert]));
    for(const node of helpBackground.keys())node.inert=true;
    $('helpDialog').hidden=false;$('introRights').setAttribute('aria-expanded','true');$('closeHelp').focus();
  }
  $('helpBtn').addEventListener('click',()=>openHelp($('helpBtn')));
  $('introRights').addEventListener('click',()=>openHelp($('introRights')));
  function closeHelp(){
    $('helpDialog').hidden=true;$('introRights').setAttribute('aria-expanded','false');
    for(const [node,inert]of helpBackground)node.inert=inert;helpBackground.clear();
    if(helpReturnFocus?.isConnected)helpReturnFocus.focus({preventScroll:true});
  }
  $('closeHelp').addEventListener('click',closeHelp);
  $('resumeBtn').addEventListener('click',closeHelp);
  $('helpDialog').addEventListener('click',(event)=>{if(event.target===$('helpDialog'))closeHelp();});
  scene.addEventListener('pointerdown',(event)=>{
    if(event.target.closest('button'))return;
    activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    scene.setPointerCapture(event.pointerId);
    if(activePointers.size===2){
      const [a,b]=[...activePointers.values()];
      pinchStart={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom,worldX:offset+(a.x+b.x)/2,screenX:(a.x+b.x)/2};
      dragging=false;velocity=0;scene.classList.remove('dragging');return;
    }
    dragging=true;pointerX=event.clientX;pointerY=event.clientY;pointerOffset=offset;lastDragX=event.clientX;lastDragTime=performance.now();velocity=0;
    scene.classList.add('dragging');
  });
  scene.addEventListener('pointermove',(event)=>{
    if(activePointers.has(event.pointerId))activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pinchStart&&activePointers.size>=2){
      const [a,b]=[...activePointers.values()];
      const nextZoom=clamp(pinchStart.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinchStart.distance),.85,1.45);
      if(Math.abs(nextZoom-zoom)>.007){
        zoom=nextZoom;layout();
        const centerX=(a.x+b.x)/2;
        offset=clamp(pinchStart.worldX*zoom/pinchStart.zoom-centerX,0,maxOffset());
        targetOffset=offset;render();
      }
      experience.classList.add('has-panned');suppressClickUntil=performance.now()+350;
      return;
    }
    if(!dragging)return;
    const delta=event.clientX-pointerX;
    offset=clamp(pointerOffset-delta,0,maxOffset());targetOffset=offset;
    const now=performance.now(),elapsed=now-lastDragTime;
    if(elapsed>8){velocity=clamp((lastDragX-event.clientX)/elapsed,-1.6,1.6);lastDragX=event.clientX;lastDragTime=now;}
    if(Math.abs(delta)>8){suppressClickUntil=now+170;experience.classList.add('has-panned');}
    render();
  });
  scene.addEventListener('pointerup',(event)=>{
    const wasPinching=Boolean(pinchStart);
    activePointers.delete(event.pointerId);
    if(activePointers.size<2)pinchStart=null;
    if(dragging&&!wasPinching&&Math.abs(event.clientX-pointerX)<7&&Math.abs(event.clientY-pointerY)<7){
      const y=(event.clientY-scene.getBoundingClientRect().top-(scene.clientHeight-height)/2)/height;
      const clickWorldX=offset+event.clientX-scene.getBoundingClientRect().left;
      const [left,right]=walkBounds();
      if(!staticPainting&&!boating&&clickWorldX>=left&&clickWorldX<=right&&Math.abs(y-routeY(clickWorldX))<.065){
        walkTargetX=clamp(clickWorldX,left,right);
        experience.classList.add('traveler-visible','walking');
        closeStory();
      }else if(y>=.65&&y<.88)triggerWaterEffect(event.clientX,event.clientY);
    }
    dragging=false;scene.classList.remove('dragging');
  });
  scene.addEventListener('pointercancel',(event)=>{activePointers.delete(event.pointerId);pinchStart=null;dragging=false;scene.classList.remove('dragging');});
  scene.addEventListener('wheel',(event)=>{event.preventDefault();velocity=0;targetOffset=clamp(targetOffset+(Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY)*.7,0,maxOffset());},{passive:false});
  const progress=$('progressFill').parentElement;
  progress.addEventListener('pointerdown',(event)=>{targetOffset=clamp((event.clientX-progress.getBoundingClientRect().left)/progress.clientWidth*maxOffset(),0,maxOffset());velocity=0;});
  for(const [id,dir] of (staticPainting?[]:[['walkLeft',-1],['walkRight',1]])){
    const button=$(id);
    let pressStart=0;
    button.addEventListener('pointerdown',(event)=>{event.preventDefault();button.setPointerCapture(event.pointerId);pressStart=performance.now();setMoving(dir);});
    button.addEventListener('pointerup',()=>{setMoving(0);if(performance.now()-pressStart<250)stepWalk(dir);});
    button.addEventListener('pointercancel',()=>setMoving(0));
  }
  window.addEventListener('keydown',(event)=>{
    if(!$('helpDialog').hidden){
      if(event.key==='Escape'){event.preventDefault();closeHelp();}
      if(event.key==='Tab'){
        const buttons=[...$('helpDialog').querySelectorAll('button,a[href]')].filter((element)=>element.getClientRects().length);
        const first=buttons[0],last=buttons.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
      return;
    }
    if(!$('depthError').hidden){
      if(event.key==='Escape'){event.preventDefault();$('depthErrorBack').click();}
      if(event.key==='Tab'&&((event.shiftKey&&document.activeElement===$('depthRetry'))||(!event.shiftKey&&document.activeElement===$('depthErrorBack')))){
        event.preventDefault();(event.shiftKey?$('depthErrorBack'):$('depthRetry')).focus();
      }
      return;
    }
    if(!$('sceneLoadError').hidden){
      if(event.key==='Tab'){event.preventDefault();$('sceneRetry').focus();}
      return;
    }
    if(depthState!=='closed'){
      if(event.key==='Escape'){event.preventDefault();closeDepth();}
      if(event.key==='Tab'&&depthState==='pending'){event.preventDefault();return;}
      if(event.key==='Tab'&&!$('depthPortal').hidden){
        const buttons=[...$('depthPortal').querySelectorAll('button')].filter((button)=>!button.disabled&&button.getClientRects().length&&getComputedStyle(button).visibility!=='hidden');
        const first=buttons[0],last=buttons.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
      return;
    }
    if(!entered||!$('helpDialog').hidden)return;
    if(event.key==='Escape')closeStory();
  });
  window.addEventListener('blur',()=>setMoving(0));
  document.addEventListener('visibilitychange',()=>{
    if(!music||!soundRequested)return;
    if(document.hidden)music.pause();
    else music.play().then(updateMusicEnvelope).catch(()=>{
      soundRequested=false;updateSoundButton(false);clearInterval(musicEnvelopeTimer);
    });
  });
  window.addEventListener('pagehide',()=>{if(music)music.pause();});
  window.addEventListener('resize',()=>{if(entered)layout();});
}

createNavigation();bindEvents();requestAnimationFrame(animate);
