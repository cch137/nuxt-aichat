import { E as ElSelect, a as ElOption } from './index-2386230b.mjs';
import { E as ElInput } from './index-31a06245.mjs';
import { E as ElButton } from './index-c43b95d6.mjs';
import { b as useLocale, d as useState } from '../server.mjs';
import { defineComponent, ref, mergeProps, unref, isRef, withCtx, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { A as switch_default } from './index-5a3c9e78.mjs';
import { a as getDefaultExportFromCjs } from '../../rollup/_commonjsHelpers.mjs';
import '@vueuse/core';
import '@popperjs/core';
import './aria-30c2b077.mjs';
import '@vue/shared';
import 'lodash-unified';
import './focus-trap-f1b636c1.mjs';
import '@ctrl/tinycolor';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'cookie';
import 'vue-i18n';
import 'crypto-js/sha3.js';
import 'prismjs';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

var es = {exports: {}};

var lexer = {};

var token = {};

(function (exports) {
function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a]);}return e},e.apply(this,arguments)}Object.defineProperty(exports,"__esModule",{value:!0});var t,o={0:11,1:0,2:3,3:0,4:0,5:0,6:0,7:11,8:11,9:1,10:10,11:0,12:11,13:0,14:-1};exports.tokenTypes=void 0,(t=exports.tokenTypes||(exports.tokenTypes={}))[t.FUNCTION_WITH_ONE_ARG=0]="FUNCTION_WITH_ONE_ARG",t[t.NUMBER=1]="NUMBER",t[t.BINARY_OPERATOR_HIGH_PRECENDENCE=2]="BINARY_OPERATOR_HIGH_PRECENDENCE",t[t.CONSTANT=3]="CONSTANT",t[t.OPENING_PARENTHESIS=4]="OPENING_PARENTHESIS",t[t.CLOSING_PARENTHESIS=5]="CLOSING_PARENTHESIS",t[t.DECIMAL=6]="DECIMAL",t[t.POSTFIX_FUNCTION_WITH_ONE_ARG=7]="POSTFIX_FUNCTION_WITH_ONE_ARG",t[t.FUNCTION_WITH_N_ARGS=8]="FUNCTION_WITH_N_ARGS",t[t.BINARY_OPERATOR_LOW_PRECENDENCE=9]="BINARY_OPERATOR_LOW_PRECENDENCE",t[t.BINARY_OPERATOR_PERMUTATION=10]="BINARY_OPERATOR_PERMUTATION",t[t.COMMA=11]="COMMA",t[t.EVALUATED_FUNCTION=12]="EVALUATED_FUNCTION",t[t.EVALUATED_FUNCTION_PARAMETER=13]="EVALUATED_FUNCTION_PARAMETER",t[t.SPACE=14]="SPACE",exports.createTokens=function(t){return [{token:"sin",show:"sin",type:0,value:t.math.sin},{token:"cos",show:"cos",type:0,value:t.math.cos},{token:"tan",show:"tan",type:0,value:t.math.tan},{token:"pi",show:"&pi;",type:3,value:"PI"},{token:"(",show:"(",type:4,value:"("},{token:")",show:")",type:5,value:")"},{token:"P",show:"P",type:10,value:t.math.P},{token:"C",show:"C",type:10,value:t.math.C},{token:" ",show:" ",type:14,value:" ".anchor},{token:"asin",show:"asin",type:0,value:t.math.asin},{token:"acos",show:"acos",type:0,value:t.math.acos},{token:"atan",show:"atan",type:0,value:t.math.atan},{token:"7",show:"7",type:1,value:"7"},{token:"8",show:"8",type:1,value:"8"},{token:"9",show:"9",type:1,value:"9"},{token:"int",show:"Int",type:0,value:Math.floor},{token:"cosh",show:"cosh",type:0,value:t.math.cosh},{token:"acosh",show:"acosh",type:0,value:t.math.acosh},{token:"ln",show:" ln",type:0,value:Math.log},{token:"^",show:"^",type:10,value:Math.pow},{token:"root",show:"root",type:0,value:Math.sqrt},{token:"4",show:"4",type:1,value:"4"},{token:"5",show:"5",type:1,value:"5"},{token:"6",show:"6",type:1,value:"6"},{token:"/",show:"&divide;",type:2,value:t.math.div},{token:"!",show:"!",type:7,value:t.math.fact},{token:"tanh",show:"tanh",type:0,value:t.math.tanh},{token:"atanh",show:"atanh",type:0,value:t.math.atanh},{token:"Mod",show:" Mod ",type:2,value:t.math.mod},{token:"1",show:"1",type:1,value:"1"},{token:"2",show:"2",type:1,value:"2"},{token:"3",show:"3",type:1,value:"3"},{token:"*",show:"&times;",type:2,value:t.math.mul},{token:"sinh",show:"sinh",type:0,value:t.math.sinh},{token:"asinh",show:"asinh",type:0,value:t.math.asinh},{token:"e",show:"e",type:3,value:"E"},{token:"log",show:" log",type:0,value:t.math.log},{token:"0",show:"0",type:1,value:"0"},{token:".",show:".",type:6,value:"."},{token:"+",show:"+",type:9,value:t.math.add},{token:"-",show:"-",type:9,value:t.math.sub},{token:",",show:",",type:11,value:","},{token:"Sigma",show:"&Sigma;",type:12,value:t.math.sigma},{token:"n",show:"n",type:13,value:"n"},{token:"Pi",show:"&Pi;",type:12,value:t.math.Pi},{token:"pow",show:"pow",type:8,value:Math.pow,numberOfArguments:2},{token:"&",show:"&",type:9,value:t.math.and}].map((function(t){return e({},t,{precedence:o[t.type]})}))},exports.preced=o; 
} (token));

