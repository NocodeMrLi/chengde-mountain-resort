// Original weather renderer. A field belongs to its painted view (or window),
// so changing scenes cannot leave a screen-wide indoor rain layer behind.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const modestDevice = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const rand = (a,b) => a + Math.random() * (b-a);
export class RainField {
  constructor(host, {water=null, indoor=false}={}) {
    this.host=host;this.water=water;this.indoor=indoor;
    this.canvas=document.createElement('canvas');this.canvas.className='painted-rain-canvas';
    this.canvas.setAttribute('aria-hidden','true');host.append(this.canvas);
    this.ctx=this.canvas.getContext('2d',{alpha:true});this.drops=[];this.rings=[];
    this.running=false;this.low=modestDevice;this.slowFrames=0;this.frames=0;
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);
    this.resize();
  }
  resize() {
    // Logical sizes follow the visible painting, not a multiplied high-DPI canvas.
    this.w=Math.max(1,this.host.clientWidth);this.h=Math.max(1,this.host.clientHeight);
    const scale=Math.min(this.low?1:1.35,devicePixelRatio||1,1400/this.w,1000/this.h);
    this.canvas.width=Math.max(1,Math.round(this.w*scale));
    this.canvas.height=Math.max(1,Math.round(this.h*scale));this.ctx.setTransform(scale,0,0,scale,0,0);
    this.drops=Array.from({length:Math.min(this.low?100:230,Math.max(12,Math.round(this.w*this.h/(this.indoor?6500:4700))))},()=>this.drop());
    this.rings=[];
  }
  drop(top=false) {
    const depth=Math.random();
    return {x:rand(-10,this.w+25),y:top?rand(-40,-3):rand(0,this.h),depth,
      speed:rand(190,310)+depth*310,wind:rand(-24,-7)-depth*32,
      len:rand(1.6,4.8)+depth*6.2,width:rand(.35,.6)+depth*.3,alpha:rand(.065,.13)+depth*.13};
  }
  setActive(active,night=false) {
    this.night=night;this.host.dataset.rainQuality=reduced.matches?'still':this.low?'light':'full';
    if(active&&!reduced.matches&&!document.hidden) {
      if(!this.running){this.running=true;this.last=0;this.frame=requestAnimationFrame(t=>this.draw(t));}
    } else this.stop();
  }
  stop() {
    this.running=false;cancelAnimationFrame(this.frame);this.last=0;this.rings=[];
    this.ctx.clearRect(0,0,this.w,this.h);
  }
  draw(now) {
    if(!this.running)return;
    const elapsed=this.last?now-this.last:(this.low?45:33);
    if(elapsed<(this.low?40:30)){this.frame=requestAnimationFrame(t=>this.draw(t));return;}
    this.last=now;const dt=Math.min(elapsed,70)/1000;this.frames++;
    if(elapsed>56)this.slowFrames++;else this.slowFrames=Math.max(0,this.slowFrames-1);
    if(!this.low&&this.slowFrames>14){this.low=true;this.resize();this.host.dataset.rainQuality='light';}
    const ctx=this.ctx,w=this.w,h=this.h;ctx.clearRect(0,0,w,h);ctx.save();
    ctx.lineCap='round';
    const gust=Math.sin(now*.00041)*9+Math.sin(now*.00113)*3;
    // Far drops are small and faint; only a few foreground drops catch the light.
    for(const d of this.drops) {
      d.x+=(d.wind+gust)*dt;d.y+=d.speed*dt;
      if(d.y>h+14||d.x<-16){Object.assign(d,this.drop(true));continue;}
      const fade=Math.min(1,d.y/30,(h-d.y+14)/28);
      ctx.strokeStyle=this.night?`rgba(202,216,218,${d.alpha*fade})`:`rgba(97,122,123,${d.alpha*fade})`;
      ctx.lineWidth=d.width;ctx.beginPath();ctx.moveTo(d.x,d.y);
      ctx.lineTo(d.x-(d.wind+gust)/d.speed*d.len,d.y-d.len);ctx.stroke();
    }
    if(this.water&&!this.indoor) {
      const [x,y,rw,rh]=this.water.map((v,i)=>v/100*(i%2?h:w));
      if(Math.random()<dt*(this.low?5:12))this.rings.push({x:x+rand(0,rw),y:y+rand(0,rh),age:0,life:rand(.45,.85),size:rand(3,8)});
      ctx.save();ctx.beginPath();ctx.rect(x,y,rw,rh);ctx.clip();
      this.rings=this.rings.filter(r=>r.age<r.life).slice(-32);
      for(const r of this.rings){r.age+=dt;const p=r.age/r.life;
        ctx.strokeStyle=`rgba(${this.night?'205,220,215':'90,119,116'},${Math.sin(p*Math.PI)*.22})`;ctx.lineWidth=.6;
        ctx.beginPath();ctx.ellipse(r.x,r.y,1+p*r.size,.45+p*r.size*.28,0,0,Math.PI*2);ctx.stroke();}
      ctx.restore();
    }
    ctx.restore();
    // Erase the UNION after drawing: overlapping opaque rectangles stay opaque.
    // An even-odd clip would reopen intersections of columns and furniture.
    if(this.occluders?.length){
      ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillStyle='#000';ctx.beginPath();
      for(const [x,y,rw,rh]of this.occluders)ctx.rect(x/100*w,y/100*h,rw/100*w,rh/100*h);
      ctx.fill();ctx.restore();
    }
    this.frame=requestAnimationFrame(t=>this.draw(t));
  }
  destroy(){this.stop();this.observer.disconnect();this.canvas.remove();}
}

