const email='lhw4553@126.com';
const dialog=document.getElementById('feedbackDialog'),closeButton=document.getElementById('feedbackClose');
const input=document.getElementById('feedbackEmail'),copyButton=document.getElementById('feedbackCopy');
const selectButton=document.getElementById('feedbackSelect'),status=document.getElementById('feedbackStatus');
const openers=[...document.querySelectorAll('[data-feedback-open]')];
let returnFocus=null,background=new Map(),operation=0;
function open(source){
  if(!dialog.hidden)return;
  returnFocus=source;operation++;status.textContent='';selectButton.hidden=true;copyButton.disabled=false;
  background=new Map([...document.getElementById('app').children].filter(node=>node!==dialog).map(node=>[node,node.inert]));
  for(const node of background.keys())node.inert=true;
  dialog.hidden=false;for(const button of openers)button.setAttribute('aria-expanded','true');closeButton.focus();
}
function close(){
  if(dialog.hidden)return;
  operation++;dialog.hidden=true;copyButton.disabled=false;
  for(const [node,inert]of background)node.inert=inert;background.clear();
  for(const button of openers)button.setAttribute('aria-expanded','false');
  if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
}
function selectEmail(){input.focus();input.select();input.setSelectionRange(0,email.length);}
for(const button of openers)button.addEventListener('click',()=>open(button));
closeButton.addEventListener('click',close);
dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
selectButton.addEventListener('click',()=>{selectEmail();status.textContent='已选中邮箱，可用复制快捷键或长按复制。';});
copyButton.addEventListener('click',async()=>{
  const token=++operation;copyButton.disabled=true;status.textContent='';
  const valid=()=>token===operation&&!dialog.hidden;
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    if(valid()){selectButton.hidden=true;status.textContent='邮箱已复制';}
  }catch{
    if(valid()){selectButton.hidden=false;status.textContent='自动复制未成功，请选择上方邮箱后复制。';selectEmail();}
  }finally{if(valid())copyButton.disabled=false;}
});
// Capture prevents the scene/help dialogs from also handling this panel's keys.
document.addEventListener('keydown',event=>{
  if(dialog.hidden)return;
  event.stopPropagation();
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('button,a[href],input')].filter(node=>!node.disabled&&node.getClientRects().length);
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
},true);
