import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, join} from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.m4a':'audio/mp4','.ogg':'audio/ogg'};

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
    const body=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(body);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('未找到页面');}
}).listen(port,'127.0.0.1',()=>console.log(`山庄入画: http://127.0.0.1:${port}`));
