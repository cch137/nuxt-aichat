import{bm as Ie,aa as f,am as ze,bO as De,r as F,a7 as X,h as G,ad as Ke,a4 as xe,a2 as je,aj as te,ai as Ue,a3 as ae,aL as we,cu as We,f as ke,cv as Ye,ar as Xe,a6 as Se,bG as Ge,cw as Je,cx as Ze,bb as qe,an as T,ac as Qe,bp as et,H as tt,J as at,o as m,c as S,v as h,F as oe,S as b,j as t,af as U,a as V,m as C,w as A,au as W,B as M,ay as ne,b as ot,bw as nt,as as st,bT as lt,t as Y,n as rt,ag as it,ap as Ee,ah as ut}from"./entry.ba7d954e.js";import{a as ct,c as dt,b as pt,u as ft}from"./use-form-item.4e7a4467.js";const vt=()=>Ie&&/firefox/i.test(window.navigator.userAgent);function mt(o){return o==null}class ht extends Error{constructor(c){super(c),this.name="ElementPlusError"}}function Mt(o,c){throw new ht(`[${o}] ${c}`)}function Ht(o,c){}const se="update:modelValue",Lt="change",Ot="input",yt=o=>/([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(o),bt=["class","style"],gt=/^on[A-Z]/,xt=(o={})=>{const{excludeListeners:c=!1,excludeKeys:i}=o,a=f(()=>((i==null?void 0:i.value)||[]).concat(bt)),r=ze();return r?f(()=>{var l;return De(Object.entries((l=r.proxy)==null?void 0:l.$attrs).filter(([u])=>!a.value.includes(u)&&!(c&&gt.test(u))))}):f(()=>({}))};function wt(o){const c=F();function i(){if(o.value==null)return;const{selectionStart:r,selectionEnd:l,value:u}=o.value;if(r==null||l==null)return;const x=u.slice(0,Math.max(0,r)),d=u.slice(Math.max(0,l));c.value={selectionStart:r,selectionEnd:l,value:u,beforeTxt:x,afterTxt:d}}function a(){if(o.value==null||c.value==null)return;const{value:r}=o.value,{beforeTxt:l,afterTxt:u,selectionStart:x}=c.value;if(l==null||u==null||x==null)return;let d=r.length;if(r.endsWith(u))d=r.length-u.length;else if(r.startsWith(l))d=l.length;else{const g=l[x-1],v=r.indexOf(g,x-1);v!==-1&&(d=v+1)}o.value.setSelectionRange(d,d)}return[i,a]}function St(o,{afterFocus:c,afterBlur:i}={}){const a=ze(),{emit:r}=a,l=X(),u=F(!1),x=v=>{u.value||(u.value=!0,r("focus",v),c==null||c())},d=v=>{var p;v.relatedTarget&&((p=l.value)!=null&&p.contains(v.relatedTarget))||(u.value=!1,r("blur",v),i==null||i())},g=()=>{var v;(v=o.value)==null||v.focus()};return G(l,v=>{v&&v.setAttribute("tabindex","-1")}),Ke(l,"click",g),{wrapperRef:l,isFocused:u,handleFocus:x,handleBlur:d}}let w;const Et=`
  height:0 !important;
  visibility:hidden !important;
  ${vt()?"":"overflow:hidden !important;"}
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`,Ct=["letter-spacing","line-height","padding-top","padding-bottom","font-family","font-weight","font-size","text-rendering","text-transform","width","text-indent","padding-left","padding-right","border-width","box-sizing"];function It(o){const c=window.getComputedStyle(o),i=c.getPropertyValue("box-sizing"),a=Number.parseFloat(c.getPropertyValue("padding-bottom"))+Number.parseFloat(c.getPropertyValue("padding-top")),r=Number.parseFloat(c.getPropertyValue("border-bottom-width"))+Number.parseFloat(c.getPropertyValue("border-top-width"));return{contextStyle:Ct.map(u=>`${u}:${c.getPropertyValue(u)}`).join(";"),paddingSize:a,borderSize:r,boxSizing:i}}function Ce(o,c=1,i){var a;w||(w=document.createElement("textarea"),document.body.appendChild(w));const{paddingSize:r,borderSize:l,boxSizing:u,contextStyle:x}=It(o);w.setAttribute("style",`${x};${Et}`),w.value=o.value||o.placeholder||"";let d=w.scrollHeight;const g={};u==="border-box"?d=d+l:u==="content-box"&&(d=d-r),w.value="";const v=w.scrollHeight-r;if(xe(c)){let p=v*c;u==="border-box"&&(p=p+r+l),d=Math.max(p,d),g.minHeight=`${p}px`}if(xe(i)){let p=v*i;u==="border-box"&&(p=p+r+l),d=Math.min(p,d)}return g.height=`${d}px`,(a=w.parentNode)==null||a.removeChild(w),w=void 0,g}const zt=je({id:{type:String,default:void 0},size:Ue,disabled:Boolean,modelValue:{type:ae([String,Number,Object]),default:""},type:{type:String,default:"text"},resize:{type:String,values:["none","both","horizontal","vertical"]},autosize:{type:ae([Boolean,Object]),default:!1},autocomplete:{type:String,default:"off"},formatter:{type:Function},parser:{type:Function},placeholder:{type:String},form:{type:String},readonly:{type:Boolean,default:!1},clearable:{type:Boolean,default:!1},showPassword:{type:Boolean,default:!1},showWordLimit:{type:Boolean,default:!1},suffixIcon:{type:we},prefixIcon:{type:we},containerRole:{type:String,default:void 0},label:{type:String,default:void 0},tabindex:{type:[String,Number],default:0},validateEvent:{type:Boolean,default:!0},inputStyle:{type:ae([Object,Array,String]),default:()=>We({})}}),kt={[se]:o=>te(o),input:o=>te(o),change:o=>te(o),focus:o=>o instanceof FocusEvent,blur:o=>o instanceof FocusEvent,clear:()=>!0,mouseleave:o=>o instanceof MouseEvent,mouseenter:o=>o instanceof MouseEvent,keydown:o=>o instanceof Event,compositionstart:o=>o instanceof CompositionEvent,compositionupdate:o=>o instanceof CompositionEvent,compositionend:o=>o instanceof CompositionEvent},Pt=["role"],Tt=["id","type","disabled","formatter","parser","readonly","autocomplete","tabindex","aria-label","placeholder","form"],Vt=["id","tabindex","disabled","readonly","autocomplete","aria-label","placeholder","form"],Ft=ke({name:"ElInput",inheritAttrs:!1}),Nt=ke({...Ft,props:zt,emits:kt,setup(o,{expose:c,emit:i}){const a=o,r=Ye(),l=Xe(),u=f(()=>{const e={};return a.containerRole==="combobox"&&(e["aria-haspopup"]=r["aria-haspopup"],e["aria-owns"]=r["aria-owns"],e["aria-expanded"]=r["aria-expanded"]),e}),x=f(()=>[a.type==="textarea"?re.b():s.b(),s.m(Pe.value),s.is("disabled",z.value),s.is("exceed",Ne.value),{[s.b("group")]:l.prepend||l.append,[s.bm("group","append")]:l.append,[s.bm("group","prepend")]:l.prepend,[s.m("prefix")]:l.prefix||a.prefixIcon,[s.m("suffix")]:l.suffix||a.suffixIcon||a.clearable||a.showPassword,[s.bm("suffix","password-clear")]:K.value&&q.value},r.class]),d=f(()=>[s.e("wrapper"),s.is("focus",Z.value)]),g=xt({excludeKeys:f(()=>Object.keys(u.value))}),{form:v,formItem:p}=ct(),{inputId:le}=dt(a,{formItemContext:p}),Pe=pt(),z=ft(),s=Se("input"),re=Se("textarea"),H=X(),E=X(),J=F(!1),N=F(!1),L=F(!1),ie=F(),O=X(a.inputStyle),k=f(()=>H.value||E.value),{wrapperRef:Te,isFocused:Z,handleFocus:_,handleBlur:D}=St(k,{afterBlur(){var e;a.validateEvent&&((e=p==null?void 0:p.validate)==null||e.call(p,"blur").catch(n=>void 0))}}),ue=f(()=>{var e;return(e=v==null?void 0:v.statusIcon)!=null?e:!1}),R=f(()=>(p==null?void 0:p.validateState)||""),ce=f(()=>R.value&&Ge[R.value]),Ve=f(()=>L.value?Je:Ze),Fe=f(()=>[r.style,a.inputStyle]),de=f(()=>[a.inputStyle,O.value,{resize:a.resize}]),I=f(()=>mt(a.modelValue)?"":String(a.modelValue)),K=f(()=>a.clearable&&!z.value&&!a.readonly&&!!I.value&&(Z.value||J.value)),q=f(()=>a.showPassword&&!z.value&&!a.readonly&&!!I.value&&(!!I.value||Z.value)),P=f(()=>a.showWordLimit&&!!g.value.maxlength&&(a.type==="text"||a.type==="textarea")&&!z.value&&!a.readonly&&!a.showPassword),Q=f(()=>I.value.length),Ne=f(()=>!!P.value&&Q.value>Number(g.value.maxlength)),Re=f(()=>!!l.suffix||!!a.suffixIcon||K.value||a.showPassword||P.value||!!R.value&&ue.value),[$e,Be]=wt(H);qe(E,e=>{if(Ae(),!P.value||a.resize!=="both")return;const n=e[0],{width:y}=n.contentRect;ie.value={right:`calc(100% - ${y+15+6}px)`}});const $=()=>{const{type:e,autosize:n}=a;if(!(!Ie||e!=="textarea"||!E.value))if(n){const y=Ee(n)?n.minRows:void 0,j=Ee(n)?n.maxRows:void 0,ge=Ce(E.value,y,j);O.value={overflowY:"hidden",...ge},T(()=>{E.value.offsetHeight,O.value=ge})}else O.value={minHeight:Ce(E.value).minHeight}},Ae=(e=>{let n=!1;return()=>{var y;if(n||!a.autosize)return;((y=E.value)==null?void 0:y.offsetParent)===null||(e(),n=!0)}})($),B=()=>{const e=k.value,n=a.formatter?a.formatter(I.value):I.value;!e||e.value===n||(e.value=n)},ee=async e=>{$e();let{value:n}=e.target;if(a.formatter&&(n=a.parser?a.parser(n):n),!N.value){if(n===I.value){B();return}i(se,n),i("input",n),await T(),B(),Be()}},pe=e=>{i("change",e.target.value)},fe=e=>{i("compositionstart",e),N.value=!0},ve=e=>{var n;i("compositionupdate",e);const y=(n=e.target)==null?void 0:n.value,j=y[y.length-1]||"";N.value=!yt(j)},me=e=>{i("compositionend",e),N.value&&(N.value=!1,ee(e))},Me=()=>{L.value=!L.value,he()},he=async()=>{var e;await T(),(e=k.value)==null||e.focus()},He=()=>{var e;return(e=k.value)==null?void 0:e.blur()},Le=e=>{J.value=!1,i("mouseleave",e)},Oe=e=>{J.value=!0,i("mouseenter",e)},ye=e=>{i("keydown",e)},_e=()=>{var e;(e=k.value)==null||e.select()},be=()=>{i(se,""),i("change",""),i("clear"),i("input","")};return G(()=>a.modelValue,()=>{var e;T(()=>$()),a.validateEvent&&((e=p==null?void 0:p.validate)==null||e.call(p,"change").catch(n=>void 0))}),G(I,()=>B()),G(()=>a.type,async()=>{await T(),B(),$()}),Qe(()=>{!a.formatter&&a.parser,B(),T($)}),c({input:H,textarea:E,ref:k,textareaStyle:de,autosize:et(a,"autosize"),focus:he,blur:He,select:_e,clear:be,resizeTextarea:$}),(e,n)=>tt((m(),S("div",ne(t(u),{class:t(x),style:t(Fe),role:e.containerRole,onMouseenter:Oe,onMouseleave:Le}),[h(" input "),e.type!=="textarea"?(m(),S(oe,{key:0},[h(" prepend slot "),e.$slots.prepend?(m(),S("div",{key:0,class:b(t(s).be("group","prepend"))},[U(e.$slots,"prepend")],2)):h("v-if",!0),V("div",{ref_key:"wrapperRef",ref:Te,class:b(t(d))},[h(" prefix slot "),e.$slots.prefix||e.prefixIcon?(m(),S("span",{key:0,class:b(t(s).e("prefix"))},[V("span",{class:b(t(s).e("prefix-inner"))},[U(e.$slots,"prefix"),e.prefixIcon?(m(),C(t(M),{key:0,class:b(t(s).e("icon"))},{default:A(()=>[(m(),C(W(e.prefixIcon)))]),_:1},8,["class"])):h("v-if",!0)],2)],2)):h("v-if",!0),V("input",ne({id:t(le),ref_key:"input",ref:H,class:t(s).e("inner")},t(g),{type:e.showPassword?L.value?"text":"password":e.type,disabled:t(z),formatter:e.formatter,parser:e.parser,readonly:e.readonly,autocomplete:e.autocomplete,tabindex:e.tabindex,"aria-label":e.label,placeholder:e.placeholder,style:e.inputStyle,form:a.form,onCompositionstart:fe,onCompositionupdate:ve,onCompositionend:me,onInput:ee,onFocus:n[0]||(n[0]=(...y)=>t(_)&&t(_)(...y)),onBlur:n[1]||(n[1]=(...y)=>t(D)&&t(D)(...y)),onChange:pe,onKeydown:ye}),null,16,Tt),h(" suffix slot "),t(Re)?(m(),S("span",{key:1,class:b(t(s).e("suffix"))},[V("span",{class:b(t(s).e("suffix-inner"))},[!t(K)||!t(q)||!t(P)?(m(),S(oe,{key:0},[U(e.$slots,"suffix"),e.suffixIcon?(m(),C(t(M),{key:0,class:b(t(s).e("icon"))},{default:A(()=>[(m(),C(W(e.suffixIcon)))]),_:1},8,["class"])):h("v-if",!0)],64)):h("v-if",!0),t(K)?(m(),C(t(M),{key:1,class:b([t(s).e("icon"),t(s).e("clear")]),onMousedown:st(t(lt),["prevent"]),onClick:be},{default:A(()=>[ot(t(nt))]),_:1},8,["class","onMousedown"])):h("v-if",!0),t(q)?(m(),C(t(M),{key:2,class:b([t(s).e("icon"),t(s).e("password")]),onClick:Me},{default:A(()=>[(m(),C(W(t(Ve))))]),_:1},8,["class"])):h("v-if",!0),t(P)?(m(),S("span",{key:3,class:b(t(s).e("count"))},[V("span",{class:b(t(s).e("count-inner"))},Y(t(Q))+" / "+Y(t(g).maxlength),3)],2)):h("v-if",!0),t(R)&&t(ce)&&t(ue)?(m(),C(t(M),{key:4,class:b([t(s).e("icon"),t(s).e("validateIcon"),t(s).is("loading",t(R)==="validating")])},{default:A(()=>[(m(),C(W(t(ce))))]),_:1},8,["class"])):h("v-if",!0)],2)],2)):h("v-if",!0)],2),h(" append slot "),e.$slots.append?(m(),S("div",{key:1,class:b(t(s).be("group","append"))},[U(e.$slots,"append")],2)):h("v-if",!0)],64)):(m(),S(oe,{key:1},[h(" textarea "),V("textarea",ne({id:t(le),ref_key:"textarea",ref:E,class:t(re).e("inner")},t(g),{tabindex:e.tabindex,disabled:t(z),readonly:e.readonly,autocomplete:e.autocomplete,style:t(de),"aria-label":e.label,placeholder:e.placeholder,form:a.form,onCompositionstart:fe,onCompositionupdate:ve,onCompositionend:me,onInput:ee,onFocus:n[2]||(n[2]=(...y)=>t(_)&&t(_)(...y)),onBlur:n[3]||(n[3]=(...y)=>t(D)&&t(D)(...y)),onChange:pe,onKeydown:ye}),null,16,Vt),t(P)?(m(),S("span",{key:0,style:rt(ie.value),class:b(t(s).e("count"))},Y(t(Q))+" / "+Y(t(g).maxlength),7)):h("v-if",!0)],64))],16,Pt)),[[at,e.type!=="hidden"]])}});var Rt=it(Nt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/input/src/input.vue"]]);const _t=ut(Rt);export{Lt as C,_t as E,Ot as I,se as U,yt as a,Ht as d,mt as i,Mt as t};