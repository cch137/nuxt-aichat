import{E as V}from"./el-switch.42351450.js";import{E as w,a as y}from"./el-select.80b4c350.js";import{_ as k}from"./client-only.c5090828.js";import{f as x,r,E as i,h as O,c as f,b as d,w as g,o as u,a as m,t as $,i as a,j as _,F as D,B as T,l as N}from"./entry.6bf6db5c.js";import"./el-input.f2adc52d.js";import"./el-popper.a24afebe.js";import{u as F}from"./useTitle.be3384cb.js";import"./focus-trap.262d5d32.js";import"./index.22df05c4.js";import"./scroll.e34d7aab.js";import"./isEqual.25144723.js";import"./_Uint8Array.f4f6a2e0.js";import"./vue.f36acd1f.f0a8a5d4.js";const A={class:"flex-col flex-center gap-2"},G=m("h2",null,"Discord Bot",-1),L=m("h2",null,"Search Engine",-1),Y=x({__name:"dashboard",setup(P){const l=r(!1),o=r(!1);async function v(){l.value=!0,await $fetch("/api/admin/setting",{method:"POST",body:{name:"dcBot",value:o.value}}),p()}async function p(){l.value=!0,o.value=(await $fetch("/api/discord",{method:"GET"})).connected,l.value=!1}p();const t=r("google"),E=r(["google","duckduckgo","all"]);$fetch("/api/admin/search-engine",{method:"GET"}).then(s=>{const{error:e,value:c}=s;if(e)throw e;t.value=c}).catch(()=>{i.error("Fetching search engine failed."),t.value=""});function B(s){$fetch("/api/admin/search-engine",{method:"POST",body:{value:s}}).then(()=>i.success("Search engine has been changed.")).catch(()=>i.error("Search engine change failed."))}const h=O("appName").value;return F(`Admin - ${h}`),(s,e)=>{const c=V,S=y,C=w,b=k;return u(),f("div",A,[d(b,null,{default:g(()=>[m("h1",null,"Admin Dashboard | "+$(a(h)),1),G,d(c,{modelValue:a(o),"onUpdate:modelValue":e[0]||(e[0]=n=>_(o)?o.value=n:null),onChange:e[1]||(e[1]=n=>v()),loading:a(l),size:"large"},null,8,["modelValue","loading"]),L,d(C,{modelValue:a(t),"onUpdate:modelValue":e[2]||(e[2]=n=>_(t)?t.value=n:null),placeholder:"Select",onChange:e[3]||(e[3]=n=>B(n))},{default:g(()=>[(u(!0),f(D,null,T(a(E),n=>(u(),N(S,{key:n,label:n,value:n},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})])}}});export{Y as default};