Object.defineProperty(lexer,"__esModule",{value:!0});var e$1=token;function t$1(e,t){for(var n=0;n<e.length;n++)e[n]+=t;return e}var n={0:!0,1:!0,3:!0,4:!0,6:!0,8:!0,9:!0,12:!0,13:!0,14:!0},r$1={0:!0,1:!0,2:!0,3:!0,4:!0,5:!0,6:!0,7:!0,8:!0,9:!0,10:!0,11:!0,12:!0,13:!0},s$1={0:!0,3:!0,4:!0,8:!0,12:!0,13:!0},h={},o$1={0:!0,1:!0,3:!0,4:!0,6:!0,8:!0,12:!0,13:!0},p={1:!0},u=[[],["1","2","3","7","8","9","4","5","6","+","-","*","/","(",")","^","!","P","C","e","0",".",",","n"," ","&"],["pi","ln","Pi"],["sin","cos","tan","Del","int","Mod","log","pow"],["asin","acos","atan","cosh","root","tanh","sinh"],["acosh","atanh","asinh","Sigma"]];function a(e,t,n,r){for(var s=0;s<r;s++)if(e[n+s]!==t[s])return !1;return !0}function i$1(e,t){for(var n=0;n<t.length;n++)if(t[n].token===e)return n;return -1}lexer.addToken=function(t){for(var n=0;n<t.length;n++){var r=t[n].token.length,s=-1;t[n].type===e$1.tokenTypes.FUNCTION_WITH_N_ARGS&&void 0===t[n].numberOfArguments&&(t[n].numberOfArguments=2),u[r]=u[r]||[];for(var h=0;h<u[r].length;h++)if(t[n].token===u[r][h]){s=i$1(u[r][h],this.tokens);break}-1===s?(this.tokens.push(t[n]),t[n].precedence=e$1.preced[t[n].type],u.length<=t[n].token.length&&(u[t[n].token.length]=[]),u[t[n].token.length].push(t[n].token)):(this.tokens[s]=t[n],t[n].precedence=e$1.preced[t[n].type]);}},lexer.lex=function(e,l){var f,c={value:this.math.changeSign,type:0,precedence:4,show:"-"},g={value:")",show:")",type:5,precedence:0},d={value:"(",type:4,precedence:0,show:"("},v=[d],w=[],y=e,m=n,k=0,b=h,O="";void 0!==l&&this.addToken(l);var x=function(e,t){for(var n,r,s,h=[],o=t.length,p=0;p<o;p++)if(!(p<o-1&&" "===t[p]&&" "===t[p+1])){for(n="",r=t.length-p>u.length-2?u.length-1:t.length-p;r>0;r--)if(void 0!==u[r])for(s=0;s<u[r].length;s++)a(t,u[r][s],p,r)&&(n=u[r][s],s=u[r].length,r=0);if(p+=n.length-1,""===n)throw new Error("Can't understand after "+t.slice(p));h.push(e.tokens[i$1(n,e.tokens)]);}return h}(this,y);for(f=0;f<x.length;f++){var A=x[f];if(14!==A.type){var E,T=A.token,_=A.type,C=A.value,S=A.precedence,D=A.show,N=v[v.length-1];for(E=w.length;E--&&0===w[E];)if(-1!==[0,2,3,4,5,9,10,11,12,13].indexOf(_)){if(!0!==m[_])throw new Error(T+" is not allowed after "+O);v.push(g),m=r$1,b=o$1,w.pop();}if(!0!==m[_])throw new Error(T+" is not allowed after "+O);!0===b[_]&&(_=2,C=this.math.mul,D="&times;",S=3,f-=1);var P={value:C,type:_,precedence:S,show:D,numberOfArguments:A.numberOfArguments};if(0===_)m=n,b=h,t$1(w,2),v.push(P),4!==x[f+1].type&&(v.push(d),w.push(2));else if(1===_)1===N.type?(N.value+=C,t$1(w,1)):v.push(P),m=r$1,b=s$1;else if(2===_)m=n,b=h,t$1(w,2),v.push(P);else if(3===_)v.push(P),m=r$1,b=o$1;else if(4===_)t$1(w,1),k++,m=n,b=h,v.push(P);else if(5===_){if(!k)throw new Error("Closing parenthesis are more than opening one, wait What!!!");k--,m=r$1,b=o$1,v.push(P),t$1(w,1);}else if(6===_){if(N.hasDec)throw new Error("Two decimals are not allowed in one number");1!==N.type&&(N={show:"0",value:0,type:1,precedence:0},v.push(N)),m=p,t$1(w,1),b=h,N.value+=C,N.hasDec=!0;}else 7===_&&(m=r$1,b=o$1,t$1(w,1),v.push(P));8===_?(m=n,b=h,t$1(w,A.numberOfArguments+2),v.push(P),4!==x[f+1].type&&(v.push(d),w.push(A.numberOfArguments+2))):9===_?(9===N.type?N.value===this.math.add?(N.value=C,N.show=D,t$1(w,1)):N.value===this.math.sub&&"-"===D&&(N.value=this.math.add,N.show="+",t$1(w,1)):5!==N.type&&7!==N.type&&1!==N.type&&3!==N.type&&13!==N.type?"-"===T&&(m=n,b=h,t$1(w,2).push(2),v.push(c),v.push(d)):(v.push(P),t$1(w,2)),m=n,b=h):10===_?(m=n,b=h,t$1(w,2),v.push(P)):11===_?(m=n,b=h,v.push(P)):12===_?(m=n,b=h,t$1(w,6),v.push(P),4!==x[f+1].type&&(v.push(d),w.push(6))):13===_&&(m=r$1,b=o$1,v.push(P)),t$1(w,-1),O=T;}else if(f>0&&f<x.length-1&&1===x[f+1].type&&(1===x[f-1].type||6===x[f-1].type))throw new Error("Unexpected Space")}for(E=w.length;E--;)v.push(g);if(!0!==m[5])throw new Error("complete the expression");for(;k--;)v.push(g);return v.push(g),v};

