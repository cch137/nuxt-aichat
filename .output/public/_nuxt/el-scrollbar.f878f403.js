import{bR as pe,A as N,L as he,bH as ge,bS as le,aR as K,a0 as Y,f as I,ae as ye,X as ie,r as m,U as C,ay as be,am as W,bd as F,o as R,j as U,w as ce,a9 as we,a as D,a6 as B,k as b,n as X,as as Se,aZ as Ee,$ as ue,c as fe,b as V,a7 as xe,aS as Te,ap as L,aW as j,V as q,an as ze,Y as G,aq as _e,h as Ce,ab as ke,ac as He,ar as Oe,a$ as Pe,l as Le,S as Re,aA as Be,ag as Ne}from"./entry.97b597df.js";import{p as de,i as Ae,q as Me,r as Ie,U as Z}from"./isEqual.a4c671d1.js";import{t as $e}from"./el-input.d5155eab.js";var We=/\s/;function Ue(e){for(var t=e.length;t--&&We.test(e.charAt(t)););return t}var De=/^\s+/;function Xe(e){return e&&e.slice(0,Ue(e)+1).replace(De,"")}var J=0/0,Ke=/^[-+]0x[0-9a-f]+$/i,Ye=/^0b[01]+$/i,Fe=/^0o[0-7]+$/i,Ve=parseInt;function Q(e){if(typeof e=="number")return e;if(pe(e))return J;if(N(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=N(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Xe(e);var n=Ye.test(e);return n||Fe.test(e)?Ve(e.slice(2),n?2:8):Ke.test(e)?J:+e}var ee=Object.create,je=function(){function e(){}return function(t){if(!N(t))return{};if(ee)return ee(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();const qe=je;function zt(e,t){var n=-1,a=e.length;for(t||(t=Array(a));++n<a;)t[n]=e[n];return t}function _t(e,t,n,a){var u=!n;n||(n={});for(var f=-1,l=t.length;++f<l;){var i=t[f],o=a?a(n[i],e[i],i,n,e):void 0;o===void 0&&(o=e[i]),u?he(n,i,o):ge(n,i,o)}return n}function Ge(e){var t=[];if(e!=null)for(var n in Object(e))t.push(n);return t}var Ze=Object.prototype,Je=Ze.hasOwnProperty;function Qe(e){if(!N(e))return Ge(e);var t=de(e),n=[];for(var a in e)a=="constructor"&&(t||!Je.call(e,a))||n.push(a);return n}function Ct(e){return Ae(e)?Me(e,!0):Qe(e)}var et=Ie(Object.getPrototypeOf,Object);const tt=et;var ve=typeof exports=="object"&&exports&&!exports.nodeType&&exports,te=ve&&typeof module=="object"&&module&&!module.nodeType&&module,nt=te&&te.exports===ve,ne=nt?le.Buffer:void 0,re=ne?ne.allocUnsafe:void 0;function kt(e,t){if(t)return e.slice();var n=e.length,a=re?re(n):new e.constructor(n);return e.copy(a),a}function rt(e){var t=new e.constructor(e.byteLength);return new Z(t).set(new Z(e)),t}function Ht(e,t){var n=t?rt(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function Ot(e){return typeof e.constructor=="function"&&!de(e)?qe(tt(e)):{}}var at=function(){return le.Date.now()};const $=at;var st="Expected a function",ot=Math.max,lt=Math.min;function Pt(e,t,n){var a,u,f,l,i,o,v=0,p=!1,c=!1,h=!0;if(typeof e!="function")throw new TypeError(st);t=Q(t)||0,N(n)&&(p=!!n.leading,c="maxWait"in n,f=c?ot(Q(n.maxWait)||0,t):f,h="trailing"in n?!!n.trailing:h);function g(s){var r=a,d=u;return a=u=void 0,v=s,l=e.apply(d,r),l}function w(s){return v=s,i=setTimeout(S,t),p?g(s):l}function k(s){var r=s-o,d=s-v,y=t-r;return c?lt(y,f-d):y}function z(s){var r=s-o,d=s-v;return o===void 0||r>=t||r<0||c&&d>=f}function S(){var s=$();if(z(s))return E(s);i=setTimeout(S,k(s))}function E(s){return i=void 0,h&&a?g(s):(a=u=void 0,l)}function H(){i!==void 0&&clearTimeout(i),v=0,a=o=u=i=void 0}function O(){return i===void 0?l:E($())}function x(){var s=$(),r=z(s);if(a=arguments,u=this,o=s,r){if(i===void 0)return w(o);if(c)return clearTimeout(i),i=setTimeout(S,t),g(o)}return i===void 0&&(i=setTimeout(S,t)),l}return x.cancel=H,x.flush=O,x}const _=4,it={vertical:{offset:"offsetHeight",scroll:"scrollTop",scrollSize:"scrollHeight",size:"height",key:"vertical",axis:"Y",client:"clientY",direction:"top"},horizontal:{offset:"offsetWidth",scroll:"scrollLeft",scrollSize:"scrollWidth",size:"width",key:"horizontal",axis:"X",client:"clientX",direction:"left"}},ct=({move:e,size:t,bar:n})=>({[n.size]:t,transform:`translate${n.axis}(${e}%)`}),me=Symbol("scrollbarContextKey"),ut=K({vertical:Boolean,size:String,move:Number,ratio:{type:Number,required:!0},always:Boolean}),ft="Thumb",dt=I({__name:"thumb",props:ut,setup(e){const t=e,n=ye(me),a=ie("scrollbar");n||$e(ft,"can not inject scrollbar context");const u=m(),f=m(),l=m({}),i=m(!1);let o=!1,v=!1,p=ue?document.onselectstart:null;const c=C(()=>it[t.vertical?"vertical":"horizontal"]),h=C(()=>ct({size:t.size,move:t.move,bar:c.value})),g=C(()=>u.value[c.value.offset]**2/n.wrapElement[c.value.scrollSize]/t.ratio/f.value[c.value.offset]),w=s=>{var r;if(s.stopPropagation(),s.ctrlKey||[1,2].includes(s.button))return;(r=window.getSelection())==null||r.removeAllRanges(),z(s);const d=s.currentTarget;d&&(l.value[c.value.axis]=d[c.value.offset]-(s[c.value.client]-d.getBoundingClientRect()[c.value.direction]))},k=s=>{if(!f.value||!u.value||!n.wrapElement)return;const r=Math.abs(s.target.getBoundingClientRect()[c.value.direction]-s[c.value.client]),d=f.value[c.value.offset]/2,y=(r-d)*100*g.value/u.value[c.value.offset];n.wrapElement[c.value.scroll]=y*n.wrapElement[c.value.scrollSize]/100},z=s=>{s.stopImmediatePropagation(),o=!0,document.addEventListener("mousemove",S),document.addEventListener("mouseup",E),p=document.onselectstart,document.onselectstart=()=>!1},S=s=>{if(!u.value||!f.value||o===!1)return;const r=l.value[c.value.axis];if(!r)return;const d=(u.value.getBoundingClientRect()[c.value.direction]-s[c.value.client])*-1,y=f.value[c.value.offset]-r,P=(d-y)*100*g.value/u.value[c.value.offset];n.wrapElement[c.value.scroll]=P*n.wrapElement[c.value.scrollSize]/100},E=()=>{o=!1,l.value[c.value.axis]=0,document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",E),x(),v&&(i.value=!1)},H=()=>{v=!1,i.value=!!t.size},O=()=>{v=!0,i.value=o};be(()=>{x(),document.removeEventListener("mouseup",E)});const x=()=>{document.onselectstart!==p&&(document.onselectstart=p)};return W(F(n,"scrollbarElement"),"mousemove",H),W(F(n,"scrollbarElement"),"mouseleave",O),(s,r)=>(R(),U(Ee,{name:b(a).b("fade"),persisted:""},{default:ce(()=>[we(D("div",{ref_key:"instance",ref:u,class:B([b(a).e("bar"),b(a).is(b(c).key)]),onMousedown:k},[D("div",{ref_key:"thumb",ref:f,class:B(b(a).e("thumb")),style:X(b(h)),onMousedown:w},null,38)],34),[[Se,s.always||i.value]])]),_:1},8,["name"]))}});var ae=Y(dt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/thumb.vue"]]);const vt=K({always:{type:Boolean,default:!0},width:String,height:String,ratioX:{type:Number,default:1},ratioY:{type:Number,default:1}}),mt=I({__name:"bar",props:vt,setup(e,{expose:t}){const n=e,a=m(0),u=m(0);return t({handleScroll:l=>{if(l){const i=l.offsetHeight-_,o=l.offsetWidth-_;u.value=l.scrollTop*100/i*n.ratioY,a.value=l.scrollLeft*100/o*n.ratioX}}}),(l,i)=>(R(),fe(xe,null,[V(ae,{move:a.value,ratio:l.ratioX,size:l.width,always:l.always},null,8,["move","ratio","size","always"]),V(ae,{move:u.value,ratio:l.ratioY,size:l.height,vertical:"",always:l.always},null,8,["move","ratio","size","always"])],64))}});var pt=Y(mt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/bar.vue"]]);const ht=K({height:{type:[String,Number],default:""},maxHeight:{type:[String,Number],default:""},native:{type:Boolean,default:!1},wrapStyle:{type:Te([String,Object,Array]),default:""},wrapClass:{type:[String,Array],default:""},viewClass:{type:[String,Array],default:""},viewStyle:{type:[String,Array,Object],default:""},noresize:Boolean,tag:{type:String,default:"div"},always:Boolean,minSize:{type:Number,default:20}}),gt={scroll:({scrollTop:e,scrollLeft:t})=>[e,t].every(L)},yt="ElScrollbar",bt=I({name:yt}),wt=I({...bt,props:ht,emits:gt,setup(e,{expose:t,emit:n}){const a=e,u=ie("scrollbar");let f,l;const i=m(),o=m(),v=m(),p=m("0"),c=m("0"),h=m(),g=m(1),w=m(1),k=C(()=>{const r={};return a.height&&(r.height=j(a.height)),a.maxHeight&&(r.maxHeight=j(a.maxHeight)),[a.wrapStyle,r]}),z=C(()=>[a.wrapClass,u.e("wrap"),{[u.em("wrap","hidden-default")]:!a.native}]),S=C(()=>[u.e("view"),a.viewClass]),E=()=>{var r;o.value&&((r=h.value)==null||r.handleScroll(o.value),n("scroll",{scrollTop:o.value.scrollTop,scrollLeft:o.value.scrollLeft}))};function H(r,d){Re(r)?o.value.scrollTo(r):L(r)&&L(d)&&o.value.scrollTo(r,d)}const O=r=>{L(r)&&(o.value.scrollTop=r)},x=r=>{L(r)&&(o.value.scrollLeft=r)},s=()=>{if(!o.value)return;const r=o.value.offsetHeight-_,d=o.value.offsetWidth-_,y=r**2/o.value.scrollHeight,P=d**2/o.value.scrollWidth,A=Math.max(y,a.minSize),M=Math.max(P,a.minSize);g.value=y/(r-y)/(A/(r-A)),w.value=P/(d-P)/(M/(d-M)),c.value=A+_<r?`${A}px`:"",p.value=M+_<d?`${M}px`:""};return q(()=>a.noresize,r=>{r?(f==null||f(),l==null||l()):({stop:f}=ze(v,s),l=W("resize",s))},{immediate:!0}),q(()=>[a.maxHeight,a.height],()=>{a.native||G(()=>{var r;s(),o.value&&((r=h.value)==null||r.handleScroll(o.value))})}),_e(me,Ce({scrollbarElement:i,wrapElement:o})),ke(()=>{a.native||G(()=>{s()})}),He(()=>s()),t({wrapRef:o,update:s,scrollTo:H,setScrollTop:O,setScrollLeft:x,handleScroll:E}),(r,d)=>(R(),fe("div",{ref_key:"scrollbarRef",ref:i,class:B(b(u).b())},[D("div",{ref_key:"wrapRef",ref:o,class:B(b(z)),style:X(b(k)),onScroll:E},[(R(),U(Pe(r.tag),{ref_key:"resizeRef",ref:v,class:B(b(S)),style:X(r.viewStyle)},{default:ce(()=>[Oe(r.$slots,"default")]),_:3},8,["class","style"]))],38),r.native?Le("v-if",!0):(R(),U(pt,{key:0,ref_key:"barRef",ref:h,height:c.value,width:p.value,always:r.always,"ratio-x":w.value,"ratio-y":g.value},null,8,["height","width","always","ratio-x","ratio-y"]))],2))}});var St=Y(wt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/scrollbar.vue"]]);const Lt=Be(St),T=new Map;let se;ue&&(document.addEventListener("mousedown",e=>se=e),document.addEventListener("mouseup",e=>{for(const t of T.values())for(const{documentHandler:n}of t)n(e,se)}));function oe(e,t){let n=[];return Array.isArray(t.arg)?n=t.arg:Ne(t.arg)&&n.push(t.arg),function(a,u){const f=t.instance.popperRef,l=a.target,i=u==null?void 0:u.target,o=!t||!t.instance,v=!l||!i,p=e.contains(l)||e.contains(i),c=e===l,h=n.length&&n.some(w=>w==null?void 0:w.contains(l))||n.length&&n.includes(i),g=f&&(f.contains(l)||f.contains(i));o||v||p||c||h||g||t.value(a,u)}}const Rt={beforeMount(e,t){T.has(e)||T.set(e,[]),T.get(e).push({documentHandler:oe(e,t),bindingFn:t.value})},updated(e,t){T.has(e)||T.set(e,[]);const n=T.get(e),a=n.findIndex(f=>f.bindingFn===t.oldValue),u={documentHandler:oe(e,t),bindingFn:t.value};a>=0?n.splice(a,1,u):n.push(u)},unmounted(e){T.delete(e)}};export{Rt as C,Lt as E,zt as a,kt as b,_t as c,Ht as d,Pt as e,rt as f,tt as g,Ot as i,Ct as k};