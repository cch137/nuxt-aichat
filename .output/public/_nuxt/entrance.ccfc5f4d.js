import{E as _}from"./el-input.061f730f.js";import{E as x}from"./el-button.fad26086.js";import{i as V,r as p,c as h,a as E,b as s,j as n,k as u,w as g,E as d,D as v,o as w,d as y}from"./entry.ba7d954e.js";import{u as N}from"./useAdmin.a631a3bc.js";import{u as k}from"./useTitle.85d9b5f6.js";import"./use-form-item.4e7a4467.js";const B={class:"flex-col flex-center gap-2"},b={class:"flex gap-2 my-8"},P={__name:"entrance",setup(T){const c=V("appName").value,a=p(""),{adminPassword:o}=N(),m=p(!1),i=()=>{$fetch("/api/auth/replaceUser",{method:"POST",body:{password:o.value,id:a.value}}).then(e=>{e!=null&&e.error?d.error(e==null?void 0:e.error):v().$router.push("/c/")}).catch(e=>{d.error(e)})};return k(`Entrance - ${c}`),(e,t)=>{const r=_,f=x;return w(),h("div",B,[E("div",b,[s(r,{type:"text",placeholder:"id",modelValue:n(a),"onUpdate:modelValue":t[0]||(t[0]=l=>u(a)?a.value=l:null)},null,8,["modelValue"]),s(r,{type:"password",placeholder:"password",modelValue:n(o),"onUpdate:modelValue":t[1]||(t[1]=l=>u(o)?o.value=l:null)},null,8,["modelValue"]),s(f,{type:"primary",onClick:i,loading:n(m)},{default:g(()=>[y("GO")]),_:1},8,["loading"])])])}}};export{P as default};