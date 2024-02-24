"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let models = {
    category: {
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
    article: {
        title: 'Article',
        model: 'article',
        icon: 'box',
        fields: {
            id: false,
            name: 'Name',
            optionsArticleModel: {
                type: "json",
                title: 'JSON editor'
            },
            createdAt: false,
            updatedAt: false
        }
    },
};
var config = {
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
};
module.exports.adminpanel = config;
