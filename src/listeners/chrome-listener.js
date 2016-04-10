export class ChromeListener {

  static registerChromeListener() {
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.target) {
          let query = request.target;
          document.artemisLocate(query);
        }
      });
    }
  }

}
