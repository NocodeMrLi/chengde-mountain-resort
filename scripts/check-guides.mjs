import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const catalog=JSON.parse(await readFile('scripts/guide-catalog.json','utf8'));
const atlas=JSON.parse(await readFile('public/atlas-data.json','utf8')).entries;
const manifest=JSON.parse(await readFile('public/audio/guide-manifest.json','utf8'));
if(catalog.entries.length!==84||new Set(catalog.entries.map(e=>e.key)).size!==84||atlas.length!==72)throw Error('Guide/scenic catalog count changed');
if(manifest.speaker!=='Dylan'||catalog.speaker!=='Dylan'||Object.keys(manifest.entries).length!==84)throw Error('Selected Dylan voice or exact guide coverage changed');
const profile=manifest.generationProfile;
if(manifest.revision!=='41d3337e8b7f2843a75841595fc14e4b9a7a4b96'||profile?.temperature!==.65||profile.topK!==50||profile.topP!==1||profile.repetitionPenalty!==1.05||profile.seed!==20261003)throw Error('Selected sample generation parameters changed');
if(manifest.model!=='mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit'||profile.language!=='Chinese'||profile.mlxAudioCommit!=='94c7716212b2228f178d2f9c7619a591fd1b0b78'||profile.instruct!=='用标准普通话，以历史导游的口吻平静讲述，音色温厚自然，语速从容，停顿清楚，不刻意压低声音，不夸张表演。')throw Error('Selected model/language/style changed');
for(const item of atlas)if(!catalog.entries.some(e=>e.key===item.id&&e.text===item.description))throw Error(`Scenic transcript mismatch: ${item.id}`);
let bytes=0,seconds=0;
for(const entry of catalog.entries){
  const audio=manifest.entries[entry.key];if(!audio)throw Error(`Guide missing: ${entry.key}`);
  if(audio.textSha256!==hash(entry.text))throw Error(`Transcript changed: ${entry.key}`);
  if(!Number.isInteger(audio.tokenCount)||audio.tokenCount<=0||audio.tokenCount>=audio.tokenLimit-1)throw Error(`Guide reached generation cap: ${entry.key}`);
  if(audio.file!==`audio/guide-${entry.key}.m4a`)throw Error(`Unexpected guide path: ${entry.key}`);
  const path=`public/${audio.file}`,data=await readFile(path);
  if(hash(data)!==audio.sha256||data.length!==audio.bytes)throw Error(`Guide bytes mismatch: ${entry.key}`);
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-show_entries','stream=codec_name,sample_rate,channels','-of','json',path],{encoding:'utf8'}));
  const stream=probe.streams[0],duration=Number(probe.format.duration);
  if(stream.codec_name!=='aac'||stream.channels!==1||stream.sample_rate!=='24000'||!Number.isFinite(duration)||duration<3||Math.abs(duration-audio.duration)>.2)throw Error(`Invalid guide encoding: ${entry.key}`);
  // Decode each real file; metadata alone cannot establish a playable payload.
  execFileSync('ffmpeg',['-v','error','-i',path,'-f','null','-'],{stdio:'pipe'});
  bytes+=data.length;seconds+=duration;
}
console.log(`84/84 guide files decoded; 72/72 scenic transcripts match; ${(bytes/1024/1024).toFixed(2)} MiB, ${(seconds/60).toFixed(1)} minutes.`);
