const $ = (id) => document.getElementById(id);
const experience = $('experience');
const portal = $('regionPortal');
const frame = $('regionCanvasFrame');
const canvas = $('regionCanvas');
const near = $('regionNear');
const nearViewport = $('regionNearViewport');
const nearCanvas = $('regionNearCanvas');
const nearArt = $('regionNearArt');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const atlasDialog = $('atlasDialog');
const mainSelectors = ['#scene','.topbar','.zone-nav','.bottom-ui','.story-panel','.progress-track','.keyboard-hint'];
const regions = {
  ruyi:{title:'如意洲',kicker:'湖区岛屿 · 史料方位写意',art:'ruyi-island.webp',alt:'写意绘制的如意洲湖岛，中央庭院和四面园景',description:'景区官网记载如意洲建于康熙四十二年，十二处康乾题名景致汇聚于此。画中标记仅表示东、西、南、北和中轴的相对关系，不是 GPS 或建筑现状图。',names:['无暑清凉','延薰山馆','水芳岩秀','一片云','般若相','清晖亭','金莲映日','沧浪屿','云帆月舫','西岭晨霞','澄波叠翠','观莲所'],positions:{'无暑清凉':[50,71],'延薰山馆':[50,56],'水芳岩秀':[50,43],'一片云':[68,47],'般若相':[75,59],'清晖亭':[84,68],'金莲映日':[36,57],'沧浪屿':[27,68],'云帆月舫':[23,45],'西岭晨霞':[31,36],'澄波叠翠':[52,30],'观莲所':[49,83]}},
  mountain:{title:'山地云岭',kicker:'山峦区 · 登高与借景',art:'mountain-region-square.webp',alt:'写意绘制的山庄山地、四面云山亭和远处磬锤峰',description:'沿山地画卷由近及远观看四面云山，再遥望园外磬锤峰。画中远峰属于借景；各标记为写意导览位置，不代表实地步道或坐标。',names:['四面云山','锤峰落照'],positions:{'四面云山':[61,29],'锤峰落照':[80,15]}}
};
const visitedKey='chengde-atlas-visited-v1';
let records=[];
let visited=new Set();
try{visited=new Set(JSON.parse(localStorage.getItem(visitedKey)||'[]'));}catch{}
let currentRegion=null,currentItem=null,atlasItem=null,returnFocus=null,atlasReturnFocus=null,regionNearReturnFocus=null;
let pan={x:0,y:0},pointer=null,dragged=false;
let layout=null;
const nearPointers=new Map();
const nearCamera={x:0,y:0,width:0,height:0,viewportWidth:0,viewportHeight:0,zoom:1};
const nearZoomLimits={min:1,max:2.4};
let nearView=null,nearGesture=null,nearRegionPosition=null,nearLoadId=0,nearLoadTimer=0,nearMoveTimer=0,nearAnimationFrame=0,nearFocusSource=null,nearSuppressClickUntil=0,nearRestoringFocus=false;
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
const percent=(value,fallback=50)=>Number.isFinite(Number(value))?Math.min(100,Math.max(0,Number(value))):fallback;
function getNearView(item){
  const view=item.regionView||{},focus=Array.isArray(view.focus)?view.focus:[50,50];
  const fallback=[{title:'画中主体',text:'循着画作的主体细看，拖动画面，留意前后景的层次。',x:focus[0],y:focus[1]},{title:'邻近景致',text:'移步看向另一处景致，观察它与主体之间的呼应。',x:percent(focus[0])-20,y:percent(focus[1])+12}];
  return {focus:focus.map((v)=>percent(v)),details:fallback.map((detail,index)=>{
    const source=view.details?.[index]||detail;
    return {title:String(source.title||detail.title),text:String(source.text||detail.text),x:percent(source.x,detail.x),y:percent(source.y,detail.y)};
  }),water:Array.isArray(view.water)&&view.water.length===4?view.water.map((v)=>percent(v,0)):null,interpretation:String(view.interpretation||'画面依据历史景名作写意创作，景物位置不代表实地测绘或今日现状。')};
}
function setNearRegionInert(value){
  for(const node of portal.children)if(node!==near)node.inert=value;
}
function restoreRegionPosition(){
  if(!nearRegionPosition)return;
  const saved=nearRegionPosition;
  canvas.style.width=`${canvas.clientHeight*1983/793}px`;
  pan.x=saved.frameWidth===frame.clientWidth&&saved.frameHeight===frame.clientHeight?saved.x:frame.clientWidth/2-saved.centerX*canvas.clientWidth;
  pan.y=saved.frameWidth===frame.clientWidth&&saved.frameHeight===frame.clientHeight?saved.y:frame.clientHeight/2-saved.centerY*canvas.clientHeight;
  canvas.classList.remove('is-locating');renderPan();
}
function renderNearCamera(){
  const width=nearViewport.clientWidth,height=nearViewport.clientHeight;
  nearCamera.zoom=Math.min(nearZoomLimits.max,Math.max(nearZoomLimits.min,nearCamera.zoom));
  nearCamera.x=Math.min(0,Math.max(width-nearCamera.width*nearCamera.zoom,nearCamera.x));
  nearCamera.y=Math.min(0,Math.max(height-nearCamera.height*nearCamera.zoom,nearCamera.y));
  nearCanvas.style.transform=`translate3d(${nearCamera.x}px,${nearCamera.y}px,0) scale(${nearCamera.zoom})`;
  nearCanvas.style.setProperty('--near-marker-scale',1/nearCamera.zoom);
  $('regionNearZoom').textContent=`${Math.round(nearCamera.zoom*100)}%`;
  // aria-disabled keeps keyboard focus on a control at a zoom limit.
  $('regionNearZoomOut').setAttribute('aria-disabled',String(nearCamera.zoom<=nearZoomLimits.min+.001));
  $('regionNearZoomIn').setAttribute('aria-disabled',String(nearCamera.zoom>=nearZoomLimits.max-.001));
}
function animateNearCamera(){
  clearTimeout(nearMoveTimer);
  nearCanvas.classList.toggle('is-moving',!reducedMotion.matches);
  nearMoveTimer=setTimeout(()=>nearCanvas.classList.remove('is-moving'),820);
}
function moveNearCamera(x,y,zoom=nearCamera.zoom,animate=true){
  if(animate)animateNearCamera();else nearCanvas.classList.remove('is-moving');
  nearCamera.zoom=zoom;
  nearCamera.x=nearViewport.clientWidth*.5-nearCamera.width*x/100*zoom;
  nearCamera.y=nearViewport.clientHeight*.45-nearCamera.height*y/100*zoom;
  renderNearCamera();
}
function sizeNearCamera(preserve=true){
  if(!nearArt.naturalWidth)return;
  const center=preserve&&nearCamera.width?[(nearCamera.viewportWidth/2-nearCamera.x)/nearCamera.zoom/nearCamera.width*100,(nearCamera.viewportHeight*.45-nearCamera.y)/nearCamera.zoom/nearCamera.height*100]:[50,50];
  const scale=Math.max(nearViewport.clientWidth/nearArt.naturalWidth,nearViewport.clientHeight/nearArt.naturalHeight);
  nearCamera.width=nearArt.naturalWidth*scale;nearCamera.height=nearArt.naturalHeight*scale;
  nearCamera.viewportWidth=nearViewport.clientWidth;nearCamera.viewportHeight=nearViewport.clientHeight;
  nearCanvas.style.width=`${nearCamera.width}px`;nearCanvas.style.height=`${nearCamera.height}px`;
  moveNearCamera(...center,preserve?nearCamera.zoom:1,false);
}
function zoomNearCamera(zoom,x=nearViewport.clientWidth/2,y=nearViewport.clientHeight/2,animate=false){
  if(near.dataset.state!=='ready')return;
  const next=Math.min(nearZoomLimits.max,Math.max(nearZoomLimits.min,zoom));
  const ratio=next/nearCamera.zoom;
  if(animate)animateNearCamera();else nearCanvas.classList.remove('is-moving');
  nearCamera.x=x-(x-nearCamera.x)*ratio;nearCamera.y=y-(y-nearCamera.y)*ratio;nearCamera.zoom=next;
  renderNearCamera();
}
function clearNearFocus(restoreFocus=false){
  $('regionNearFocusCard').hidden=true;
  near.querySelectorAll('[data-near-detail]').forEach((button)=>button.setAttribute('aria-pressed','false'));
  if(restoreFocus){nearRestoringFocus=true;try{(nearFocusSource?.isConnected?nearFocusSource:$('regionNearReset')).focus({preventScroll:true});}finally{nearRestoringFocus=false;}}
}
function selectNearFocus(index,source){
  if(near.dataset.state!=='ready')return;
  const detail=nearView.details[index];if(!detail)return;
  nearFocusSource=source;
  near.querySelectorAll('[data-near-detail]').forEach((button)=>button.setAttribute('aria-pressed',String(Number(button.dataset.nearDetail)===index)));
  $('regionNearFocusTitle').textContent=detail.title;$('regionNearFocusText').textContent=detail.text;
  $('regionNearFocusCard').hidden=false;
  moveNearCamera(detail.x,detail.y,Math.min(nearZoomLimits.max,Math.max(nearCamera.zoom,1.3)));
}
function renderNearDetails(){
  const targets=$('regionNearTargets'),list=$('regionNearFocusList');targets.replaceChildren();list.replaceChildren();
  nearView.details.forEach((detail,index)=>{
    for(const inPicture of [true,false]){
      const button=document.createElement('button');button.type='button';button.dataset.nearDetail=index;button.setAttribute('aria-pressed','false');button.setAttribute('aria-controls','regionNearFocusCard');
      if(inPicture){
        button.className='region-near-target';button.style.left=`${detail.x}%`;button.style.top=`${detail.y}%`;button.setAttribute('aria-label',`细看${detail.title}`);
        const mark=document.createElement('span');mark.textContent='✦';mark.setAttribute('aria-hidden','true');
        const label=document.createElement('small');label.textContent=detail.title;button.append(mark,label);
      }else button.textContent=`${index+1} · ${detail.title}`;
      button.addEventListener('click',()=>selectNearFocus(index,button));
      if(inPicture)button.addEventListener('focus',()=>{if(!nearRestoringFocus&&button.matches(':focus-visible'))selectNearFocus(index,button);});
      (inPicture?targets:list).append(button);
    }
  });
  const water=$('regionNearWater');water.hidden=!nearView.water||nearView.water[2]===0||nearView.water[3]===0;
  if(!water.hidden){const [x,y,w,h]=nearView.water;Object.assign(water.style,{left:`${x}%`,top:`${y}%`,width:`${Math.min(w,100-x)}%`,height:`${Math.min(h,100-y)}%`});}
}
function updateNearWeather(){
  const night=experience.classList.contains('night'),rain=experience.classList.contains('raining');
  $('regionNearWeather').textContent=`${night?'夜色':'日色'} · ${rain?'烟雨':'晴景'} · 写意近观`;
}
function setNearLoadState(state){
  near.dataset.state=state;nearViewport.setAttribute('aria-busy',String(state==='loading'));nearViewport.inert=state!=='ready';
  $('regionNearLoad').hidden=state==='ready';$('regionNearRetry').hidden=state!=='error';
  for(const id of ['regionNearZoomOut','regionNearZoomIn','regionNearReset'])$(id).disabled=state!=='ready';
  $('regionNearFocusList').inert=state!=='ready';
  $('regionNearLoadText').textContent=state==='error'?'画作暂未展开，请重试。':'正在展开画作…';
}
function loadNearArt(retry=false){
  if(document.activeElement===$('regionNearRetry'))$('regionNearBack').focus({preventScroll:true});
  const request=++nearLoadId,item=currentItem;clearTimeout(nearLoadTimer);cancelAnimationFrame(nearAnimationFrame);clearNearGestures();clearNearFocus();setNearLoadState('loading');
  let settled=false;
  const fail=()=>{if(settled||request!==nearLoadId||near.hidden)return;settled=true;clearTimeout(nearLoadTimer);setNearLoadState('error');};
  nearArt.onload=async()=>{
    try{await nearArt.decode();}catch{fail();return;}
    if(settled||request!==nearLoadId||near.hidden)return;
    if(!nearArt.naturalWidth||!nearArt.naturalHeight){fail();return;}
    settled=true;
    clearTimeout(nearLoadTimer);setNearLoadState('ready');sizeNearCamera(false);
    // One frame separates the cover view from the gentle opening move; no render loop.
    nearAnimationFrame=requestAnimationFrame(()=>{
      if(request!==nearLoadId||near.hidden)return;
      moveNearCamera(nearView.focus[0],nearView.focus[1],1.08,!reducedMotion.matches);
      saveVisited(item.name);
    });
    if(document.activeElement===$('regionNearRetry'))$('regionNearBack').focus({preventScroll:true});
  };
  nearArt.onerror=fail;
  nearLoadTimer=setTimeout(fail,20000);
  const url=new URL(artUrl(item.regionNearArt));if(retry)url.searchParams.set('retry',String(Date.now()));
  nearArt.alt=`${item.name}的写意近景`;nearArt.src=url.href;
}
function openNear(){
  if(!currentItem?.regionNearArt)return;
  regionNearReturnFocus=document.activeElement;
  nearRegionPosition={x:pan.x,y:pan.y,frameWidth:frame.clientWidth,frameHeight:frame.clientHeight,centerX:(frame.clientWidth/2-pan.x)/canvas.clientWidth,centerY:(frame.clientHeight/2-pan.y)/canvas.clientHeight};
  pointer=null;nearView=getNearView(currentItem);
  $('toast').classList.remove('show');
  $('regionNearTitle').textContent=currentItem.name;$('regionNearText').textContent=currentItem.description;$('regionNearInterpretation').textContent=nearView.interpretation;
  $('regionNearRead').setAttribute('aria-expanded','false');$('regionNearRead').textContent='读此景 ＋';$('regionNearReading').hidden=true;
  near.hidden=false;setNearRegionInert(true);renderNearDetails();updateNearWeather();loadNearArt();
  $('regionNearBack').focus({preventScroll:true});
}
function closeNear(restoreFocus=true){
  if(near.hidden)return;
  ++nearLoadId;clearTimeout(nearLoadTimer);clearTimeout(nearMoveTimer);cancelAnimationFrame(nearAnimationFrame);nearArt.onload=null;nearArt.onerror=null;
  clearNearGestures();nearCanvas.classList.remove('is-moving');near.hidden=true;setNearRegionInert(false);restoreRegionPosition();nearRegionPosition=null;
  if(restoreFocus)(regionNearReturnFocus?.isConnected?regionNearReturnFocus:$('regionNearBtn')).focus({preventScroll:true});
}
function beginNearGesture(){
  const points=[...nearPointers.values()];
  if(points.length>=2){
    const [a,b]=points,rect=nearViewport.getBoundingClientRect(),x=(a.x+b.x)/2-rect.left,y=(a.y+b.y)/2-rect.top;
    nearGesture={mode:'pinch',distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom:nearCamera.zoom,anchorX:(x-nearCamera.x)/nearCamera.zoom,anchorY:(y-nearCamera.y)/nearCamera.zoom};
  }else if(points.length){const [p]=points;nearGesture={mode:'pan',x:p.x,y:p.y,startX:nearCamera.x,startY:nearCamera.y};}
  else nearGesture=null;
}
function clearNearGestures(){
  const ids=[...nearPointers.keys()];nearPointers.clear();nearGesture=null;nearSuppressClickUntil=0;nearViewport.classList.remove('is-dragging');
  for(const id of ids)if(nearViewport.hasPointerCapture(id))nearViewport.releasePointerCapture(id);
}
nearViewport.addEventListener('pointerdown',(event)=>{
  const target=event.target.closest('button');
  if(near.dataset.state!=='ready'||(target&&event.pointerType!=='touch')||(event.pointerType==='mouse'&&event.button!==0))return;
  nearCanvas.classList.remove('is-moving');nearPointers.set(event.pointerId,{x:event.clientX,y:event.clientY,target});
  if(!target)nearViewport.setPointerCapture(event.pointerId);
  if(nearPointers.size>=2){for(const id of nearPointers.keys())nearViewport.setPointerCapture(id);nearSuppressClickUntil=performance.now()+400;}
  beginNearGesture();
});
nearViewport.addEventListener('pointermove',(event)=>{
  if(!nearPointers.has(event.pointerId)||!nearGesture)return;
  const point=nearPointers.get(event.pointerId);point.x=event.clientX;point.y=event.clientY;
  if(nearGesture.mode==='pinch'){
    nearSuppressClickUntil=performance.now()+400;
    const [a,b]=[...nearPointers.values()],rect=nearViewport.getBoundingClientRect();
    nearCamera.zoom=Math.max(nearZoomLimits.min,Math.min(nearZoomLimits.max,nearGesture.zoom*Math.hypot(a.x-b.x,a.y-b.y)/nearGesture.distance));
    nearCamera.x=(a.x+b.x)/2-rect.left-nearGesture.anchorX*nearCamera.zoom;nearCamera.y=(a.y+b.y)/2-rect.top-nearGesture.anchorY*nearCamera.zoom;
  }else{
    const dx=event.clientX-nearGesture.x,dy=event.clientY-nearGesture.y;
    if(Math.hypot(dx,dy)>4){nearViewport.classList.add('is-dragging');nearSuppressClickUntil=performance.now()+400;if(point.target&&!nearViewport.hasPointerCapture(event.pointerId))nearViewport.setPointerCapture(event.pointerId);}
    nearCamera.x=nearGesture.startX+dx;nearCamera.y=nearGesture.startY+dy;
  }
  renderNearCamera();
});
nearViewport.addEventListener('click',(event)=>{if(event.detail&&performance.now()<nearSuppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
for(const type of ['pointerup','pointercancel','lostpointercapture'])nearViewport.addEventListener(type,(event)=>{
  if(!nearPointers.delete(event.pointerId))return;
  if(nearViewport.hasPointerCapture(event.pointerId))nearViewport.releasePointerCapture(event.pointerId);
  beginNearGesture();if(!nearPointers.size)nearViewport.classList.remove('is-dragging');
});
nearViewport.addEventListener('wheel',(event)=>{
  if(near.dataset.state!=='ready')return;event.preventDefault();
  const rect=nearViewport.getBoundingClientRect(),delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?nearViewport.clientHeight:1);
  zoomNearCamera(nearCamera.zoom*Math.exp(-delta*.0015),event.clientX-rect.left,event.clientY-rect.top);
},{passive:false});
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
  if(item.aliases.length){const alias=document.createElement('p');alias.textContent=`相关称呼：${item.aliases.map((name)=>{const note=item.aliasNotes?.find((entry)=>entry.name===name);return note?`${name}（${note.relation}）`:name;}).join('、')}`;pane.append(alias);}
  if(item.region==='如意洲'||item.regionNearArt&&item.region==='山地'){
    const button=document.createElement('button');button.type='button';button.textContent=item.regionNearArt?'进入区域，走近此景':'查看如意洲写意方位';
    button.addEventListener('click',()=>{const key=item.region==='如意洲'?'ruyi':'mountain';const source=portal.contains(atlasReturnFocus)?returnFocus:atlasReturnFocus;closeAtlas(false);openRegion(key,source);selectItem(item.name);requestAnimationFrame(()=>locateItem(item.name));});pane.append(button);
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
  showAtlasDetail(items.includes(atlasItem)?atlasItem:items[0]);
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
  const focusables=[...root.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),summary,[tabindex]:not([tabindex="-1"])')].filter((node)=>!node.closest('[hidden],[inert]')&&node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden');
  const first=focusables[0],last=focusables.at(-1);
  if(!first){event.preventDefault();return;}
  if(!focusables.includes(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();}
  else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
}
window.addEventListener('keydown',(event)=>{
  if(!atlasDialog.hidden){if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeAtlas();}else if(event.key==='Tab'){event.stopImmediatePropagation();trap(event,atlasDialog);}return;}
  if(portal.hidden)return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();if(!$('regionNear').hidden)closeNear();else closeRegion();}
  else if(event.key==='Tab'){event.stopImmediatePropagation();trap(event,$('regionNear').hidden?portal:$('regionNear'));}
  else if(!near.hidden&&near.dataset.state==='ready'&&nearViewport.contains(document.activeElement)){
    const directions={ArrowLeft:[70,0],ArrowRight:[-70,0],ArrowUp:[0,70],ArrowDown:[0,-70]};
    if(directions[event.key]){event.preventDefault();event.stopImmediatePropagation();nearCanvas.classList.remove('is-moving');const [x,y]=directions[event.key];nearCamera.x+=x;nearCamera.y+=y;renderNearCamera();}
    else if(['+','=','-','_','Home'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();if(event.key==='Home')$('regionNearReset').click();else zoomNearCamera(nearCamera.zoom*(['+','='].includes(event.key)?1.2:1/1.2),undefined,undefined,true);}
  }
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
window.addEventListener('resize',()=>{
  if(portal.hidden)return;
  if(!near.hidden){restoreRegionPosition();clearNearGestures();if(near.dataset.state==='ready')sizeNearCamera();}
  else{resetPan();if(currentItem)locateItem(currentItem.name);}
});
window.addEventListener('blur',clearNearGestures);
$('regionBack').addEventListener('click',()=>closeRegion());
$('regionNearBack').addEventListener('click',()=>closeNear());
$('regionNearBtn').addEventListener('click',openNear);
$('regionNearRetry').addEventListener('click',()=>loadNearArt(true));
$('regionNearFocusClose').addEventListener('click',()=>clearNearFocus(true));
$('regionNearZoomOut').addEventListener('click',()=>zoomNearCamera(nearCamera.zoom/1.2,undefined,undefined,true));
$('regionNearZoomIn').addEventListener('click',()=>zoomNearCamera(nearCamera.zoom*1.2,undefined,undefined,true));
$('regionNearReset').addEventListener('click',()=>{clearNearFocus();moveNearCamera(nearView.focus[0],nearView.focus[1],1.08);});
$('regionNearRead').addEventListener('click',()=>{
  const expanded=$('regionNearRead').getAttribute('aria-expanded')==='true';
  $('regionNearRead').setAttribute('aria-expanded',String(!expanded));$('regionNearRead').textContent=expanded?'读此景 ＋':'收起文字 −';$('regionNearReading').hidden=expanded;
});
new MutationObserver(()=>{if(!near.hidden)updateNearWeather();}).observe(experience,{attributes:true,attributeFilter:['class']});
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
