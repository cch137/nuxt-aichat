import{b as L,aW as W,j as B,l as U,m as G,o as j,c as q,y as K,a5 as Q,v as X,u as $,z as V,H as Z,K as J,r as f,bI as Y,w as A,ay as tt,L as et,ax as y,bE as nt,bF as st}from"./entry.fd8f04cd.js";import{a as ot}from"./el-button.493ffc8f.js";const rt=L({type:{type:String,values:["primary","success","info","warning","danger",""],default:""},size:{type:String,values:W,default:""},truncated:{type:Boolean},tag:{type:String,default:"span"}}),ct=B({name:"ElText"}),at=B({...ct,props:rt,setup(t){const n=t,e=ot(),c=U("text"),r=G(()=>[c.b(),c.m(n.type),c.m(e.value),c.is("truncated",n.truncated)]);return(s,a)=>(j(),q(V(s.tag),{class:X($(r))},{default:K(()=>[Q(s.$slots,"default")]),_:3},8,["class"]))}});var it=Z(at,[["__file","/home/runner/work/element-plus/element-plus/packages/components/text/src/text.vue"]]);const bt=J(it);function lt(){setTimeout(()=>{window.scrollTo(0,document.body.scrollHeight)})}const E="web-browsing",ut="temperature-suffix",v=t=>(t==null?void 0:t.toString)===void 0?"":t.toString(),pt=t=>v(t).toLowerCase(),b="01",I="0123456789",k="0123456789abcdef",H="0123456789abcdefghijklmnopqrstuvwxyz",R="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",D="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",S=t=>{switch(typeof t!="string"&&(t=pt(t)),t){case"2":return b;case"10":return I;case"16":return k;case"36":return H;case"62":return R;case"64":return u;case"64w":case"64+":return D;default:return t}},ft=(t,n,e,c=0)=>{typeof t!="string"&&(t=v(t));let r=0;if(+n==10)r=+Number(t);else if(+n<37)r=parseInt(t,+n);else{n=S(n);const a=n.length;for(let o=0;o<t.length;o++)r+=n.indexOf(t[o])*Math.pow(a,t.length-1-o)}let s="";if(+e<37&&(s=r.toString(+e),c<=1))return s;if(e=S(e),s===""){const a=e.length;for(;r>0;)s=e.charAt(r%a)+s,r=Math.floor(r/a)}return(s===""?e.charAt(0):s).padStart(c,e[0])},ht=t=>{const n=t.split("").map(s=>s.charCodeAt(0)),e=[];let c=0;for(;c<n.length;){const[s,a=0,o=0]=n.slice(c,c+=3),i=(s<<16)+(a<<8)+o,p=i>>18,h=i>>12&63,d=i>>6&63,O=i&63;e.push(u[p],u[h],u[d],u[O])}const r=n.length%3;return e.join("").slice(0,1+e.length-r)+(r===2?"==":r===1?"=":"")},dt=/[^A-Za-z0-9+/]/g,M=t=>t.replace(dt,""),g=t=>String.fromCharCode(+t),gt=t=>{const n=M(t).split(""),e=[];let c=0;for(;c<n.length;){const[r,s,a,o]=n.slice(c,c+=4).map(i=>u.indexOf(i));e.push(g(r<<2|s>>4)),a!==64&&e.push(g((s&15)<<4|a>>2)),o!==64&&e.push(g((a&3)<<6|o))}return e.join("").replaceAll("\0","")},mt={BASE2_CHARSET:b,BASE10_CHARSET:I,BASE16_CHARSET:k,BASE36_CHARSET:H,BASE62_CHARSET:R,BASE64_CHARSET:u,BASE64WEB_CHARSET:D,convert:ft,getCharset:S,secureBase64:M,textToBase64:ht,base64ToText:gt},z=2048,l=[],P=()=>{for(;l.length>1&&l.slice(1,l.length).join("").length>z;)l.shift()},St=()=>{if(!N.value)return"";P();const t=[...l].reverse().join(`
---
`);return t.length===0?"":`Here are your replies, from newest to oldest:
${t}`.substring(0,z)},wt=(...t)=>{l.push(...t),P()},Tt=()=>{l.splice(0,l.length)},xt=["OFF","BASIC","ADVANCED"],At="BASIC",m=f(At),w=f([]),T=f([]),x={add:wt,get:St,clear:Tt},Et=f(""),Ct=()=>{document.querySelector(".InputBox textarea").focus()},F=()=>new Promise((t,n)=>{$fetch("/api/token/check",{method:"POST"}).then(e=>{const{list:c,named:r}=e;T.value=c.sort().map(s=>({id:s,name:r[s]})),t(!0)}).catch(e=>{y.error("Initialization Failed"),n(e)})}),_t=t=>new Promise((n,e)=>{const c=mt.convert(t,"64w",10);if(Et.value=c,t==null)return x.clear(),n(!0);$fetch("/api/history",{method:"POST",body:{id:t}}).then(r=>{const s=r;s.length===0&&st("/c/");const a=[];x.add(...s.map(o=>{const{Q:i,A:p,t:h}=o,d=new Date(h);return a.push({type:"Q",text:i,t:d},{type:"A",text:p,t:d}),p})),w.value.unshift(...a),n(!0)}).catch(r=>{y.error("There was an error loading the conversation."),e(r)})}),C=(t,n=!1)=>{if(!n){const e=nt.service();Promise.all([t===null?null:F(),_t(t)]).finally(()=>{lt(),e!==null&&setTimeout(()=>{e.close()},500)})}},Bt="_t05",_=f(Bt),N=f(!0);function It(){const t=Y(),n=t.get(E);xt.includes(n)&&(m.value=n),A(m,o=>{typeof o=="string"&&t.set(E,o,{path:"/"})}),A(_,o=>{t.set(ut,o,{path:"/"})});const e=tt(),c=()=>{var o,i;return(i=(o=e._route)==null?void 0:o.params)==null?void 0:i.conv},r=()=>{const o=c();return T.value.filter(i=>i.id===o)[0].name||""},s=et("openDrawer",()=>!1);return{conversations:T,messages:w,context:x,webBrowsingMode:m,temperatureSuffix:_,contextMode:N,getCurrentConvId:c,getCurrentConvName:r,checkTokenAndGetConversations:F,initPage:C,goToChat:(o,i=!1,p=!1)=>{const h=c();(i||h!==o||o===null)&&(w.value=[],C(o,p)),s.value=!1,Ct()}}}export{bt as E,lt as a,mt as b,v as s,It as u};