(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{aec1:function(t,e,n){"use strict";n("ddf9")},ddf9:function(t,e,n){},f820:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"about"},[n("h1",[t._v("This is an about page")]),n("div",{attrs:{id:"info"}},[n("h1",[t._v("Bitcoin Price Index")]),t._v(" Precision: "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.precision,expression:"precision"}],attrs:{type:"text"},domProps:{value:t.precision},on:{input:function(e){e.target.composing||(t.precision=e.target.value)}}}),t._l(t.info.bpi,(function(e){return n("div",{key:e.code,staticClass:"currency",staticStyle:{margin:"30px"}},[t._v(" "+t._s(e.description?e.description:null)+": "),n("span",{staticClass:"lighten"},[n("span",{domProps:{innerHTML:t._s(e.symbol)}}),t._v(t._s(t._f("toFixedX")(e.rate_float?e.rate_float:null,t.precision))+" ")])])})),n("p",[t._v("First case up: "+t._s(t._f("firstCaseUp")(t.content)))]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.content,expression:"content"}],attrs:{type:"text"},domProps:{value:t.content},on:{input:function(e){e.target.composing||(t.content=e.target.value)}}}),n("h2",[t._v(t._s(t._f("formatDate")(t.today)))])],2)])},a=[],o=n("d4ec"),c=n("bee2"),s=n("262e"),r=n("2caf"),u=n("9ab4"),p=n("60a3"),l=n("bc3a"),d=n.n(l),f=function(t){Object(s["a"])(n,t);var e=Object(r["a"])(n);function n(){var t;return Object(o["a"])(this,n),t=e.apply(this,arguments),t.info=null,t.content="ab",t.today=new Date,t.precision=2,t}return Object(c["a"])(n,[{key:"mounted",value:function(){var t=this;d.a.get("https://api.coindesk.com/v1/bpi/currentprice.json").then((function(e){t.info=e.data})).catch((function(t){return console.log(t)}))}}]),n}(p["c"]);f=Object(u["a"])([p["a"]],f);var v=f,_=v,b=(n("aec1"),n("2877")),m=Object(b["a"])(_,i,a,!1,null,"0afc4b38",null);e["default"]=m.exports}}]);
//# sourceMappingURL=about.4e055da1.js.map