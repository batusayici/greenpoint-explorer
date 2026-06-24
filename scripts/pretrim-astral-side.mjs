#!/usr/bin/env node
// pretrim-astral-side.mjs — crop an Astral side texture to a TIGHT content box
// that PRESERVES the stepped-gable crown (the runtime 8.5%-density trim shaves
// the sparse gable rows — same trap the Franklin frontage hit). Writes a
// .trim.png that goes in PRETRIMMED_TEXTURES (runtime skips re-trim), and prints
// the cornice roofV + the redness window-seed grid in the NEW crop's coords.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

function decodePng(buffer){let o=8,ihdr=null,pal=null;const idat=[];while(o<buffer.length){const l=buffer.readUInt32BE(o);const t=buffer.toString("ascii",o+4,o+8);const b=buffer.subarray(o+8,o+8+l);if(t==="IHDR")ihdr={width:b.readUInt32BE(0),height:b.readUInt32BE(4),colorType:b[9]};else if(t==="PLTE")pal=b;else if(t==="IDAT")idat.push(b);else if(t==="IEND")break;o+=12+l;}const ch={0:1,2:3,3:1,4:2,6:4}[ihdr.colorType];const raw=inflateSync(Buffer.concat(idat));const{width,height}=ihdr;const st=width*ch;const ln=new Uint8Array(st),pv=new Uint8Array(st);const out=new Uint8Array(width*height*4);for(let y=0;y<height;y++){const f=raw[y*(st+1)];const r=raw.subarray(y*(st+1)+1,(y+1)*(st+1));for(let x=0;x<st;x++){const rb=r[x];const a=x>=ch?ln[x-ch]:0;const bb=pv[x];const c=x>=ch?pv[x-ch]:0;let v;switch(f){case 0:v=rb;break;case 1:v=rb+a;break;case 2:v=rb+bb;break;case 3:v=rb+((a+bb)>>1);break;case 4:{const p=a+bb-c,pa=Math.abs(p-a),pb=Math.abs(p-bb),pc=Math.abs(p-c);v=rb+(pa<=pb&&pa<=pc?a:pb<=pc?bb:c);break;}}ln[x]=v&255;}for(let x=0;x<width;x++){const at=(y*width+x)*4,s=x*ch;if(ihdr.colorType===2||ihdr.colorType===6){out[at]=ln[s];out[at+1]=ln[s+1];out[at+2]=ln[s+2];}else if(ihdr.colorType===3){const p=ln[s]*3;out[at]=pal[p];out[at+1]=pal[p+1];out[at+2]=pal[p+2];}else{out[at]=out[at+1]=out[at+2]=ln[s];}out[at+3]=255;}pv.set(ln);}return{width,height,data:out};}
function encodePng(W,H,rgba){const stride=W*4;const raw=Buffer.alloc(H*(stride+1));for(let y=0;y<H;y++){raw[y*(stride+1)]=0;raw.set(rgba.subarray(y*stride,(y+1)*stride),y*(stride+1)+1);}const crc32=(d)=>{let c=~0;for(let i=0;i<d.length;i++){c^=d[i];for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1));}return(~c)>>>0;};const chunk=(type,body)=>{const len=Buffer.alloc(4);len.writeUInt32BE(body.length);const tb=Buffer.from(type,"ascii");const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([tb,body])));return Buffer.concat([len,tb,body,crc]);};const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",deflateSync(raw,{level:9})),chunk("IEND",Buffer.alloc(0))]);}

