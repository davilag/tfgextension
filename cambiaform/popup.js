document.addEventListener('DOMContentLoaded', function () {
    chrome.privacy.services.autofillEnabled.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          chrome.privacy.services.autofillEnabled.set({ value: false }, function() {
            if (chrome.runtime.lastError === undefined)
              alert("Hooray, it worked!");
            else
              alert("Sadness!", chrome.runtime.lastError);
          });
        }
      });
  chrome.privacy.services.autofillEnabled.get({}, function(details) {
        if (details.value)
          alert('Autofill is on!');
        else
          alert('Autofill is off!');
      });
});
