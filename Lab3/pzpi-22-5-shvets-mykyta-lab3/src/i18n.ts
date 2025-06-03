// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import homeEn from '../public/locales/en/home.json';
import homeUk from '../public/locales/uk/home.json';
import commonEn      from '../public/locales/en/common.json';
import commonUk      from '../public/locales/uk/common.json';
import dashboardEn   from '../public/locales/en/dashboard.json';
import dashboardUk   from '../public/locales/uk/dashboard.json';
import permissionsEn from '../public/locales/en/permissions.json';
import permissionsUk from '../public/locales/uk/permissions.json';
import historyEn     from '../public/locales/en/history.json';
import historyUk     from '../public/locales/uk/history.json';
import settingsEn    from '../public/locales/en/settings.json';
import settingsUk    from '../public/locales/uk/settings.json';
import sidebarEn     from '../public/locales/en/sidebar.json';
import sidebarUk     from '../public/locales/uk/sidebar.json';
import headerEn      from '../public/locales/en/header.json';
import headerUk      from '../public/locales/uk/header.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                home:        homeEn,
                common:      commonEn,
                dashboard:   dashboardEn,
                permissions: permissionsEn,
                history:     historyEn,
                settings:    settingsEn,
                sidebar:     sidebarEn,
                header:      headerEn,
            },
            uk: {
                home:        homeUk,
                common:      commonUk,
                dashboard:   dashboardUk,
                permissions: permissionsUk,
                history:     historyUk,
                settings:    settingsUk,
                sidebar:     sidebarUk,
                header:      headerUk,
            },
        },
        lng: 'en',
        fallbackLng: 'en',
        ns: ['common','dashboard','permissions','history','settings','sidebar','header'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
    });

export default i18n;
