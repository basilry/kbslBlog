(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{72431:function(){},56788:function(e,r,s){Promise.resolve().then(s.bind(s,1226))},1226:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return J}});var a=s(57437),t=s(18788),o=s.n(t),n=s(30105),i=s.n(n),l=s(2265),d=s(27948),c=s(68530),h=s(42744),_=s.n(h),u=s(89628),x=s(57689),g=s(23978),m=s(14880),p=s(2963),f=s.n(p),k=function(){let{darkMode:e}=(0,m.A)(),[r,s]=(0,l.useState)(!1);return(0,l.useEffect)(()=>{s(!0)},[]),(0,a.jsx)(a.Fragment,{children:r&&(0,a.jsxs)("div",{className:_()(f().footer,e&&f().dark),children:[(0,a.jsx)("div",{className:f().leftWrapper,children:(0,a.jsx)(g.Z,{size:"x-small",bold:"bold",children:"Copyright ⓒ 2023 by Basilri Kim all rights reserved."})}),(0,a.jsxs)("div",{className:f().rightWrapper,children:[(0,a.jsx)(g.Z,{size:"x-small",bold:"bold",children:"basilry@gmail.com"}),(0,a.jsx)(g.Z,{size:"x-small",bold:"bold",children:"+82 010-8936-4302"})]})]})})},j=s(90516),b=s.n(j),B=s(61396),v=s.n(B),w=s(24033),N=s(67016),M=s.n(N),C=()=>{let{changeDarkMode:e,darkMode:r}=(0,m.A)(),[s,t]=(0,l.useState)(!1);return(0,l.useEffect)(()=>{t(!0)},[]),(0,a.jsx)("div",{className:_()(M().darkModeBasic,r&&M().darkBack),onClick:e,children:s&&(0,a.jsx)("div",{className:_()(M().modeToggleBtn,r&&M().left),children:(0,a.jsx)("div",{className:_()(M().toggleRound),children:(0,a.jsx)("div",{className:_()(M().toggleInnerColor,r&&M().dark),children:r&&(0,a.jsx)("div",{className:M().moon})})})})})},y=s(73004),L=s(82438),T=s(76431),W=s.n(T),E=function(){let{darkMode:e,changeSideBarFold:r,nowMenuName:s,changeNowMenuName:t}=(0,m.A)(),o=(0,w.useRouter)();return(0,a.jsxs)("div",{className:_()(W().headerWrapper,e&&W().darkMode),onClick:()=>r(!1),children:[(0,a.jsxs)("div",{className:W().leftWrapper,children:[(0,a.jsx)("div",{className:W().hamberger,children:(0,a.jsx)(b(),{src:e?"/kbslBlog/bars-solid_white.svg":"/kbslBlog/bars-solid.svg",alt:"sidebarBtn",width:20,height:20,onClick:e=>{e.stopPropagation(),r(!0)}})}),(0,a.jsxs)("div",{className:W().linkBlock,children:[(0,a.jsx)("div",{className:W().rootLink,children:(0,a.jsx)(v(),{href:"/",onClick:()=>{t(""),o.push("/"),(0,L.z)("홈으로 이동합니다.","success")},children:(0,a.jsx)(g.Z,{size:"xx-large",bold:"bold",children:"KBSL's Blog"})})}),(0,a.jsx)(g.Z,{size:"xx-large",bold:"bold",children:"/"}),(0,a.jsx)("div",{className:W().menuLink,children:(0,a.jsx)(v(),{href:"/".concat(s.toLowerCase()),onClick:()=>{(0,L.z)("".concat(y.e5[y.c2.indexOf(s[0]+s.slice(1).toLowerCase())]," 페이지로 이동합니다."),"success")},children:(0,a.jsx)(g.Z,{size:"xx-large",bold:"bold",children:s})})})]})]}),(0,a.jsx)("div",{className:W().rightWrapper,children:(0,a.jsx)("div",{className:W().darkToggleWrapper,onClick:e=>e.stopPropagation(),children:(0,a.jsx)(C,{})})})]})},S=e=>{let{menuName:r,krName:s}=e;return(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,a.jsx)(g.Z,{bold:"bold",size:"xx-large",children:r}),s&&(0,a.jsx)(g.Z,{bold:"bold",size:"medium",children:s})]})},z=s(69351),F=s.n(z),I=function(){let e=(0,w.usePathname)().split("/"),{darkMode:r,sideBarFold:s,changeSideBarFold:t,changeNowMenuName:o}=(0,m.A)(),[n,i]=(0,l.useState)(0),d=(0,w.useRouter)();return(0,a.jsxs)("div",{className:_()(F().sidebarWrapper,s&&F().open,r&&F().dark),children:[(0,a.jsxs)("ul",{children:[(0,a.jsx)("li",{className:s?F().view:F().hidden,onClick:()=>t(!1),children:(0,a.jsx)(b(),{src:r?"/kbslBlog/xmark-solid_white.svg":"/kbslBlog/xmark-solid.svg",alt:"sidebarCloseBtn",width:30,height:30})}),y.c2.map((l,c)=>(0,a.jsx)(v(),{href:"/".concat(l.slice(0,1).toLowerCase()+l.slice(1)),children:(0,a.jsx)("li",{onClick:()=>{o(l.toUpperCase()),t(!1),(0,L.z)("".concat(y.e5[c]," 페이지로 이동합니다."),"success"),d.push("/".concat(l.slice(0,1).toLowerCase()+l.slice(1)))},className:_()(s?F().view:F().hidden,e[1]===l.toLowerCase()&&F().nowPath,r&&F().dark),onMouseEnter:()=>i(c),onMouseLeave:()=>i(-1),children:(0,a.jsx)(S,{menuName:l,krName:n===c?y.e5[c]:""})})},l))]}),(0,a.jsxs)("div",{className:_()(F().sideBarFooter,!s&&F().hidden),children:[(0,a.jsx)(g.Z,{size:"x-small",bold:"bold",children:"Copyright ⓒ 2023 by Basilri Kim"}),(0,a.jsx)(g.Z,{size:"x-small",bold:"bold",children:"all rights reserved."}),(0,a.jsxs)("div",{className:F().socialLogoWrppaer,children:[(0,a.jsx)("div",{className:F().socialLogo,children:(0,a.jsx)(v(),{href:"https://github.com/basilry",children:(0,a.jsx)(b(),{src:r?"/kbslBlog/github_white.svg":"/kbslBlog/github.svg",alt:"github",width:20,height:20})})}),(0,a.jsx)("div",{className:F().socialLogo,children:(0,a.jsx)(v(),{href:"https://www.linkedin.com/in/basilri-kim-4b6611218/",children:(0,a.jsx)(b(),{src:r?"/kbslBlog/linkedin_white.svg":"/kbslBlog/linkedin.svg",alt:"linkedin",width:20,height:20})})}),(0,a.jsx)("div",{className:F().socialLogo,children:(0,a.jsx)(v(),{href:"https://blog.naver.com/basilry",children:(0,a.jsx)(b(),{src:r?"/kbslBlog/n-solid_white.svg":"/kbslBlog/n-solid.svg",alt:"n-solid",width:20,height:20})})})]})]})]})},A=s(25420),P=s.n(A),Z=()=>{let{darkMode:e}=(0,m.A)();return window.addEventListener("scroll",function(){let e=document.getElementById("scrollToTopButton");e&&(window.scrollY>150?(e.style.display="block",e.classList.add("show")):(e.style.display="none",e.classList.remove("show")))}),(0,a.jsx)("div",{id:"scrollToTopButton",className:_()(P().wrapper,e&&P().darkMode),onClick:()=>window.scrollTo({top:0,left:0,behavior:"smooth"}),children:(0,a.jsx)(g.Z,{className:"topButton",size:"medium",bold:"bold",children:"Top"})})},U=s(91334),O=s.n(U),R=function(e){let{children:r}=e,{darkMode:s,changeSideBarFold:t}=(0,m.A)(),{scrollYProgress:o}=(0,u.v)(),[n,i]=(0,l.useState)(!1);return(0,l.useEffect)(()=>{i(!0)},[s]),n?(0,a.jsxs)("div",{className:_()(O().container,s&&O().darkMode),children:[(0,a.jsx)(x.E.div,{className:O().progressBar,style:{scaleX:o||0}}),(0,a.jsx)(E,{}),(0,a.jsx)(I,{}),(0,a.jsx)("div",{className:O().body,onClick:()=>t(!1),children:r}),(0,a.jsx)(Z,{}),(0,a.jsx)(k,{})]}):(0,a.jsx)(a.Fragment,{})};s(76873),s(18604),s(35350),s(87021),s(86054),s(21773);var q=s(86569),K=e=>{let{children:r}=e;return(0,a.jsx)(l.Suspense,{fallback:(0,a.jsx)(q.default,{}),children:r})},Y=s(48475),D=s.n(Y),H=s(62601),X=()=>{let e=H.env.GTM_ID;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("noscript",{children:(0,a.jsx)("iframe",{src:"https://www.googletagmanager.com/ns.html?id=".concat(e),height:"0",width:"0",className:"hidden invisible"})}),(0,a.jsx)(D(),{id:"google-tag-management",children:"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer',".concat(e,");")})]})};function J(e){let{children:r}=e,{darkMode:s}=(0,m.A)(),[t,n]=(0,l.useState)("darkMode");return(0,l.useEffect)(()=>{s?n("darkMode"):n("lightMode")},[s]),(0,a.jsxs)("html",{lang:"ko",className:_()(i().className,o().className),children:[(0,a.jsxs)("head",{children:[(0,a.jsx)("meta",{charSet:"utf-8"}),(0,a.jsx)("meta",{name:"author",content:"Kim Basilri(Zannavi)"}),(0,a.jsx)("meta",{name:"application-name",content:"KBSL's BLog"}),(0,a.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"}),(0,a.jsx)("title",{children:"KBSL's Blog"}),(0,a.jsx)("link",{rel:"icon",href:"/kbslBlog/myFace.png"})]}),(0,a.jsx)("body",{id:t,children:(0,a.jsxs)(K,{children:[(0,a.jsxs)(R,{children:[r,(0,a.jsx)(c.Cd,{height:"0.3rem",color:"#b024d6",options:{showSpinner:!0},shallowRouting:!0}),(0,a.jsx)(d.Ix,{position:"bottom-right",autoClose:1800,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"light"}),(0,a.jsx)("div",{id:"modal-root"})]}),(0,a.jsx)(X,{})]})})]})}},86569:function(e,r,s){"use strict";s.r(r);var a=s(57437),t=s(2265),o=s(36396),n=s.n(o);r.default=()=>{let[e,r]=(0,t.useState)(!1),s=()=>n().start(),o=()=>n().done();return(0,t.useEffect)(()=>{r(!0),s()},[]),(0,t.useEffect)(()=>{e&&(r(!1),o())},[e]),(0,a.jsx)("div",{style:{minHeight:"100vh",height:"100vh"}})}},23978:function(e,r,s){"use strict";var a=s(57437),t=s(42744),o=s.n(t),n=s(80635),i=s.n(n);r.Z=e=>{let{children:r,bold:s,className:t,size:n,...l}=e;return(0,a.jsx)("div",{className:o()(i().text,t&&i()[t],t,n&&i()[n],s&&i()[s]),...l,children:r})}},14880:function(e,r,s){"use strict";s.d(r,{A:function(){return g}});var a=s(94660),t=s(74810);let o=e=>({darkMode:!1,sideBarFold:!1,nowMenuName:"",changeDarkMode:()=>e(e=>({darkMode:!e.darkMode})),changeSideBarFold:r=>e(()=>({sideBarFold:r})),changeNowMenuName:r=>e(()=>({nowMenuName:r}))}),n={userId:"",password:"",accessToken:"",refreshToken:""};var i=s(54829),l=s(62601);let d=i.Z.create({baseURL:"".concat(l.env.NEXT_PUBLIC_IP,":").concat(l.env.NEXT_PUBLIC_PORT),headers:{"Content-Type":"application/json; charset=utf-8"},responseType:"json",withCredentials:!0,timeout:5e3}),c=e=>e,h=e=>Promise.reject({...e}),_=e=>e,u=e=>(e.response||(e={...e,response:{data:{message:"error",code:"9999"}}}),Promise.reject({...e}));d.interceptors.request.use(),d.interceptors.request.use(e=>c(e),e=>h(e)),d.interceptors.request.use(e=>e),d.interceptors.response.use(e=>_(e),e=>u(e));let x=e=>({loginState:!1,loginUser:{...n},doLogin:async r=>{console.log(r);let s=await function(e){let r={userId:e.userId,password:e.password};return d.post("/login/req",{serviceId:"LOGIN001",params:{json:{...r}}})}(r),{data:a}=s;"100"===a.returnCode?e({loginState:!0,loginUser:r}):(e({loginState:!1,loginUser:{...n}}),alert("login failed"))}}),g=(0,a.Ue)()((0,t.tJ)(function(){for(var e=arguments.length,r=Array(e),s=0;s<e;s++)r[s]=arguments[s];return{...o(...r)}},{name:"core"}));(0,a.Ue)()((0,t.tJ)(function(){for(var e=arguments.length,r=Array(e),s=0;s<e;s++)r[s]=arguments[s];return{...x(...r)}},{name:"login"}))},73004:function(e,r,s){"use strict";s.d(r,{XB:function(){return d},c2:function(){return c},e5:function(){return h},fk:function(){return n},tN:function(){return i},zY:function(){return l}});var a=s(74548),t=s.n(a);let o=t()().format("YYYYMMDD"),n=t()(o).diff("20210913","year"),i=t()(o).diff("20210913","month"),l=t()(o).diff("20220101","month"),d=t()(o).diff("20240101","month"),c=["Introduce","Career","Projects","Visitor"],h=["소개","경력","프로젝트 목록","방명록"]},82438:function(e,r,s){"use strict";s.d(r,{z:function(){return t}});var a=s(27948);let t=(e,r)=>{switch(r){case"success":return a.Am.success(e,{theme:"colored"});case"error":return a.Am.error(e,{theme:"colored"});case"warning":return a.Am.warning(e,{theme:"colored"});case"info":return a.Am.info(e,{theme:"colored"})}}},18604:function(){},76873:function(){},35350:function(){},67016:function(e){e.exports={darkModeBasic:"darkModeBasic_darkModeBasic__1_Tn2",darkBack:"darkModeBasic_darkBack__qIOAo",modeToggleBtn:"darkModeBasic_modeToggleBtn__7nzST",left:"darkModeBasic_left__AqUCE",toggleRound:"darkModeBasic_toggleRound__Ga96k",toggleInnerColor:"darkModeBasic_toggleInnerColor__HFhmu",dark:"darkModeBasic_dark__5gHSB",moon:"darkModeBasic_moon__BGtTX"}},80635:function(e){e.exports={text:"textBasic_text__po6Ic","xx-small":"textBasic_xx-small__Adhma","x-small":"textBasic_x-small__hPM9M",small:"textBasic_small__PtwBZ",medium:"textBasic_medium__1ISnW",large:"textBasic_large__z61dO","x-large":"textBasic_x-large__Gemxl","xx-large":"textBasic_xx-large__VNzxr","xxx-large":"textBasic_xxx-large__aWUOh","xxxx-large":"textBasic_xxxx-large__9_7OS",bold:"textBasic_bold__R19ZP",normal:"textBasic_normal__ipvSk",bar:"textBasic_bar__hB_uF",careerYear:"textBasic_careerYear__mk9UE",topButton:"textBasic_topButton__YXK4k"}},91334:function(e){e.exports={container:"container_container__7out_",darkMode:"container_darkMode__CaJBF",progressBar:"container_progressBar__q3x9p",body:"container_body__ChuyF"}},2963:function(e){e.exports={footer:"footer_footer__VEq2T",dark:"footer_dark__yFBeV",leftWrapper:"footer_leftWrapper__oVqHZ",rightWrapper:"footer_rightWrapper__idUWf"}},76431:function(e){e.exports={headerWrapper:"header_headerWrapper__1F3JK",darkMode:"header_darkMode__tiKi5",leftWrapper:"header_leftWrapper__cwe3H",hamberger:"header_hamberger__jJb3E",linkBlock:"header_linkBlock__Dvf1b",rootLink:"header_rootLink__lxsfd",menuLink:"header_menuLink__ezE9a",rightWrapper:"header_rightWrapper__2ccA7",darkToggleWrapper:"header_darkToggleWrapper__FNJRT"}},69351:function(e){e.exports={sidebarWrapper:"sidebar_sidebarWrapper__f7n66",open:"sidebar_open__gMTRf",dark:"sidebar_dark__NS6FD",hidden:"sidebar_hidden__wu7uu",nowPath:"sidebar_nowPath__EQTbk",sideBarFooter:"sidebar_sideBarFooter__UeaFX",socialLogoWrppaer:"sidebar_socialLogoWrppaer__HjmQx",socialLogo:"sidebar_socialLogo__UXRTR"}},25420:function(e){e.exports={wrapper:"topMoveButton_wrapper__bhDvy",darkMode:"topMoveButton_darkMode__mSHjE"}}},function(e){e.O(0,[441,685,680,766,299,971,596,744],function(){return e(e.s=56788)}),_N_E=e.O()}]);