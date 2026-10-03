const assetUrl=(path)=>{
  const url=new URL(path,import.meta.url),hash=window.__ASSET_HASHES__?.[path];
  if(hash)url.searchParams.set('v',hash);return url.href;
};
// One shared player for every entrance. No system voice, network TTS or autoplay.
const audio=document.getElementById('guideAudio');
let key=null,mode='idle',serial=0,timer=0,unbind=()=>{},expected='';
const labels={idle:'▶ 听讲解',loading:'Ⅱ 暂停加载',playing:'Ⅱ 暂停',paused:'▶ 继续讲解',done:'↺ 重播讲解',error:'▶ 重试讲解'};
function publish(){
  audio.dataset.guideKey=key||'';audio.dataset.guideState=mode;
  window.dispatchEvent(new CustomEvent('chengde-guide-state',{detail:{key,mode,speaking:mode==='playing',label:labels[mode]}}));
}
function clear(){clearTimeout(timer);timer=0;unbind();unbind=()=>{};}
function stop(){serial++;clear();audio.pause();audio.removeAttribute('src');audio.load();expected='';key=null;mode='idle';publish();}
function pause(){serial++;clear();audio.pause();mode='paused';publish();}
function play(next,{replay=false}={}){
  if(key===next&&(mode==='playing'||mode==='loading')&&!replay){pause();return;}
  const resume=key===next&&mode==='paused'&&!replay;
  const retry=key===next&&mode==='error';
  if(!resume){stop();key=next;const url=new URL(assetUrl(`audio/guide-${next}.m4a`));if(retry)url.searchParams.set('retry',Date.now());expected=url.href;audio.src=expected;}
  const token=++serial;clear();audio.volume=.9;mode='loading';publish();
  const valid=()=>token===serial&&key===next&&audio.src===expected;
  const fail=()=>{if(!valid())return;clear();audio.pause();mode='error';publish();};
  const timeout=()=>{if(!timer)timer=setTimeout(fail,16000);};
  const playing=()=>{if(!valid())return;clearTimeout(timer);timer=0;mode='playing';publish();};
  const waiting=()=>{if(!valid())return;mode='loading';publish();timeout();};
  const ended=()=>{if(!valid())return;clear();mode='done';publish();};
  const handlers={playing,waiting,stalled:waiting,ended,error:fail};
  for(const [event,fn] of Object.entries(handlers))audio.addEventListener(event,fn);
  unbind=()=>{for(const [event,fn] of Object.entries(handlers))audio.removeEventListener(event,fn);};
  timeout();
  // Called synchronously from the button gesture, including on mobile browsers.
  audio.play().then(()=>{if(valid()&&!audio.paused)playing();}).catch(fail);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(mode==='playing'||mode==='loading'))pause();});
window.addEventListener('pagehide',stop);
export const guide={play,stop,pause,get key(){return key;},get mode(){return mode;},labels};
