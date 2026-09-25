/* Contact form and calendar. */
'use strict';
/* ================= CONTACT FORM ================= */
const FORM_ENDPOINT='/api/contact.php';
const formOpened=Date.now();
const ERRTXT={en:{net:'Could not send. Please try again or email us directly.',val:'Please check the highlighted fields.',rate:'Please wait a moment before sending again.'},
              tr:{net:'Gönderilemedi. Tekrar deneyin veya doğrudan e-posta yazın.',val:'Lütfen işaretli alanları kontrol edin.',rate:'Tekrar göndermeden önce biraz bekleyin.'}};
function formError(kind){
  const p=$('#formErr');p.textContent=(ERRTXT[LANG]||ERRTXT.en)[kind];p.hidden=false;
}
$('#contactForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=$('#formBtn');
  $('#formErr').hidden=true;
  btn.classList.add('loading');btn.disabled=true;
  const payload={
    name:$('#fName').value.trim(),
    email:$('#fMail').value.trim(),
    company:$('#fComp').value.trim(),
    interest:$('#fInt').value||($('#fInt').selectedOptions[0]||{}).textContent||'',
    message:$('#fMsg').value.trim(),
    website:$('#website').value,
    elapsed:Date.now()-formOpened,
    lang:LANG
  };
  try{
    const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(r.status===422){formError('val');}
    else if(r.status===429){formError('rate');}
    else if(!r.ok){formError('net');}
    else{
      const d=await r.json();
      if(d&&d.ok){$('#formFields').style.display='none';btn.style.display='none';$('#formOk').classList.add('show');return;}
      formError('net');
    }
  }catch(err){formError('net');}
  btn.classList.remove('loading');btn.disabled=false;
});
$$('.field select').forEach(s=>s.addEventListener('change',()=>s.classList.add('filled')));

/* ================= CALENDAR ================= */
const TIMES=['09:30','11:00','12:30','14:00','15:30','17:00'];
const calDays=[];
(function(){let d=new Date();while(calDays.length<10){d=new Date(d);d.setDate(d.getDate()+1);const w=d.getDay();if(w!==0&&w!==6)calDays.push(new Date(d));}})();
let calSel={d:null,t:null};
const locMap={en:'en-US',tr:'tr-TR',ar:'ar-AE'};
function calRender(){
  const loc=locMap[LANG]||'en-US';
  $('#calDates').innerHTML=calDays.map((d,i)=>{
    const w=d.toLocaleDateString(loc,{weekday:'short'}),m=d.toLocaleDateString(loc,{month:'short'});
    return '<button type="button" class="cal-day'+(calSel.d===i?' on':'')+'" data-d="'+i+'"><span class="cd-w">'+w+'</span><span class="cd-d">'+d.getDate()+'</span><span class="cd-m">'+m+'</span></button>';}).join('');
  $('#calTimes').innerHTML=TIMES.map((t,i)=>'<button type="button" class="cal-time'+(calSel.t===i?' on':'')+'" data-t="'+i+'">'+t+'</button>').join('');
  $('#calConfirm').classList.toggle('disabled',calSel.d==null||calSel.t==null);
}
window._calRender=calRender;
$('#calDates').addEventListener('click',e=>{const b=e.target.closest('.cal-day');if(!b)return;calSel.d=+b.dataset.d;calRender();});
$('#calTimes').addEventListener('click',e=>{const b=e.target.closest('.cal-time');if(!b)return;calSel.t=+b.dataset.t;calRender();});
$('#calConfirm').addEventListener('click',()=>{
  if(calSel.d==null||calSel.t==null)return;
  const d=calDays[calSel.d];
  $('#calSum').textContent=d.toLocaleDateString(locMap[LANG]||'en-US',{weekday:'long',day:'numeric',month:'long'})+' · '+TIMES[calSel.t]+' (GMT+3)';
  $('#calFields').style.display='none';$('#calOk').classList.add('show');
});
$('#calReset').addEventListener('click',()=>{calSel={d:null,t:null};$('#calOk').classList.remove('show');$('#calFields').style.display='';calRender();});
calRender();

