import{E as _}from"./el-input.d87563b5.js";import{E as h}from"./el-button.7a9f65de.js";import{h as x,r as p,c as V,a as E,b as s,i as n,j as u,w as g,E as d,C as v,o as w,d as y}from"./entry.337d13a0.js";import{u as N}from"./useAdmin.b6dd11a6.js";import{u as B}from"./useTitle.63034ec4.js";import"./use-form-item.2ef56732.js";import"./index.fb7bb0f1.js";import"./vue.f36acd1f.c0857e96.js";const b={class:"flex-col flex-center gap-2"},k={class:"flex gap-2 my-8"},j={__name:"entrance",setup(C){const m=x("appName").value,o=p(""),{adminPassword:a}=N(),i=p(!1),c=()=>{$fetch("/api/auth/replaceUser",{method:"POST",body:{password:a.value,id:o.value}}).then(e=>{e!=null&&e.error?d.error(e==null?void 0:e.error):v().$router.push("/")}).catch(e=>{d.error(e)})};return B(`Entrance - ${m}`),(e,t)=>{const r=_,f=h;return w(),V("div",b,[E("div",k,[s(r,{type:"text",placeholder:"id",modelValue:n(o),"onUpdate:modelValue":t[0]||(t[0]=l=>u(o)?o.value=l:null)},null,8,["modelValue"]),s(r,{type:"password",placeholder:"password",modelValue:n(a),"onUpdate:modelValue":t[1]||(t[1]=l=>u(a)?a.value=l:null)},null,8,["modelValue"]),s(f,{type:"primary",onClick:c,loading:n(i)},{default:g(()=>[y("GO")]),_:1},8,["loading"])])])}}};export{j as default};