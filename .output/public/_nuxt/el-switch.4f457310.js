import{aR as Z,b3 as A,aS as x,Q as S,az as k,ap as V,f as L,T as ee,X as ae,U as c,r as I,aW as te,V as T,ab as ie,o as l,c as d,a as E,k as a,a6 as r,bq as oe,j as v,w as C,a$ as N,s as g,l as u,t as B,b as ne,av as le,n as M,b0 as se,a0 as re,Y as ce,bF as O,aA as ue}from"./entry.97b597df.js";import{i as de}from"./focus-trap.50241fa8.js";import{U as P,C as D,I as _,d as ve,t as fe}from"./el-input.d5155eab.js";import{b as pe,u as he,c as me,a as be,d as ye}from"./el-button.dc8b7a60.js";const Ce=Z({modelValue:{type:[Boolean,String,Number],default:!1},disabled:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},size:{type:String,validator:de},width:{type:[String,Number],default:""},inlinePrompt:{type:Boolean,default:!1},activeIcon:{type:A},inactiveIcon:{type:A},activeText:{type:String,default:""},inactiveText:{type:String,default:""},activeValue:{type:[Boolean,String,Number],default:!0},inactiveValue:{type:[Boolean,String,Number],default:!1},activeColor:{type:String,default:""},inactiveColor:{type:String,default:""},borderColor:{type:String,default:""},name:{type:String,default:""},validateEvent:{type:Boolean,default:!0},beforeChange:{type:x(Function)},id:String,tabindex:{type:[String,Number]},value:{type:[Boolean,String,Number],default:!1}}),ge={[P]:s=>S(s)||k(s)||V(s),[D]:s=>S(s)||k(s)||V(s),[_]:s=>S(s)||k(s)||V(s)},Se=["onClick"],we=["id","aria-checked","aria-disabled","name","true-value","false-value","disabled","tabindex","onKeydown"],ke=["aria-hidden"],Ve=["aria-hidden"],Ie=["aria-hidden"],z="ElSwitch",Te=L({name:z}),Ee=L({...Te,props:Ce,emits:ge,setup(s,{expose:R,emit:f}){const t=s,W=ee(),{formItem:h}=pe(),j=he(),i=ae("switch");(e=>{e.forEach(o=>{ye({from:o[0],replacement:o[1],scope:z,version:"2.3.0",ref:"https://element-plus.org/en-US/component/switch.html#attributes",type:"Attribute"},c(()=>{var y;return!!((y=W.vnode.props)!=null&&y[o[2]])}))})})([['"value"','"model-value" or "v-model"',"value"],['"active-color"',"CSS var `--el-switch-on-color`","activeColor"],['"inactive-color"',"CSS var `--el-switch-off-color`","inactiveColor"],['"border-color"',"CSS var `--el-switch-border-color`","borderColor"]]);const{inputId:q}=me(t,{formItemContext:h}),m=be(c(()=>t.loading)),w=I(t.modelValue!==!1),p=I(),G=I(),H=c(()=>[i.b(),i.m(j.value),i.is("disabled",m.value),i.is("checked",n.value)]),Q=c(()=>[i.e("label"),i.em("label","left"),i.is("active",!n.value)]),X=c(()=>[i.e("label"),i.em("label","right"),i.is("active",n.value)]),Y=c(()=>({width:te(t.width)}));T(()=>t.modelValue,()=>{w.value=!0}),T(()=>t.value,()=>{w.value=!1});const F=c(()=>w.value?t.modelValue:t.value),n=c(()=>F.value===t.activeValue);[t.activeValue,t.inactiveValue].includes(F.value)||(f(P,t.inactiveValue),f(D,t.inactiveValue),f(_,t.inactiveValue)),T(n,e=>{var o;p.value.checked=e,t.validateEvent&&((o=h==null?void 0:h.validate)==null||o.call(h,"change").catch(y=>ve()))});const b=()=>{const e=n.value?t.inactiveValue:t.activeValue;f(P,e),f(D,e),f(_,e),ce(()=>{p.value.checked=n.value})},K=()=>{if(m.value)return;const{beforeChange:e}=t;if(!e){b();return}const o=e();[O(o),S(o)].includes(!0)||fe(z,"beforeChange must return type `Promise<boolean>` or `boolean`"),O(o)?o.then(U=>{U&&b()}).catch(U=>{}):o&&b()},$=c(()=>i.cssVarBlock({...t.activeColor?{"on-color":t.activeColor}:null,...t.inactiveColor?{"off-color":t.inactiveColor}:null,...t.borderColor?{"border-color":t.borderColor}:null})),J=()=>{var e,o;(o=(e=p.value)==null?void 0:e.focus)==null||o.call(e)};return ie(()=>{p.value.checked=n.value}),R({focus:J,checked:n}),(e,o)=>(l(),d("div",{class:r(a(H)),style:M(a($)),onClick:se(K,["prevent"])},[E("input",{id:a(q),ref_key:"input",ref:p,class:r(a(i).e("input")),type:"checkbox",role:"switch","aria-checked":a(n),"aria-disabled":a(m),name:e.name,"true-value":e.activeValue,"false-value":e.inactiveValue,disabled:a(m),tabindex:e.tabindex,onChange:b,onKeydown:oe(K,["enter"])},null,42,we),!e.inlinePrompt&&(e.inactiveIcon||e.inactiveText)?(l(),d("span",{key:0,class:r(a(Q))},[e.inactiveIcon?(l(),v(a(g),{key:0},{default:C(()=>[(l(),v(N(e.inactiveIcon)))]),_:1})):u("v-if",!0),!e.inactiveIcon&&e.inactiveText?(l(),d("span",{key:1,"aria-hidden":a(n)},B(e.inactiveText),9,ke)):u("v-if",!0)],2)):u("v-if",!0),E("span",{ref_key:"core",ref:G,class:r(a(i).e("core")),style:M(a(Y))},[e.inlinePrompt?(l(),d("div",{key:0,class:r(a(i).e("inner"))},[e.activeIcon||e.inactiveIcon?(l(),v(a(g),{key:0,class:r(a(i).is("icon"))},{default:C(()=>[(l(),v(N(a(n)?e.activeIcon:e.inactiveIcon)))]),_:1},8,["class"])):e.activeText||e.inactiveText?(l(),d("span",{key:1,class:r(a(i).is("text")),"aria-hidden":!a(n)},B(a(n)?e.activeText:e.inactiveText),11,Ve)):u("v-if",!0)],2)):u("v-if",!0),E("div",{class:r(a(i).e("action"))},[e.loading?(l(),v(a(g),{key:0,class:r(a(i).is("loading"))},{default:C(()=>[ne(a(le))]),_:1},8,["class"])):u("v-if",!0)],2)],6),!e.inlinePrompt&&(e.activeIcon||e.activeText)?(l(),d("span",{key:1,class:r(a(X))},[e.activeIcon?(l(),v(a(g),{key:0},{default:C(()=>[(l(),v(N(e.activeIcon)))]),_:1})):u("v-if",!0),!e.activeIcon&&e.activeText?(l(),d("span",{key:1,"aria-hidden":!a(n)},B(e.activeText),9,Ie)):u("v-if",!0)],2)):u("v-if",!0)],14,Se))}});var Ne=re(Ee,[["__file","/home/runner/work/element-plus/element-plus/packages/components/switch/src/switch.vue"]]);const Fe=ue(Ne);export{Fe as E};