(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[8],{561:function(e,t,n){"use strict";var r=n(0),a=n.n(r);n(295);class o extends a.a.Component{render(){return a.a.createElement("div",{className:"fallback-spinner"},a.a.createElement("div",{className:"loading component-loader"},a.a.createElement("div",{className:"effect-1 effects"}),a.a.createElement("div",{className:"effect-2 effects"}),a.a.createElement("div",{className:"effect-3 effects"})))}}t.a=o},580:function(e,t,n){},581:function(e,t,n){},708:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(47),l=n(33),i=n(20),c=n(561),s=n(279),p=n(57);const u=Object(r.lazy)(()=>Promise.all([n.e(3),n.e(9)]).then(n.bind(null,711))),f=Object(r.lazy)(()=>Promise.all([n.e(4),n.e(7)]).then(n.bind(null,710))),m=Object(r.lazy)(()=>n.e(6).then(n.bind(null,707))),d=Object(r.lazy)(()=>n.e(5).then(n.bind(null,709))),y=Object(i.b)(e=>({user:e.auth.login.userRole}))(e=>{let{component:t,fullLayout:n,...l}=e;const{authToken:i,isExpired:u}=Object(p.a)();return a.a.createElement(o.b,Object.assign({},l,{render:e=>"/login"===e.location.pathname||i||u||"/register"===e.location.pathname||"/forgot-password"===e.location.pathname||"/reset-password"===e.location.pathname?a.a.createElement(s.a.Consumer,null,o=>{let l=!0===n?o.fullLayout:"horizontal"===o.state.activeLayout?o.horizontalLayout:o.VerticalLayout;return a.a.createElement(l,Object.assign({},e,{permission:e.user}),a.a.createElement(r.Suspense,{fallback:a.a.createElement(c.a,null)},a.a.createElement(t,e)))}):a.a.createElement(o.a,{to:"/login"})}))});var h=()=>a.a.createElement(o.c,{history:l.a},a.a.createElement(o.d,null,a.a.createElement(y,{exact:!0,path:"/",component:u}),a.a.createElement(y,{path:"/products",component:f}),a.a.createElement(y,{path:"/login",component:m,fullLayout:!0}),a.a.createElement(y,{path:"/register",component:d,fullLayout:!0}))),b=n(287),g=n(1),v=n.n(g),E=function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),O=function(){return(O=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)},j=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},w={position:"relative",display:"inline-flex",overflow:"hidden"},k=function(){return(k=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)},C=function(e){return function(t){return a.a.createElement(e,k({},t))}}(function(e){var t;return void 0===e&&(e={}),(t=function(e){function t(t){var n=e.call(this,t)||this;return n.timer=0,n.onClick=function(e){var t=n.props,r=t.during,a=t.onClick,o=t.color;e.stopPropagation();var l=e.pageX,i=e.pageY,c=e.currentTarget.getBoundingClientRect(),s=l-(c.left+window.scrollX),p=i-(c.top+window.scrollY),u=Math.max(c.width,c.height);n.setState((function(e){return{rippleStyle:O({},e.rippleStyle,{left:s,top:p,opacity:1,transform:"translate(-50%, -50%)",transition:"initial",backgroundColor:o})}}),(function(){n.timer=setTimeout((function(){n.setState((function(e){return{rippleStyle:O({},e.rippleStyle,{opacity:0,transform:"scale("+u/9+")",transition:"all "+r+"ms"})}}))}),50)})),a&&a(e)},n.state={rippleStyle:{position:"absolute",borderRadius:"50%",opacity:0,width:35,height:35,transform:"translate(-50%, -50%)",pointerEvents:"none"}},n}return E(t,e),t.prototype.componentWillUnmount=function(){clearTimeout(this.timer)},t.prototype.render=function(){var e=this.props,t=e.children,n=(e.during,e.color,e.onClick,e.className),r=j(e,["children","during","color","onClick","className"]),o=this.state.rippleStyle;return a.a.createElement("div",O({},r,{className:("react-ripples "+n).trim(),style:w,onClick:this.onClick}),t,a.a.createElement("s",{style:o}))},t}(a.a.PureComponent)).displayName="Ripples",t.propTypes={during:v.a.number,color:v.a.string,onClick:v.a.func,className:v.a.string},t.defaultProps=O({during:600,color:"rgba(0, 0, 0, .3)",className:"",onClick:function(){}},e),t}());b.a.Ripple=e=>{let{rippleColor:t,during:n,block:r,...o}=e;return a.a.createElement(C,{color:t||"rgba(255, 255, 255, .5)",during:n,className:"".concat(r?"d-block":"")},a.a.createElement(b.a,o))};n(580),n(581);t.default=e=>a.a.createElement(h,null)}}]);
//# sourceMappingURL=8.aee43fee.chunk.js.map