import {createServer} from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {resolve, extname, join} from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.m4a':'audio/mp4','.ogg':'audio/ogg'};

createServer(async(req,res)=>{
  try{
    const pathName=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const requested=pathName==='/'?'/index.html':pathName;
    let path=resolve(root,`.${requested}`);
    if(!path.startsWith(root+'/') && path!==join(root,'index.html'))throw new Error('Invalid path');
    let fileStat;
    try{fileStat=await stat(path);}catch{
      path=resolve(root,'public',`.${requested}`);
      if(!path.startsWith(join(root,'public')+'/'))throw new Error('Invalid path');
      fileStat=await stat(path);
    }
    if(!fileStat.isFile())throw new Error('Not a file');
    let start=0,end=fileStat.size-1,status=200;
    const headers={'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    if(req.headers.range&&req.method==='GET'){
      const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!range||(!range[1]&&!range[2]))throw Object.assign(new Error('Invalid range'),{rangeSize:fileStat.size});
      if(range[1]){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;}
      else start=Math.max(0,fileStat.size-Number(range[2]));
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=fileStat.size)throw Object.assign(new Error('Unsatisfiable range'),{rangeSize:fileStat.size});
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${fileStat.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if(req.method==='HEAD'||fileStat.size===0){res.end();return;}
    createReadStream(path,{start,end}).on('error',()=>res.destroy()).pipe(res);
  }catch(error){
    if(error.rangeSize!==undefined){res.writeHead(416,{'Content-Range':`bytes */${error.rangeSize}`,'Content-Length':0});res.end();}
    else{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('未找到页面');}
  }
}).listen(port,'127.0.0.1',()=>console.log(`山庄入画: http://127.0.0.1:${port}`));
