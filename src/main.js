import Vue from 'vue';
import App from './App.vue';
import router from "../src/routes/router.js";
import $ from 'jquery';
import api from './configs/api.js';
import i18n from './js/i18n/i18n.js';
import CKEditor from 'ckeditor4-vue';

Vue.config.productionTip = false;
Vue.use(CKEditor);

//Variáveis globais
let firstLoad = true;

let hidden;

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

if ($(document).length) {
  if (window.location.pathname == "/" || window.location.pathname == "/rabsystems") {
    $("a").on("click", e => {
      
      if (e.currentTarget.className == "header-button") {
        return;
      }
  
      e.preventDefault();
      
      let target = $(e.currentTarget.attributes.href.nodeValue);
      $("html, body").animate({
          scrollTop: target.offset().top - 100
      }, 10);
    });
  }
  findPageVisibility();
}

function findPageVisibility() {
  let visibilityChange;

  if (typeof document.hidden !== "undefined") { // Suporte para Opera 12.10 e Firefox 18 em diante
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  // Alerta se o navegador não suporta addEventListener ou a API de visibilidade da página
  if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
  } else {
    if (firstLoad) {
      handleVisibilityChange();
      firstLoad = false;
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }
}

function outUser(user_out = false) {
  let jwt = "Bearer " + getJwtInLocalStorage();

  if (user_out) {
      api.patch("/user/out_user", "", {
          headers: {
              Authorization: jwt
          }
      })
  }
}

function handleVisibilityChange () {
  if (!document[hidden]) {
    $("body").removeClass("hidden");
    $("body").addClass("visible");
    outUser(false);
  } else {
    $("body").removeClass("visible");
    $("body").addClass("hidden");
    outUser(true);
  }
}

function pesquisaCep(value, target) {
  if (value.length == 8) {
    let cep = value;
    target.removeClass("invalid-number");

    //Preenche os campos com "..." enquanto consulta webservice.
    $("#street").val("...");
    $("#district").val("...");
    $("#city").val("...");
    $("#state").val("");

    $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
    //Atualiza os campos com os valores da consulta.
    $("#street").val(dados.logradouro);
    $("#district").val(dados.bairro);
    $("#city").val(dados.localidade);
    $("#state").val(dados.uf);
    });
  }
}

$("#cep").on("focusout", event => {
  pesquisaCep(event.target.value, $("#" + event.target.id))
});

function getJwtInLocalStorage() {
  return localStorage.getItem("rabsystems_jwt");
}

let globalLanguage = localStorage.getItem("lang");

function checkIfLangIsChanged() {
  let localLanguage = localStorage.getItem("lang");
  if (localLanguage != globalLanguage) {
    globalLanguage = localLanguage;
    location.reload();
  } else {
    setTimeout(() => {
      checkIfLangIsChanged();
    }, 1000)
  }
}

checkIfLangIsChanged();