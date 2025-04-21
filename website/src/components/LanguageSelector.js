import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ vertical = false, collapsed = false }) => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };
  
  const languages = [
    { code: 'en', abbr: 'EN', name: t('language.english'), flag: '🇬🇧' },
    { code: 'bg', abbr: 'BG', name: t('language.bulgarian'), flag: '🇧🇬' },
    { code: 'ru', abbr: 'RU', name: t('language.russian'), flag: '🇷🇺' }
  ];
  
  // When collapsed, only show current language
  if (collapsed) {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    return (
      <div className="language-selector-collapsed text-center">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            // Cycle to next language when clicked
            const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
            const nextIndex = (currentIndex + 1) % languages.length;
            changeLanguage(languages[nextIndex].code);
          }}
        >
          {currentLang.abbr}
        </button>
      </div>
    );
  }
  
  if (vertical) {
    return (
      <div className="language-selector-vertical">
        <div className="language-list d-flex justify-content-center">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`btn btn-sm mx-1 ${i18n.language === lang.code ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.abbr}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="language-selector d-flex">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`btn btn-sm me-1 ${i18n.language === lang.code ? 'btn-primary' : 'btn-outline-light'}`}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.abbr}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
