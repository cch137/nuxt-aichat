import{a as V,E as N}from"./el-select.c8d880ea.js";import{E as T}from"./el-link.439cfa23.js";import{E as j}from"./el-text.c87ce24e.js";import{_ as I}from"./client-only.8a198672.js";import{f as F,r as m,aR as $,h as q,c as i,b as h,w as u,aS as O,o as s,a as l,i as _,j as R,F as k,B as x,l as C,t as S,d as y,s as A,E as K,K as P,p as U,e as D,_ as M}from"./entry.d4d7846e.js";import"./el-input.9eac9918.js";import"./el-popper.b3c80393.js";import{u as W}from"./useTitle.6f1b29ab.js";import"./index.f5c8aa24.js";import"./scroll.1c205c16.js";import"./isEqual.79d2a005.js";import"./_Uint8Array.72f9103d.js";import"./focus-trap.d864d2e3.js";import"./vue.f36acd1f.5c6fe5ba.js";const Y=f=>(U("data-v-8484fbc1"),f=f(),D(),f),z={class:"mt-8 flex-col gap-4 flex-center"},G=Y(()=>l("h1",{class:"m-0"},"LS",-1)),H={class:"px-4 w-full max-w-prose flex flex-col gap-4 justify-center"},J={class:"pb-16"},Q={class:"chapter-title"},X={class:"flex flex-wrap gap-2 pl-4 pt-2 pb-4"},Z={key:0,class:"flex-col flex-center pb-16"},ee={class:"flex-center pb-16"},te=F({__name:"ls",setup(f){const n=m(""),v=m([]),d=m([]);function L(){history.length>1?history.back():K.info(P.choice(["Oh~dear, you shouldn't click this.","Back? Where do you want to go?","I don't want you to go anywhere else.","Stay here!","You are lost."]))}const b=m(!1);async function w(){b.value=!0;const a=[];d.value=[];const t=O(),c=await(await fetch(`https://api.cch137.link/ls/${n.value}`)).json();function g(o){for(const r of a)if(r.chapter===o)return r.problems;const p=[];return a.push({chapter:o,problems:p}),p}for(const o of c){const[p,r,e]=o.isbn_c_p.split("_");g(r).push({p:e,link:o.link})}d.value=a,t.close(),b.value=!1}(async()=>{const a=$().get("q")||"",t=fetch("https://api.cch137.link/ls/list");if(v.value=await(await t).json(),a&&!n.value){for(const c of v.value)if(c.toLowerCase().includes(a.toLowerCase())){n.value=c,await w();break}}})();const B=q("appName");return W(`LS - ${B.value}`),(a,t)=>{const c=V,g=N,o=T,p=j,r=I;return s(),i("div",z,[h(r,null,{default:u(()=>[G,l("div",H,[h(g,{modelValue:_(n),"onUpdate:modelValue":t[0]||(t[0]=e=>R(n)?n.value=e:null),onChange:t[1]||(t[1]=e=>w()),placeholder:"請選擇原文書",loading:_(b)},{default:u(()=>[(s(!0),i(k,null,x(_(v),e=>(s(),C(c,{key:e,label:e.replaceAll(".json",""),value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue","loading"]),l("div",J,[(s(!0),i(k,null,x(_(d),e=>(s(),i("details",null,[l("summary",Q,S(e.chapter),1),l("div",X,[(s(!0),i(k,null,x(e.problems,E=>(s(),C(o,{href:E.link,target:"_blank"},{default:u(()=>[y(S(E.p),1)]),_:2},1032,["href"]))),256))])]))),256))]),_(d).length?(s(),i("div",Z,[l("div",null,[h(p,{type:"info"},{default:u(()=>[y("提示：點擊下載 (Скачать) 可以取得更清晰的圖片。免責聲明：本站非以上文件之所有者，訪客若因訪問非本站頁面或資源導致任何損失，本站概不負責。")]),_:1})])])):A("",!0),l("div",ee,[h(o,{onClick:t[2]||(t[2]=e=>L())},{default:u(()=>[y("BACK")]),_:1})])])]),_:1})])}}});const he=M(te,[["__scopeId","data-v-8484fbc1"]]);export{he as default};