import{a4 as $,aN as w,a5 as x,a7 as I,al as V,a6 as T,f as L,ao as ee,a8 as ae,ac as u,r as E,ad as te,g as N,ae as ie,o,c as v,a as B,i as a,T as c,bl as oe,l as r,w as p,aw as b,A as h,s as d,t as P,b as ne,aH as le,n as U,au as se,ai as re,ap as ce,bL as _,aj as ue}from"./entry.337d13a0.js";import{i as de}from"./focus-trap.adc928d3.js";import{U as A,C as D,I as z,d as ve,t as fe}from"./el-input.d87563b5.js";import{a as pe,b as he,c as me,u as be}from"./use-form-item.2ef56732.js";import{u as ye}from"./index.fb7bb0f1.js";const ge=$({modelValue:{type:[Boolean,String,Number],default:!1},disabled:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},size:{type:String,validator:de},width:{type:[String,Number],default:""},inlinePrompt:{type:Boolean,default:!1},inactiveActionIcon:{type:w},activeActionIcon:{type:w},activeIcon:{type:w},inactiveIcon:{type:w},activeText:{type:String,default:""},inactiveText:{type:String,default:""},activeValue:{type:[Boolean,String,Number],default:!0},inactiveValue:{type:[Boolean,String,Number],default:!1},activeColor:{type:String,default:""},inactiveColor:{type:String,default:""},borderColor:{type:String,default:""},name:{type:String,default:""},validateEvent:{type:Boolean,default:!0},beforeChange:{type:x(Function)},id:String,tabindex:{type:[String,Number]},value:{type:[Boolean,String,Number],default:!1},label:{type:String,default:void 0}}),Ce={[A]:s=>I(s)||V(s)||T(s),[D]:s=>I(s)||V(s)||T(s),[z]:s=>I(s)||V(s)||T(s)},Se=["onClick"],we=["id","aria-checked","aria-disabled","aria-label","name","true-value","false-value","disabled","tabindex","onKeydown"],Ie=["aria-hidden"],ke=["aria-hidden"],Ve=["aria-hidden"],K="ElSwitch",Te=L({name:K}),Ee=L({...Te,props:ge,emits:Ce,setup(s,{expose:H,emit:f}){const t=s,j=ee(),{formItem:y}=pe(),G=he(),i=ae("switch");(e=>{e.forEach(l=>{ye({from:l[0],replacement:l[1],scope:K,version:"2.3.0",ref:"https://element-plus.org/en-US/component/switch.html#attributes",type:"Attribute"},u(()=>{var S;return!!((S=j.vnode.props)!=null&&S[l[2]])}))})})([['"value"','"model-value" or "v-model"',"value"],['"active-color"',"CSS var `--el-switch-on-color`","activeColor"],['"inactive-color"',"CSS var `--el-switch-off-color`","inactiveColor"],['"border-color"',"CSS var `--el-switch-border-color`","borderColor"]]);const{inputId:R}=me(t,{formItemContext:y}),g=be(u(()=>t.loading)),k=E(t.modelValue!==!1),m=E(),W=E(),q=u(()=>[i.b(),i.m(G.value),i.is("disabled",g.value),i.is("checked",n.value)]),J=u(()=>[i.e("label"),i.em("label","left"),i.is("active",!n.value)]),Q=u(()=>[i.e("label"),i.em("label","right"),i.is("active",n.value)]),X=u(()=>({width:te(t.width)}));N(()=>t.modelValue,()=>{k.value=!0}),N(()=>t.value,()=>{k.value=!1});const F=u(()=>k.value?t.modelValue:t.value),n=u(()=>F.value===t.activeValue);[t.activeValue,t.inactiveValue].includes(F.value)||(f(A,t.inactiveValue),f(D,t.inactiveValue),f(z,t.inactiveValue)),N(n,e=>{var l;m.value.checked=e,t.validateEvent&&((l=y==null?void 0:y.validate)==null||l.call(y,"change").catch(S=>ve()))});const C=()=>{const e=n.value?t.inactiveValue:t.activeValue;f(A,e),f(D,e),f(z,e),ce(()=>{m.value.checked=n.value})},M=()=>{if(g.value)return;const{beforeChange:e}=t;if(!e){C();return}const l=e();[_(l),I(l)].includes(!0)||fe(K,"beforeChange must return type `Promise<boolean>` or `boolean`"),_(l)?l.then(O=>{O&&C()}).catch(O=>{}):l&&C()},Y=u(()=>i.cssVarBlock({...t.activeColor?{"on-color":t.activeColor}:null,...t.inactiveColor?{"off-color":t.inactiveColor}:null,...t.borderColor?{"border-color":t.borderColor}:null})),Z=()=>{var e,l;(l=(e=m.value)==null?void 0:e.focus)==null||l.call(e)};return ie(()=>{m.value.checked=n.value}),H({focus:Z,checked:n}),(e,l)=>(o(),v("div",{class:c(a(q)),style:U(a(Y)),onClick:se(M,["prevent"])},[B("input",{id:a(R),ref_key:"input",ref:m,class:c(a(i).e("input")),type:"checkbox",role:"switch","aria-checked":a(n),"aria-disabled":a(g),"aria-label":e.label,name:e.name,"true-value":e.activeValue,"false-value":e.inactiveValue,disabled:a(g),tabindex:e.tabindex,onChange:C,onKeydown:oe(M,["enter"])},null,42,we),!e.inlinePrompt&&(e.inactiveIcon||e.inactiveText)?(o(),v("span",{key:0,class:c(a(J))},[e.inactiveIcon?(o(),r(a(h),{key:0},{default:p(()=>[(o(),r(b(e.inactiveIcon)))]),_:1})):d("v-if",!0),!e.inactiveIcon&&e.inactiveText?(o(),v("span",{key:1,"aria-hidden":a(n)},P(e.inactiveText),9,Ie)):d("v-if",!0)],2)):d("v-if",!0),B("span",{ref_key:"core",ref:W,class:c(a(i).e("core")),style:U(a(X))},[e.inlinePrompt?(o(),v("div",{key:0,class:c(a(i).e("inner"))},[e.activeIcon||e.inactiveIcon?(o(),r(a(h),{key:0,class:c(a(i).is("icon"))},{default:p(()=>[(o(),r(b(a(n)?e.activeIcon:e.inactiveIcon)))]),_:1},8,["class"])):e.activeText||e.inactiveText?(o(),v("span",{key:1,class:c(a(i).is("text")),"aria-hidden":!a(n)},P(a(n)?e.activeText:e.inactiveText),11,ke)):d("v-if",!0)],2)):d("v-if",!0),B("div",{class:c(a(i).e("action"))},[e.loading?(o(),r(a(h),{key:0,class:c(a(i).is("loading"))},{default:p(()=>[ne(a(le))]),_:1},8,["class"])):e.activeActionIcon&&a(n)?(o(),r(a(h),{key:1},{default:p(()=>[(o(),r(b(e.activeActionIcon)))]),_:1})):e.inactiveActionIcon&&!a(n)?(o(),r(a(h),{key:2},{default:p(()=>[(o(),r(b(e.inactiveActionIcon)))]),_:1})):d("v-if",!0)],2)],6),!e.inlinePrompt&&(e.activeIcon||e.activeText)?(o(),v("span",{key:1,class:c(a(Q))},[e.activeIcon?(o(),r(a(h),{key:0},{default:p(()=>[(o(),r(b(e.activeIcon)))]),_:1})):d("v-if",!0),!e.activeIcon&&e.activeText?(o(),v("span",{key:1,"aria-hidden":!a(n)},P(e.activeText),9,Ve)):d("v-if",!0)],2)):d("v-if",!0)],14,Se))}});var Ne=re(Ee,[["__file","/home/runner/work/element-plus/element-plus/packages/components/switch/src/switch.vue"]]);const Fe=ue(Ne);export{Fe as E};