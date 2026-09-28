const dialog=document.querySelector('#inquiry');
const form=document.querySelector('#inquiry-form');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let closing=false;
document.querySelectorAll('[data-inquiry]').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.topic)form.elements.message.value=button.dataset.topic;
  document.querySelector('#form-status').textContent='';
  dialog.showModal();document.body.classList.add('modal-open');
}));
function closeDialog(){if(closing)return;if(reducedMotion.matches){dialog.close();return;}closing=true;dialog.classList.add('closing');setTimeout(()=>{dialog.close();dialog.classList.remove('closing');closing=false;},300);}
document.querySelector('.close-modal').addEventListener('click',closeDialog);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))closeDialog();});
form.addEventListener('submit',event=>{event.preventDefault();const values=new FormData(form);const body=`Имя: ${values.get('name')}\nТелефон: ${values.get('phone')}\nЗадача: ${values.get('message')||'Подбор системы кондиционирования'}`;location.href=`mailto:info@satsvyaz.ru?subject=${encodeURIComponent('Заявка — Спутник')}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Письмо подготовлено. Отправьте его в почтовой программе. Если она не открылась, позвоните: 8 800 555-69-92.';});
if(!reducedMotion.matches&&'IntersectionObserver' in window){
  document.querySelectorAll('.solution-list,.process-grid,.price-grid').forEach(group=>[...group.children].forEach((el,i)=>el.style.setProperty('--delay',`${i%4*100}ms`)));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el);});
}
const hero=document.querySelector('.hero'),image=document.querySelector('.hero-image'),progress=document.querySelector('.reading-progress');
let frame=0,current=0,last=0;
function draw(time){const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?Math.min(1,scrollY/distance):0})`;const target=reducedMotion.matches?0:Math.min(scrollY,hero.offsetHeight)*.04;const dt=last?Math.min(time-last,50):16;last=time;current+=(target-current)*(1-Math.exp(-dt/140));image.style.setProperty('--hero-shift',`${current.toFixed(2)}px`);if(Math.abs(target-current)>.1)frame=requestAnimationFrame(draw);else{frame=0;last=0;}}
function queue(){if(!frame)frame=requestAnimationFrame(draw);}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);queue();
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)document.querySelectorAll('.pending').forEach(el=>el.classList.remove('pending'));queue();});
