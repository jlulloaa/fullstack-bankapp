import ReactTooltip from "react-tooltip";
import { useEffect } from 'react';

// Language setting taken from https://codeutility.org/javascript-how-can-i-convert-google-translate-dropdown-into-language-button-i-am-using-google_translate_element-in-react-js-stack-overflow/ 
const LanguageChange = () => {
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'en', 
                                                     includedLanguages: 'es,it,fr',  
                                                     layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, 
                                                    }, 
                                                    'google_translate_element')
    }
    useEffect(() => {
      var addScript = document.createElement('script');
      addScript.setAttribute('async', '');
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    }, [])

    return (
      <div id="google_translate_element"></div>
    );
  };


  const formatBalance = (value) => {
    if (value >0) {
        return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else {
        return "--";
    }
}

const ToolTips = () => {

    const tooltipFormat = {
        place: "bottom",
        type: "dark",
        effect: "float",
        multiline: true,
        offset: {'top': 1, 'left': 1},
        border: false,
        backgroundColor: "gray",
        textColor: "white",
        delayHide: 10
    };

    const idTip = {
        homeTip: "Reset values", 
        createAccTip: <>Add a new <br/> account</>,
        startTip: "Get started",
        existAccTip: <>Access your <br/> account</>,
        newAccTip: "Click to add account",
        depositTip: <>Add funds <br/> to your account</>,
        depositClickTip: "Click to deposit",
        depositAmountTip: "Enter amount",
        withdrawTip: <>Draw funds out <br/> from your account</>,
        withdrawClickTip: "Click to withdraw",
        withdrawAmountTip: "Enter amount", 
        aboutTip: "The small print",
        allDataTip: <>Historic <br/> transactions</>,
        noAccountTip: <>Must have an account <br/> to enable this option</>, 
        exportEnabledTip: "Click to download", 
        balanceTip: <>Check your <br/> current balance</>,
        productsTip: "Check our products"
    }

    let toolTipFlags = Object.entries(idTip).map((item, idx) => {
                return (
                  <ReactTooltip key={idx} id={item[0]} {...tooltipFormat} >
                    {item[1]}
                  </ReactTooltip>
                  );
              });
          
    return (
        <>
            {toolTipFlags}
        </>
    )
};


export {formatBalance, ToolTips, LanguageChange};