document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('.site-header');
 const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>20);
 onScroll();window.addEventListener('scroll',onScroll,{passive:true});
 document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
 const reveals=document.querySelectorAll('.reveal');
 const io=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12});
 reveals.forEach(e=>io.observe(e));
 document.querySelectorAll('[data-toast]').forEach(btn=>btn.addEventListener('click',()=>showToast(btn.dataset.toast)));
 document.querySelectorAll('.toggle-password').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.target);if(!input)return;input.type=input.type==='password'?'text':'password';btn.innerHTML=input.type==='password'?'<i class="bi bi-eye"></i>':'<i class="bi bi-eye-slash"></i>'}));
});
function showToast(message){const host=document.getElementById('toastHost');if(!host)return;host.innerHTML=`<div class="toast show border-0 rounded-0" role="alert"><div class="toast-body bg-dark text-white px-4 py-3"><i class="bi bi-check2 me-2"></i>${message}</div></div>`;setTimeout(()=>host.innerHTML='',2800)}