var postfix = {};

(function (exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.toPostfix=function(e){for(var p,t,u,l=[],o=-1,r=-1,s=[{value:"(",type:4,precedence:0,show:"("}],a=1;a<e.length;a++)if(1===e[a].type||3===e[a].type||13===e[a].type)1===e[a].type&&(e[a].value=Number(e[a].value)),l.push(e[a]);else if(4===e[a].type)s.push(e[a]);else if(5===e[a].type)for(;4!==(null==(h=t=s.pop())?void 0:h.type);){var h;t&&l.push(t);}else if(11===e[a].type){for(;4!==(null==(v=t=s.pop())?void 0:v.type);){var v;t&&l.push(t);}s.push(t);}else {r=(p=e[a]).precedence,o=(u=s[s.length-1]).precedence;var n="Math.pow"==u.value&&"Math.pow"==p.value;if(r>o)s.push(p);else {for(;o>=r&&!n||n&&r<o;)t=s.pop(),u=s[s.length-1],t&&l.push(t),o=u.precedence,n="Math.pow"==p.value&&"Math.pow"==u.value;s.push(p);}}return l}; 
} (postfix));

var postfix_evaluator = {};

(function (exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.postfixEval=function(e,a){(a=a||{}).PI=Math.PI,a.E=Math.E;for(var p,u,r,l=[],s=void 0!==a.n,t=0;t<e.length;t++)if(1===e[t].type)l.push({value:e[t].value,type:1});else if(3===e[t].type)l.push({value:a[e[t].value],type:1});else if(0===e[t].type){var v=l[l.length-1];Array.isArray(v)?v.push(e[t]):v.value=e[t].value(v.value);}else if(7===e[t].type){var y=l[l.length-1];Array.isArray(y)?y.push(e[t]):y.value=e[t].value(y.value);}else if(8===e[t].type){for(var h=[],i=0;i<e[t].numberOfArguments;i++){var o=l.pop();o&&h.push(o.value);}l.push({type:1,value:e[t].value.apply(e[t],h.reverse())});}else if(10===e[t].type)p=l.pop(),u=l.pop(),Array.isArray(u)?((u=u.concat(p)).push(e[t]),l.push(u)):Array.isArray(p)?(p.unshift(u),p.push(e[t]),l.push(p)):l.push({type:1,value:e[t].value(u.value,p.value)});else if(2===e[t].type||9===e[t].type)p=l.pop(),u=l.pop(),Array.isArray(u)?((u=u.concat(p)).push(e[t]),l.push(u)):Array.isArray(p)?(p.unshift(u),p.push(e[t]),l.push(p)):l.push({type:1,value:e[t].value(u.value,p.value)});else if(12===e[t].type){p=l.pop();var n=void 0;n=!Array.isArray(p)&&p?[p]:p||[],u=l.pop(),r=l.pop(),l.push({type:1,value:e[t].value(r.value,u.value,n)});}else 13===e[t].type&&(s?l.push({value:a[e[t].value],type:3}):l.push([e[t]]));if(l.length>1)throw new Error("Uncaught Syntax error");return parseFloat(l[0].value.toFixed(15))}; 
} (postfix_evaluator));

