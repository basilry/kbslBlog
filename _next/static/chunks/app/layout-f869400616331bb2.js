(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{6788:function(e,r,s){Promise.resolve().then(s.bind(s,1226))},1226:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return D}});var a=s(7437),l=s(8788),o=s.n(l),t=s(105),i=s.n(t),n=s(2265),d=s(2744),c=s.n(d),h=s(3978),_=s(4880),g=s(2963),x=s.n(g),m=function(){let{darkMode:e}=(0,_.A)();return(0,a.jsxs)("div",{className:c()(x().footer,e&&x().dark),children:[(0,a.jsx)("div",{className:x().leftWrapper,children:(0,a.jsx)(h.Z,{size:"x-small",bold:"bold",children:"Copyright ⓒ 2023 by Basilri Kim all rights reserved."})}),(0,a.jsxs)("div",{className:x().rightWrapper,children:[(0,a.jsx)(h.Z,{size:"x-small",bold:"bold",children:"basilry@gmail.com"}),(0,a.jsx)(h.Z,{size:"x-small",bold:"bold",children:"+82 010-8936-4302"})]})]})},u=s(1125),p=s.n(u),k=s(1396),j=s.n(k),b=s(7016),f=s.n(b),B=()=>{let{changeDarkMode:e,darkMode:r}=(0,_.A)(),[s,l]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{l(!0)},[]),(0,a.jsx)("div",{className:c()(f().darkModeBasic,r&&f().darkBack),onClick:e,children:s&&(0,a.jsx)("div",{className:c()(f().modeToggleBtn,r&&f().left),children:(0,a.jsx)("div",{className:c()(f().toggleRound),children:(0,a.jsx)("div",{className:c()(f().toggleInnerColor,r&&f().dark),children:r&&(0,a.jsx)("div",{className:f().moon})})})})})},v=s(6431),w=s.n(v),N=function(){let{darkMode:e,changeSideBarFold:r,nowMenuName:s,changeNowMenuName:l}=(0,_.A)();return(0,a.jsxs)("div",{className:c()(w().headerWrapper,e&&w().darkMode),onClick:()=>r(!1),children:[(0,a.jsxs)("div",{className:w().leftWrapper,children:[(0,a.jsx)("div",{className:w().hamberger,children:(0,a.jsx)(p(),{placeholder:"blur",src:e?"/kbslBlog/bars-solid_white.svg":"/kbslBlog/bars-solid.svg",alt:"sidebarBtn",width:20,height:20,onClick:e=>{e.stopPropagation(),r(!0)}})}),(0,a.jsxs)("div",{className:w().linkBlock,children:[(0,a.jsx)("div",{className:w().rootLink,children:(0,a.jsx)(j(),{href:"/",onClick:()=>l("MAIN"),children:(0,a.jsx)(h.Z,{size:"xx-large",bold:"bold",children:"KBSL's Blog"})})}),(0,a.jsx)(h.Z,{size:"xx-large",bold:"bold",children:"/"}),(0,a.jsx)("div",{className:w().menuLink,children:(0,a.jsx)(j(),{href:"/".concat(s.toLowerCase()),children:(0,a.jsx)(h.Z,{size:"xx-large",bold:"bold",children:s})})})]})]}),(0,a.jsx)("div",{className:w().rightWrapper,children:(0,a.jsx)("div",{className:w().darkToggleWrapper,onClick:e=>e.stopPropagation(),children:(0,a.jsx)(B,{})})})]})},M=s(4033),y=e=>{let{menuName:r,krName:s}=e;return(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,a.jsx)(h.Z,{bold:"bold",size:"xx-large",children:r}),s&&(0,a.jsx)(h.Z,{bold:"bold",size:"medium",children:s})]})},L=s(9351),C=s.n(L);let T=["Main","Introduce","Projects","Visitor"],W=["메인","자기소개","프로젝트","방명록"];var E=function(){let e=(0,M.usePathname)().split("/"),{darkMode:r,sideBarFold:s,changeSideBarFold:l,changeNowMenuName:o}=(0,_.A)(),[t,i]=(0,n.useState)(0);return(0,a.jsxs)("div",{className:c()(C().sidebarWrapper,s&&C().open,r&&C().dark),children:[(0,a.jsxs)("ul",{children:[(0,a.jsx)("li",{className:s?C().view:C().hidden,onClick:()=>l(!1),children:(0,a.jsx)(p(),{placeholder:"blur",src:r?"/kbslBlog/xmark-solid_white.svg":"/kbslBlog/xmark-solid.svg",alt:"sidebarCloseBtn",width:30,height:30})}),T.map((n,d)=>(0,a.jsx)(j(),{href:"/".concat(n.slice(0,1).toLowerCase()+n.slice(1)),children:(0,a.jsx)("li",{onClick:()=>{o(n.toUpperCase()),l(!1)},className:c()(s?C().view:C().hidden,e[1]===n.toLowerCase()&&C().nowPath,r&&C().dark),onMouseEnter:()=>i(d),onMouseLeave:()=>i(-1),children:(0,a.jsx)(y,{menuName:e[1]===n.toLowerCase()?"{"+n+"}":n,krName:t===d?W[d]:""})})},n))]}),(0,a.jsxs)("div",{className:c()(C().sideBarFooter,!s&&C().hidden),children:[(0,a.jsx)(h.Z,{size:"x-small",bold:"bold",children:"Copyright ⓒ 2023 by Basilri Kim"}),(0,a.jsx)(h.Z,{size:"x-small",bold:"bold",children:"all rights reserved."}),(0,a.jsxs)("div",{className:C().socialLogoWrppaer,children:[(0,a.jsx)("div",{className:C().socialLogo,children:(0,a.jsx)(j(),{href:"https://github.com/basilry",children:(0,a.jsx)(p(),{placeholder:"blur",src:r?"/kbslBlog/github_white.svg":"/kbslBlog/github.svg",alt:"github",width:20,height:20})})}),(0,a.jsx)("div",{className:C().socialLogo,children:(0,a.jsx)(j(),{href:"https://www.linkedin.com/in/basilri-kim-4b6611218/",children:(0,a.jsx)(p(),{placeholder:"blur",src:r?"/kbslBlog/linkedin_white.svg":"/kbslBlog/linkedin.svg",alt:"linkedin",width:20,height:20})})}),(0,a.jsx)("div",{className:C().socialLogo,children:(0,a.jsx)(j(),{href:"https://blog.naver.com/basilry",children:(0,a.jsx)(p(),{placeholder:"blur",src:r?"/kbslBlog/n-solid_white.svg":"/kbslBlog/n-solid.svg",alt:"n-solid",width:20,height:20})})})]})]})]})},S=s(5420),I=s.n(S),F=()=>{let{darkMode:e}=(0,_.A)();return window.addEventListener("scroll",function(){let e=document.getElementById("scrollToTopButton");e&&(window.scrollY>150?(e.style.display="block",e.classList.add("show")):(e.style.display="none",e.classList.remove("show")))}),(0,a.jsx)("div",{id:"scrollToTopButton",className:c()(I().wrapper,e&&I().darkMode),onClick:()=>window.scrollTo({top:0,left:0,behavior:"smooth"}),children:(0,a.jsx)(h.Z,{size:"large",bold:"bold",children:"Top"})})},P=s(1334),Z=s.n(P),z=function(e){let{children:r}=e,{darkMode:s,changeSideBarFold:l}=(0,_.A)(),[o,t]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{t(!0)},[s]),o?(0,a.jsxs)("div",{className:c()(Z().container,s&&Z().darkMode),children:[(0,a.jsx)(N,{}),(0,a.jsx)(E,{}),(0,a.jsx)("div",{className:Z().body,onClick:()=>l(!1),children:r}),(0,a.jsx)(F,{}),(0,a.jsx)(m,{})]}):(0,a.jsx)(a.Fragment,{})};s(6873),s(8604),s(1409),s(7021),s(6054),s(1773);var A=s(6569),U=e=>{let{children:r}=e;return(0,a.jsx)(n.Suspense,{fallback:(0,a.jsx)(A.default,{}),children:r})},R=s(8475),q=s.n(R),K=s(2601),H=()=>{let e=K.env.GTM_ID;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("noscript",{children:(0,a.jsx)("iframe",{src:"https://www.googletagmanager.com/ns.html?id=".concat(e),height:"0",width:"0",className:"hidden invisible"})}),(0,a.jsx)(q(),{id:"google-tag-management",children:"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer',".concat(e,");")})]})};function D(e){let{children:r}=e,{darkMode:s}=(0,_.A)(),[l,t]=(0,n.useState)("lightMode");return(0,n.useEffect)(()=>{s?t("darkMode"):t("lightMode")},[s]),(0,a.jsxs)("html",{lang:"ko",className:c()(i().className,o().className),children:[(0,a.jsxs)("head",{children:[(0,a.jsx)("meta",{charSet:"utf-8"}),(0,a.jsx)("meta",{name:"author",content:"Kim Basilri(Zannavi)"}),(0,a.jsx)("meta",{name:"application-name",content:"KBSL's BLog"}),(0,a.jsx)("title",{children:"KBSL's Blog"}),(0,a.jsx)("link",{rel:"icon",href:"/kbslBlog/myFace.png"})]}),(0,a.jsx)("body",{id:l,children:(0,a.jsxs)(U,{children:[(0,a.jsx)(z,{children:r}),(0,a.jsx)(H,{})]})})]})}},6569:function(e,r,s){"use strict";s.r(r);var a=s(7437),l=s(2265),o=s(6396),t=s.n(o);r.default=()=>{let[e,r]=(0,l.useState)(!1),s=()=>t().start(),o=()=>t().done();return(0,l.useEffect)(()=>{r(!0),s()},[]),(0,l.useEffect)(()=>{e&&(r(!1),o())},[e]),(0,a.jsx)("div",{style:{minHeight:"100vh",height:"100vh"}})}},3978:function(e,r,s){"use strict";var a=s(7437),l=s(2744),o=s.n(l),t=s(635),i=s.n(t);r.Z=e=>{let{children:r,bold:s,className:l,size:t,...n}=e;return(0,a.jsx)("div",{className:o()(i().text,l&&i()[l],t&&i()[t],s&&i()[s]),...n,children:r})}},4880:function(e,r,s){"use strict";s.d(r,{A:function(){return m}});var a=s(4660),l=s(4810);let o=e=>({darkMode:!1,sideBarFold:!1,nowMenuName:"",changeDarkMode:()=>e(e=>({darkMode:!e.darkMode})),changeSideBarFold:r=>e(()=>({sideBarFold:r})),changeNowMenuName:r=>e(()=>({nowMenuName:r}))}),t={userId:"",password:"",accessToken:"",refreshToken:""};var i=s(4829),n=s(2601);let d=i.Z.create({baseURL:"".concat(n.env.NEXT_PUBLIC_IP,":").concat(n.env.NEXT_PUBLIC_PORT),headers:{"Content-Type":"application/json; charset=utf-8"},responseType:"json",withCredentials:!0,timeout:5e3}),c=e=>e,h=e=>Promise.reject({...e}),_=e=>e,g=e=>(e.response||(e={...e,response:{data:{message:"error",code:"9999"}}}),Promise.reject({...e}));d.interceptors.request.use(),d.interceptors.request.use(e=>c(e),e=>h(e)),d.interceptors.request.use(e=>e),d.interceptors.response.use(e=>_(e),e=>g(e));let x=e=>({loginState:!1,loginUser:{...t},doLogin:async r=>{console.log(r);let s=await function(e){let r={userId:e.userId,password:e.password};return d.post("/login/req",{serviceId:"LOGIN001",params:{json:{...r}}})}(r),{data:a}=s;"100"===a.returnCode?e({loginState:!0,loginUser:r}):(e({loginState:!1,loginUser:{...t}}),alert("login failed"))}}),m=(0,a.Ue)()((0,l.tJ)(function(){for(var e=arguments.length,r=Array(e),s=0;s<e;s++)r[s]=arguments[s];return{...o(...r)}},{name:"core"}));(0,a.Ue)()((0,l.tJ)(function(){for(var e=arguments.length,r=Array(e),s=0;s<e;s++)r[s]=arguments[s];return{...x(...r)}},{name:"login"}))},8604:function(){},6873:function(){},1409:function(){},7016:function(e){e.exports={darkModeBasic:"darkModeBasic_darkModeBasic__1_Tn2",darkBack:"darkModeBasic_darkBack__qIOAo",modeToggleBtn:"darkModeBasic_modeToggleBtn__7nzST",left:"darkModeBasic_left__AqUCE",toggleRound:"darkModeBasic_toggleRound__Ga96k",toggleInnerColor:"darkModeBasic_toggleInnerColor__HFhmu",dark:"darkModeBasic_dark__5gHSB",moon:"darkModeBasic_moon__BGtTX"}},635:function(e){e.exports={text:"textBasic_text__po6Ic","xx-small":"textBasic_xx-small__Adhma","x-small":"textBasic_x-small__hPM9M",small:"textBasic_small__PtwBZ",medium:"textBasic_medium__1ISnW",large:"textBasic_large__z61dO","x-large":"textBasic_x-large__Gemxl","xx-large":"textBasic_xx-large__VNzxr",bold:"textBasic_bold__R19ZP",normal:"textBasic_normal__ipvSk",bar:"textBasic_bar__hB_uF",careerYear:"textBasic_careerYear__mk9UE"}},1334:function(e){e.exports={container:"container_container__7out_",darkMode:"container_darkMode__CaJBF",body:"container_body__ChuyF"}},2963:function(e){e.exports={footer:"footer_footer__VEq2T",dark:"footer_dark__yFBeV",leftWrapper:"footer_leftWrapper__oVqHZ",rightWrapper:"footer_rightWrapper__idUWf"}},6431:function(e){e.exports={headerWrapper:"header_headerWrapper__1F3JK",darkMode:"header_darkMode__tiKi5",leftWrapper:"header_leftWrapper__cwe3H",hamberger:"header_hamberger__jJb3E",linkBlock:"header_linkBlock__Dvf1b",rootLink:"header_rootLink__lxsfd",menuLink:"header_menuLink__ezE9a",rightWrapper:"header_rightWrapper__2ccA7",darkToggleWrapper:"header_darkToggleWrapper__FNJRT"}},9351:function(e){e.exports={sidebarWrapper:"sidebar_sidebarWrapper__f7n66",open:"sidebar_open__gMTRf",dark:"sidebar_dark__NS6FD",hidden:"sidebar_hidden__wu7uu",nowPath:"sidebar_nowPath__EQTbk",sideBarFooter:"sidebar_sideBarFooter__UeaFX",socialLogoWrppaer:"sidebar_socialLogoWrppaer__HjmQx",socialLogo:"sidebar_socialLogo__UXRTR"}},5420:function(e){e.exports={wrapper:"topMoveButton_wrapper__bhDvy",darkMode:"topMoveButton_darkMode__mSHjE"}}},function(e){e.O(0,[42,685,925,883,971,596,744],function(){return e(e.s=6788)}),_N_E=e.O()}]);