import{b as Q,aQ as U,j as b,l as $,m as q,o as G,c as j,y as K,a6 as X,v as V,u as Z,z as J,H as Y,K as ee,r as f,bL as te,w as g,az as ne,ay as M,bp as se,bq as oe}from"./entry.db26d00d.js";import{a as re}from"./el-button.8bc36cb1.js";const ce=Q({type:{type:String,values:["primary","success","info","warning","danger",""],default:""},size:{type:String,values:U,default:""},truncated:{type:Boolean},tag:{type:String,default:"span"}}),ae=b({name:"ElText"}),ie=b({...ae,props:ce,setup(e){const n=e,t=re(),c=$("text"),s=q(()=>[c.b(),c.m(n.type),c.m(t.value),c.is("truncated",n.truncated)]);return(r,a)=>(G(),j(J(r.tag),{class:V(Z(s))},{default:K(()=>[X(r.$slots,"default")]),_:3},8,["class"]))}});var le=Y(ie,[["__file","/home/runner/work/element-plus/element-plus/packages/components/text/src/text.vue"]]);const ke=ee(le);async function ue(){return await new Promise((e,n)=>{setTimeout(()=>{try{window.scrollTo(0,document.body.scrollHeight),e(null)}catch(t){n(t)}})})}const fe={get isMobileScreen(){return window.innerWidth<600},get isTouchScreen(){return"ontouchstart"in document||navigator.maxTouchPoints>0}};function C(){return fe}const _="web-browsing",y="temperature-suffix",k=e=>(e==null?void 0:e.toString)===void 0?"":e.toString(),pe=e=>k(e).toLowerCase(),H="01",I="0123456789",P="0123456789abcdef",R="0123456789abcdefghijklmnopqrstuvwxyz",z="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",D="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",v=e=>{switch(typeof e!="string"&&(e=pe(e)),e){case"2":return H;case"10":return I;case"16":return P;case"36":return R;case"62":return z;case"64":return h;case"64w":case"64+":return D;default:return e}},he=(e,n,t,c=0)=>{typeof e!="string"&&(e=k(e));let s=0;if(+n==10)s=+Number(e);else if(+n<37)s=parseInt(e,+n);else{n=v(n);const a=n.length;for(let i=0;i<e.length;i++)s+=n.indexOf(e[i])*Math.pow(a,e.length-1-i)}let r="";if(+t<37&&(r=s.toString(+t),c<=1))return r;if(t=v(t),r===""){const a=t.length;for(;s>0;)r=t.charAt(s%a)+r,s=Math.floor(s/a)}return(r===""?t.charAt(0):r).padStart(c,t[0])},de=e=>{const n=e.split("").map(r=>r.charCodeAt(0)),t=[];let c=0;for(;c<n.length;){const[r,a=0,i=0]=n.slice(c,c+=3),l=(r<<16)+(a<<8)+i,d=l>>18,o=l>>12&63,u=l>>6&63,S=l&63;t.push(h[d],h[o],h[u],h[S])}const s=n.length%3;return t.join("").slice(0,1+t.length-s)+(s===2?"==":s===1?"=":"")},ge=/[^A-Za-z0-9+/]/g,F=e=>e.replace(ge,""),w=e=>String.fromCharCode(+e),me=e=>{const n=F(e).split(""),t=[];let c=0;for(;c<n.length;){const[s,r,a,i]=n.slice(c,c+=4).map(l=>h.indexOf(l));t.push(w(s<<2|r>>4)),a!==64&&t.push(w((r&15)<<4|a>>2)),i!==64&&t.push(w((a&3)<<6|i))}return t.join("").replaceAll("\0","")},Se={BASE2_CHARSET:H,BASE10_CHARSET:I,BASE16_CHARSET:P,BASE36_CHARSET:R,BASE62_CHARSET:z,BASE64_CHARSET:h,BASE64WEB_CHARSET:D,convert:he,getCharset:v,secureBase64:F,textToBase64:de,base64ToText:me},we=2048,p=[],O=()=>{for(;p.length>1&&p.slice(1,p.length).join("").length>we;)p.shift()},Te=()=>{if(!L.value)return"";O();const e=p.join(`
---
`);return e.length===0?"":`Conversation history
===
${e}`},xe=(e="",n="",t=!0)=>{p.push(`Question: ${e}
Answer: ${n}`),t&&O()},ve=()=>{p.splice(0,p.length)},Ae=["OFF","BASIC","ADVANCED"],Ee="OFF",T=f(Ee),A=f([]),E=f([]),m={add:xe,get:Te,clear:ve},Ce=f(""),_e=()=>{document.querySelector(".InputBox textarea").focus()},N=()=>new Promise((e,n)=>{$fetch("/api/token/check",{method:"POST"}).then(t=>{const{list:c,named:s}=t;E.value=c.sort().map(r=>({id:r,name:s[r]})),e(!0)}).catch(t=>{M.error("Initialization Failed"),n(t)})}),ye=e=>new Promise((n,t)=>{const c=Se.convert(e,"64w",10);if(Ce.value=c,e==null)return m.clear(),n(!0);$fetch("/api/history",{method:"POST",body:{id:e}}).then(s=>{const r=s;r.length===0&&oe("/c/");const a=[];for(const i of r){const{Q:l,A:d,t:o}=i,u=new Date(o);a.push({type:"Q",text:l,t:u},{type:"A",text:d,t:u}),m.add(l,d,!1)}A.value.unshift(...a),n(!0)}).catch(s=>{M.error("There was an error loading the conversation."),t(s)})}),B=(e,n=!1)=>{if(!n){m.clear();const t=se.service();Promise.all([e===null?null:N(),ye(e)]).finally(()=>{ue(),t!==null&&setTimeout(()=>{t.close()},500)})}},Be="_t05",x=f(Be),L=f(!0);function He(){const e=te(),n=e.get(_);Ae.includes(n)&&(T.value=n);const t=e.get(y)||"";/_t(?:0[0-9]|10)/.test(t)&&(x.value=t),g(T,o=>{typeof o=="string"&&e.set(_,o,{path:"/"})}),g(x,o=>{e.set(y,o,{path:"/"})});const c=ne(),s=()=>{var o,u;return(u=(o=c._route)==null?void 0:o.params)==null?void 0:u.conv},r=()=>{const o=s();return E.value.filter(u=>u.id===o)[0].name||""},a=f(!1),i=f(!1),l=f(!1);return g(a,o=>{C().isMobileScreen?(i.value=!1,l.value!==o&&(l.value=o)):(l.value=!1,i.value!==o&&(i.value=o))}),g(l,o=>{a.value=o}),g(i,o=>{a.value=o}),a.value=!0,{conversations:E,messages:A,context:m,webBrowsingMode:T,temperatureSuffix:x,contextMode:L,openMenu:a,openSidebar:i,openDrawer:l,getCurrentConvId:s,getCurrentConvName:r,checkTokenAndGetConversations:N,initPage:B,goToChat:(o,u=!1,S=!1)=>{const W=s();(u||W!==o||o===null)&&(A.value=[],B(o,S)),C().isMobileScreen&&(a.value=!1),_e()}}}export{ke as E,ue as a,Se as b,k as s,He as u};