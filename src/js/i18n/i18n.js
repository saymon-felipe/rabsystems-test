import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)

const messages = {
    pt: require('./languages/messages_pt.json'),
    en: require('./languages/messages_en.json')
}

const i18n = new VueI18n({
  locale: navigator.language,
  fallback: true,
  fallbackLocale: 'en',
  messages
})

export default i18n;