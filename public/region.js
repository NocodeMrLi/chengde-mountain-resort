const $ = (id) => document.getElementById(id);
const experience = $('experience');
const portal = $('regionPortal');
const frame = $('regionCanvasFrame');
const canvas = $('regionCanvas');
const atlasDialog = $('atlasDialog');
const mainSelectors = ['#scene','.topbar','.zone-nav','.bottom-ui','.story-panel','.progress-track','.keyboard-hint'];
const regions = {
  ruyi:{title:'如意洲',kicker:'湖区岛屿 · 史料方位写意',art:'ruyi-island.webp',alt:'写意绘制的如意洲湖岛，中央庭院和四面园景',description:'景区官网记载如意洲建于康熙四十二年，十二处康乾题名景致汇聚于此。画中标记仅表示东、西、南、北和中轴的相对关系，不是 GPS 或建筑现状图。',names:['无暑清凉','延薰山馆','水芳岩秀','一片云','般若相','清晖亭','金莲映日','沧浪屿','云帆月舫','西岭晨霞','澄波叠翠','观莲所'],positions:{'无暑清凉':[50,71],'延薰山馆':[50,56],'水芳岩秀':[50,43],'一片云':[68,47],'般若相':[75,59],'清晖亭':[84,68],'金莲映日':[36,57],'沧浪屿':[27,68],'云帆月舫':[23,45],'西岭晨霞':[31,36],'澄波叠翠':[52,30],'观莲所':[49,83]}},
  mountain:{title:'山地云岭',kicker:'山峦区 · 登高与借景',art:'mountain-region.webp',alt:'写意绘制的山庄山地、四面云山亭和远处磬锤峰',description:'沿山地画卷由近及远观看四面云山，再遥望园外磬锤峰。画中远峰属于借景；各标记为写意导览位置，不代表实地步道或坐标。',names:['四面云山','锤峰落照'],positions:{'四面云山':[56,41],'锤峰落照':[76,31]}}
};
const visitedKey='chengde-atlas-visited-v1';
let records=[];
let visited=new Set();
try{visited=new Set(JSON.parse(localStorage.getItem(visitedKey)||'[]'));}catch{}
let currentRegion=null,currentItem=null,atlasItem=null,returnFocus=null,atlasReturnFocus=null,regionNearReturnFocus=null;
let pan={x:0,y:0},pointer=null,dragged=false;
let layout=null;
const assetUrl=(path)=>{
  const url=new URL(`./${path}`,import.meta.url);
  const hash=window.__ASSET_HASHES__?.[path];if(hash)url.searchParams.set('v',hash);
  return url.href;
};
const artUrl=(name)=>assetUrl(`art/${name}`);
const entryByName=(name)=>records.find((item)=>item.name===name);
function saveVisited(name){
  const item=entryByName(name);if(!item)return;
  visited.add(item.id);
  try{localStorage.setItem(visitedKey,JSON.stringify([...visited]));}catch{}
  if(!atlasDialog.hidden)renderAtlas();
}
function setMainInert(value){for(const selector of mainSelectors){const node=document.querySelector(selector);if(node)node.inert=value;}}
function resetPan(){
  canvas.style.width=`${canvas.clientHeight*1983/793}px`;
  pan.x=(frame.clientWidth-canvas.clientWidth)/2;pan.y=(frame.clientHeight-canvas.clientHeight)/2;renderPan();
}
function locateItem(name){
  const position=regions[currentRegion]?.positions[name];if(!position)return;
  pan.x=frame.clientWidth*.50-canvas.clientWidth*position[0]/100;
  pan.y=frame.clientHeight*.36-canvas.clientHeight*position[1]/100;
  canvas.classList.add('is-locating');renderPan();
  setTimeout(()=>canvas.classList.remove('is-locating'),680);
}
function renderPan(){
  pan.x=Math.min(0,Math.max(frame.clientWidth-canvas.clientWidth,pan.x));
  pan.y=Math.min(0,Math.max(frame.clientHeight-canvas.clientHeight,pan.y));
  canvas.style.transform=`translate3d(${pan.x}px,${pan.y}px,0)`;
}
function renderMarkers(){
  const container=$('regionMarkers');container.replaceChildren();
  for(const name of regions[currentRegion].names){
    const item=entryByName(name);if(!item)continue;
    const [x,y]=regions[currentRegion].positions[name];
    const button=document.createElement('button');button.type='button';button.className='region-marker';
    button.style.left=`${x}%`;button.style.top=`${y}%`;
    button.setAttribute('aria-label',`${name}，${item.artStatus}`);
    button.dataset.name=name;
    const dot=document.createElement('span');dot.textContent=item.regionNearArt?'✦':'·';
    const label=document.createElement('small');label.textContent=name;
    button.append(dot,label);
    button.addEventListener('click',(event)=>{event.stopPropagation();selectItem(name);});
    container.append(button);
  }
  const list=$('regionList');list.replaceChildren();
  for(const name of regions[currentRegion].names){
    const item=entryByName(name);const button=document.createElement('button');button.type='button';
    button.dataset.name=name;button.textContent=`${name}${item?.regionNearArt?' ↗':' · 筹备中'}`;
    button.addEventListener('click',()=>selectItem(name,true));list.append(button);
  }
}
function selectItem(name,locate=false){
  const item=entryByName(name);if(!item)return;
  currentItem=item;
  $('regionSpotTitle').textContent=item.name;
  $('regionPosition').textContent=`${item.locationHint} · 写意相对位置`;
  $('regionSpotBody').textContent=item.description;
  $('regionSpotStatus').textContent=`画面：${item.artStatus} · 实地现状：${item.presentCondition}`;
  $('regionNearBtn').disabled=!item.regionNearArt;
  $('regionNearBtn').textContent=item.regionNearArt?'走近此景 ↗':'近景筹备中';
  document.querySelectorAll('.region-marker,.region-list button').forEach((button)=>{
    const active=button.dataset.name===name;button.classList.toggle('active',active);
    if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
  });
  if(locate)locateItem(name);
}
function openRegion(key,focusSource=document.activeElement){
  if(!records.length||!regions[key])return;
  if(!atlasDialog.hidden)closeAtlas(false);
  if(!portal.hidden)closeRegion(false);
  returnFocus=focusSource instanceof HTMLElement?focusSource:$('scene');
  currentRegion=key;
  const region=regions[key];
  portal.hidden=false;
  portal.dataset.region=key;
  $('toast').classList.remove('show');
  $('regionArt').src=artUrl(region.art);$('regionArt').alt=region.alt;
  $('regionTitle').textContent=region.title;$('regionKicker').textContent=region.kicker;
  renderMarkers();selectItem(region.names[0]);
  setMainInert(true);
  requestAnimationFrame(()=>{
    resetPan();
    if(key==='mountain'&&frame.clientWidth>800){
      pan.x=frame.clientWidth*.5-canvas.clientWidth*.65;
      pan.y=frame.clientHeight*.36-canvas.clientHeight*.41;
      canvas.classList.add('is-locating');renderPan();
      setTimeout(()=>canvas.classList.remove('is-locating'),680);
    }else locateItem(region.names[0]);
    $('regionBack').focus({preventScroll:true});
  });
}
function closeRegion(restoreFocus=true){
  closeNear(false);
  canvas.classList.remove('is-locating');
  portal.hidden=true;currentRegion=null;currentItem=null;
  setMainInert(false);
  if(restoreFocus){if(returnFocus?.isConnected&&!returnFocus.closest('[hidden]'))returnFocus.focus({preventScroll:true});else $('scene').focus({preventScroll:true});}
}
function openNear(){
  if(!currentItem?.regionNearArt)return;
  regionNearReturnFocus=document.activeElement;
  $('regionNearTitle').textContent=currentItem.name;
  $('regionNearText').textContent=`${currentItem.description} 此画面根据题名与已核对的区域关系进行写意创作；建筑现状和细部形制尚待核实。`;
  $('regionNearArt').src=artUrl(currentItem.regionNearArt);
  $('regionNearArt').alt=`${currentItem.name}的写意近景`;
  $('regionNear').hidden=false;
  for(const id of ['regionCanvasFrame','regionBack','regionAtlas','regionList','regionNearBtn'])$(id).inert=true;
  document.querySelector('.region-tools').inert=true;
  document.querySelector('.region-detail').inert=true;
  saveVisited(currentItem.name);
  $('regionNearBack').focus({preventScroll:true});
}
function closeNear(restoreFocus=true){
  if($('regionNear').hidden)return;
  $('regionNear').hidden=true;
  for(const id of ['regionCanvasFrame','regionBack','regionAtlas','regionList','regionNearBtn'])$(id).inert=false;
  document.querySelector('.region-tools').inert=false;
  document.querySelector('.region-detail').inert=false;
  if(restoreFocus)(regionNearReturnFocus?.isConnected?regionNearReturnFocus:$('regionNearBtn')).focus({preventScroll:true});
}
function statusFor(item){return visited.has(item.id)?'已游览':item.artStatus==='筹备中'?'筹备中':'可游览';}
function filtered(){
  const search=$('atlasSearch').value.trim().toLowerCase(),dynasty=$('atlasDynasty').value,region=$('atlasRegion').value,status=$('atlasStatus').value;
  return records.filter((item)=>{
    const matches=!search||[item.name,...item.aliases].some((word)=>word.toLowerCase().includes(search));
    const s=statusFor(item);
    return matches&&(!dynasty||item.dynasty===dynasty)&&(!region||item.region===region)&&(!status||(status==='visited'?s==='已游览':status==='ready'?s==='可游览':s==='筹备中'));
  });
}
function showAtlasDetail(item){
  atlasItem=item;
  const pane=$('atlasDetail');pane.replaceChildren();
  if(!item){pane.textContent='没有匹配的景名。试试其他关键词或筛选条件。';return;}
  const small=document.createElement('small');small.textContent=`${item.dynasty}题名 · ${item.id.toUpperCase()}`;
  const title=document.createElement('h3');title.textContent=item.name;
  const text=document.createElement('p');text.textContent=`${item.description}\n\n区域：${item.region}（${item.locationHint}）\n实地现状：${item.presentCondition}\n数字画面：${item.artStatus}\n游览状态：${visited.has(item.id)?'已游览':'尚未游览'}`;
  const caution=document.createElement('p');caution.className='atlas-caution';caution.textContent='图鉴标记表示历史题名与数字创作进度，不表示建筑今日仍存或准确坐标。';
  pane.append(small,title,text,caution);
  if(item.aliases.length){const alias=document.createElement('p');alias.textContent=`相关称呼：${item.aliases.join('、')}`;pane.append(alias);}
  if(item.region==='如意洲'||item.regionNearArt&&item.region==='山地'){
    const button=document.createElement('button');button.type='button';button.textContent=item.regionNearArt?'进入区域，走近此景':'查看如意洲写意方位';
    button.addEventListener('click',()=>{const key=item.region==='如意洲'?'ruyi':'mountain';const source=atlasReturnFocus;closeAtlas(false);openRegion(key,source);selectItem(item.name);requestAnimationFrame(()=>locateItem(item.name));});pane.append(button);
  }else if(item.overviewSpotId){
    const button=document.createElement('button');button.type='button';button.textContent='定位长卷景点';
    button.addEventListener('click',()=>{closeAtlas(false);if(!portal.hidden)closeRegion(false);document.querySelector(`[data-spot="${item.overviewSpotId}"]`)?.click();});pane.append(button);
  }
}
function renderAtlas(){
  const items=filtered();$('atlasCount').textContent=`找到 ${items.length} / 72 景 · 已游览 ${visited.size} 景`;
  const list=$('atlasList');list.replaceChildren();
  for(const item of items){
    const button=document.createElement('button');button.type='button';button.className='atlas-row';
    const name=document.createElement('strong');name.textContent=item.name;
    const meta=document.createElement('span');meta.textContent=`${item.dynasty} · ${item.region} · ${statusFor(item)}`;
    button.append(name,meta);button.addEventListener('click',()=>{showAtlasDetail(item);renderAtlasSelection();});list.append(button);
    button.dataset.atlasId=item.id;
  }
  if(!items.includes(atlasItem))showAtlasDetail(items[0]);
  renderAtlasSelection();
}
function renderAtlasSelection(){document.querySelectorAll('.atlas-row').forEach((row)=>row.classList.toggle('active',row.dataset.atlasId===atlasItem?.id));}
function openAtlas(){
  if(!records.length)return;
  atlasReturnFocus=document.activeElement;
  atlasDialog.hidden=false;
  $('toast').classList.remove('show');
  if(!portal.hidden)portal.inert=true;else setMainInert(true);
  renderAtlas();$('atlasSearch').focus({preventScroll:true});
}
function closeAtlas(restoreFocus=true){
  atlasDialog.hidden=true;portal.inert=false;
  if(portal.hidden)setMainInert(false);
  if(restoreFocus)(atlasReturnFocus?.isConnected?atlasReturnFocus:$('atlasBtn')).focus({preventScroll:true});
}
function trap(event,root){
  const focusables=[...root.querySelectorAll('button:not(:disabled),a[href],input,select')].filter((node)=>!node.closest('[hidden]')&&!node.inert&&node.getClientRects().length);
  const first=focusables[0],last=focusables.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
}
window.addEventListener('keydown',(event)=>{
  if(!atlasDialog.hidden){if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeAtlas();}else if(event.key==='Tab'){event.stopImmediatePropagation();trap(event,atlasDialog);}return;}
  if(portal.hidden)return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();if(!$('regionNear').hidden)closeNear();else closeRegion();}
  else if(event.key==='Tab'){event.stopImmediatePropagation();trap(event,$('regionNear').hidden?portal:$('regionNear'));}
},true);
window.addEventListener('chengde-layout',(event)=>{
  layout=event.detail;
  for(const [key,panel,x,y] of [['ruyi',0,.45,.76],['mountain',5,.55,.55]]){
    const button=document.querySelector(`.region-entry[data-region="${key}"]`);if(!button)continue;
    button.style.left=`${layout.panelStarts[panel]+layout.widths[panel]*x}px`;
    button.style.top=`${layout.height*y}px`;
  }
});
window.addEventListener('chengde-spot-visited',(event)=>saveVisited(event.detail.name));
frame.addEventListener('pointerdown',(event)=>{
  if(event.target.closest('button'))return;
  canvas.classList.remove('is-locating');
  pointer={id:event.pointerId,x:event.clientX,y:event.clientY,startX:pan.x,startY:pan.y};dragged=false;
  frame.setPointerCapture(event.pointerId);
});
frame.addEventListener('pointermove',(event)=>{
  if(!pointer||pointer.id!==event.pointerId)return;
  const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
  if(Math.hypot(dx,dy)>5)dragged=true;
  pan.x=pointer.startX+dx;pan.y=pointer.startY+dy;renderPan();
});
for(const name of ['pointerup','pointercancel'])frame.addEventListener(name,()=>{pointer=null;});
window.addEventListener('resize',()=>{if(!portal.hidden){resetPan();if(currentItem)locateItem(currentItem.name);}});
$('regionBack').addEventListener('click',()=>closeRegion());
$('regionNearBack').addEventListener('click',()=>closeNear());
$('regionNearBtn').addEventListener('click',openNear);
$('regionAtlas').addEventListener('click',openAtlas);
$('atlasBtn').addEventListener('click',openAtlas);
$('atlasClose').addEventListener('click',()=>closeAtlas());
for(const id of ['atlasSearch','atlasDynasty','atlasRegion','atlasStatus'])$(id).addEventListener(id==='atlasSearch'?'input':'change',renderAtlas);
$('regionDay').addEventListener('click',()=>$('nightBtn').click());
$('regionRain').addEventListener('click',()=>$('rainBtn').click());
$('regionSound').addEventListener('click',()=>$('soundBtn').click());
document.querySelectorAll('[data-region-entry]').forEach((button)=>button.addEventListener('click',()=>openRegion(button.dataset.regionEntry,button)));
for(const key of ['ruyi','mountain']){
  const button=document.createElement('button');button.type='button';button.className='hotspot region-entry';button.dataset.region=key;
  button.setAttribute('aria-label',`进入${regions[key].title}区域纵深`);
  button.innerHTML=`<span class="hotspot-dot" aria-hidden="true">↘</span><span class="hotspot-name">${regions[key].title} · 深入</span>`;
  button.addEventListener('click',(event)=>{event.stopPropagation();openRegion(key,button);});
  $('hotspotLayer').append(button);
}
fetch(assetUrl('atlas-data.json')).then((response)=>{if(!response.ok)throw new Error('atlas data failed');return response.json();}).then((data)=>{
  if(data.entries?.length!==72)throw new Error('atlas data incomplete');
  records=data.entries;
}).catch(()=>{
  $('atlasBtn').disabled=true;document.querySelectorAll('[data-region-entry],.region-entry').forEach((button)=>button.disabled=true);
  console.error('七十二景资料加载失败，区域与图鉴暂不可用');
});
