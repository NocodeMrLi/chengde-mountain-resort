"""Offline generation after the user chooses a voice. Never runs in the browser.

Use an isolated Python 3.12 environment with mlx-audio at the documented commit.
Model/cache and lossless masters stay outside the publication checkout.
"""
import argparse, hashlib, json, os, re, subprocess, time, wave
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
import mlx.core as mx
from mlx_audio.tts.utils import load_model

MODEL='mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit'
REVISION='41d3337e8b7f2843a75841595fc14e4b9a7a4b96'
STYLE='用标准普通话，以历史导游的口吻平静讲述，音色温厚自然，语速从容，停顿清楚，不刻意压低声音，不夸张表演。'
# Only the spoken input changes. The displayed historical spelling stays intact.
PRONUNCIATION={'澹泊':'淡薄','般若相':'波惹象','般若':'波惹','法相':'法象','磬锤':'庆锤','罨画':'眼画','试马埭':'试马代','萍香泮':'萍香盼','丛樾':'丛月','万壑':'万贺','清樾':'清月','重檐':'崇檐','秋狝':'秋显','蘋':'频','沜':'盼'}
PROFILE={'temperature':.65,'topK':50,'topP':1.0,'repetitionPenalty':1.05,'seed':20261003,'language':'Chinese','instruct':STYLE,'mlxAudioCommit':'94c7716212b2228f178d2f9c7619a591fd1b0b78'}
def spoken(text):
    for a,b in PRONUNCIATION.items():text=text.replace(a,b)
    digits='零一二三四五六七八九'
    return re.sub(r'(?<!\d)(1[67]\d{2})(?!\d)',lambda m:''.join(digits[int(n)] for n in m[0]),text)

parser=argparse.ArgumentParser()
parser.add_argument('--voice',required=True,choices=['Uncle_Fu','Dylan'])
parser.add_argument('--masters',type=Path,required=True)
parser.add_argument('--batch-size',type=int,default=2,choices=[1,2,4])
parser.add_argument('--cooldown',type=float,default=12,help='Release caches and rest between batches.')
parser.add_argument('--keys',nargs='*',help='Generate just the selected catalog keys for review.')
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
entries=json.loads((root/'scripts/guide-catalog.json').read_text())['entries']
if args.keys:entries=[e for e in entries if e['key'] in args.keys]
args.masters.mkdir(parents=True,exist_ok=True)
if root in args.masters.resolve().parents or args.masters.resolve()==root:raise SystemExit('Lossless masters must stay outside publication checkout.')
out=root/'public/audio';out.mkdir(exist_ok=True)
manifest_path=out/'guide-manifest.json'
manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {'schemaVersion':2,'model':MODEL,'revision':REVISION,'speaker':args.voice,'generationProfile':PROFILE,'entries':{}}
if manifest['speaker']!=args.voice:raise SystemExit('Existing voice differs: start with a new explicit output set.')
if manifest.get('generationProfile')!=PROFILE or manifest.get('revision')!=REVISION:raise SystemExit('Existing generation parameters differ; do not silently mix output sets.')
pending=[]
for e in entries:
    text_hash=hashlib.sha256(e['text'].encode()).hexdigest()
    saved=manifest['entries'].get(e['key'])
    path=root/'public'/saved['file'] if saved else None
    if saved and saved.get('textSha256')==text_hash and saved.get('spokenText')==spoken(e['text']) and path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest()==saved['sha256']:continue
    pending.append(e)
if not pending:print('All requested entries already generated.');raise SystemExit()
mx.set_cache_limit(256*1024*1024)
mx.set_memory_limit(6*1024*1024*1024)
model=load_model(MODEL,revision=REVISION)
for at in range(0,len(pending),args.batch_size):
    batch=pending[at:at+args.batch_size];began=time.time();mx.random.seed(PROFILE['seed'])
    print('Generating', ', '.join(e['key'] for e in batch),flush=True)
    token_limit=max(750,max(len(e['text']) for e in batch)*6+100)
    results=model.batch_generate(texts=[spoken(e['text']) for e in batch],voices=[args.voice]*len(batch),instructs=[STYLE]*len(batch),lang_code='Chinese',temperature=.65,top_k=50,top_p=1.0,repetition_penalty=1.05,max_tokens=token_limit)
    completed=set();batch_seconds=0;batch_peak=0
    for result in results:
        e=batch[result.sequence_idx];data=np.array(result.audio);rate=result.sample_rate
        if result.sequence_idx in completed:raise RuntimeError('Unexpected duplicate batch result')
        if result.token_count>=token_limit-1:raise RuntimeError(f"Generation reached token cap; possible truncation: {e['key']}")
        if not np.isfinite(data).all() or np.sqrt(np.mean(data**2))<.002:raise RuntimeError(f"Invalid/silent output: {e['key']}")
        if len(data)/rate<max(3,len(e['text'])/9):raise RuntimeError(f"Suspiciously short output: {e['key']}")
        if len(data)/rate>len(e['text'])/1.7+8:raise RuntimeError(f"Suspiciously long/repeated output: {e['key']}")
        master=args.masters/f"guide-{e['key']}.wav"
        with wave.open(str(master),'wb') as f:
            f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
        target=out/f"guide-{e['key']}.m4a";duration=len(data)/rate;encoded=args.masters/f"guide-{e['key']}.m4a"
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(master),'-af',f'loudnorm=I=-19:TP=-2:LRA=8,afade=t=in:d=0.035,afade=t=out:st={max(0,duration-.045)}:d=0.045','-ar','24000','-ac','1','-c:a','aac','-b:a','96k','-movflags','+faststart',str(encoded)],check=True)
        os.replace(encoded,target)
        manifest['entries'][e['key']]={'name':e['name'],'file':f'audio/{target.name}','duration':round(duration,3),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'textSha256':hashlib.sha256(e['text'].encode()).hexdigest(),'spokenText':spoken(e['text']),'tokenCount':result.token_count,'tokenLimit':token_limit,'batchSize':len(batch),'masterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'nativePeak':round(float(np.max(np.abs(data))),5),'peakMemoryGB':round(float(result.peak_memory_usage),3)}
        saved_manifest=args.masters/'guide-manifest.json.tmp';saved_manifest.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');os.replace(saved_manifest,manifest_path)
        completed.add(result.sequence_idx)
        batch_seconds+=duration;batch_peak=max(batch_peak,float(result.peak_memory_usage))
        print('Saved',e['key'],round(duration,1),'s;',round(time.time()-began,1),'s batch elapsed;',round(float(result.peak_memory_usage),2),'GB peak memory',flush=True)
    if len(completed)!=len(batch):raise RuntimeError('Missing batch output; resume will regenerate missing entries.')
    with (args.masters/'generation-batches.jsonl').open('a') as log:
        log.write(json.dumps({'finished':datetime.now(timezone.utc).isoformat(),'keys':[e['key'] for e in batch],'elapsedSeconds':round(time.time()-began,2),'audioSeconds':round(batch_seconds,3),'peakMemoryGB':round(batch_peak,3),'totalSaved':len(manifest['entries'])})+'\n')
    mx.clear_cache()
    if at+args.batch_size<len(pending):time.sleep(max(0,min(60,args.cooldown)))
print('Finished requested entries:',len(entries),flush=True)
