export class ChromeListener {

  static registerChromeListener(manager) {
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.target) {
          let query = request.target;
          manager.init();
          manager.locate.apply(manager,[query]);
        }
      });
    }
  }

}
