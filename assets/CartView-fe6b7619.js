import{u as n,a as c,s as u,j as _,f as t,o as i,d as m,q as d,m as p,g as l,A as f,_ as A}from"./index-ba497632.js";const h={key:0,class:"px-10 py-12"},x={__name:"CartView",setup(C){const s=f(()=>A(()=>import("./CartList-ca8dd643.js"),["assets/CartList-ca8dd643.js","assets/index-ba497632.js","assets/index-e99d5bae.css","assets/orderStore-d52bf467.js","assets/cartStore-34a7c14a.js","assets/SpinnerLoading-c6094c35.js","assets/SpinnerLoading-64712071.css"])),o=n(),r=c(),{isAuthenticated:e}=u(r),{showAlert:a}=l();return _(()=>{if(!e.value)return a("error","請先登入才能使用功能"),o.replace({name:"ProductList"})}),(V,k)=>t(e)?(i(),m("main",h,[d(t(s))])):p("",!0)}};export{x as default};
