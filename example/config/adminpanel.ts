import { ModelConfig, AdminpanelConfig } from "sails-adminpanel/interfaces/adminpanelConfig"
import { FieldsTypes } from 'sails-adminpanel/interfaces/fieldsTypes'
let models: { [key:string]: ModelConfig } = {
  category:{
    title: 'Category',
    model: 'category',
    icon: 'box',
    fields: {
      id: false,
      name: 'Name',
      createdAt: false,
      updatedAt: false
    }
  },
  article:{
    title: 'Article',
    model: 'article',
    icon: 'box',
    fields: {
      id: false,
      name: 'Name',
      optionsArticleModel: {
        type: FieldsTypes.json,
        title: 'JSON editor'
      },
      createdAt: false,
      updatedAt: false
    }
  },
}

var config: AdminpanelConfig = {
  models: models,
  administrator: {
    login: process.env.ADMIN_LOGIN === undefined ? 'admin' : process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASS === undefined ? '45345345FF38' : process.env.ADMIN_PASS
  },
  translation: {
    locales: ['ru', 'en', 'de', 'ua'],
    path: 'config/locales/adminpanel', // relative path to translations directory
    defaultLocale: 'ru'
  },
  //@ts-ignore
  auth: process.env.NODE_ENV === 'production'
}

module.exports.adminpanel = config