var functions = {};

Object.defineProperty(functions,"__esModule",{value:!0});functions.createMathFunctions=function(t){return {isDegree:!0,acos:function(n){return t.math.isDegree?180/Math.PI*Math.acos(n):Math.acos(n)},add:function(t,n){return t+n},asin:function(n){return t.math.isDegree?180/Math.PI*Math.asin(n):Math.asin(n)},atan:function(n){return t.math.isDegree?180/Math.PI*Math.atan(n):Math.atan(n)},acosh:function(t){return Math.log(t+Math.sqrt(t*t-1))},asinh:function(t){return Math.log(t+Math.sqrt(t*t+1))},atanh:function(t){return Math.log((1+t)/(1-t))},C:function(n,r){var a=1,o=n-r,e=r;e<o&&(e=o,o=r);for(var u=e+1;u<=n;u++)a*=u;var i=t.math.fact(o);return "NaN"===i?"NaN":a/i},changeSign:function(t){return -t},cos:function(n){return t.math.isDegree&&(n=t.math.toRadian(n)),Math.cos(n)},cosh:function(t){return (Math.pow(Math.E,t)+Math.pow(Math.E,-1*t))/2},div:function(t,n){return t/n},fact:function(t){if(t%1!=0)return "NaN";for(var n=1,r=2;r<=t;r++)n*=r;return n},inverse:function(t){return 1/t},log:function(t){return Math.log(t)/Math.log(10)},mod:function(t,n){return t%n},mul:function(t,n){return t*n},P:function(t,n){for(var r=1,a=Math.floor(t)-Math.floor(n)+1;a<=Math.floor(t);a++)r*=a;return r},Pi:function(n,r,a){for(var o=1,e=n;e<=r;e++)o*=Number(t.postfixEval(a,{n:e}));return o},pow10x:function(t){for(var n=1;t--;)n*=10;return n},sigma:function(n,r,a){for(var o=0,e=n;e<=r;e++)o+=Number(t.postfixEval(a,{n:e}));return o},sin:function(n){return t.math.isDegree&&(n=t.math.toRadian(n)),Math.sin(n)},sinh:function(t){return (Math.pow(Math.E,t)-Math.pow(Math.E,-1*t))/2},sub:function(t,n){return t-n},tan:function(n){return t.math.isDegree&&(n=t.math.toRadian(n)),Math.tan(n)},tanh:function(n){return t.math.sinh(n)/t.math.cosh(n)},toRadian:function(t){return t*Math.PI/180},and:function(t,n){return t&n}}};

