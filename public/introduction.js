// Folding text never changes the scene, player, camera, or visited state.
export function bindIntroduction({content,close,open,panel,onChange=()=>{}}){
  function set(expanded,focus=false){
    content.hidden=!expanded;close.hidden=!expanded;open.hidden=expanded;
    open.setAttribute('aria-expanded',String(expanded));
    panel?.classList.toggle('is-intro-collapsed',!expanded);
    onChange(expanded);
    if(focus)(expanded?close:open).focus({preventScroll:true});
  }
  const api={get expanded(){return !content.hidden;},show(focus=false){set(true,focus);},hide(focus=false){set(false,focus);}};
  close.addEventListener('click',()=>api.hide(true));
  open.addEventListener('click',()=>api.show(true));
  set(!content.hidden);
  return api;
}
