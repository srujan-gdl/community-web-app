import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const translations = { en, es };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  // Initialize language from localStorage or fall back to 'es' (best choice for Mexican communities)
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem('cotogate_lang');
    return savedLang === 'en' || savedLang === 'es' ? savedLang : 'es';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'es') {
      setLanguageState(lang);
      localStorage.setItem('cotogate_lang', lang);
    }
  };

  // Simple key resolver
  const t = (key) => {
    const dictionary = translations[language];
    return dictionary[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom React hook for context access
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
