/* Performance chart, tilt/magnet, filters. */
'use strict';
/* ================= PERFORMANCE CHART ================= */
const CHART={
  aum:{data:[1.2,1.6,2.1,2.8,3.4,4.1,5.0,5.9,6.7,7.4,7.9,8.4],fmt:v=>'$'+v.toFixed(1)+'B'},
  irr:{data:[18.2,19.1,20.4,19.6,21.2,22.0,22.8,23.1,23.9,24.2,24.5,24.8],fmt:v=>v.toFixed(1)+'%'},
  dist:{data:[0.3,0.5,0.8,1.1,1.4,1.7,2.0,2.3,2.5,2.7,2.9,3.1],fmt:v=>'$'+v.toFixed(1)+'B'}
};
const YEARS=Array.from({length:12},(_,i)=>2015+i);
const chartSvg=$('#chart'),tip=$('#chartTip');
function smoothPath(pts){
  let d='M'+pts[0][0]+','+pts[0][1];
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    d+='C'+(p1[0]+(p2[0]-p0[0])/6)+','+(p1[1]+(p2[1]-p0[1])/6)+','+(p2[0]-(p3[0]-p1[0])/6)+','+(p2[1]-(p3[1]-p1[1])/6)+','+p2[0]+','+p2[1];
  }
  return d;
}
function renderChart(key){
  const data=CHART[key].data,fmt=CHART[key].fmt;
  const W=640,H=340,L=54,R=18,T=24,B=40;
  const min=Math.min.apply(null,data),max=Math.max.apply(null,data),pad=(max-min)*.18||1;
  const lo=Math.max(0,min-pad),hi=max+pad;
  const X=i=>L+(W-L-R)*i/(data.length-1);
  const Y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo));
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=smoothPath(pts);
  const area=line+'L'+X(data.length-1)+','+(H-B)+'L'+X(0)+','+(H-B)+'Z';
  let g='',xl='';
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4,y=Y(v);
    g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" class="cg"/>';
    g+='<text x="'+(L-10)+'" y="'+(y+4)+'" class="cl" text-anchor="end">'+(key==='irr'?Math.round(v)+'%':'$'+v.toFixed(1)+'B')+'</text>';}
  YEARS.forEach((yr,i)=>{if(i%2===0)xl+='<text x="'+X(i)+'" y="'+(H-14)+'" class="cl" text-anchor="middle">'+yr+'</text>';});
  chartSvg.innerHTML='<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A55C" stop-opacity=".32"/><stop offset="1" stop-color="#C9A55C" stop-opacity="0"/></linearGradient></defs>'
    +'<g>'+g+xl+'</g>'
    +'<path d="'+area+'" fill="url(#ag)" class="c-area"/>'
    +'<path d="'+line+'" class="c-line" id="cLine"/>'
    +'<line id="cHover" y1="'+T+'" y2="'+(H-B)+'" class="c-hov"/>'
    +'<circle id="cDot" r="5" class="c-dot"/>';
  const path=$('#cLine'),len=path.getTotalLength(),areaEl=chartSvg.querySelector('.c-area');
  path.style.strokeDasharray=len;path.style.strokeDashoffset=REDUCED?0:len;
  areaEl.style.opacity=0;
  requestAnimationFrame(()=>{path.style.transition='stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)';path.style.strokeDashoffset=0;
    areaEl.style.transition='opacity 1s .5s';areaEl.style.opacity=1;});
  chartSvg._s={X:X,Y:Y,data:data,fmt:fmt,L:L,R:R,W:W};
}
chartSvg.addEventListener('mousemove',e=>{
  const s=chartSvg._s;if(!s)return;
  const r=chartSvg.getBoundingClientRect();
  const x=(e.clientX-r.left)*(640/r.width);
  let i=Math.round((x-s.L)/((s.W-s.L-s.R)/(s.data.length-1)));
  i=Math.max(0,Math.min(s.data.length-1,i));
  const px=s.X(i),py=s.Y(s.data[i]);
  const hov=$('#cHover'),dot=$('#cDot');
  hov.setAttribute('x1',px);hov.setAttribute('x2',px);hov.style.opacity=1;
  dot.setAttribute('cx',px);dot.setAttribute('cy',py);dot.style.opacity=1;
  tip.innerHTML='<b>'+s.fmt(s.data[i])+'</b>'+YEARS[i];
  tip.style.left=(px/640*100)+'%';tip.style.top=(py/340*100)+'%';tip.style.opacity=1;
});
chartSvg.addEventListener('mouseleave',()=>{tip.style.opacity=0;
  const h=$('#cHover'),d=$('#cDot');if(h)h.style.opacity=0;if(d)d.style.opacity=0;});
$$('[data-chart]').forEach(b=>b.addEventListener('click',()=>{
  $$('[data-chart]').forEach(x=>x.classList.toggle('on',x===b));renderChart(b.dataset.chart);
}));
renderChart('aum');

/* ================= TILT + MAGNET ================= */
if(FINE&&!REDUCED){
  $$('.tilt').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='translateY(-8px) perspective(900px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg)';});
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
  $$('.magnet').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();
      el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.16)+'px,'+((e.clientY-r.top-r.height/2)*.2)+'px)';});
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
}

/* ================= FILTERS ================= */
function bindFilter(barSel,itemSel,attr){
  const bar=$(barSel);if(!bar)return;
  bar.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    $$('button',bar).forEach(x=>x.classList.toggle('on',x===b));
    const f=b.dataset.filter;
    $$(itemSel).forEach(it=>{
      const show=f==='all'||it.dataset[attr]===f;
      if(show){it.style.display='';requestAnimationFrame(()=>requestAnimationFrame(()=>it.classList.remove('hide')));}
      else{it.classList.add('hide');setTimeout(()=>{if(it.classList.contains('hide'))it.style.display='none';},330);}
    });
  });
}
bindFilter('#pfFilters','.pf-item','sector');
bindFilter('#inTabs','.in-card','type');

