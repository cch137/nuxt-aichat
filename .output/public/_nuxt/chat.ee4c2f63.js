import{d as We,a as qe,u as Ye,E as Ee,b as Ie,_ as Ve,c as Se,e as Ge}from"./DefaultHeaderButtons.a2261b28.js";import{E as H}from"./el-button.fad26086.js";import{E as Ne}from"./el-text.837bb81d.js";import{b as Ze,a as Xe,E as et}from"./el-switch.f7b21545.js";import{aI as we,a2 as Me,ag as Ae,f as O,B as Q,aP as ye,aa as T,r as be,a6 as Be,aM as De,ab as tt,aH as ae,o as b,m as B,b as n,w as s,H as he,a,ay as nt,as as U,S as M,c as x,af as G,t as C,v as A,J as ot,aA as st,aQ as lt,ah as ze,ai as at,a4 as z,l as it,al as ie,h as rt,ac as ut,aJ as dt,j as t,aR as re,aS as ct,aT as pt,aU as _t,aV as Fe,aj as mt,F as ge,C as Te,k as L,_ as te,s as Le,d as $,aW as Ce,aX as fe,G as Oe,aY as Pe,i as ft,aZ as vt,a_ as bt,a$ as ht,q as yt,U as gt,aC as K,E as ue,p as Re,e as Ue,b0 as wt,n as X,b1 as He,b2 as Ct}from"./entry.ba7d954e.js";import{C as Ke,I as de,i as ee,U as Z,E as ce,t as $t,d as $e}from"./el-input.061f730f.js";import"./el-popper.010f9139.js";import{u as D,b as xt}from"./useChat.a71d49bd.js";import{E as kt}from"./el-popover.bf792b60.js";import{_ as pe}from"./client-only.bd7056b1.js";import{d as xe,a as Et,b as It,u as Vt}from"./use-form-item.4e7a4467.js";/* empty css                */import{a as Qe,E as St}from"./el-form.f1a14850.js";import{_ as Nt}from"./nuxt-link.d91d2a24.js";import{E as Mt}from"./el-link.85548223.js";import{a as At,E as ve}from"./el-overlay.0d7054d6.js";import{E as Bt}from"./focus-trap.5c77d484.js";import"./CommonSettings.c505cd82.js";import"./dropdown.65518fa1.js";import"./castArray.ae76fbff.js";import"./useAuth.69ec0df0.js";import"./scroll.765c600c.js";import"./isEqual.126f8112.js";import"./_Uint8Array.8669c32a.js";import"./useTitle.85d9b5f6.js";const Dt=100,zt=600,ke={beforeMount(e,i){const r=i.value,{interval:l=Dt,delay:m=zt}=we(r)?{}:r;let _,v;const u=()=>we(r)?r():r.handler(),f=()=>{v&&(clearTimeout(v),v=void 0),_&&(clearInterval(_),_=void 0)};e.addEventListener("mousedown",d=>{d.button===0&&(f(),u(),document.addEventListener("mouseup",()=>f(),{once:!0}),v=setTimeout(()=>{_=setInterval(()=>{u()},l)},m))})}},Ft=Me({...We,direction:{type:String,default:"rtl",values:["ltr","rtl","ttb","btt"]},size:{type:[String,Number],default:"30%"},withHeader:{type:Boolean,default:!0},modalFade:{type:Boolean,default:!0},headerAriaLevel:{type:String,default:"2"}}),Tt=qe,Lt=O({name:"ElDrawer",components:{ElOverlay:At,ElFocusTrap:Bt,ElIcon:Q,Close:ye},inheritAttrs:!1,props:Ft,emits:Tt,setup(e,{slots:i}){xe({scope:"el-drawer",from:"the title slot",replacement:"the header slot",version:"3.0.0",ref:"https://element-plus.org/en-US/component/drawer.html#slots"},T(()=>!!i.title)),xe({scope:"el-drawer",from:"custom-class",replacement:"class",version:"2.3.0",ref:"https://element-plus.org/en-US/component/drawer.html#attributes",type:"Attribute"},T(()=>!!e.customClass));const r=be(),l=be(),m=Be("drawer"),{t:_}=De(),v=T(()=>e.direction==="rtl"||e.direction==="ltr"),u=T(()=>tt(e.size));return{...Ye(e,r),drawerRef:r,focusStartRef:l,isHorizontal:v,drawerSize:u,ns:m,t:_}}}),Ot=["aria-label","aria-labelledby","aria-describedby"],Pt=["id","aria-level"],Rt=["aria-label"],Ut=["id"];function Ht(e,i,r,l,m,_){const v=ae("close"),u=ae("el-icon"),f=ae("el-focus-trap"),d=ae("el-overlay");return b(),B(lt,{to:"body",disabled:!e.appendToBody},[n(st,{name:e.ns.b("fade"),onAfterEnter:e.afterEnter,onAfterLeave:e.afterLeave,onBeforeLeave:e.beforeLeave,persisted:""},{default:s(()=>[he(n(d,{mask:e.modal,"overlay-class":e.modalClass,"z-index":e.zIndex,onClick:e.onModalClick},{default:s(()=>[n(f,{loop:"",trapped:e.visible,"focus-trap-el":e.drawerRef,"focus-start-el":e.focusStartRef,onReleaseRequested:e.onCloseRequested},{default:s(()=>[a("div",nt({ref:"drawerRef","aria-modal":"true","aria-label":e.title||void 0,"aria-labelledby":e.title?void 0:e.titleId,"aria-describedby":e.bodyId},e.$attrs,{class:[e.ns.b(),e.direction,e.visible&&"open",e.customClass],style:e.isHorizontal?"width: "+e.drawerSize:"height: "+e.drawerSize,role:"dialog",onClick:i[1]||(i[1]=U(()=>{},["stop"]))}),[a("span",{ref:"focusStartRef",class:M(e.ns.e("sr-focus")),tabindex:"-1"},null,2),e.withHeader?(b(),x("header",{key:0,class:M(e.ns.e("header"))},[e.$slots.title?G(e.$slots,"title",{key:1},()=>[A(" DEPRECATED SLOT ")]):G(e.$slots,"header",{key:0,close:e.handleClose,titleId:e.titleId,titleClass:e.ns.e("title")},()=>[e.$slots.title?A("v-if",!0):(b(),x("span",{key:0,id:e.titleId,role:"heading","aria-level":e.headerAriaLevel,class:M(e.ns.e("title"))},C(e.title),11,Pt))]),e.showClose?(b(),x("button",{key:2,"aria-label":e.t("el.drawer.close"),class:M(e.ns.e("close-btn")),type:"button",onClick:i[0]||(i[0]=(...c)=>e.handleClose&&e.handleClose(...c))},[n(u,{class:M(e.ns.e("close"))},{default:s(()=>[n(v)]),_:1},8,["class"])],10,Rt)):A("v-if",!0)],2)):A("v-if",!0),e.rendered?(b(),x("div",{key:1,id:e.bodyId,class:M(e.ns.e("body"))},[G(e.$slots,"default")],10,Ut)):A("v-if",!0),e.$slots.footer?(b(),x("div",{key:2,class:M(e.ns.e("footer"))},[G(e.$slots,"footer")],2)):A("v-if",!0)],16,Ot)]),_:3},8,["trapped","focus-trap-el","focus-start-el","onReleaseRequested"])]),_:3},8,["mask","overlay-class","z-index","onClick"]),[[ot,e.visible]])]),_:3},8,["name","onAfterEnter","onAfterLeave","onBeforeLeave"])],8,["disabled"])}var Kt=Ae(Lt,[["render",Ht],["__file","/home/runner/work/element-plus/element-plus/packages/components/drawer/src/drawer.vue"]]);const Qt=ze(Kt),jt=Me({id:{type:String,default:void 0},step:{type:Number,default:1},stepStrictly:Boolean,max:{type:Number,default:Number.POSITIVE_INFINITY},min:{type:Number,default:Number.NEGATIVE_INFINITY},modelValue:Number,readonly:Boolean,disabled:Boolean,size:at,controls:{type:Boolean,default:!0},controlsPosition:{type:String,default:"",values:["","right"]},valueOnClear:{type:[String,Number,null],validator:e=>e===null||z(e)||["min","max"].includes(e),default:null},name:String,label:String,placeholder:String,precision:{type:Number,validator:e=>e>=0&&e===Number.parseInt(`${e}`,10)},validateEvent:{type:Boolean,default:!0}}),Jt={[Ke]:(e,i)=>i!==e,blur:e=>e instanceof FocusEvent,focus:e=>e instanceof FocusEvent,[de]:e=>z(e)||ee(e),[Z]:e=>z(e)||ee(e)},Wt=["aria-label","onKeydown"],qt=["aria-label","onKeydown"],Yt=O({name:"ElInputNumber"}),Gt=O({...Yt,props:jt,emits:Jt,setup(e,{expose:i,emit:r}){const l=e,{t:m}=De(),_=Be("input-number"),v=be(),u=it({currentValue:l.modelValue,userInput:null}),{formItem:f}=Et(),d=T(()=>z(l.modelValue)&&l.modelValue<=l.min),c=T(()=>z(l.modelValue)&&l.modelValue>=l.max),h=T(()=>{const o=ne(l.step);return ie(l.precision)?Math.max(ne(l.modelValue),o):(o>l.precision,l.precision)}),y=T(()=>l.controls&&l.controlsPosition==="right"),S=It(),w=Vt(),k=T(()=>{if(u.userInput!==null)return u.userInput;let o=u.currentValue;if(ee(o))return"";if(z(o)){if(Number.isNaN(o))return"";ie(l.precision)||(o=o.toFixed(l.precision))}return o}),j=(o,p)=>{if(ie(p)&&(p=h.value),p===0)return Math.round(o);let g=String(o);const E=g.indexOf(".");if(E===-1||!g.replace(".","").split("")[E+p])return o;const se=g.length;return g.charAt(se-1)==="5"&&(g=`${g.slice(0,Math.max(0,se-1))}6`),Number.parseFloat(Number(g).toFixed(p))},ne=o=>{if(ee(o))return 0;const p=o.toString(),g=p.indexOf(".");let E=0;return g!==-1&&(E=p.length-g-1),E},oe=(o,p=1)=>z(o)?j(o+l.step*p):u.currentValue,J=()=>{if(l.readonly||w.value||c.value)return;const o=Number(k.value)||0,p=oe(o);R(p),r(de,u.currentValue)},W=()=>{if(l.readonly||w.value||d.value)return;const o=Number(k.value)||0,p=oe(o,-1);R(p),r(de,u.currentValue)},P=(o,p)=>{const{max:g,min:E,step:I,precision:F,stepStrictly:se,valueOnClear:le}=l;g<E&&$t("InputNumber","min should not be greater than max.");let N=Number(o);if(ee(o)||Number.isNaN(N))return null;if(o===""){if(le===null)return null;N=mt(le)?{min:E,max:g}[le]:le}return se&&(N=j(Math.round(N/I)*I,F)),ie(F)||(N=j(N,F)),(N>g||N<E)&&(N=N>g?g:E,p&&r(Z,N)),N},R=(o,p=!0)=>{var g;const E=u.currentValue,I=P(o);if(!p){r(Z,I);return}E!==I&&(u.userInput=null,r(Z,I),r(Ke,I,E),l.validateEvent&&((g=f==null?void 0:f.validate)==null||g.call(f,"change").catch(F=>$e())),u.currentValue=I)},_e=o=>{u.userInput=o;const p=o===""?null:Number(o);r(de,p),R(p,!1)},me=o=>{const p=o!==""?Number(o):"";(z(p)&&!Number.isNaN(p)||o==="")&&R(p),u.userInput=null},q=()=>{var o,p;(p=(o=v.value)==null?void 0:o.focus)==null||p.call(o)},V=()=>{var o,p;(p=(o=v.value)==null?void 0:o.blur)==null||p.call(o)},Y=o=>{r("focus",o)},Je=o=>{var p;r("blur",o),l.validateEvent&&((p=f==null?void 0:f.validate)==null||p.call(f,"blur").catch(g=>$e()))};return rt(()=>l.modelValue,o=>{const p=P(u.userInput),g=P(o,!0);!z(p)&&(!p||p!==g)&&(u.currentValue=g,u.userInput=null)},{immediate:!0}),ut(()=>{var o;const{min:p,max:g,modelValue:E}=l,I=(o=v.value)==null?void 0:o.input;if(I.setAttribute("role","spinbutton"),Number.isFinite(g)?I.setAttribute("aria-valuemax",String(g)):I.removeAttribute("aria-valuemax"),Number.isFinite(p)?I.setAttribute("aria-valuemin",String(p)):I.removeAttribute("aria-valuemin"),I.setAttribute("aria-valuenow",u.currentValue||u.currentValue===0?String(u.currentValue):""),I.setAttribute("aria-disabled",String(w.value)),!z(E)&&E!=null){let F=Number(E);Number.isNaN(F)&&(F=null),r(Z,F)}}),dt(()=>{var o,p;const g=(o=v.value)==null?void 0:o.input;g==null||g.setAttribute("aria-valuenow",`${(p=u.currentValue)!=null?p:""}`)}),i({focus:q,blur:V}),(o,p)=>(b(),x("div",{class:M([t(_).b(),t(_).m(t(S)),t(_).is("disabled",t(w)),t(_).is("without-controls",!o.controls),t(_).is("controls-right",t(y))]),onDragstart:p[1]||(p[1]=U(()=>{},["prevent"]))},[o.controls?he((b(),x("span",{key:0,role:"button","aria-label":t(m)("el.inputNumber.decrease"),class:M([t(_).e("decrease"),t(_).is("disabled",t(d))]),onKeydown:re(W,["enter"])},[n(t(Q),null,{default:s(()=>[t(y)?(b(),B(t(ct),{key:0})):(b(),B(t(pt),{key:1}))]),_:1})],42,Wt)),[[t(ke),W]]):A("v-if",!0),o.controls?he((b(),x("span",{key:1,role:"button","aria-label":t(m)("el.inputNumber.increase"),class:M([t(_).e("increase"),t(_).is("disabled",t(c))]),onKeydown:re(J,["enter"])},[n(t(Q),null,{default:s(()=>[t(y)?(b(),B(t(_t),{key:0})):(b(),B(t(Fe),{key:1}))]),_:1})],42,qt)),[[t(ke),J]]):A("v-if",!0),n(t(ce),{id:o.id,ref_key:"input",ref:v,type:"number",step:o.step,"model-value":t(k),placeholder:o.placeholder,readonly:o.readonly,disabled:t(w),size:t(S),max:o.max,min:o.min,name:o.name,label:o.label,"validate-event":!1,onWheel:p[0]||(p[0]=U(()=>{},["prevent"])),onKeydown:[re(U(J,["prevent"]),["up"]),re(U(W,["prevent"]),["down"])],onBlur:Je,onFocus:Y,onInput:_e,onChange:me},null,8,["id","step","model-value","placeholder","readonly","disabled","size","max","min","name","label","onKeydown"])],34))}});var Zt=Ae(Gt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/input-number/src/input-number.vue"]]);const Xt=ze(Zt),en=O({__name:"ModelSelect",setup(e){const{model:i,models:r}=D();return(l,m)=>{const _=Ze,v=Xe;return b(),x("div",null,[n(v,{modelValue:t(i),"onUpdate:modelValue":m[0]||(m[0]=u=>L(i)?i.value=u:null),placeholder:"Select model",class:"ChatbotModelSelect"},{default:s(()=>[(b(!0),x(ge,null,Te(t(r),u=>(b(),B(_,{key:u.name,label:u.name,value:u.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])}}}),tn={style:{"max-height":"32px"},class:"flex items-center"},nn=O({__name:"ContextSelect",setup(e){const{contextMode:i}=D();return(r,l)=>{const m=et;return b(),x("div",tn,[n(m,{modelValue:t(i),"onUpdate:modelValue":l[0]||(l[0]=_=>L(i)?i.value=_:null),size:"large",class:"cursor-pointer",width:"56"},null,8,["modelValue"])])}}});const on=O({__name:"TemperatureSelect",setup(e){const{temperature:i}=D();return(r,l)=>{const m=Xt;return b(),x("div",null,[n(m,{modelValue:t(i),"onUpdate:modelValue":l[0]||(l[0]=_=>L(i)?i.value=_:null),min:0,max:1,step:.1,style:{width:"100%"}},null,8,["modelValue"])])}}});const sn={class:"flex flex-col py-1 px-2 -m-2 -mx-3",style:{"margin-bottom":"-10px"}},ln={__name:"MoreActions",setup(e){const{refreshConversation:i,renameConversation:r,deleteConversation:l,resetConvConfig:m,exportAsMarkdown:_,exportAsJson:v,exportAsJsonDetailed:u}=D();return(f,d)=>{const c=Q,h=H,y=Ee,S=Ie,w=pe;return b(),B(w,null,{default:s(()=>[n(S,{trigger:"click",placement:"bottom"},{dropdown:s(()=>[n(y,{style:{overflow:"hidden"}},{default:s(()=>[a("div",sn,[a("div",null,[n(h,{class:"MoreOptionButton",icon:t(Le),onClick:d[0]||(d[0]=k=>t(r)())},{default:s(()=>[$(C(f.$t("action.renameConv")),1)]),_:1},8,["icon"])]),a("div",null,[n(h,{class:"MoreOptionButton",icon:t(Ce),onClick:d[1]||(d[1]=k=>t(m)(!0))},{default:s(()=>[$(C(f.$t("action.resetConv")),1)]),_:1},8,["icon"])]),a("div",null,[n(h,{class:"MoreOptionButton",icon:t(fe),onClick:d[2]||(d[2]=k=>t(_)())},{default:s(()=>[$(C(f.$t("action.exportAs"))+" .MD ",1)]),_:1},8,["icon"])]),a("div",null,[n(h,{class:"MoreOptionButton",icon:t(fe),onClick:d[3]||(d[3]=k=>t(v)())},{default:s(()=>[$(C(f.$t("action.exportAs"))+" .JSON ",1)]),_:1},8,["icon"])]),a("div",null,[n(h,{class:"MoreOptionButton",icon:t(fe),onClick:d[4]||(d[4]=k=>t(u)())},{default:s(()=>[$(C(f.$t("action.exportAs"))+" .JSON (detailed) ",1)]),_:1},8,["icon"])]),a("div",null,[n(h,{class:"MoreOptionButton",icon:t(Ce),onClick:d[5]||(d[5]=k=>t(i)())},{default:s(()=>[$(C(f.$t("action.refresh")),1)]),_:1},8,["icon"])]),a("div",null,[n(h,{type:"danger",class:"MoreOptionButton",icon:t(Oe),onClick:d[6]||(d[6]=k=>t(l)()),plain:""},{default:s(()=>[$(C(f.$t("action.deleteConv")),1)]),_:1},8,["icon"])])])]),_:1})]),default:s(()=>[n(h,{size:"small",style:{padding:"8px"}},{default:s(()=>[n(c,{style:{margin:"0 -0.125rem"}},{default:s(()=>[n(t(Pe))]),_:1})]),_:1})]),_:1})]),_:1})}}},an=te(ln,[["__scopeId","data-v-86221b09"]]);const rn=e=>(Re("data-v-5e12e367"),e=e(),Ue(),e),un={class:"h-full max-h-full flex flex-col"},dn={class:"flex justify-stretch"},cn={class:"flex-1 mt-0"},pn={class:"px-1"},_n={class:"flex flex-col pr-1 gap-1"},mn={class:"flex gap-1"},fn={class:"flex gap-1"},vn={key:0,class:"flex gap-1"},bn=rn(()=>a("span",{class:"mr-2"},"Temperature",-1)),hn={class:"info"},yn={class:"flex-1",style:{width:"calc(50% - 0.25rem)"}},gn={key:1,class:"flex gap-1"},wn={class:"flex flex-1"},Cn={class:"flex-1 text-right pr-2"},$n={class:"mt-4 mb-0"},xn={class:"ConversationListContainer mt-1 border rounded overflow-hidden",style:{height:"45vh","border-color":"var(--el-border-color)"}},kn={class:"border-b createNewChat-bg",style:{"border-color":"var(--el-border-color)"}},En={class:"ConversationList overflow-y-auto overflow-x-hidden flex-1",style:{"max-height":"calc(100% - 32px)"}},In=["active"],Vn={class:"text-ellipsis overflow-hidden max-w-full"},Sn={class:"ConversationLinkButtons px-1 flex-center"},Nn={class:"flex flex-col py-1 px-2 -m-2 -mx-3",style:{"margin-bottom":"-10px"}},Mn={class:"flex flex-col mt-4 gap-1"},An={class:"pl-1"},Bn={class:"pl-1"},Dn={class:"pl-1"},zn={__name:"ConvMenu",setup(e){const i=ft("version",()=>""),{conversations:r,model:l,currentConvIdComputed:m,focusInput:_,renameConversation:v,deleteConversation:u}=D();i.value===""&&$fetch("/api/version",{method:"POST"}).then(c=>{i.value=c.version}).catch(()=>{});const f=()=>{ve({title:"Aboute Me",message:()=>K("div",[K("div","I'm a web developer, and I can create a great website that suits your needs perfectly! Feel free to reach out to me to learn more."),K("br",""),K("div",[K("strong","Email: "),K("span","137emailservice@gmail.com")])])})},d=()=>{ve.prompt("Your name:","What should we call you?").then(({value:c})=>{if(c=c.trim(),!c)throw"Name cannot be empty";ve.prompt("What would you like to tell us?","We value your feedback, thank you!").then(async({value:h})=>{if(h=h.trim(),!h)throw"Feedback cannot be empty";const y=await $fetch("/api/stats/feedback",{method:"POST",body:{name:c,feedback:h}});!y||"error"in y?ue.error("Feedback submission failed."):ue.success("Feedback submitted successfully")}).catch(()=>{ue.info("Feedback has been cancelled.")})}).catch(()=>{ue.info("Feedback has been cancelled.")})};return(c,h)=>{const y=Ne,S=en,w=nn,k=Q,j=kt,ne=pe,oe=on,J=an,W=Qe,P=H,R=Nt,_e=Ee,me=Ie,q=Mt;return b(),x("div",un,[n(W,{onSubmit:h[0]||(h[0]=U(()=>{},["prevent"]))},{default:s(()=>[a("div",dn,[a("h4",cn,C(c.$t("settings.title")),1),a("div",pn,[t(i)?(b(),B(y,{key:0,type:"info",size:"small"},{default:s(()=>[$(" v"+C(t(i)),1)]),_:1})):A("",!0)])]),a("div",_n,[a("div",mn,[n(y,{class:"flex-1"},{default:s(()=>[$(C(c.$t("settings.model")),1)]),_:1}),n(S,{class:"flex-1"})]),a("div",fn,[n(y,{class:"flex-1"},{default:s(()=>[$(C(c.$t("settings.context")),1)]),_:1}),n(w,{class:"flex-1"})]),["gpt4","gpt3","gpt3-fga"].includes(t(l))?(b(),x("div",vn,[n(y,{class:"flex flex-1 items-center"},{default:s(()=>[bn,n(ne,null,{default:s(()=>[n(j,{placement:"bottom",width:240,trigger:"click"},{reference:s(()=>[n(k,{color:"#409EFF",class:"cursor-pointer",size:"large"},{default:s(()=>[n(t(vt))]),_:1})]),default:s(()=>[a("div",hn,[n(y,{class:"info"},{default:s(()=>[$(C(c.$t("menu.tempInfo")),1)]),_:1})])]),_:1})]),_:1})]),_:1}),a("div",yn,[n(oe,{class:"w-full"})])])):A("",!0),t(m)?(b(),x("div",gn,[a("div",wn,[a("div",Cn,[n(y,{size:"small",type:"info"},{default:s(()=>[$(C(c.$t("action.more")),1)]),_:1})]),n(J)])])):A("",!0)])]),_:1}),a("h4",$n,C(c.$t("chat.chats")),1),a("div",xn,[a("div",kn,[n(R,{id:"createNewChat",to:"/c/",onClick:t(_)},{default:s(()=>[n(P,{icon:t(Fe),class:"ConversationLink w-full",style:{border:"none",background:"transparent !important"}},{default:s(()=>[$(C(c.$t("chat.newChat")),1)]),_:1},8,["icon"])]),_:1},8,["onClick"])]),a("div",En,[(b(!0),x(ge,null,Te(t(r),V=>(b(),x("div",{class:M(["ConversationLink flex items-center",V.moreActionsExpanded?"MoreOptionsExpended":""]),active:V.id===t(m)},[n(R,{id:V.id,to:`/c/${V.id}`,class:M(["justify-start items-center flex gap-1 py-1 px-4 w-full",V.id===t(m)?"pointer-events-none":""])},{default:s(()=>[n(k,null,{default:s(()=>[n(t(bt))]),_:1}),a("span",Vn,C(V.name||t(xt).convert(V.id,"64w",10)),1)]),_:2},1032,["id","to","class"]),a("div",Sn,[n(y,{type:"info",class:"flex gap-2"},{default:s(()=>[n(me,{trigger:"click",placement:"bottom",onVisibleChange:Y=>V.moreActionsExpanded=Y},{dropdown:s(()=>[n(_e,{style:{overflow:"hidden"}},{default:s(()=>[a("div",Nn,[a("div",null,[n(P,{class:"MoreOptionButton",icon:t(Le),onClick:Y=>t(v)(V.id,V.name)},{default:s(()=>[$(C(c.$t("action.rename")),1)]),_:2},1032,["icon","onClick"])]),a("div",null,[n(P,{type:"danger",class:"MoreOptionButton",icon:t(Oe),onClick:Y=>t(u)(V.id),plain:""},{default:s(()=>[$(C(c.$t("action.delete")),1)]),_:2},1032,["icon","onClick"])])])]),_:2},1024)]),default:s(()=>[n(y,null,{default:s(()=>[n(k,{class:"cursor-pointer"},{default:s(()=>[n(t(Pe))]),_:1})]),_:1})]),_:2},1032,["onVisibleChange"])]),_:2},1024)])],10,In))),256))])]),a("div",Mn,[a("div",null,[n(q,{href:"https://www.buymeacoffee.com/cch137",target:"_blank",icon:t(ht)},{default:s(()=>[a("div",An,[n(y,{size:"large",style:{color:"inherit"}},{default:s(()=>[$("Buy me a coffee")]),_:1})])]),_:1},8,["icon"])]),a("div",null,[n(q,{onClick:h[1]||(h[1]=V=>f()),target:"_blank",icon:t(yt)},{default:s(()=>[a("div",Bn,[n(y,{size:"large",style:{color:"inherit"}},{default:s(()=>[$("About me")]),_:1})])]),_:1},8,["icon"])]),a("div",null,[n(q,{onClick:h[2]||(h[2]=V=>d()),target:"_blank",icon:t(gt)},{default:s(()=>[a("div",Dn,[n(y,{size:"large",style:{color:"inherit"}},{default:s(()=>[$("Feedback")]),_:1})])]),_:1},8,["icon"])])])])}}},je=te(zn,[["__scopeId","data-v-5e12e367"]]);const Fn={class:"flex"},Tn={class:"flex flex-1"},Ln={__name:"ConvSidebar",setup(e){const{openMenu:i,openSidebarController:r}=D();return(l,m)=>{const _=Ve,v=H,u=je;return b(),x("div",{class:"ChatbotConvSidebar flex flex-col z-50",style:X(`transform: translateX(${t(r)?"0":"-100%"});`)},[a("div",Fn,[a("div",Tn,[n(_)]),n(v,{class:"ChatbotConvHeaderMenuButton",icon:t(wt),style:{padding:"8px"},onClick:m[0]||(m[0]=f=>i.value=!1)},null,8,["icon"])]),n(u,{class:"flex-1 mt-4"})],4)}}},On=te(Ln,[["__scopeId","data-v-bc06a107"]]),Pn={class:"px-2 pb-4 flex flex-col gap-4"},Rn={class:"flex items-center justify-end"},Un=O({__name:"EditQuestionDialog",setup(e){const{isEditingQuestion:i,editingQuestion:r,editingQuestionContent:l,inputMaxLength:m,updateMessage:_}=D();function v(){i.value=!1}function u(d){d.key==="Enter"&&!d.shiftKey&&(f(),d.preventDefault())}async function f(){if(r.value===void 0)return;const d=l.value.trim();r.value.Q!==d&&(r.value.Q=d,_(r.value)),setTimeout(()=>v(),0)}return(d,c)=>{const h=ce,y=H,S=Se;return b(),B(S,{modelValue:t(i),"onUpdate:modelValue":c[4]||(c[4]=w=>L(i)?i.value=w:null),title:d.$t("chat.editQues"),width:"80%",style:{"max-width":"600px"}},{default:s(()=>[a("div",Pn,[n(h,{modelValue:t(l),"onUpdate:modelValue":c[0]||(c[0]=w=>L(l)?l.value=w:null),autosize:{minRows:4,maxRows:16},type:"textarea",size:"large",class:"EditQuestionInput",maxlength:t(m),autofocus:!0,onKeydown:c[1]||(c[1]=w=>u(w))},null,8,["modelValue","maxlength"]),a("div",Rn,[n(y,{onClick:c[2]||(c[2]=w=>v()),icon:t(ye)},{default:s(()=>[$(C(d.$t("message.cancel")),1)]),_:1},8,["icon"]),n(y,{onClick:c[3]||(c[3]=w=>f()),type:"primary",icon:t(He)},{default:s(()=>[$(C(d.$t("action.save")),1)]),_:1},8,["icon"])])])]),_:1},8,["modelValue","title"])}}});const Hn={class:"px-2 pb-4 flex flex-col gap-4"},Kn={class:"flex items-center justify-end"},Qn=O({__name:"EditAnswerDialog",setup(e){const{isEditingAnswer:i,editingAnswer:r,editingAnswerContent:l,inputMaxLength:m,updateMessage:_}=D();function v(){i.value=!1}function u(d){d.key==="Enter"&&!d.shiftKey&&(f(),d.preventDefault())}async function f(){if(r.value===void 0)return;const d=l.value.trim();r.value.A!==d&&(r.value.A=d,_(r.value)),setTimeout(()=>v(),0)}return(d,c)=>{const h=ce,y=H,S=Se;return b(),B(S,{modelValue:t(i),"onUpdate:modelValue":c[4]||(c[4]=w=>L(i)?i.value=w:null),title:d.$t("chat.editAns"),width:"80%",style:{"max-width":"600px"}},{default:s(()=>[a("div",Hn,[n(h,{modelValue:t(l),"onUpdate:modelValue":c[0]||(c[0]=w=>L(l)?l.value=w:null),autosize:{minRows:4,maxRows:16},type:"textarea",size:"large",class:"EditAnswerInput",maxlength:t(m),autofocus:!0,onKeydown:c[1]||(c[1]=w=>u(w))},null,8,["modelValue","maxlength"]),a("div",Kn,[n(y,{onClick:c[2]||(c[2]=w=>v()),icon:t(ye)},{default:s(()=>[$(C(d.$t("message.cancel")),1)]),_:1},8,["icon"]),n(y,{onClick:c[3]||(c[3]=w=>f()),type:"primary",icon:t(He)},{default:s(()=>[$(C(d.$t("action.save")),1)]),_:1},8,["icon"])])])]),_:1},8,["modelValue","title"])}}});const jn={},Jn=e=>(Re("data-v-3c80ec5a"),e=e(),Ue(),e),Wn={class:"MenuIcon"},qn=Jn(()=>a("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 96 960 960"},[a("path",{d:"M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"})],-1)),Yn=[qn];function Gn(e,i){return b(),x("i",Wn,Yn)}const Zn=te(jn,[["render",Gn],["__scopeId","data-v-3c80ec5a"]]);const Xn={class:"fixed z-50 w-full flex"},eo={class:"ChatbotConvHeader px-4 gap-4 flex items-stretch flex-1"},to=a("div",{class:"flex-1 flex items-center justify-end gap-2"},null,-1),no={__name:"ConvHeader",setup(e){const{openMenu:i,openSidebarController:r}=D();return i.value=!0,(l,m)=>{const _=On,v=Un,u=Qn,f=Zn,d=H,c=Ve,h=Ge;return b(),x("div",Xn,[a("div",{style:X(`min-width: ${t(r)?"320px":"0px"}; width: ${t(r)?"25%":"0px"}; transition: .1s;`)},null,4),n(_),n(v),n(u),a("div",eo,[a("div",{style:X([t(r)?"opacity: 0; pointer-events: none; width: 0px;":"",{transition:".1s"}])},[n(d,{style:{padding:"8px"},onClick:m[0]||(m[0]=y=>i.value=!t(i))},{default:s(()=>[n(f)]),_:1})],4),n(c,{style:X(t(r)?"opacity: 0; pointer-events: none; width: 0px;":"")},null,8,["style"]),to,n(h)])])}}},oo=no,so={class:"InputBoxOuter flex fixed w-full z-40"},lo={class:"InputBox pt-20 pb-1 px-2 flex-1"},ao={class:"flex gap-3 w-full mx-auto justify-center px-2",style:{"max-width":"900px"}},io={class:"w-full"},ro={class:"InputBoxActionButtonGroup flex flex-col gap-1"},uo={style:{"margin-left":".25rem"}},co={class:"text-center mt-1",style:{"line-height":"1em"}},po=O({__name:"InputBox",setup(e){const{sendMessage:i,openSidebarController:r,inputMaxLength:l,inputValue:m}=D(),_=u=>{u.key==="Enter"&&!u.shiftKey&&(i(),u.preventDefault())},v=()=>{i()};return(u,f)=>{const d=ce,c=Q,h=H,y=St,S=Qe,w=Ne;return b(),x("div",so,[a("div",{style:X(`min-width: ${t(r)?"320px":"0px"}; width: ${t(r)?"25%":"0px"}; transition: .1s;`)},null,4),a("div",lo,[n(S,{ref:"inputForm",class:"mx-auto max-w-full",onSubmit:f[2]||(f[2]=U(()=>{},["prevent"]))},{default:s(()=>[n(y,{style:{margin:"0"}},{default:s(()=>[a("div",ao,[a("div",io,[n(d,{modelValue:t(m),"onUpdate:modelValue":f[0]||(f[0]=k=>L(m)?m.value=k:null),autosize:{minRows:2,maxRows:16},type:"textarea",size:"large",maxlength:t(l),autofocus:!0,onKeydown:f[1]||(f[1]=k=>_(k))},null,8,["modelValue","maxlength"])]),a("div",ro,[n(h,{type:"primary",onClick:v,style:{padding:"12px"},size:"large"},{default:s(()=>[n(c,null,{default:s(()=>[n(t(Ct))]),_:1}),a("span",uo,C(u.$t("chat.send")),1)]),_:1})])])]),_:1})]),_:1},512),a("div",co,[n(w,{type:"info",size:"small"},{default:s(()=>[$(C(u.$t("footer.patient")),1)]),_:1})])])])}}});const _o={style:{"margin-top":"-1.5rem",height:"calc(100% + 1.5rem)"}},mo={__name:"ConvDrawer",setup(e){const{openDrawerController:i}=D();return(r,l)=>{const m=je,_=Qt,v=pe;return b(),B(v,null,{default:s(()=>[n(_,{modelValue:t(i),"onUpdate:modelValue":l[0]||(l[0]=u=>L(i)?i.value=u:null),title:r.$t("menu.title"),direction:"ltr",style:{"min-width":"320px","max-width":"100vw"}},{default:s(()=>[a("div",_o,[n(m)])]),_:1},8,["modelValue","title"])]),_:1})}}},fo=mo,vo={},bo={style:{"padding-top":"56px"},class:"w-full"};function ho(e,i){const r=oo,l=pe,m=po,_=fo;return b(),x(ge,null,[n(l,null,{default:s(()=>[n(r)]),_:1}),a("div",bo,[G(e.$slots,"default"),n(l,null,{default:s(()=>[n(m),n(_)]),_:1})])],64)}const Ko=te(vo,[["render",ho]]);export{Ko as default};