export function installRegionRain(experience,portal) {
  const fields=new Map();let queued=false;
  function sync(){
    queued=false;
    const rain=experience.classList.contains('raining'),night=experience.classList.contains('night');
    const near=portal.querySelector('#regionNear'),nearOpen=!near.hidden;
    for(const host of portal.querySelectorAll('.region-rain')) {
      if(!fields.has(host))fields.set(host,new RainField(host,{indoor:host.classList.contains('region-near-window-rain')}));
      const field=fields.get(host),inNear=near.contains(host),isWindow=field.indoor;
      const visible=!portal.hidden&&portal.dataset.state==='ready'&&(!inNear?!nearOpen:nearOpen&&near.dataset.state==='ready');
      const enabled=visible&&rain&&!host.hidden&&(!inNear||isWindow||!near.classList.contains('interior-scene'));
      if(isWindow){
        const wx=parseFloat(host.style.left)||0,wy=parseFloat(host.style.top)||0,ww=parseFloat(host.style.width)||100,wh=parseFloat(host.style.height)||100;
        try{field.occluders=JSON.parse(near.dataset.rainOccluders||'[]').map(([x,y,w,h])=>[(x-wx)/ww*100,(y-wy)/wh*100,w/ww*100,h/wh*100]);}catch{field.occluders=[];}
      }
      if(inNear&&!isWindow){try{field.water=JSON.parse(near.dataset.rainWater||'null');}catch{field.water=null;}}
      field.setActive(enabled,night);
    }
    for(const [host,field] of fields)if(!host.isConnected){field.destroy();fields.delete(host);}
  }
  function schedule(){if(!queued){queued=true;queueMicrotask(sync);}}
  new MutationObserver(schedule).observe(portal,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','data-state','data-rain-water','data-rain-occluders']});
  new MutationObserver(schedule).observe(experience,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',sync);window.addEventListener('pagehide',()=>{for(const field of fields.values())field.stop();});
  reduced.addEventListener('change',sync);sync();
  return {sync,fields};
}

export function installDepthRain(experience,portal,regionPortal){
  const field=new RainField(portal.querySelector('.depth-rain'));
  const sync=()=>field.setActive(!portal.hidden&&portal.classList.contains('open')&&regionPortal.hidden&&experience.classList.contains('raining'),experience.classList.contains('night'));
  new MutationObserver(sync).observe(portal,{attributes:true,attributeFilter:['hidden','class']});
  new MutationObserver(sync).observe(experience,{attributes:true,attributeFilter:['class']});
  new MutationObserver(sync).observe(regionPortal,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  window.addEventListener('pagehide',()=>field.stop());sync();
}
