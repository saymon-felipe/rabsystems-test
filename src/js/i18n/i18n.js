import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)

const messages = {
    pt: require('./languages/messages_pt.json'),
    en: require('./languages/messages_en.json')
}

let navigatorLanguage = navigator.language.split("-")[0];

const i18n = new VueI18n({
  locale: navigatorLanguage,
  fallback: true,
  fallbackLocale: 'en',
  messages
})

export default i18n;