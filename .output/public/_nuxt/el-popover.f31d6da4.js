import{a as N,b as a,E as M}from"./el-popper.f4b6b791.js";import{M as O,N as y,af as g,D as S,ae as _,a2 as R,$ as K,E as l,ao as U,aL as C,aM as c,aZ as D,aY as m,z as Y,F as E,I as V,aQ as F,o as $,U as j,w as L,c as J,V as z,t as P,ah as B,d as H,aR as q,bE as G,aq as Q}from"./entry.e24fde4f.js";const W=y({inheritAttrs:!1});function Z(t,n,r,o,d,p){return g(t.$slots,"default")}var X=O(W,[["render",Z],["__file","/home/runner/work/element-plus/element-plus/packages/components/collection/src/collection.vue"]]);const x=y({name:"ElCollectionItem",inheritAttrs:!1});function ee(t,n,r,o,d,p){return g(t.$slots,"default")}var te=O(x,[["render",ee],["__file","/home/runner/work/element-plus/element-plus/packages/components/collection/src/collection-item.vue"]]);const oe="data-el-collection-item",ne=t=>{const n=`El${t}Collection`,r=`${n}Item`,o=Symbol(n),d=Symbol(r),p={...X,name:n,setup(){const b=S(null),f=new Map;_(o,{itemMap:f,getItems:()=>{const i=l(b);if(!i)return[];const s=Array.from(i.querySelectorAll(`[${oe}]`));return[...f.values()].sort((h,I)=>s.indexOf(h.ref)-s.indexOf(I.ref))},collectionRef:b})}},v={...te,name:r,setup(b,{attrs:f}){const u=S(null),i=R(o,void 0);_(d,{collectionItemRef:u}),K(()=>{const s=l(u);s&&i.itemMap.set(s,{ref:s,...f})}),U(()=>{const s=l(u);i.itemMap.delete(s)})}};return{COLLECTION_INJECTION_KEY:o,COLLECTION_ITEM_INJECTION_KEY:d,ElCollection:p,ElCollectionItem:v}},w=C({trigger:N.trigger,effect:{...a.effect,default:"light"},type:{type:c(String)},placement:{type:c(String),default:"bottom"},popperOptions:{type:c(Object),default:()=>({})},id:String,size:{type:String,default:""},splitButton:Boolean,hideOnClick:{type:Boolean,default:!0},loop:{type:Boolean,default:!0},showTimeout:{type:Number,default:150},hideTimeout:{type:Number,default:150},tabindex:{type:c([Number,String]),default:0},maxHeight:{type:c([Number,String]),default:""},popperClass:{type:String,default:""},disabled:{type:Boolean,default:!1},role:{type:String,default:"menu"},buttonProps:{type:c(Object)},teleported:a.teleported}),ge=C({command:{type:[Object,String,Number],default:()=>({})},disabled:Boolean,divided:Boolean,textValue:String,icon:{type:D}}),ye=C({onKeydown:{type:c(Function)}}),re=[m.down,m.pageDown,m.home],se=[m.up,m.pageUp,m.end],Ce=[...re,...se],{ElCollection:he,ElCollectionItem:Ie,COLLECTION_INJECTION_KEY:we,COLLECTION_ITEM_INJECTION_KEY:Ne}=ne("Dropdown"),ae=C({trigger:N.trigger,placement:w.placement,disabled:N.disabled,visible:a.visible,transition:a.transition,popperOptions:w.popperOptions,tabindex:w.tabindex,content:a.content,popperStyle:a.popperStyle,popperClass:a.popperClass,enterable:{...a.enterable,default:!0},effect:{...a.effect,default:"light"},teleported:a.teleported,title:String,width:{type:[String,Number],default:150},offset:{type:Number,default:void 0},showAfter:{type:Number,default:0},hideAfter:{type:Number,default:200},autoClose:{type:Number,default:0},showArrow:{type:Boolean,default:!0},persistent:{type:Boolean,default:!0},"onUpdate:visible":{type:Function}}),le={"update:visible":t=>Y(t),"before-enter":()=>!0,"before-leave":()=>!0,"after-enter":()=>!0,"after-leave":()=>!0},pe="onUpdate:visible",ie=y({name:"ElPopover"}),ce=y({...ie,props:ae,emits:le,setup(t,{expose:n,emit:r}){const o=t,d=E(()=>o[pe]),p=V("popover"),v=S(),b=E(()=>{var e;return(e=l(v))==null?void 0:e.popperRef}),f=E(()=>[{width:F(o.width)},o.popperStyle]),u=E(()=>[p.b(),o.popperClass,{[p.m("plain")]:!!o.content}]),i=E(()=>o.transition===`${p.namespace.value}-fade-in-linear`),s=()=>{var e;(e=v.value)==null||e.hide()},T=()=>{r("before-enter")},h=()=>{r("before-leave")},I=()=>{r("after-enter")},k=()=>{r("update:visible",!1),r("after-leave")};return n({popperRef:b,hide:s}),(e,ve)=>($(),j(l(M),q({ref_key:"tooltipRef",ref:v},e.$attrs,{trigger:e.trigger,placement:e.placement,disabled:e.disabled,visible:e.visible,transition:e.transition,"popper-options":e.popperOptions,tabindex:e.tabindex,content:e.content,offset:e.offset,"show-after":e.showAfter,"hide-after":e.hideAfter,"auto-close":e.autoClose,"show-arrow":e.showArrow,"aria-label":e.title,effect:e.effect,enterable:e.enterable,"popper-class":l(u),"popper-style":l(f),teleported:e.teleported,persistent:e.persistent,"gpu-acceleration":l(i),"onUpdate:visible":l(d),onBeforeShow:T,onBeforeHide:h,onShow:I,onHide:k}),{content:L(()=>[e.title?($(),J("div",{key:0,class:z(l(p).e("title")),role:"title"},P(e.title),3)):B("v-if",!0),g(e.$slots,"default",{},()=>[H(P(e.content),1)])]),default:L(()=>[e.$slots.reference?g(e.$slots,"reference",{key:0}):B("v-if",!0)]),_:3},16,["trigger","placement","disabled","visible","transition","popper-options","tabindex","content","offset","show-after","hide-after","auto-close","show-arrow","aria-label","effect","enterable","popper-class","popper-style","teleported","persistent","gpu-acceleration","onUpdate:visible"]))}});var de=O(ce,[["__file","/home/runner/work/element-plus/element-plus/packages/components/popover/src/popover.vue"]]);const A=(t,n)=>{const r=n.arg||n.value,o=r==null?void 0:r.popperRef;o&&(o.triggerRef=t)};var fe={mounted(t,n){A(t,n)},updated(t,n){A(t,n)}};const ue="popover",me=G(fe,ue),Se=Q(de,{directive:me});export{Ne as C,Se as E,Ce as F,se as L,he as a,ge as b,ne as c,w as d,oe as e,Ie as f,ye as g,we as h};