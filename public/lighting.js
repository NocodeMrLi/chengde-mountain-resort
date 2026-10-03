// Hand-placed illumination follows bays in these original paintings. This is
// an atmospheric night interpretation, not a claim about historic fixtures.
const regionLights={
  jinshan:{bays:[[26.1,56.2,2,3.8],[29.1,56.2,2,3.8],[34.4,56.2,2,3.8],[36,29.2,1.5,3.3],[39.1,29.2,1.5,3.3],[77.2,55.5,1.4,4],[80.2,55.5,1.4,4],[84.6,55.5,1.4,4]],reflection:[30,66,10,8]},
  gongyuan:{bays:[[10.7,22.2,1,2.5],[13.7,22.2,1,2.5],[48.1,28,1.2,2.8],[52.8,28,1.2,2.8],[45.4,67.7,1.3,3.6],[48.4,67.7,1.3,3.6],[51.3,67.7,1.3,3.6],[17.3,66.3,1.1,2.4],[19.1,66.3,1.1,2.4]]},
  ruyi:{bays:[[47.2,66.1,.9,1.9],[50.1,66.1,.9,1.9],[47.7,49.7,.8,1.5],[50.4,49.7,.8,1.5],[47.1,40,.8,1.5],[50.1,40,.8,1.5],[35.2,62.8,.8,1.5],[78.4,61,.8,1.5]],reflection:[48.7,78,4,9]},
  huzhou:{bays:[[13.3,71,1.1,3.2],[17.2,71,1.1,3.2],[20,71,1.1,3.2],[41.4,43.6,1.1,3.5],[44.6,43.6,1.1,3.5],[50.4,46.2,.9,3.1],[54.2,46.2,.9,3.1],[86,57.7,1.1,3.1],[89.2,57.7,1.1,3.1]],reflection:[17.5,80,9,7]}
};
const nearLights={
  'jingshui-near.webp':{bays:[[52.1,55.9,1.5,7],[55.4,55.9,1.5,7],[61.3,55.9,1.5,7],[65.6,55.9,1.5,7],[68.7,55.9,1.5,7],[73.9,55.9,1.5,7]],reflection:[63.4,83,19,12]},
  'tianyu-near.webp':{bays:[[14.6,41.3,1.3,7],[16.2,41.3,1.3,7],[20.9,41.3,1.3,7],[22.5,41.3,1.3,7]]},
  'qingque-near.webp':{bays:[[29.4,57.8,1.2,6.5],[33,57.8,1.2,6.5],[37.3,57.8,1.2,6.5],[41.3,57.8,1.2,6.5],[45.7,57.8,1.2,6.5],[49.7,57.8,1.2,6.5]],reflection:[38,76,22,9]},
  'wushu-close.webp':{bays:[[50.4,46.3,2,9.2],[53.2,46.3,2,9.2],[60.4,46.3,2,9.2],[63.6,46.3,2,9.2]]},
  'qiwang-near.webp':{bays:[[75.4,38,1.1,5.3],[77.2,38,1.1,5.3],[83.4,38,1.1,5.3],[85.3,38,1.1,5.3],[67.5,51.8,1.4,8],[73.9,51.8,1.4,8]]},
  'yanbo-near.webp':{pools:[[29,72,19,9],[61,68,22,9],[83,57,8,14]]},
  'chengguan-near.webp':{pools:[[25,71,25,10],[17,41,9,15]]}
};
const ns='http://www.w3.org/2000/svg';let count=0;
const node=(tag,attrs)=>{const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);return el;};
function render(host,config){
  host.querySelector(':scope>.painted-lighting')?.remove();if(!config)return;
  const id=`painted-light-${++count}`,svg=node('svg',{class:'painted-lighting',viewBox:'0 0 100 100',preserveAspectRatio:'none','aria-hidden':'true'});
  const defs=node('defs',{}),gradient=node('linearGradient',{id,x1:'0',y1:'0',x2:'0',y2:'1'});
  gradient.append(node('stop',{offset:'0','stop-color':'#f3b96d','stop-opacity':'.05'}),node('stop',{offset:'.45','stop-color':'#f5c27b','stop-opacity':'.86'}),node('stop',{offset:'1','stop-color':'#e8ab54','stop-opacity':'.3'}));
  const pool=node('radialGradient',{id:`${id}-pool`});pool.append(node('stop',{offset:'0','stop-color':'#f2c37e','stop-opacity':'.32'}),node('stop',{offset:'1','stop-color':'#d69247','stop-opacity':'0'}));defs.append(gradient,pool);svg.append(defs);
  for(const [x,y,w,h]of config.bays||[])svg.append(node('rect',{x,y,width:w,height:h,fill:`url(#${id})`,rx:'.12'}));
  for(const [cx,cy,rx,ry]of config.pools||[])svg.append(node('ellipse',{cx,cy,rx,ry,fill:`url(#${id}-pool)`}));
  if(config.reflection){const [cx,cy,rx,ry]=config.reflection;for(let i=0;i<6;i++)svg.append(node('ellipse',{cx:cx+Math.sin(i)*.3,cy:cy+i*ry/7,rx:rx*(1-i*.09),ry:'.12',fill:'#e5b56f',opacity:.17-i*.022}));}
  host.append(svg);
}
export function lightRegion(host,key){render(host,regionLights[key]);}
export function lightNear(host,art){render(host,nearLights[art]);}
