import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';
import React from 'react';

export const OUPharmacyChatBot = () => {
  React.useEffect(() => {
    // (function (d, m) {
    //   var kommunicateSettings = {
    //     appId: '2aa5fb4081ecebd15ce8f31b534ae461',
    //     popupWidget: true,
    //     automaticChatOpenOnNavigation: true,
    //   };
    //   var s = document.createElement('script');
    //   s.type = 'text/javascript';
    //   s.async = true;
    //   s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
    //   var h = document.getElementsByTagName('head')[0];
    //   h.appendChild(s);
    //   window.kommunicate = m;
    //   m._globals = kommunicateSettings;
    // })(document, window.kommunicate || {});

    (function(d, m){
       /*---------------- Kommunicate settings start ----------------*/
      // var defaultSettings = {
      //   "defaultBotIds": ["oupharmacy-gj9ar"], // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
      //   "defaultAssignee": "oupharmacy-gj9ar", // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
      //   "skipRouting":true
      // };

      var kommunicateSettings = {
          automaticChatOpenOnNavigation:false,
          appId:'34ecb68da4ad3dc79330e73674c66e979',
          popupWidget:true,
          quickReplies:["Đặt lịch ngay","Kết nối với y tá", "Kết nối với bác sĩ"],
          // onInit: function() {
          //     Kommunicate.updateSettings(defaultSettings); 
          // } ,
      };
      /*----------------- Kommunicate settings end ------------------*/
        
        var s = document.createElement("script"); 
        s.type = "text/javascript"; 
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; 
        h.appendChild(s);
        window.kommunicate = m; 
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
  }, []);

  return <div></div>;
};