const file=process.argv[2];
const img=decodePng(readFileSync(file));
const {width,height,data}=img;
const bd=[data[0],data[1],data[2]];
const diff=(x,y)=>{const at=(y*width+x)*4;return Math.abs(data[at]-bd[0])+Math.abs(data[at+1]-bd[1])+Math.abs(data[at+2]-bd[2])>80;};
// LOW-threshold content box (catches the sparse gable; ignores 1px noise).
const colC=new Array(width).fill(0), rowC=new Array(height).fill(0);
for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(diff(x,y)){colC[x]++;rowC[y]++;}
const rowThr=width*0.004, colThr=height*0.004; // 0.4%
let minX=0,maxX=width-1,minY=0,maxY=height-1;
while(minX<maxX&&colC[minX]<=colThr)minX++;
while(maxX>minX&&colC[maxX]<=colThr)maxX--;
while(minY<maxY&&rowC[minY]<=rowThr)minY++;
while(maxY>minY&&rowC[maxY]<=rowThr)maxY--;
const pad=2; minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(width-1,maxX+pad);maxY=Math.min(height-1,maxY+pad);
const W=maxX-minX+1,H=maxY-minY+1;
const crop=new Uint8Array(W*H*4);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const s=((minY+y)*width+(minX+x))*4,d=(y*W+x)*4;crop[d]=data[s];crop[d+1]=data[s+1];crop[d+2]=data[s+2];crop[d+3]=255;}
const outPath=file.replace(/\.png$/,".trim.png");
writeFileSync(outPath,encodePng(W,H,crop));

// Cornice roofV: top of the SOLID wall course = first row (from top) where a
// FULL-WIDTH band of content begins (the parapet/gablets above are sparse).
// Use 60% row-content as "solid course". Crown = rows above it.
const cl=W*0.60; let corniceY=0; for(let y=0;y<H;y++){let c=0;for(let x=0;x<W;x++){const at=(y*W+x)*4;if(Math.abs(crop[at]-bd[0])+Math.abs(crop[at+1]-bd[1])+Math.abs(crop[at+2]-bd[2])>80)c++;}if(c>cl){corniceY=y;break;}}
const roofV=+(1-corniceY/H).toFixed(3);

// Redness window seed on the crop (R-B<28 && lum>55), cols x rows, merge sashes.
const px=(x,y)=>{const at=(y*W+x)*4;return [crop[at],crop[at+1],crop[at+2]];};
const lum=(r,g,b)=>0.299*r+0.587*g+0.114*b;
const bright=(x,y)=>{const[r,g,b]=px(x,y);return r-b<28&&lum(r,g,b)>55;};
const colD=new Array(W).fill(0),rowD=new Array(H).fill(0);
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(bright(x,y)){colD[x]++;rowD[y]++;}
const bands=(d,frac)=>{const mx=Math.max(...d),thr=mx*frac,o=[];let s=-1;for(let i=0;i<d.length;i++){if(d[i]>thr){if(s<0)s=i;}else if(s>=0){o.push([s,i-1]);s=-1;}}if(s>=0)o.push([s,d.length-1]);return o;};
const cols=bands(colD,0.28).filter(([a,b])=>b-a>=W*0.012);
const rows=bands(rowD,0.30).filter(([a,b])=>b-a>=H*0.012);
let rects=[];
for(const[cx0,cx1]of cols)for(const[ry0,ry1]of rows){let bx0=1e9,bx1=-1,by0=1e9,by1=-1,cnt=0;for(let y=ry0;y<=ry1;y++)for(let x=cx0;x<=cx1;x++)if(bright(x,y)){cnt++;if(x<bx0)bx0=x;if(x>bx1)bx1=x;if(y<by0)by0=y;if(y>by1)by1=y;}const cell=(cx1-cx0+1)*(ry1-ry0+1);if(cnt<cell*0.10)continue;rects.push({x0:+(bx0/W).toFixed(4),x1:+((bx1+1)/W).toFixed(4),y0:+(1-(by1+1)/H).toFixed(4),y1:+(1-by0/H).toFixed(4)});}
const xov=(a,b)=>Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0))/Math.min(a.x1-a.x0,b.x1-b.x0);
let merged=true;while(merged){merged=false;outer:for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(xov(a,b)>0.6&&Math.max(a.y0,b.y0)-Math.min(a.y1,b.y1)<0.02){rects[i]={x0:Math.min(a.x0,b.x0),x1:Math.max(a.x1,b.x1),y0:Math.min(a.y0,b.y0),y1:Math.max(a.y1,b.y1)};rects.splice(j,1);merged=true;break outer;}}}
rects.sort((a,b)=>b.y0-a.y0||a.x0-b.x0);
console.log(JSON.stringify({out:outPath,raw:[width,height],crop:[W,H],cropBox:{minX,minY,maxX,maxY},corniceY,roofV,windows:rects.length}));
console.log("ROOFV="+roofV);
console.log("RECTS="+JSON.stringify(rects));
