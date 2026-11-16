(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function sc(){top.classList.toggle('sc',window.scrollY>8);if(window.scrollY<300)document.querySelectorAll('.menu a.on').forEach(function(l){l.classList.remove('on')})}
  window.addEventListener('scroll',sc,{passive:true});sc();
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});
  var IO='IntersectionObserver' in window;
  // aktywna pozycja menu
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if(IO){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
  }
  // karuzele: palec natywnie, mysz przeciaganiem, strzalki + licznik
  function krok(tor){var k=tor.children[0];return k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0)}
  document.querySelectorAll('.tor').forEach(function(tor){
    var nav=document.querySelector('.nawig[data-tor="'+tor.id+'"]'),licz=nav&&nav.querySelector('.licz'),bs=nav?nav.querySelectorAll('button'):[];
    function upd(){var w=krok(tor),n=tor.children.length,vis=Math.max(1,Math.round(tor.clientWidth/w)),i=Math.round(tor.scrollLeft/w);
      if(licz)licz.textContent=Math.min(n,i+1)+'-'+Math.min(n,i+vis)+' z '+n;
      if(bs.length){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4}}
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(upd)},{passive:true});window.addEventListener('resize',upd);upd();
    [].forEach.call(bs,function(b){b.addEventListener('click',function(){tor.scrollBy({left:krok(tor)*(+b.dataset.k),behavior:'smooth'})})});
    var down=false,sx=0,sl=0,moved=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.target.closest('.pas[data-gal]'))return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;tor.classList.add('drag')}if(moved)tor.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=krok(tor);tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
  });
  // galeria w karcie autokaru: palec natywnie, mysz przeciaganiem, kropki
  document.querySelectorAll('.pas[data-gal]').forEach(function(p){
    var dots=p.parentNode.querySelectorAll('.kropki i');
    function u(){var i=Math.round(p.scrollLeft/p.clientWidth);[].forEach.call(dots,function(d,j){d.classList.toggle('on',j===i)})}
    p.addEventListener('scroll',function(){window.requestAnimationFrame(u)},{passive:true});u();
    var down=false,sx=0,sl=0;
    p.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=p.scrollLeft;p.style.scrollSnapType='none'});
    window.addEventListener('pointermove',function(e){if(down)p.scrollLeft=sl-(e.clientX-sx)});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;p.style.scrollSnapType='';p.scrollTo({left:Math.round(p.scrollLeft/p.clientWidth)*p.clientWidth,behavior:'smooth'})});
  });
  // przyciski ustawiaja temat formularza
  var tem=document.getElementById('f-tem'),tr=document.getElementById('f-tr');
  document.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){tem.value=a.dataset.temat;if(a.dataset.wyjazd&&!tr.value)tr.value='Wyjazd: '+a.dataset.wyjazd+'\nLiczba osób: '})});
  document.getElementById('form').addEventListener('submit',function(e){e.preventDefault();document.getElementById('ok').hidden=false});
  // dolny pasek na telefonie po przewinieciu pierwszego ekranu
  var mob=document.getElementById('mob'),hero=document.querySelector('.hero');
  if(IO&&mob){new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting)},{threshold:0}).observe(hero)}
  // mapa Google dopiero przy przewinieciu
  var m=document.getElementById('mapa');
  function load(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title='Mapa dojazdu - ul. Inowrocławska 35, Bydgoszcz';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if(m){if(IO){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else load()}
})();
