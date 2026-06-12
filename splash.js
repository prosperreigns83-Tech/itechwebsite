document.addEventListener('DOMContentLoaded', ()=>{
  // subtle floating animation for products
  const products = document.querySelectorAll('.product');
  products.forEach((el,i)=>{
    const delay = i * 300;
    el.animate([
      { transform: el.style.transform + ' translateY(0px)', opacity: 1 },
      { transform: el.style.transform + ' translateY(-10px)', opacity: 0.98 },
      { transform: el.style.transform + ' translateY(0px)', opacity: 1 }
    ],{duration:4000 + i*600, iterations:Infinity, easing:'ease-in-out', delay});
  });

  // CTA pulse
  const cta = document.querySelector('.cta');
  let hovering = false;
  setInterval(()=>{
    if (!hovering) cta.animate([{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}],{duration:2400,iterations:1,easing:'ease-in-out'});
  },2600);
  cta.addEventListener('mouseenter',()=>hovering=true);
  cta.addEventListener('mouseleave',()=>hovering=false);

  // Loading dots subtle color pulse
  const dots = document.querySelectorAll('.dots span');
  dots.forEach((d,idx)=>{
    d.animate([{opacity:.14, boxShadow:'0 6px 18px rgba(10,90,220,0.18)'},{opacity:1, boxShadow:'0 10px 30px rgba(20,110,255,0.28)'},{opacity:.14, boxShadow:'0 6px 18px rgba(10,90,220,0.18)'}],{duration:1200,iterations:Infinity,delay:idx*200,easing:'ease-in-out'});
  });
});
