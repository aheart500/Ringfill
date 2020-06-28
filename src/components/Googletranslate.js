import React, { Component } from 'react';

class GoogleTranslate extends Component {
    googleTranslateElementInit () {
        new window.google.translate.TranslateElement({pageLanguage: 'pt',includedLanguages: 'ar,en', layout: window.google.translate.TranslateElement.FloatPosition.SIMPLE}, 'google_translate_element')
     }

    componentDidMount() {
        var addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');        
        document.body.appendChild(addScript);  
        window.googleTranslateElementInit = this.googleTranslateElementInit;
    }

    render() {
        return (
            <div id="google_translate_element"></div>
          );
     }
}

export default GoogleTranslate;