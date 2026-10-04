/* KASHMIR HAMAM — storefront JS: nav, cart, FAQ, gallery, quote form */
(function(){
"use strict";
var WA_NUMBER = '916005898996';
function waLink(text){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }

/* ── mobile nav ── */
var tgl = document.getElementById('navToggle'), mnav = document.getElementById('mnav');
if(tgl && mnav){ tgl.addEventListener('click', function(){ mnav.classList.toggle('open'); }); }

/* ── FAQ accordion ── */
document.querySelectorAll('.faq q').forEach(function(q){
  q.addEventListener('click', function(){
    var f = q.parentElement, was = f.classList.contains('open');
    document.querySelectorAll('.faq.open').forEach(function(o){ o.classList.remove('open'); });
    if(!was) f.classList.add('open');
  });
});

/* ── gallery filters ── */
document.querySelectorAll('.gal-filters button').forEach(function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.gal-filters button').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on');
    var cat = b.getAttribute('data-cat');
    document.querySelectorAll('.gal figure').forEach(function(f){
      f.classList.toggle('hide', cat !== 'all' && f.getAttribute('data-cat') !== cat);
    });
  });
});

/* ═══════════ CART ═══════════ */
var PRODUCTS = window.KH_PRODUCTS || {};
function getCart(){ try{ return JSON.parse(localStorage.getItem('kh_cart')||'{}'); }catch(e){ return {}; } }
function saveCart(c){ localStorage.setItem('kh_cart', JSON.stringify(c)); renderCart(); }
function cartQty(){ var c=getCart(), n=0; for(var k in c) n+=c[k]; return n; }
function cartTotal(){ var c=getCart(), t=0; for(var k in c){ if(PRODUCTS[k]) t += PRODUCTS[k].price*c[k]; } return t; }
function fmt(n){ return '₹' + n.toLocaleString('en-IN'); }

window.khAddToCart = function(id){
  var c = getCart(); c[id] = (c[id]||0) + 1; saveCart(c);
  openCart();
  toast('Added to cart');
};
window.khEnquire = function(id){
  var p = PRODUCTS[id]; if(!p) return;
  var msg = 'Assalamu alaikum! I am interested in this product from Kashmir Hamam:\n\n' +
            p.name + '\n' + p.spec + '\nPrice: ' + fmt(p.price) + ' ' + (p.unit||'') +
            '\n\nPlease share details.';
  window.open(waLink(msg), '_blank');
};
window.khQty = function(id, d){
  var c = getCart(); c[id] = (c[id]||0) + d;
  if(c[id] <= 0) delete c[id];
  saveCart(c);
};
window.khRemove = function(id){ var c=getCart(); delete c[id]; saveCart(c); };

function openCart(){
  document.getElementById('cartDrawer').classList.add('on');
  document.getElementById('cartOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('on');
  document.getElementById('cartOverlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.khOpenCart = openCart; window.khCloseCart = closeCart;

var cartBtn = document.getElementById('cartBtn');
if(cartBtn) cartBtn.addEventListener('click', openCart);
var ov = document.getElementById('cartOverlay');
if(ov) ov.addEventListener('click', closeCart);
var cx = document.getElementById('cartX');
if(cx) cx.addEventListener('click', closeCart);

window.khCheckoutWA = function(){
  var c = getCart(), keys = Object.keys(c);
  if(!keys.length) return;
  var lines = ['Assalamu alaikum! I would like to order from Kashmir Hamam:', ''];
  keys.forEach(function(k, i){
    var p = PRODUCTS[k]; if(!p) return;
    lines.push((i+1) + '. ' + p.name + ' × ' + c[k] + ' — ' + fmt(p.price*c[k]));
  });
  lines.push('', 'Total: ' + fmt(cartTotal()), '', 'My name: ', 'My village/town: ');
  window.open(waLink(lines.join('\n')), '_blank');
};

function renderCart(){
  var box = document.getElementById('cartItems'); if(!box) return;
  var c = getCart(), keys = Object.keys(c).filter(function(k){ return PRODUCTS[k]; });
  var cc = document.getElementById('cartCount');
  if(cc){ cc.textContent = cartQty(); cc.style.display = cartQty() ? 'flex' : 'none'; }
  if(!keys.length){
    box.innerHTML = '<div class="cd-empty">Your cart is empty.<br>Browse the shop and add what you need.</div>';
  } else {
    box.innerHTML = keys.map(function(k){
      var p = PRODUCTS[k];
      return '<div class="cd-item">' +
        '<img src="/assets/img/' + p.image + '" alt="">' +
        '<div style="flex:1"><div class="nm">' + p.name + '</div>' +
        '<div class="pr">' + fmt(p.price) + ' ' + (p.unit||'') + '</div>' +
        '<div class="qty"><button onclick="khQty(\''+k+'\',-1)">−</button><span>' + c[k] + '</span><button onclick="khQty(\''+k+'\',1)">+</button>' +
        '<button onclick="khRemove(\''+k+'\')" style="margin-left:auto;border:0;background:none;color:#a00;cursor:pointer;font-size:13px">Remove</button></div>' +
        '</div></div>';
    }).join('');
  }
  var ft = document.getElementById('cartFoot');
  if(ft) ft.style.display = keys.length ? 'block' : 'none';
  var tot = document.getElementById('cartTotalVal');
  if(tot) tot.textContent = fmt(cartTotal());
}

/* tiny toast */
var toastT = null;
function toast(msg){
  var t = document.getElementById('khToast');
  if(!t){
    t = document.createElement('div'); t.id = 'khToast';
    t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#2e2018;color:#fff;padding:10px 20px;border-radius:999px;font-size:14px;z-index:120;opacity:0;transition:.3s;pointer-events:none';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(toastT); toastT = setTimeout(function(){ t.style.opacity = '0'; }, 1800);
}
window.khToast = toast;

/* ═══════════ QUOTE FORM ═══════════ */
var qf = document.getElementById('quoteForm');
if(qf){
  qf.addEventListener('submit', function(ev){
    ev.preventDefault();
    var fd = new FormData(qf);
    var d = {};
    fd.forEach(function(v,k){ d[k]=v; });
    if(!d.name || !d.phone){ toast('Please add your name and phone number.'); return; }
    document.getElementById('quoteFields').style.display = 'none';
    var th = document.getElementById('quoteThanks');
    th.style.display = 'block';
    th.querySelector('p').innerHTML = 'Thank you, <b>' + escapeHtml(d.name) +
      '</b>! We have received your request and will call you back soon on <b>' +
      escapeHtml(d.phone) + '</b>.';
    // WhatsApp shortcut with the details prefilled
    var lines = ['Assalamu alaikum! I would like a free hamam quote:', '',
      'Name: ' + d.name, 'Phone: ' + d.phone,
      'Location: ' + (d.location||'-'),
      'Room size: ' + (d.roomsize||'-'),
      'Type: ' + (d.jobtype||'-'),
      'Floor: ' + (d.floor||'-'),
      'Message: ' + (d.message||'-')];
    document.getElementById('quoteWA').href = waLink(lines.join('\n'));
    qf.scrollIntoView({behavior:'smooth', block:'center'});
  });
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

renderCart();
})();
