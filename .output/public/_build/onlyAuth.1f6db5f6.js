import{aU as a,aV as s,C as u}from"./entry.337d13a0.js";import{u as r}from"./useAuth.5ec6db09.js";const p=a(async(c,i)=>{let e,t;{const o=r();[e,t]=s(()=>o.checkIsLoggedIn()),e=await e,t(),!e&&setTimeout(()=>u().$router.replace("/login"),0)}});export{p as default};