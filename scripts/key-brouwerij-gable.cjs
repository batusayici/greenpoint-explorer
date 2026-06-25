// key-brouwerij-gable.cjs — clean the keyed sky above the Brouwerij stepped gable.
// The sky alpha is baked (border flood-fill originally; Batu hand-cropped the cream
// borders → 1067×1192). Two cleanup passes on the alpha, then re-measure roofV:
//   1) CONNECTIVITY: keep only opaque pixels reachable from the bottom edge (the
//      building is one connected mass, gable included) — drops isolated islands.
//   2) COLUMN despeckle: per column, scan bottom→up; at the first run of >=GAP
//      consecutive transparent px (a real sky gap, not a 1-5px ragged-edge bite),
//      remove every opaque pixel ABOVE it — that's floating "dust" sitting in the
//      sky over the silhouette, attached to the gable's ragged top by thin threads.
// Reads the ORIGINAL render? No — operates on the current .trim.png in place.
const {readFileSync,writeFileSync}=require("node:fs");
const {PNG}=require("pngjs");
const FILE="assets/textures/franklin/brouwerij-lane.trim.png";
const GAP=6;
const p=PNG.sync.read(readFileSync(FILE));
const {width:W,height:H,data:d}=p;
const A=128; const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&d[(y*W+x)*4+3]>A;
const before=PNG.sync.read(readFileSync(FILE)); // for the removed-preview

// 1) connectivity from the bottom row
const keep=new Uint8Array(W*H); const st=[];
for(let x=0;x<W;x++){ if(op(x,H-1)){keep[(H-1)*W+x]=1;st.push(x,H-1);} }
while(st.length){const y=st.pop(),x=st.pop();
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){ if(!dx&&!dy)continue; const nx=x+dx,ny=y+dy;
    if(nx<0||ny<0||nx>=W||ny>=H)continue; const m=ny*W+nx; if(keep[m])continue; if(op(nx,ny)){keep[m]=1;st.push(nx,ny);} } }
for(let i=0;i<W*H;i++){ if(d[i*4+3]>A && !keep[i]) d[i*4+3]=0; }

// 2) per-column: remove opaque above the first >=GAP transparent run (bottom→up)
const opp=(x,y)=>d[(y*W+x)*4+3]>A;
for(let x=0;x<W;x++){
  let run=0, cut=-1;
  for(let y=H-1;y>=0;y--){ if(!opp(x,y)){ run++; if(run>=GAP){ cut=y; break; } } else run=0; }
  if(cut<0) continue;                 // no real sky gap in this column → leave it
  for(let y=cut;y>=0;y--){ if(opp(x,y)) d[(y*W+x)*4+3]=0; }
}

// preview: mark every newly-transparent (was opaque) pixel magenta
let removed=0;
for(let i=0;i<W*H;i++){ if(before.data[i*4+3]>A && d[i*4+3]<=A){ removed++; before.data[i*4]=255;before.data[i*4+1]=0;before.data[i*4+2]=255;before.data[i*4+3]=255; } }
writeFileSync(FILE,PNG.sync.write(p));
writeFileSync("scripts/brouwerij-clean-preview.png",PNG.sync.write(before));

// re-measure cornice roofV
const inset=Math.round(0.04*W); let corniceRow=0;
for(let y=0;y<H;y++){ if(op(inset,y)&&op(W-1-inset,y)){corniceRow=y;break;} }
console.log(JSON.stringify({W,H,removed,corniceRow,roofV:+(1-corniceRow/H).toFixed(3),aspect:+(W/H).toFixed(3)}));
