import{E as _}from"./el-input.c348ab8f.js";import{E as x}from"./el-button.62b8687a.js";import{i as V,r as p,c as h,a as E,b as s,j as n,k as u,w as g,E as d,D as v,o as w,d as y}from"./entry.4eb90b85.js";import{u as N}from"./useAdmin.dbc993ef.js";import{u as k}from"./useTitle.ea0faea4.js";const B={class:"flex-col flex-center gap-2"},b={class:"flex gap-2 my-8"},O={__name:"entrance",setup(T){const c=V("appName").value,a=p(""),{adminPassword:o}=N(),m=p(!1),i=()=>{$fetch("/api/auth/replaceUser",{method:"POST",body:{password:o.value,id:a.value}}).then(e=>{e!=null&&e.error?d.error(e==null?void 0:e.error):v().$router.push("/")}).catch(e=>{d.error(e)})};return k(`Entrance - ${c}`),(e,t)=>{const r=_,f=x;return w(),h("div",B,[E("div",b,[s(r,{type:"text",placeholder:"id",modelValue:n(a),"onUpdate:modelValue":t[0]||(t[0]=l=>u(a)?a.value=l:null)},null,8,["modelValue"]),s(r,{type:"password",placeholder:"password",modelValue:n(o),"onUpdate:modelValue":t[1]||(t[1]=l=>u(o)?o.value=l:null)},null,8,["modelValue"]),s(f,{type:"primary",onClick:i,loading:n(m)},{default:g(()=>[y("GO")]),_:1},8,["loading"])])])}}};export{O as default};