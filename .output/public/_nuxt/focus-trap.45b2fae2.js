import{bv as te,ab as R,$,ay as k,b2 as G,r as _,a0 as ne,f as se,aq as oe,h as w,k as T,ar as ce,Z as B,az as re}from"./entry.60a981b0.js";import{i as ae}from"./el-input.27303907.js";const he=e=>["",...te].includes(e);let p=[];const q=e=>{const n=e;n.key===G.esc&&p.forEach(s=>s(n))},ue=e=>{R(()=>{p.length===0&&document.addEventListener("keydown",q),$&&p.push(e)}),k(()=>{p=p.filter(n=>n!==e),p.length===0&&$&&document.removeEventListener("keydown",q)})},O="focus-trap.focus-after-trapped",g="focus-trap.focus-after-released",ie="focus-trap.focusout-prevented",z={cancelable:!0,bubbles:!1},de={cancelable:!0,bubbles:!1},M="focusAfterTrapped",j="focusAfterReleased",fe=Symbol("elFocusTrap"),N=_(),S=_(0),I=_(0);let F=0;const Q=e=>{const n=[],s=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:o=>{const r=o.tagName==="INPUT"&&o.type==="hidden";return o.disabled||o.hidden||r?NodeFilter.FILTER_SKIP:o.tabIndex>=0||o===document.activeElement?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;s.nextNode();)n.push(s.currentNode);return n},W=(e,n)=>{for(const s of e)if(!le(s,n))return s},le=(e,n)=>{if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(n&&e===n)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1},ve=e=>{const n=Q(e),s=W(n,e),o=W(n.reverse(),e);return[s,o]},pe=e=>e instanceof HTMLInputElement&&"select"in e,l=(e,n)=>{if(e&&e.focus){const s=document.activeElement;e.focus({preventScroll:!0}),I.value=window.performance.now(),e!==s&&pe(e)&&n&&e.select()}};function J(e,n){const s=[...e],o=e.indexOf(n);return o!==-1&&s.splice(o,1),s}const Ee=()=>{let e=[];return{push:o=>{const r=e[0];r&&o!==r&&r.pause(),e=J(e,o),e.unshift(o)},remove:o=>{var r,d;e=J(e,o),(d=(r=e[0])==null?void 0:r.resume)==null||d.call(r)}}},me=(e,n=!1)=>{const s=document.activeElement;for(const o of e)if(l(o,n),document.activeElement!==s)return},Y=Ee(),Te=()=>S.value>I.value,b=()=>{N.value="pointer",S.value=window.performance.now()},Z=()=>{N.value="keyboard",S.value=window.performance.now()},Fe=()=>(R(()=>{F===0&&(document.addEventListener("mousedown",b),document.addEventListener("touchstart",b),document.addEventListener("keydown",Z)),F++}),k(()=>{F--,F<=0&&(document.removeEventListener("mousedown",b),document.removeEventListener("touchstart",b),document.removeEventListener("keydown",Z))}),{focusReason:N,lastUserFocusTimestamp:S,lastAutomatedFocusTimestamp:I}),y=e=>new CustomEvent(ie,{...de,detail:e}),be=se({name:"ElFocusTrap",inheritAttrs:!1,props:{loop:Boolean,trapped:Boolean,focusTrapEl:Object,focusStartEl:{type:[Object,String],default:"first"}},emits:[M,j,"focusin","focusout","focusout-prevented","release-requested"],setup(e,{emit:n}){const s=_();let o,r;const{focusReason:d}=Fe();ue(t=>{e.trapped&&!v.paused&&n("release-requested",t)});const v={paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}},E=t=>{if(!e.loop&&!e.trapped||v.paused)return;const{key:c,altKey:a,ctrlKey:u,metaKey:i,currentTarget:V,shiftKey:x}=t,{loop:H}=e,ee=c===G.tab&&!a&&!u&&!i,m=document.activeElement;if(ee&&m){const h=V,[C,L]=ve(h);if(C&&L){if(!x&&m===L){const f=y({focusReason:d.value});n("focusout-prevented",f),f.defaultPrevented||(t.preventDefault(),H&&l(C,!0))}else if(x&&[C,h].includes(m)){const f=y({focusReason:d.value});n("focusout-prevented",f),f.defaultPrevented||(t.preventDefault(),H&&l(L,!0))}}else if(m===h){const f=y({focusReason:d.value});n("focusout-prevented",f),f.defaultPrevented||t.preventDefault()}}};oe(fe,{focusTrapRef:s,onKeydown:E}),w(()=>e.focusTrapEl,t=>{t&&(s.value=t)},{immediate:!0}),w([s],([t],[c])=>{t&&(t.addEventListener("keydown",E),t.addEventListener("focusin",A),t.addEventListener("focusout",U)),c&&(c.removeEventListener("keydown",E),c.removeEventListener("focusin",A),c.removeEventListener("focusout",U))});const P=t=>{n(M,t)},X=t=>n(j,t),A=t=>{const c=T(s);if(!c)return;const a=t.target,u=t.relatedTarget,i=a&&c.contains(a);e.trapped||u&&c.contains(u)||(o=u),i&&n("focusin",t),!v.paused&&e.trapped&&(i?r=a:l(r,!0))},U=t=>{const c=T(s);if(!(v.paused||!c))if(e.trapped){const a=t.relatedTarget;!ae(a)&&!c.contains(a)&&setTimeout(()=>{if(!v.paused&&e.trapped){const u=y({focusReason:d.value});n("focusout-prevented",u),u.defaultPrevented||l(r,!0)}},0)}else{const a=t.target;a&&c.contains(a)||n("focusout",t)}};async function K(){await B();const t=T(s);if(t){Y.push(v);const c=t.contains(document.activeElement)?o:document.activeElement;if(o=c,!t.contains(c)){const u=new Event(O,z);t.addEventListener(O,P),t.dispatchEvent(u),u.defaultPrevented||B(()=>{let i=e.focusStartEl;re(i)||(l(i),document.activeElement!==i&&(i="first")),i==="first"&&me(Q(t),!0),(document.activeElement===c||i==="container")&&l(t)})}}}function D(){const t=T(s);if(t){t.removeEventListener(O,P);const c=new CustomEvent(g,{...z,detail:{focusReason:d.value}});t.addEventListener(g,X),t.dispatchEvent(c),!c.defaultPrevented&&(d.value=="keyboard"||!Te()||t.contains(document.activeElement))&&l(o??document.body),t.removeEventListener(g,P),Y.remove(v)}}return R(()=>{e.trapped&&K(),w(()=>e.trapped,t=>{t?K():D()})}),k(()=>{e.trapped&&D()}),{onKeydown:E}}});function ye(e,n,s,o,r,d){return ce(e.$slots,"default",{handleKeydown:e.onKeydown})}var Ce=ne(be,[["render",ye],["__file","/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);export{Ce as E,fe as F,he as i};