(function() {
  var base_url, currVersion, getVersion, onInstall, onUpdate, prevVersion;

  base_url = "http://localhost:5000";

  onInstall = function() {
    localStorage['needsHelp'] = true;
    chrome.tabs.getSelected(function(tab) {
      return chrome.tabs.update(tab.id, {
        'url': "http://mail.google.com"
      });
    });
    return null;
  };

  onUpdate = function() {
    alert("Extension Updated");
    return null;
  };

  getVersion = function() {
    var details;
    details = chrome.app.getDetails();
    return details.version;
  };

  currVersion = getVersion();

  prevVersion = localStorage['version'];

  if (currVersion !== prevVersion) {
    if (typeof prevVersion === 'undefined') {
      onInstall();
    } else {
      onUpdate();
    }
    localStorage['version'] = currVersion;
  }

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getLocalStorage") {
      return sendResponse({
        data: localStorage[request.key]
      });
    } else if (request.method === "setLocalStorage") {
      localStorage[request.key] = request.value;
      return sendResponse({
        data: localStorage[request.key]
      });
    } else if (request.method === "getUser") {
      $.ajax({
        url: base_url + "/users/lookup/",
        data: {
          email: request.email
        },
        type: "get",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          return sendResponse({
            data: data
          });
        }
      });
      return true;
    } else if (request.method === "makePayment") {
      $.post(base_url + "/users/" + request.to + "/payments/new", {
        amount: request.amount
      }, function(data) {
        return sendResponse({
          data: data
        });
      });
      return true;
    } else {
      return sendResponse({});
    }
  });

}).call(this);
