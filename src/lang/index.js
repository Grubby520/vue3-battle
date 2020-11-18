import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import en from './en'
import zh from './zh'
import { getLang } from '@shared/util'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: getLang(),
  messages: {
    en,
    zh,
    'zh-CN': zh// 兼容navigator.language获取的语言值
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
