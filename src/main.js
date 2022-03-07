import Vue from 'vue';
import App from './App.vue';
import router from "../src/routes/router.js";
import $ from 'jquery';

Vue.config.productionTip = false;
Vue.prototype.$firstLoad = true;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

if ($(document).length) {
  if (window.location.pathname == "/" || window.location.pathname == "/rabsystems") {
    $("a").on("click", e => {
      
      if (e.currentTarget.className == "header-button") {
        return
      }
  
      e.preventDefault();
      
      let target = $(e.currentTarget.attributes.href.nodeValue);
      $("html, body").animate({
          scrollTop: target.offset().top - 100
      }, 10);
    });
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
  } else {
    target.addClass("invalid-number");
  }
}

$("#cep").on("focusout", event => {
  pesquisaCep(event.target.value, $("#" + event.target.id))
});