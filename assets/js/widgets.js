/* Chat assistant, Escape key, newsletter. */
'use strict';
/* ================= CHAT ================= */
const chatPanel=$('#chatPanel'),chatBody=$('#chatBody');
let chatOpen=false;
$('#chatFab').addEventListener('click',()=>{
  chatOpen=!chatOpen;chatPanel.classList.toggle('open',chatOpen);
  if(chatOpen&&!chatBody.dataset.init){chatBody.dataset.init='1';botSay(I18N[LANG]['chat.hi']);}
});
$('#chatClose').addEventListener('click',()=>{chatOpen=false;chatPanel.classList.remove('open');});
function addMsg(text,who){const m=document.createElement('div');m.className='msg '+who;m.textContent=text;chatBody.appendChild(m);chatBody.scrollTop=chatBody.scrollHeight;}
function botSay(text){
  const t=document.createElement('div');t.className='msg bot typing';t.innerHTML='<i></i><i></i><i></i>';
  chatBody.appendChild(t);chatBody.scrollTop=chatBody.scrollHeight;
  setTimeout(()=>{t.remove();addMsg(text,'bot');},850);
}
function botReply(q){
  const d=I18N[LANG],s=q.toLowerCase();
  if(/invest|yatırım|مستثمر|portal|ir\b/.test(s))return d['chat.r1'];
  if(/meet|toplantı|اجتماع|book|randevu|schedule/.test(s))return d['chat.r2'];
  if(/overview|tanıtım|ملف|firm|report|rapor/.test(s))return d['chat.r3'];
  return d['chat.r4'];
}
$('#chatForm').addEventListener('submit',e=>{
  e.preventDefault();const inp=$('#chatText'),v=inp.value.trim();if(!v)return;
  addMsg(v,'user');inp.value='';botSay(botReply(v));
});
$('#chatChips').addEventListener('click',e=>{
  const b=e.target.closest('.ch-chip');if(!b)return;
  const txt=b.textContent.trim();addMsg(txt,'user');botSay(botReply(txt));
});

/* ================= PORTAL MODAL ================= */
/* portal kaldırıldı — geri eklenirse bu blok da geri gelmeli */
addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(chatOpen){chatOpen=false;chatPanel.classList.remove('open');}}});

/* ================= NEWSLETTER ================= */
$('#nlForm').addEventListener('submit',e=>{
  e.preventDefault();const b=$('#nlBtn');
  b.textContent=I18N[LANG]['ft.subok'];b.classList.add('done');$('#nlMail').value='';
});

