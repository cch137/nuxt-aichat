import{E as b}from"./el-input.061f730f.js";import{E as k,a as O}from"./el-form.f1a14850.js";import{E as V}from"./el-button.fad26086.js";import{E as I}from"./el-text.837bb81d.js";import{_ as L}from"./nuxt-link.d91d2a24.js";import{E as N}from"./el-link.85548223.js";import{_ as F}from"./client-only.bd7056b1.js";import{f as q,g as z,r as A,l as h,i as B,o as C,c as R,b as e,w as t,j as o,a,t as i,K as T,x as W,d as p,E as P}from"./entry.ba7d954e.js";import{u as S}from"./useAuth.69ec0df0.js";import{u as U}from"./useTitle.85d9b5f6.js";import"./use-form-item.4e7a4467.js";import"./castArray.ae76fbff.js";import"./_Uint8Array.8669c32a.js";const j={class:"mt-0 mb-6"},D=a("div",{class:"p-6"},null,-1),K={class:"flex-center"},M=a("div",{class:"p-2"},null,-1),G={class:"flex-center flex-col gap-2"},H={class:"flex-center flex-wrap gap-1",style:{"line-height":"1rem"}},J={class:"flex-center flex-wrap gap-1",style:{"line-height":"1rem"}},Q={style:{"line-height":"1rem"},class:"mt-2 text-center"},X=a("div",{class:"p-8"},null,-1),_e=q({__name:"login",setup(Y){const{login:w}=S(),m=z().t,d=A(),n=h({usernameOrEmail:"",password:""}),x=h({usernameOrEmail:[{required:!0,message:m("auth.usernameOrEmailRequired"),trigger:"change"}],password:[{required:!0,message:m("auth.passwdRequired"),trigger:"change"}]}),y=async s=>{await s.validate((l,u)=>{l?w(n.usernameOrEmail,n.password):P.error(m("auth.formIncomplete"))})};return U(`${m("auth.login")} - ${B("appName").value}`),(s,l)=>{const u=b,_=k,E=V,c=I,f=L,g=N,v=O,$=F;return C(),R("div",null,[e($,null,{default:t(()=>[e(v,{ref_key:"ruleFormRef",ref:d,model:o(n),rules:o(x),"label-position":"top",class:"flex-col flex-center w-full max-w-xs px-4 m-auto",style:{height:"calc(100vh - 56px)"}},{default:t(()=>[a("h1",j,i(s.$t("auth.login")),1),e(_,{label:s.$t("auth.usernameOrEmail"),prop:"usernameOrEmail",class:"inputWrapper LoginInputAnim1"},{default:t(()=>[e(u,{modelValue:o(n).usernameOrEmail,"onUpdate:modelValue":l[0]||(l[0]=r=>o(n).usernameOrEmail=r),type:"text",size:"large","prefix-icon":o(T)},null,8,["modelValue","prefix-icon"])]),_:1},8,["label"]),e(_,{label:s.$t("auth.passwd"),prop:"password",class:"inputWrapper LoginInputAnim2 LoginPasswordInputWrapper"},{default:t(()=>[e(u,{modelValue:o(n).password,"onUpdate:modelValue":l[1]||(l[1]=r=>o(n).password=r),type:"password",size:"large","prefix-icon":o(W),formatter:r=>r.trim(),parser:r=>r.trim(),"show-password":""},null,8,["modelValue","prefix-icon","formatter","parser"])]),_:1},8,["label"]),D,a("div",K,[e(E,{size:"large",type:"primary",onClick:l[2]||(l[2]=r=>y(o(d)))},{default:t(()=>[p(i(s.$t("auth.login")),1)]),_:1})]),M,a("div",G,[a("div",H,[e(c,{type:"info"},{default:t(()=>[p(i(s.$t("auth.createNewAcc")),1)]),_:1}),e(g,{type:"primary"},{default:t(()=>[e(f,{to:"/signup"},{default:t(()=>[p(i(s.$t("auth.signup")),1)]),_:1})]),_:1})]),a("div",J,[e(g,{type:"primary"},{default:t(()=>[e(f,{to:"/acc/reset-password"},{default:t(()=>[p(i(s.$t("auth.resetPw")),1)]),_:1})]),_:1})])]),a("div",Q,[e(c,{size:"small",type:"info",style:{"word-break":"break-word"}},{default:t(()=>[p(i(s.$t("auth.loginTip1")),1)]),_:1})]),X]),_:1},8,["model","rules"])]),_:1})])}}});export{_e as default};