var t=lexer,e=token,i=postfix,o=postfix_evaluator,s=functions,r=function(){function r(){this.toPostfix=i.toPostfix,this.addToken=t.addToken,this.lex=t.lex,this.postfixEval=o.postfixEval,this.math=s.createMathFunctions(this),this.tokens=e.createTokens(this);}return r.prototype.eval=function(t,e,i){return this.postfixEval(this.toPostfix(this.lex(t,e)),i)},r}();r.TOKEN_TYPES=e.tokenTypes,r.tokenTypes=e.tokenTypes,es.exports=r;

var esExports = es.exports;
const Mexp = /*@__PURE__*/getDefaultExportFromCjs(esExports);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "currency-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const availableCurrencies = ref([]);
    const fxFromCurrency = ref("TWD");
    const fxToCurrency = ref("MYR");
    const fxFromValue = ref("");
    const fxToValue = ref("");
    async function _fetchCurrency(fromCurrency, toCurrency) {
      var _a;
      if (fromCurrency === toCurrency)
        return 1;
      const res = await fetch(`https://api.cch137.link/currency?from=${fromCurrency}&to=${toCurrency}`);
      const fxRate = ((_a = await res.json()) == null ? void 0 : _a.rate) || 0;
      return fxRate;
    }
    const getFxRate = (() => {
      let lastFetchFromCurrency = "";
      let lastFetchToCurrency = "";
      let mustUpdateAfter = 0;
      let fetchPromise = void 0;
      return async () => {
        const fromCurrency = fxFromCurrency.value;
        const toCurrency = fxToCurrency.value;
        if (mustUpdateAfter < Date.now() || lastFetchFromCurrency !== fromCurrency || lastFetchToCurrency !== toCurrency) {
          fetchPromise = _fetchCurrency(fromCurrency, toCurrency);
          lastFetchFromCurrency = fromCurrency;
          lastFetchToCurrency = toCurrency;
          mustUpdateAfter = Date.now() + 5 * 60 * 1e3;
        }
        return await fetchPromise || 1;
      };
    })();
    function roundTo2Digits(amount, add00 = true) {
      const ans = Math.round(amount * 100) / 100;
      if (add00 && ans % 1 === 0) {
        return `${ans}.00`;
      }
      if (!add00 && !ans) {
        return "";
      }
      return ans;
    }
    function _calc(expression) {
      try {
        return new Mexp().eval(expression.toString());
      } catch {
      }
      return +expression || 0;
    }
    async function calcToValue(selfUpdate = false) {
      fxToValue.value = roundTo2Digits(_calc(fxFromValue.value) * await getFxRate());
      if (selfUpdate) {
        fxFromValue.value = roundTo2Digits(_calc(fxFromValue.value), false);
      }
    }
    async function calcFromValue(selfUpdate = false) {
      if (selfUpdate) {
        fxToValue.value = roundTo2Digits(_calc(fxToValue.value));
      }
      fxFromValue.value = roundTo2Digits(_calc(fxToValue.value) / await getFxRate(), false);
    }
    function switchCurrencies() {
      const temp = fxFromCurrency.value;
      fxFromCurrency.value = fxToCurrency.value;
      fxToCurrency.value = temp;
    }
    const _t = useLocale().t;
    const appName = useState("appName").value;
    useTitle(`${_t("page.currencyCvt")} - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_select = ElSelect;
      const _component_el_option = ElOption;
      const _component_el_input = ElInput;
      const _component_el_button = ElButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))}><h1>${ssrInterpolate(_ctx.$t("page.currencyCvt"))}</h1><div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center"><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_el_select, {
        modelValue: unref(fxFromCurrency),
        "onUpdate:modelValue": ($event) => isRef(fxFromCurrency) ? fxFromCurrency.value = $event : null,
        class: "currency-select",
        size: "large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(availableCurrencies), (item) => {
              _push2(ssrRenderComponent(_component_el_option, {
                key: item,
                label: item,
                value: item
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(availableCurrencies), (item) => {
                return openBlock(), createBlock(_component_el_option, {
                  key: item,
                  label: item,
                  value: item
                }, null, 8, ["label", "value"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex-1 flex-center">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(fxFromValue),
        "onUpdate:modelValue": ($event) => isRef(fxFromValue) ? fxFromValue.value = $event : null,
        size: "large",
        class: "FxFromValueInput currency-input",
        onKeyup: ($event) => calcToValue(),
        onChange: ($event) => calcToValue(true)
      }, null, _parent));
      _push(`</div></div><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_el_select, {
        modelValue: unref(fxToCurrency),
        "onUpdate:modelValue": ($event) => isRef(fxToCurrency) ? fxToCurrency.value = $event : null,
        class: "currency-select",
        size: "large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(availableCurrencies), (item) => {
              _push2(ssrRenderComponent(_component_el_option, {
                key: item,
                label: item,
                value: item
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(availableCurrencies), (item) => {
                return openBlock(), createBlock(_component_el_option, {
                  key: item,
                  label: item,
                  value: item
                }, null, 8, ["label", "value"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex-1 flex-center">`);
      _push(ssrRenderComponent(_component_el_input, {
        modelValue: unref(fxToValue),
        "onUpdate:modelValue": ($event) => isRef(fxToValue) ? fxToValue.value = $event : null,
        size: "large",
        class: "FxFromValueOutput currency-input",
        onKeyup: ($event) => calcFromValue(),
        onChange: ($event) => calcFromValue(true)
      }, null, _parent));
      _push(`</div></div><div class="flex-center">`);
      _push(ssrRenderComponent(_component_el_button, {
        class: "SwitchCurrenciesButton",
        onClick: ($event) => switchCurrencies(),
        icon: unref(switch_default),
        size: "large"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/currency-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=currency-converter-7fec2480.mjs.map
