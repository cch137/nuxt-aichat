import{b as rt,d as Mt,e as Ae,f as ge,t as Lt}from"./el-input.a048f47e.js";import{b7 as qe,b8 as Nt,b9 as nt,ba as Rt,$ as Me,bb as it,a0 as Bt,a4 as je,bc as at,a5 as ve,aq as Ct,al as me,a7 as st,r as C,ac as T,f as H,a8 as Ee,g as ne,ax as ot,k as ft,ay as lt,o as ye,c as ut,ah as ee,T as K,i as E,ai as dt,aK as ct,am as ie,ae as pt,bd as gt,aL as Wt,be as Vt,b as ae,F as Dt,ap as vt,at as Ut,bf as zt,bg as Gt,ad as Le,bh as de,w as ce,l as Kt,aw as Yt,n as Ne,d as Jt,t as Re,s as Be,a as Ce,bi as Zt,aj as Ht,az as Qt}from"./entry.e6e23e13.js";import{c as he}from"./castArray.0e05eee0.js";import{b as mt,c as Xt,d as kt,o as er,k as yt,g as ht,s as tr,a as rr,e as nr,U as We,f as Te,n as se,h as bt,j as ir,S as ar,l as sr}from"./_Uint8Array.be944d2d.js";var Ve=Object.create,or=function(){function r(){}return function(e){if(!qe(e))return{};if(Ve)return Ve(e);r.prototype=e;var t=new r;return r.prototype=void 0,t}}();const fr=or;function lr(r,e){var t=-1,n=r.length;for(e||(e=Array(n));++t<n;)e[t]=r[t];return e}function ur(r,e){for(var t=-1,n=r==null?0:r.length;++t<n&&e(r[t],t,r)!==!1;);return r}function oe(r,e,t,n){var i=!t;t||(t={});for(var s=-1,a=e.length;++s<a;){var o=e[s],l=n?n(t[o],r[o],o,t,r):void 0;l===void 0&&(l=r[o]),i?Nt(t,o,l):nt(t,o,l)}return t}function dr(r){var e=[];if(r!=null)for(var t in Object(r))e.push(t);return e}var cr=Object.prototype,pr=cr.hasOwnProperty;function gr(r){if(!qe(r))return dr(r);var e=mt(r),t=[];for(var n in r)n=="constructor"&&(e||!pr.call(r,n))||t.push(n);return t}function Se(r){return Xt(r)?kt(r,!0):gr(r)}var vr=er(Object.getPrototypeOf,Object);const wt=vr;function mr(r,e){return r&&oe(e,yt(e),r)}function yr(r,e){return r&&oe(e,Se(e),r)}var Ft=typeof exports=="object"&&exports&&!exports.nodeType&&exports,De=Ft&&typeof module=="object"&&module&&!module.nodeType&&module,hr=De&&De.exports===Ft,Ue=hr?Rt.Buffer:void 0,ze=Ue?Ue.allocUnsafe:void 0;function br(r,e){if(e)return r.slice();var t=r.length,n=ze?ze(t):new r.constructor(t);return r.copy(n),n}function wr(r,e){return oe(r,ht(r),e)}var Fr=Object.getOwnPropertySymbols,xr=Fr?function(r){for(var e=[];r;)rr(e,ht(r)),r=wt(r);return e}:tr;const xt=xr;function Or(r,e){return oe(r,xt(r),e)}function Ar(r){return nr(r,Se,xt)}var qr=Object.prototype,jr=qr.hasOwnProperty;function Er(r){var e=r.length,t=new r.constructor(e);return e&&typeof r[0]=="string"&&jr.call(r,"index")&&(t.index=r.index,t.input=r.input),t}function _e(r){var e=new r.constructor(r.byteLength);return new We(e).set(new We(r)),e}function Tr(r,e){var t=e?_e(r.buffer):r.buffer;return new r.constructor(t,r.byteOffset,r.byteLength)}var Sr=/\w*$/;function _r(r){var e=new r.constructor(r.source,Sr.exec(r));return e.lastIndex=r.lastIndex,e}var Ge=Me?Me.prototype:void 0,Ke=Ge?Ge.valueOf:void 0;function Pr(r){return Ke?Object(Ke.call(r)):{}}function $r(r,e){var t=e?_e(r.buffer):r.buffer;return new r.constructor(t,r.byteOffset,r.length)}var Ir="[object Boolean]",Mr="[object Date]",Lr="[object Map]",Nr="[object Number]",Rr="[object RegExp]",Br="[object Set]",Cr="[object String]",Wr="[object Symbol]",Vr="[object ArrayBuffer]",Dr="[object DataView]",Ur="[object Float32Array]",zr="[object Float64Array]",Gr="[object Int8Array]",Kr="[object Int16Array]",Yr="[object Int32Array]",Jr="[object Uint8Array]",Zr="[object Uint8ClampedArray]",Hr="[object Uint16Array]",Qr="[object Uint32Array]";function Xr(r,e,t){var n=r.constructor;switch(e){case Vr:return _e(r);case Ir:case Mr:return new n(+r);case Dr:return Tr(r,t);case Ur:case zr:case Gr:case Kr:case Yr:case Jr:case Zr:case Hr:case Qr:return $r(r,t);case Lr:return new n;case Nr:case Cr:return new n(r);case Rr:return _r(r);case Br:return new n;case Wr:return Pr(r)}}function kr(r){return typeof r.constructor=="function"&&!mt(r)?fr(wt(r)):{}}var en="[object Map]";function tn(r){return it(r)&&Te(r)==en}var Ye=se&&se.isMap,rn=Ye?bt(Ye):tn;const nn=rn;var an="[object Set]";function sn(r){return it(r)&&Te(r)==an}var Je=se&&se.isSet,on=Je?bt(Je):sn;const fn=on;var ln=1,un=2,dn=4,Ot="[object Arguments]",cn="[object Array]",pn="[object Boolean]",gn="[object Date]",vn="[object Error]",At="[object Function]",mn="[object GeneratorFunction]",yn="[object Map]",hn="[object Number]",qt="[object Object]",bn="[object RegExp]",wn="[object Set]",Fn="[object String]",xn="[object Symbol]",On="[object WeakMap]",An="[object ArrayBuffer]",qn="[object DataView]",jn="[object Float32Array]",En="[object Float64Array]",Tn="[object Int8Array]",Sn="[object Int16Array]",_n="[object Int32Array]",Pn="[object Uint8Array]",$n="[object Uint8ClampedArray]",In="[object Uint16Array]",Mn="[object Uint32Array]",O={};O[Ot]=O[cn]=O[An]=O[qn]=O[pn]=O[gn]=O[jn]=O[En]=O[Tn]=O[Sn]=O[_n]=O[yn]=O[hn]=O[qt]=O[bn]=O[wn]=O[Fn]=O[xn]=O[Pn]=O[$n]=O[In]=O[Mn]=!0;O[vn]=O[At]=O[On]=!1;function te(r,e,t,n,i,s){var a,o=e&ln,l=e&un,w=e&dn;if(t&&(a=i?t(r,n,i,s):t(r)),a!==void 0)return a;if(!qe(r))return r;var c=Bt(r);if(c){if(a=Er(r),!o)return lr(r,a)}else{var g=Te(r),b=g==At||g==mn;if(ir(r))return br(r,o);if(g==qt||g==Ot||b&&!i){if(a=l||b?{}:kr(r),!o)return l?Or(r,yr(a,r)):wr(r,mr(a,r))}else{if(!O[g])return i?r:{};a=Xr(r,g,o)}}s||(s=new ar);var q=s.get(r);if(q)return q;s.set(r,a),fn(r)?r.forEach(function(v){a.add(te(v,e,t,v,r,s))}):nn(r)&&r.forEach(function(v,f){a.set(f,te(v,e,t,f,r,s))});var j=w?l?Ar:sr:l?Se:yt,d=c?void 0:j(r);return ur(d||r,function(v,f){d&&(f=v,v=r[f]),nt(a,f,te(v,e,t,f,r,s))}),a}var Ln=4;function Ze(r){return te(r,Ln)}const Nn=je({size:{type:String,values:at},disabled:Boolean}),Rn=je({...Nn,model:Object,rules:{type:ve(Object)},labelPosition:{type:String,values:["left","right","top"],default:"right"},requireAsteriskPosition:{type:String,values:["left","right"],default:"left"},labelWidth:{type:[String,Number],default:""},labelSuffix:{type:String,default:""},inline:Boolean,inlineMessage:Boolean,statusIcon:Boolean,showMessage:{type:Boolean,default:!0},validateOnRuleChange:{type:Boolean,default:!0},hideRequiredAsterisk:Boolean,scrollToError:Boolean,scrollIntoViewOptions:{type:[Object,Boolean]}}),Bn={validate:(r,e,t)=>(Ct(r)||me(r))&&st(e)&&me(t)};function Cn(){const r=C([]),e=T(()=>{if(!r.value.length)return"0";const s=Math.max(...r.value);return s?`${s}px`:""});function t(s){const a=r.value.indexOf(s);return a===-1&&e.value,a}function n(s,a){if(s&&a){const o=t(a);r.value.splice(o,1,s)}else s&&r.value.push(s)}function i(s){const a=t(s);a>-1&&r.value.splice(a,1)}return{autoLabelWidth:e,registerLabelWidth:n,deregisterLabelWidth:i}}const X=(r,e)=>{const t=he(e);return t.length>0?r.filter(n=>n.prop&&t.includes(n.prop)):r},Wn="ElForm",Vn=H({name:Wn}),Dn=H({...Vn,props:Rn,emits:Bn,setup(r,{expose:e,emit:t}){const n=r,i=[],s=rt(),a=Ee("form"),o=T(()=>{const{labelPosition:m,inline:u}=n;return[a.b(),a.m(s.value||"default"),{[a.m(`label-${m}`)]:m,[a.m("inline")]:u}]}),l=m=>{i.push(m)},w=m=>{m.prop&&i.splice(i.indexOf(m),1)},c=(m=[])=>{n.model&&X(i,m).forEach(u=>u.resetField())},g=(m=[])=>{X(i,m).forEach(u=>u.clearValidate())},b=T(()=>!!n.model),q=m=>{if(i.length===0)return[];const u=X(i,m);return u.length?u:[]},j=async m=>v(void 0,m),d=async(m=[])=>{if(!b.value)return!1;const u=q(m);if(u.length===0)return!0;let h={};for(const x of u)try{await x.validate("")}catch(A){h={...h,...A}}return Object.keys(h).length===0?!0:Promise.reject(h)},v=async(m=[],u)=>{const h=!ct(u);try{const x=await d(m);return x===!0&&(u==null||u(x)),x}catch(x){if(x instanceof Error)throw x;const A=x;return n.scrollToError&&f(Object.keys(A)[0]),u==null||u(!1,A),h&&Promise.reject(A)}},f=m=>{var u;const h=X(i,m)[0];h&&((u=h.$el)==null||u.scrollIntoView(n.scrollIntoViewOptions))};return ne(()=>n.rules,()=>{n.validateOnRuleChange&&j().catch(m=>Mt())},{deep:!0}),ot(Ae,ft({...lt(n),emit:t,resetFields:c,clearValidate:g,validateField:v,addField:l,removeField:w,...Cn()})),e({validate:j,validateField:v,resetFields:c,clearValidate:g,scrollToField:f}),(m,u)=>(ye(),ut("form",{class:K(E(o))},[ee(m.$slots,"default")],2))}});var Un=dt(Dn,[["__file","/home/runner/work/element-plus/element-plus/packages/components/form/src/form.vue"]]);function W(){return W=Object.assign?Object.assign.bind():function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},W.apply(this,arguments)}function zn(r,e){r.prototype=Object.create(e.prototype),r.prototype.constructor=r,Z(r,e)}function be(r){return be=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},be(r)}function Z(r,e){return Z=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(n,i){return n.__proto__=i,n},Z(r,e)}function Gn(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function re(r,e,t){return Gn()?re=Reflect.construct.bind():re=function(i,s,a){var o=[null];o.push.apply(o,s);var l=Function.bind.apply(i,o),w=new l;return a&&Z(w,a.prototype),w},re.apply(null,arguments)}function Kn(r){return Function.toString.call(r).indexOf("[native code]")!==-1}function we(r){var e=typeof Map=="function"?new Map:void 0;return we=function(n){if(n===null||!Kn(n))return n;if(typeof n!="function")throw new TypeError("Super expression must either be null or a function");if(typeof e<"u"){if(e.has(n))return e.get(n);e.set(n,i)}function i(){return re(n,arguments,be(this).constructor)}return i.prototype=Object.create(n.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),Z(i,n)},we(r)}var Yn=/%[sdj%]/g,Jn=function(){};typeof process<"u"&&process.env;function Fe(r){if(!r||!r.length)return null;var e={};return r.forEach(function(t){var n=t.field;e[n]=e[n]||[],e[n].push(t)}),e}function I(r){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++)t[n-1]=arguments[n];var i=0,s=t.length;if(typeof r=="function")return r.apply(null,t);if(typeof r=="string"){var a=r.replace(Yn,function(o){if(o==="%%")return"%";if(i>=s)return o;switch(o){case"%s":return String(t[i++]);case"%d":return Number(t[i++]);case"%j":try{return JSON.stringify(t[i++])}catch{return"[Circular]"}break;default:return o}});return a}return r}function Zn(r){return r==="string"||r==="url"||r==="hex"||r==="email"||r==="date"||r==="pattern"}function S(r,e){return!!(r==null||e==="array"&&Array.isArray(r)&&!r.length||Zn(e)&&typeof r=="string"&&!r)}function Hn(r,e,t){var n=[],i=0,s=r.length;function a(o){n.push.apply(n,o||[]),i++,i===s&&t(n)}r.forEach(function(o){e(o,a)})}function He(r,e,t){var n=0,i=r.length;function s(a){if(a&&a.length){t(a);return}var o=n;n=n+1,o<i?e(r[o],s):t([])}s([])}function Qn(r){var e=[];return Object.keys(r).forEach(function(t){e.push.apply(e,r[t]||[])}),e}var Qe=function(r){zn(e,r);function e(t,n){var i;return i=r.call(this,"Async Validation Error")||this,i.errors=t,i.fields=n,i}return e}(we(Error));function Xn(r,e,t,n,i){if(e.first){var s=new Promise(function(b,q){var j=function(f){return n(f),f.length?q(new Qe(f,Fe(f))):b(i)},d=Qn(r);He(d,t,j)});return s.catch(function(b){return b}),s}var a=e.firstFields===!0?Object.keys(r):e.firstFields||[],o=Object.keys(r),l=o.length,w=0,c=[],g=new Promise(function(b,q){var j=function(v){if(c.push.apply(c,v),w++,w===l)return n(c),c.length?q(new Qe(c,Fe(c))):b(i)};o.length||(n(c),b(i)),o.forEach(function(d){var v=r[d];a.indexOf(d)!==-1?He(v,t,j):Hn(v,t,j)})});return g.catch(function(b){return b}),g}function kn(r){return!!(r&&r.message!==void 0)}function ei(r,e){for(var t=r,n=0;n<e.length;n++){if(t==null)return t;t=t[e[n]]}return t}function Xe(r,e){return function(t){var n;return r.fullFields?n=ei(e,r.fullFields):n=e[t.field||r.fullField],kn(t)?(t.field=t.field||r.fullField,t.fieldValue=n,t):{message:typeof t=="function"?t():t,fieldValue:n,field:t.field||r.fullField}}}function ke(r,e){if(e){for(var t in e)if(e.hasOwnProperty(t)){var n=e[t];typeof n=="object"&&typeof r[t]=="object"?r[t]=W({},r[t],n):r[t]=n}}return r}var jt=function(e,t,n,i,s,a){e.required&&(!n.hasOwnProperty(e.field)||S(t,a||e.type))&&i.push(I(s.messages.required,e.fullField))},ti=function(e,t,n,i,s){(/^\s+$/.test(t)||t==="")&&i.push(I(s.messages.whitespace,e.fullField))},k,ri=function(){if(k)return k;var r="[a-fA-F\\d:]",e=function(h){return h&&h.includeBoundaries?"(?:(?<=\\s|^)(?="+r+")|(?<="+r+")(?=\\s|$))":""},t="(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}",n="[a-fA-F\\d]{1,4}",i=(`
(?:
(?:`+n+":){7}(?:"+n+`|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:`+n+":){6}(?:"+t+"|:"+n+`|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:`+n+":){5}(?::"+t+"|(?::"+n+`){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:`+n+":){4}(?:(?::"+n+"){0,1}:"+t+"|(?::"+n+`){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:`+n+":){3}(?:(?::"+n+"){0,2}:"+t+"|(?::"+n+`){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:`+n+":){2}(?:(?::"+n+"){0,3}:"+t+"|(?::"+n+`){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:`+n+":){1}(?:(?::"+n+"){0,4}:"+t+"|(?::"+n+`){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::`+n+"){0,5}:"+t+"|(?::"+n+`){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`).replace(/\s*\/\/.*$/gm,"").replace(/\n/g,"").trim(),s=new RegExp("(?:^"+t+"$)|(?:^"+i+"$)"),a=new RegExp("^"+t+"$"),o=new RegExp("^"+i+"$"),l=function(h){return h&&h.exact?s:new RegExp("(?:"+e(h)+t+e(h)+")|(?:"+e(h)+i+e(h)+")","g")};l.v4=function(u){return u&&u.exact?a:new RegExp(""+e(u)+t+e(u),"g")},l.v6=function(u){return u&&u.exact?o:new RegExp(""+e(u)+i+e(u),"g")};var w="(?:(?:[a-z]+:)?//)",c="(?:\\S+(?::\\S*)?@)?",g=l.v4().source,b=l.v6().source,q="(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)",j="(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*",d="(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))",v="(?::\\d{2,5})?",f='(?:[/?#][^\\s"]*)?',m="(?:"+w+"|www\\.)"+c+"(?:localhost|"+g+"|"+b+"|"+q+j+d+")"+v+f;return k=new RegExp("(?:^"+m+"$)","i"),k},et={email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,hex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i},Y={integer:function(e){return Y.number(e)&&parseInt(e,10)===e},float:function(e){return Y.number(e)&&!Y.integer(e)},array:function(e){return Array.isArray(e)},regexp:function(e){if(e instanceof RegExp)return!0;try{return!!new RegExp(e)}catch{return!1}},date:function(e){return typeof e.getTime=="function"&&typeof e.getMonth=="function"&&typeof e.getYear=="function"&&!isNaN(e.getTime())},number:function(e){return isNaN(e)?!1:typeof e=="number"},object:function(e){return typeof e=="object"&&!Y.array(e)},method:function(e){return typeof e=="function"},email:function(e){return typeof e=="string"&&e.length<=320&&!!e.match(et.email)},url:function(e){return typeof e=="string"&&e.length<=2048&&!!e.match(ri())},hex:function(e){return typeof e=="string"&&!!e.match(et.hex)}},ni=function(e,t,n,i,s){if(e.required&&t===void 0){jt(e,t,n,i,s);return}var a=["integer","float","array","regexp","object","method","email","number","date","url","hex"],o=e.type;a.indexOf(o)>-1?Y[o](t)||i.push(I(s.messages.types[o],e.fullField,e.type)):o&&typeof t!==e.type&&i.push(I(s.messages.types[o],e.fullField,e.type))},ii=function(e,t,n,i,s){var a=typeof e.len=="number",o=typeof e.min=="number",l=typeof e.max=="number",w=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,c=t,g=null,b=typeof t=="number",q=typeof t=="string",j=Array.isArray(t);if(b?g="number":q?g="string":j&&(g="array"),!g)return!1;j&&(c=t.length),q&&(c=t.replace(w,"_").length),a?c!==e.len&&i.push(I(s.messages[g].len,e.fullField,e.len)):o&&!l&&c<e.min?i.push(I(s.messages[g].min,e.fullField,e.min)):l&&!o&&c>e.max?i.push(I(s.messages[g].max,e.fullField,e.max)):o&&l&&(c<e.min||c>e.max)&&i.push(I(s.messages[g].range,e.fullField,e.min,e.max))},z="enum",ai=function(e,t,n,i,s){e[z]=Array.isArray(e[z])?e[z]:[],e[z].indexOf(t)===-1&&i.push(I(s.messages[z],e.fullField,e[z].join(", ")))},si=function(e,t,n,i,s){if(e.pattern){if(e.pattern instanceof RegExp)e.pattern.lastIndex=0,e.pattern.test(t)||i.push(I(s.messages.pattern.mismatch,e.fullField,t,e.pattern));else if(typeof e.pattern=="string"){var a=new RegExp(e.pattern);a.test(t)||i.push(I(s.messages.pattern.mismatch,e.fullField,t,e.pattern))}}},y={required:jt,whitespace:ti,type:ni,range:ii,enum:ai,pattern:si},oi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t,"string")&&!e.required)return n();y.required(e,t,i,a,s,"string"),S(t,"string")||(y.type(e,t,i,a,s),y.range(e,t,i,a,s),y.pattern(e,t,i,a,s),e.whitespace===!0&&y.whitespace(e,t,i,a,s))}n(a)},fi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&y.type(e,t,i,a,s)}n(a)},li=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(t===""&&(t=void 0),S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&(y.type(e,t,i,a,s),y.range(e,t,i,a,s))}n(a)},ui=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&y.type(e,t,i,a,s)}n(a)},di=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),S(t)||y.type(e,t,i,a,s)}n(a)},ci=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&(y.type(e,t,i,a,s),y.range(e,t,i,a,s))}n(a)},pi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&(y.type(e,t,i,a,s),y.range(e,t,i,a,s))}n(a)},gi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(t==null&&!e.required)return n();y.required(e,t,i,a,s,"array"),t!=null&&(y.type(e,t,i,a,s),y.range(e,t,i,a,s))}n(a)},vi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&y.type(e,t,i,a,s)}n(a)},mi="enum",yi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s),t!==void 0&&y[mi](e,t,i,a,s)}n(a)},hi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t,"string")&&!e.required)return n();y.required(e,t,i,a,s),S(t,"string")||y.pattern(e,t,i,a,s)}n(a)},bi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t,"date")&&!e.required)return n();if(y.required(e,t,i,a,s),!S(t,"date")){var l;t instanceof Date?l=t:l=new Date(t),y.type(e,l,i,a,s),l&&y.range(e,l.getTime(),i,a,s)}}n(a)},wi=function(e,t,n,i,s){var a=[],o=Array.isArray(t)?"array":typeof t;y.required(e,t,i,a,s,o),n(a)},pe=function(e,t,n,i,s){var a=e.type,o=[],l=e.required||!e.required&&i.hasOwnProperty(e.field);if(l){if(S(t,a)&&!e.required)return n();y.required(e,t,i,o,s,a),S(t,a)||y.type(e,t,i,o,s)}n(o)},Fi=function(e,t,n,i,s){var a=[],o=e.required||!e.required&&i.hasOwnProperty(e.field);if(o){if(S(t)&&!e.required)return n();y.required(e,t,i,a,s)}n(a)},J={string:oi,method:fi,number:li,boolean:ui,regexp:di,integer:ci,float:pi,array:gi,object:vi,enum:yi,pattern:hi,date:bi,url:pe,hex:pe,email:pe,required:wi,any:Fi};function xe(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var e=JSON.parse(JSON.stringify(this));return e.clone=this.clone,e}}}var Oe=xe(),Q=function(){function r(t){this.rules=null,this._messages=Oe,this.define(t)}var e=r.prototype;return e.define=function(n){var i=this;if(!n)throw new Error("Cannot configure a schema with no rules");if(typeof n!="object"||Array.isArray(n))throw new Error("Rules must be an object");this.rules={},Object.keys(n).forEach(function(s){var a=n[s];i.rules[s]=Array.isArray(a)?a:[a]})},e.messages=function(n){return n&&(this._messages=ke(xe(),n)),this._messages},e.validate=function(n,i,s){var a=this;i===void 0&&(i={}),s===void 0&&(s=function(){});var o=n,l=i,w=s;if(typeof l=="function"&&(w=l,l={}),!this.rules||Object.keys(this.rules).length===0)return w&&w(null,o),Promise.resolve(o);function c(d){var v=[],f={};function m(h){if(Array.isArray(h)){var x;v=(x=v).concat.apply(x,h)}else v.push(h)}for(var u=0;u<d.length;u++)m(d[u]);v.length?(f=Fe(v),w(v,f)):w(null,o)}if(l.messages){var g=this.messages();g===Oe&&(g=xe()),ke(g,l.messages),l.messages=g}else l.messages=this.messages();var b={},q=l.keys||Object.keys(this.rules);q.forEach(function(d){var v=a.rules[d],f=o[d];v.forEach(function(m){var u=m;typeof u.transform=="function"&&(o===n&&(o=W({},o)),f=o[d]=u.transform(f)),typeof u=="function"?u={validator:u}:u=W({},u),u.validator=a.getValidationMethod(u),u.validator&&(u.field=d,u.fullField=u.fullField||d,u.type=a.getType(u),b[d]=b[d]||[],b[d].push({rule:u,value:f,source:o,field:d}))})});var j={};return Xn(b,l,function(d,v){var f=d.rule,m=(f.type==="object"||f.type==="array")&&(typeof f.fields=="object"||typeof f.defaultField=="object");m=m&&(f.required||!f.required&&d.value),f.field=d.field;function u(A,L){return W({},L,{fullField:f.fullField+"."+A,fullFields:f.fullFields?[].concat(f.fullFields,[A]):[A]})}function h(A){A===void 0&&(A=[]);var L=Array.isArray(A)?A:[A];!l.suppressWarning&&L.length&&r.warning("async-validator:",L),L.length&&f.message!==void 0&&(L=[].concat(f.message));var $=L.map(Xe(f,o));if(l.first&&$.length)return j[f.field]=1,v($);if(!m)v($);else{if(f.required&&!d.value)return f.message!==void 0?$=[].concat(f.message).map(Xe(f,o)):l.error&&($=[l.error(f,I(l.messages.required,f.field))]),v($);var B={};f.defaultField&&Object.keys(d.value).map(function(N){B[N]=f.defaultField}),B=W({},B,d.rule.fields);var G={};Object.keys(B).forEach(function(N){var M=B[N],fe=Array.isArray(M)?M:[M];G[N]=fe.map(u.bind(null,N))});var V=new r(G);V.messages(l.messages),d.rule.options&&(d.rule.options.messages=l.messages,d.rule.options.error=l.error),V.validate(d.value,d.rule.options||l,function(N){var M=[];$&&$.length&&M.push.apply(M,$),N&&N.length&&M.push.apply(M,N),v(M.length?M:null)})}}var x;if(f.asyncValidator)x=f.asyncValidator(f,d.value,h,d.source,l);else if(f.validator){try{x=f.validator(f,d.value,h,d.source,l)}catch(A){console.error==null||console.error(A),l.suppressValidatorError||setTimeout(function(){throw A},0),h(A.message)}x===!0?h():x===!1?h(typeof f.message=="function"?f.message(f.fullField||f.field):f.message||(f.fullField||f.field)+" fails"):x instanceof Array?h(x):x instanceof Error&&h(x.message)}x&&x.then&&x.then(function(){return h()},function(A){return h(A)})},function(d){c(d)},o)},e.getType=function(n){if(n.type===void 0&&n.pattern instanceof RegExp&&(n.type="pattern"),typeof n.validator!="function"&&n.type&&!J.hasOwnProperty(n.type))throw new Error(I("Unknown rule type %s",n.type));return n.type||"string"},e.getValidationMethod=function(n){if(typeof n.validator=="function")return n.validator;var i=Object.keys(n),s=i.indexOf("message");return s!==-1&&i.splice(s,1),i.length===1&&i[0]==="required"?J.required:J[this.getType(n)]||void 0},r}();Q.register=function(e,t){if(typeof t!="function")throw new Error("Cannot register a validator by type, validator is not a function");J[e]=t};Q.warning=Jn;Q.messages=Oe;Q.validators=J;const xi=["","error","validating","success"],Oi=je({label:String,labelWidth:{type:[String,Number],default:""},prop:{type:ve([String,Array])},required:{type:Boolean,default:void 0},rules:{type:ve([Object,Array])},error:String,validateStatus:{type:String,values:xi},for:String,inlineMessage:{type:[String,Boolean],default:""},showMessage:{type:Boolean,default:!0},size:{type:String,values:at}}),tt="ElLabelWrap";var Ai=H({name:tt,props:{isAutoWidth:Boolean,updateAll:Boolean},setup(r,{slots:e}){const t=ie(Ae,void 0),n=ie(ge);n||Lt(tt,"usage: <el-form-item><label-wrap /></el-form-item>");const i=Ee("form"),s=C(),a=C(0),o=()=>{var c;if((c=s.value)!=null&&c.firstElementChild){const g=window.getComputedStyle(s.value.firstElementChild).width;return Math.ceil(Number.parseFloat(g))}else return 0},l=(c="update")=>{vt(()=>{e.default&&r.isAutoWidth&&(c==="update"?a.value=o():c==="remove"&&(t==null||t.deregisterLabelWidth(a.value)))})},w=()=>l("update");return pt(()=>{w()}),gt(()=>{l("remove")}),Wt(()=>w()),ne(a,(c,g)=>{r.updateAll&&(t==null||t.registerLabelWidth(c,g))}),Vt(T(()=>{var c,g;return(g=(c=s.value)==null?void 0:c.firstElementChild)!=null?g:null}),w),()=>{var c,g;if(!e)return null;const{isAutoWidth:b}=r;if(b){const q=t==null?void 0:t.autoLabelWidth,j=n==null?void 0:n.hasLabel,d={};if(j&&q&&q!=="auto"){const v=Math.max(0,Number.parseInt(q,10)-a.value),f=t.labelPosition==="left"?"marginRight":"marginLeft";v&&(d[f]=`${v}px`)}return ae("div",{ref:s,class:[i.be("item","label-wrap")],style:d},[(c=e.default)==null?void 0:c.call(e)])}else return ae(Dt,{ref:s},[(g=e.default)==null?void 0:g.call(e)])}}});const qi=["role","aria-labelledby"],ji=H({name:"ElFormItem"}),Ei=H({...ji,props:Oi,setup(r,{expose:e}){const t=r,n=Ut(),i=ie(Ae,void 0),s=ie(ge,void 0),a=rt(void 0,{formItem:!1}),o=Ee("form-item"),l=zt().value,w=C([]),c=C(""),g=Gt(c,100),b=C(""),q=C();let j,d=!1;const v=T(()=>{if((i==null?void 0:i.labelPosition)==="top")return{};const p=Le(t.labelWidth||(i==null?void 0:i.labelWidth)||"");return p?{width:p}:{}}),f=T(()=>{if((i==null?void 0:i.labelPosition)==="top"||i!=null&&i.inline)return{};if(!t.label&&!t.labelWidth&&B)return{};const p=Le(t.labelWidth||(i==null?void 0:i.labelWidth)||"");return!t.label&&!n.label?{marginLeft:p}:{}}),m=T(()=>[o.b(),o.m(a.value),o.is("error",c.value==="error"),o.is("validating",c.value==="validating"),o.is("success",c.value==="success"),o.is("required",fe.value||t.required),o.is("no-asterisk",i==null?void 0:i.hideRequiredAsterisk),(i==null?void 0:i.requireAsteriskPosition)==="right"?"asterisk-right":"asterisk-left",{[o.m("feedback")]:i==null?void 0:i.statusIcon}]),u=T(()=>st(t.inlineMessage)?t.inlineMessage:(i==null?void 0:i.inlineMessage)||!1),h=T(()=>[o.e("error"),{[o.em("error","inline")]:u.value}]),x=T(()=>t.prop?me(t.prop)?t.prop:t.prop.join("."):""),A=T(()=>!!(t.label||n.label)),L=T(()=>t.for||(w.value.length===1?w.value[0]:void 0)),$=T(()=>!L.value&&A.value),B=!!s,G=T(()=>{const p=i==null?void 0:i.model;if(!(!p||!t.prop))return de(p,t.prop).value}),V=T(()=>{const{required:p}=t,F=[];t.rules&&F.push(...he(t.rules));const P=i==null?void 0:i.rules;if(P&&t.prop){const _=de(P,t.prop).value;_&&F.push(...he(_))}if(p!==void 0){const _=F.map((R,U)=>[R,U]).filter(([R])=>Object.keys(R).includes("required"));if(_.length>0)for(const[R,U]of _)R.required!==p&&(F[U]={...R,required:p});else F.push({required:p})}return F}),N=T(()=>V.value.length>0),M=p=>V.value.filter(P=>!P.trigger||!p?!0:Array.isArray(P.trigger)?P.trigger.includes(p):P.trigger===p).map(({trigger:P,..._})=>_),fe=T(()=>V.value.some(p=>p.required)),Tt=T(()=>{var p;return g.value==="error"&&t.showMessage&&((p=i==null?void 0:i.showMessage)!=null?p:!0)}),Pe=T(()=>`${t.label||""}${(i==null?void 0:i.labelSuffix)||""}`),D=p=>{c.value=p},St=p=>{var F,P;const{errors:_,fields:R}=p;(!_||!R)&&console.error(p),D("error"),b.value=_?(P=(F=_==null?void 0:_[0])==null?void 0:F.message)!=null?P:`${t.prop} is required`:"",i==null||i.emit("validate",t.prop,!1,b.value)},_t=()=>{D("success"),i==null||i.emit("validate",t.prop,!0,"")},Pt=async p=>{const F=x.value;return new Q({[F]:p}).validate({[F]:G.value},{firstFields:!0}).then(()=>(_t(),!0)).catch(_=>(St(_),Promise.reject(_)))},$e=async(p,F)=>{if(d||!t.prop)return!1;const P=ct(F);if(!N.value)return F==null||F(!1),!1;const _=M(p);return _.length===0?(F==null||F(!0),!0):(D("validating"),Pt(_).then(()=>(F==null||F(!0),!0)).catch(R=>{const{fields:U}=R;return F==null||F(!1,U),P?!1:Promise.reject(U)}))},le=()=>{D(""),b.value="",d=!1},Ie=async()=>{const p=i==null?void 0:i.model;if(!p||!t.prop)return;const F=de(p,t.prop);d=!0,F.value=Ze(j),await vt(),le(),d=!1},$t=p=>{w.value.includes(p)||w.value.push(p)},It=p=>{w.value=w.value.filter(F=>F!==p)};ne(()=>t.error,p=>{b.value=p||"",D(p?"error":"")},{immediate:!0}),ne(()=>t.validateStatus,p=>D(p||""));const ue=ft({...lt(t),$el:q,size:a,validateState:c,labelId:l,inputIds:w,isGroup:$,hasLabel:A,addInputId:$t,removeInputId:It,resetField:Ie,clearValidate:le,validate:$e});return ot(ge,ue),pt(()=>{t.prop&&(i==null||i.addField(ue),j=Ze(G.value))}),gt(()=>{i==null||i.removeField(ue)}),e({size:a,validateMessage:b,validateState:c,validate:$e,clearValidate:le,resetField:Ie}),(p,F)=>{var P;return ye(),ut("div",{ref_key:"formItemRef",ref:q,class:K(E(m)),role:E($)?"group":void 0,"aria-labelledby":E($)?E(l):void 0},[ae(E(Ai),{"is-auto-width":E(v).width==="auto","update-all":((P=E(i))==null?void 0:P.labelWidth)==="auto"},{default:ce(()=>[E(A)?(ye(),Kt(Yt(E(L)?"label":"div"),{key:0,id:E(l),for:E(L),class:K(E(o).e("label")),style:Ne(E(v))},{default:ce(()=>[ee(p.$slots,"label",{label:E(Pe)},()=>[Jt(Re(E(Pe)),1)])]),_:3},8,["id","for","class","style"])):Be("v-if",!0)]),_:3},8,["is-auto-width","update-all"]),Ce("div",{class:K(E(o).e("content")),style:Ne(E(f))},[ee(p.$slots,"default"),ae(Zt,{name:`${E(o).namespace.value}-zoom-in-top`},{default:ce(()=>[E(Tt)?ee(p.$slots,"error",{key:0,error:b.value},()=>[Ce("div",{class:K(E(h))},Re(b.value),3)]):Be("v-if",!0)]),_:3},8,["name"])],6)],10,qi)}}});var Et=dt(Ei,[["__file","/home/runner/work/element-plus/element-plus/packages/components/form/src/form-item.vue"]]);const $i=Ht(Un,{FormItem:Et}),Ii=Qt(Et);export{Ii as E,$i as a};