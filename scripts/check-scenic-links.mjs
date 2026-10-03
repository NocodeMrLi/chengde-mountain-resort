import {readFile} from 'node:fs/promises';
const files=['index.html','app.js','public/region.js','public/atlas-data.json'];
const prohibited=/https?:\/\/(?:www\.)?(?:bishushanzhuang\.com\.cn|dpm\.org\.cn|npm\.gov\.tw)/i;
const failures=[];
for(const file of files){
  const content=await readFile(file,'utf8');
  if(prohibited.test(content))failures.push(file);
}
if(failures.length){console.error(`游客运行文件出现景点来源外链：${failures.join(', ')}`);process.exit(1);}
console.log('游客运行文件无景点来源外链；研究链接仅保存在开发文档。');
