(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[42],{1042:function(e,t,r){"use strict";var n,i,o=Object.create,a=Object.defineProperty,l=Object.getOwnPropertyDescriptor,u=Object.getOwnPropertyNames,s=Object.getPrototypeOf,d=Object.prototype.hasOwnProperty,c=(e,t,r,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of u(t))d.call(e,i)||i===r||a(e,i,{get:()=>t[i],enumerable:!(n=l(t,i))||n.enumerable});return e},f=(e,t,r)=>(r=null!=e?o(s(e)):{},c(!t&&e&&e.__esModule?r:a(r,"default",{value:e,enumerable:!0}),e)),p={};((e,t)=>{for(var r in t)a(e,r,{get:t[r],enumerable:!0})})(p,{default:()=>j}),e.exports=c(a({},"__esModule",{value:!0}),p);var m=f(r(1295)),g=f(r(2265)),h=e=>"string"==typeof e?e:void 0!==e.default?e.default.src:e.src,b=["jpeg","jpg","png","webp","avif"],y=e=>b.some(t=>t===e),v=e=>{let t=e.split(/\.([^.]*$)/)[0],r=(e.split(/\.([^.]*$)/)[1]||"").split("?")[0];if(!t||!r)throw Error(`Invalid path or no file extension: ${e}`);let n=t.split("/").slice(0,-1).join("/"),i=t.split("/").slice(-1).toString();return e.startsWith("http")&&(n=n.replace(/^https?:\/\//,"").split("/").slice(1).join("/")),{pathWithoutName:n,name:i,extension:r}},_=({src:e,width:t,config:r})=>{let n=e;void 0!==r.basePath&&(n=e.replace(r.basePath,""));let i=r.sourceImageParser?r.sourceImageParser({src:n,defaultParser:v}):v(n),{extension:o}=i,{pathWithoutName:a,name:l,extension:u}=i;if(void 0!==r.convertFormat){let e=r.convertFormat.find(([e])=>e===o);if(void 0!==e){if(!y(e[0]))throw Error(`Unauthorized format specified in \`configFormat\`. beforeConvert: ${e[0]}`);if(!y(e[1]))throw Error(`Unauthorized format specified in \`configFormat\`. afterConvert: ${e[1]}`);o=e[1]}}let s=`/${r.imageDir?r.imageDir.replace(/^\//,"").replace(/\/$/,""):"_next/static/chunks/images"}`,d=`${r.externalImageDir?r.externalImageDir.replace(/^\//,"").replace(/\/$/,""):"_next/static/media"}`,c=[...new Set([...r.generateFormats??["webp"],o])];return c.map((e,i)=>{if(c.length!==i+1&&!y(e))throw Error(`Unauthorized extension specified in \`generateFormats\`: ${e}`);let o=void 0!==r.filenameGenerator?r.filenameGenerator({path:a,name:l,width:t,extension:e}):`${a}/${l}_${t}.${e}`,f=`${s}/${o.replace(/^\//,"")}`;return{output:f,src:n,extension:e,originalExtension:u,externalOutputDir:d}})},w=r(2815),P=e=>({src:t,width:r})=>{let n=_({src:t,width:r,config:w}).at(e??-1);if(void 0===n)throw Error(`No output info found for ${t}`);return`${w.basePath??""}${n.output}`};n=r(1295),i=e.exports,c(p,n,"default"),i&&c(i,n,"default");var j=(0,g.forwardRef)((e,t)=>{let r=h(e.src);return g.default.createElement(m.default,{...e,ref:t,loader:e.loader||P(),blurDataURL:e.blurDataURL||("string"==typeof e.src&&"blur"===e.placeholder&&void 0===e.loader?P()({src:e.src,width:8,quality:10}):void 0),unoptimized:void 0!==e.unoptimized?e.unoptimized:r.endsWith(".svg")})})},2815:function(e){e.exports={}},3222:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return y}});let n=r(1024),i=r(8533),o=i._(r(2265)),a=r(4887),l=n._(r(2912)),u=r(2301),s=r(7709),d=r(9469);r(7873);let c=r(2706),f=n._(r(5033)),p={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/kbslBlog/_next/image/",loader:"custom",dangerouslyAllowSVG:!1,unoptimized:!1};function m(e,t,r,n,i,o){let a=null==e?void 0:e.src;if(!e||e["data-loaded-src"]===a)return;e["data-loaded-src"]=a;let l="decode"in e?e.decode():Promise.resolve();l.catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),null==r?void 0:r.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let n=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>n,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{n=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}(null==n?void 0:n.current)&&n.current(e)}})}function g(e){let[t,r]=o.version.split("."),n=parseInt(t,10),i=parseInt(r,10);return n>18||18===n&&i>=3?{fetchPriority:e}:{fetchpriority:e}}let h=(0,o.forwardRef)((e,t)=>{let{src:r,srcSet:n,sizes:i,height:a,width:l,decoding:u,className:s,style:d,fetchPriority:c,placeholder:f,loading:p,unoptimized:h,fill:b,onLoadRef:y,onLoadingCompleteRef:v,setBlurComplete:_,setShowAltText:w,onLoad:P,onError:j,...S}=e;return o.default.createElement("img",{...S,...g(c),loading:p,width:l,height:a,decoding:u,"data-nimg":b?"fill":"1",className:s,style:d,sizes:i,srcSet:n,src:r,ref:(0,o.useCallback)(e=>{t&&("function"==typeof t?t(e):"object"==typeof t&&(t.current=e)),e&&(j&&(e.src=e.src),e.complete&&m(e,f,y,v,_,h))},[r,f,y,v,_,j,h,t]),onLoad:e=>{let t=e.currentTarget;m(t,f,y,v,_,h)},onError:e=>{w(!0),"empty"!==f&&_(!0),j&&j(e)}})});function b(e){let{isAppRouter:t,imgAttributes:r}=e,n={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,...g(r.fetchPriority)};return t&&a.preload?((0,a.preload)(r.src,n),null):o.default.createElement(l.default,null,o.default.createElement("link",{key:"__nimg-"+r.src+r.srcSet+r.sizes,rel:"preload",href:r.srcSet?void 0:r.src,...n}))}let y=(0,o.forwardRef)((e,t)=>{let r=(0,o.useContext)(c.RouterContext),n=(0,o.useContext)(d.ImageConfigContext),i=(0,o.useMemo)(()=>{let e=p||n||s.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r}},[n]),{onLoad:a,onLoadingComplete:l}=e,m=(0,o.useRef)(a);(0,o.useEffect)(()=>{m.current=a},[a]);let g=(0,o.useRef)(l);(0,o.useEffect)(()=>{g.current=l},[l]);let[y,v]=(0,o.useState)(!1),[_,w]=(0,o.useState)(!1),{props:P,meta:j}=(0,u.getImgProps)(e,{defaultLoader:f.default,imgConf:i,blurComplete:y,showAltText:_});return o.default.createElement(o.default.Fragment,null,o.default.createElement(h,{...P,unoptimized:j.unoptimized,placeholder:j.placeholder,fill:j.fill,onLoadRef:m,onLoadingCompleteRef:g,setBlurComplete:v,setShowAltText:w,ref:t}),j.priority?o.default.createElement(b,{isAppRouter:!r,imgAttributes:P}):null)});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7555:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"AmpStateContext",{enumerable:!0,get:function(){return o}});let n=r(1024),i=n._(r(2265)),o=i.default.createContext({})},8551:function(e,t){"use strict";function r(e){let{ampFirst:t=!1,hybrid:r=!1,hasQuery:n=!1}=void 0===e?{}:e;return t||r&&n}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isInAmpMode",{enumerable:!0,get:function(){return r}})},2301:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImgProps",{enumerable:!0,get:function(){return l}}),r(7873);let n=r(9540),i=r(7709);function o(e){return void 0!==e.default}function a(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function l(e,t){var r;let l,u,s,{src:d,sizes:c,unoptimized:f=!1,priority:p=!1,loading:m,className:g,quality:h,width:b,height:y,fill:v=!1,style:_,onLoad:w,onLoadingComplete:P,placeholder:j="empty",blurDataURL:S,fetchPriority:O,layout:x,objectFit:C,objectPosition:E,lazyBoundary:z,lazyRoot:M,...I}=e,{imgConf:k,showAltText:R,blurComplete:$,defaultLoader:D}=t,A=k||i.imageConfigDefault;if("allSizes"in A)l=A;else{let e=[...A.deviceSizes,...A.imageSizes].sort((e,t)=>e-t),t=A.deviceSizes.sort((e,t)=>e-t);l={...A,allSizes:e,deviceSizes:t}}let U=I.loader||D;delete I.loader,delete I.srcSet;let F="__next_img_default"in U;if(F){if("custom"===l.loader)throw Error('Image with src "'+d+'" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader')}else{let e=U;U=t=>{let{config:r,...n}=t;return e(n)}}if(x){"fill"===x&&(v=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[x];e&&(_={..._,...e});let t={responsive:"100vw",fill:"100vw"}[x];t&&!c&&(c=t)}let L="",N=a(b),B=a(y);if("object"==typeof(r=d)&&(o(r)||void 0!==r.src)){let e=o(d)?d.default:d;if(!e.src)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(e));if(!e.height||!e.width)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(e));if(u=e.blurWidth,s=e.blurHeight,S=S||e.blurDataURL,L=e.src,!v){if(N||B){if(N&&!B){let t=N/e.width;B=Math.round(e.height*t)}else if(!N&&B){let t=B/e.height;N=Math.round(e.width*t)}}else N=e.width,B=e.height}}let G=!p&&("lazy"===m||void 0===m);(!(d="string"==typeof d?d:L)||d.startsWith("data:")||d.startsWith("blob:"))&&(f=!0,G=!1),l.unoptimized&&(f=!0),F&&d.endsWith(".svg")&&!l.dangerouslyAllowSVG&&(f=!0),p&&(O="high");let W=a(h),T=Object.assign(v?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:E}:{},R?{}:{color:"transparent"},_),V=$||"empty"===j?null:"blur"===j?'url("data:image/svg+xml;charset=utf-8,'+(0,n.getImageBlurSvg)({widthInt:N,heightInt:B,blurWidth:u,blurHeight:s,blurDataURL:S||"",objectFit:T.objectFit})+'")':'url("'+j+'")',q=V?{backgroundSize:T.objectFit||"cover",backgroundPosition:T.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:V}:{},H=function(e){let{config:t,src:r,unoptimized:n,width:i,quality:o,sizes:a,loader:l}=e;if(n)return{src:r,srcSet:void 0,sizes:void 0};let{widths:u,kind:s}=function(e,t,r){let{deviceSizes:n,allSizes:i}=e;if(r){let e=/(^|\s)(1?\d?\d)vw/g,t=[];for(let n;n=e.exec(r);n)t.push(parseInt(n[2]));if(t.length){let e=.01*Math.min(...t);return{widths:i.filter(t=>t>=n[0]*e),kind:"w"}}return{widths:i,kind:"w"}}if("number"!=typeof t)return{widths:n,kind:"w"};let o=[...new Set([t,2*t].map(e=>i.find(t=>t>=e)||i[i.length-1]))];return{widths:o,kind:"x"}}(t,i,a),d=u.length-1;return{sizes:a||"w"!==s?a:"100vw",srcSet:u.map((e,n)=>l({config:t,src:r,quality:o,width:e})+" "+("w"===s?e:n+1)+s).join(", "),src:l({config:t,src:r,quality:o,width:u[d]})}}({config:l,src:d,unoptimized:f,width:N,quality:W,sizes:c,loader:U}),J={...I,loading:G?"lazy":m,fetchPriority:O,width:N,height:B,decoding:"async",className:g,style:{...T,...q},sizes:H.sizes,srcSet:H.srcSet,src:H.src},Y={unoptimized:f,priority:p,placeholder:j,fill:v};return{props:J,meta:Y}}},2912:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{defaultHead:function(){return d},default:function(){return m}});let n=r(1024),i=r(8533),o=i._(r(2265)),a=n._(r(2378)),l=r(7555),u=r(1330),s=r(8551);function d(e){void 0===e&&(e=!1);let t=[o.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(o.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function c(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}r(7873);let f=["name","httpEquiv","charSet","itemProp"];function p(e,t){let{inAmpMode:r}=t;return e.reduce(c,[]).reverse().concat(d(r).reverse()).filter(function(){let e=new Set,t=new Set,r=new Set,n={};return i=>{let o=!0,a=!1;if(i.key&&"number"!=typeof i.key&&i.key.indexOf("$")>0){a=!0;let t=i.key.slice(i.key.indexOf("$")+1);e.has(t)?o=!1:e.add(t)}switch(i.type){case"title":case"base":t.has(i.type)?o=!1:t.add(i.type);break;case"meta":for(let e=0,t=f.length;e<t;e++){let t=f[e];if(i.props.hasOwnProperty(t)){if("charSet"===t)r.has(t)?o=!1:r.add(t);else{let e=i.props[t],r=n[t]||new Set;("name"!==t||!a)&&r.has(e)?o=!1:(r.add(e),n[t]=r)}}}}return o}}()).reverse().map((e,t)=>{let n=e.key||t;if(!r&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(t=>e.props.href.startsWith(t))){let t={...e.props||{}};return t["data-href"]=t.href,t.href=void 0,t["data-optimized-fonts"]=!0,o.default.cloneElement(e,t)}return o.default.cloneElement(e,{key:n})})}let m=function(e){let{children:t}=e,r=(0,o.useContext)(l.AmpStateContext),n=(0,o.useContext)(u.HeadManagerContext);return o.default.createElement(a.default,{reduceComponentsToState:p,headManager:n,inAmpMode:(0,s.isInAmpMode)(r)},t)};("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9540:function(e,t){"use strict";function r(e){let{widthInt:t,heightInt:r,blurWidth:n,blurHeight:i,blurDataURL:o,objectFit:a}=e,l=n?40*n:t,u=i?40*i:r,s=l&&u?"viewBox='0 0 "+l+" "+u+"'":"";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+s+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+(s?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none")+"' style='filter: url(%23b);' href='"+o+"'/%3E%3C/svg%3E"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},9469:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"ImageConfigContext",{enumerable:!0,get:function(){return a}});let n=r(1024),i=n._(r(2265)),o=r(7709),a=i.default.createContext(o.imageConfigDefault)},7709:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{VALID_LOADERS:function(){return r},imageConfigDefault:function(){return n}});let r=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"inline",remotePatterns:[],unoptimized:!1}},1295:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return s},unstable_getImgProps:function(){return u}});let n=r(1024),i=r(2301),o=r(7873),a=r(3222),l=n._(r(5033)),u=e=>{(0,o.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");let{props:t}=(0,i.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/kbslBlog/_next/image/",loader:"custom",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}},s=a.Image},5033:function(e,t){"use strict";function r(e){let{config:t,src:r,width:n,quality:i}=e;return t.path+"?url="+encodeURIComponent(r)+"&w="+n+"&q="+(i||75)}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return n}}),r.__next_img_default=!0;let n=r},2706:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RouterContext",{enumerable:!0,get:function(){return o}});let n=r(1024),i=n._(r(2265)),o=i.default.createContext(null)},2378:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return l}});let n=r(8533),i=n._(r(2265)),o=i.useLayoutEffect,a=i.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function n(){if(t&&t.mountedInstances){let n=i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(n,e))}}return o(()=>{var r;return null==t||null==(r=t.mountedInstances)||r.add(e.children),()=>{var r;null==t||null==(r=t.mountedInstances)||r.delete(e.children)}}),o(()=>(t&&(t._pendingUpdate=n),()=>{t&&(t._pendingUpdate=n)})),a(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},7873:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"warnOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}}}]);