const textInput = document.querySelector("[name='text_input']");
const secretKey = document.querySelector("[name='secret']");
const saveButton = document.querySelector(".save_button");
const startButton = document.querySelector(".start_button");
const stopButton = document.querySelector(".stop_button");
const saveSecret = document.querySelector("[name='save_secret']");
const countEl = document.querySelector(".count");

chrome.storage.sync.get(null, function ({ omegle_text, okey }) {
  omegle_text && (textInput.value = omegle_text);
  if (okey) {
    secretKey.value = okey;
    saveSecret.checked = true;
  }
});

saveButton.onclick = function () {
  chrome.storage.sync.set(
    { omegle_text: textInput.value, omegle_error: false },
    function () {
      alert("Settings updated successfully🎉🎉!");
    }
  );
};

startButton.onclick = async function () {
  if (!secretKey.value) {
    alert("Secret key must be provided for this app to work");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        start_bombing: true,
        key: secretKey.value,
        save_okey: saveSecret.checked
      },
      function () {}
    );
  });
};

stopButton.onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { start_bombing: false },
      function () {}
    );
  });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.omegle_count) {
    sendResponse({});
    const { omegle_count } = request;
    countEl.innerHTML = omegle_count;
  }
});

chrome.storage.sync.get(["omegle_count"], function ({ omegle_count }) {
  console.log({ omegle_count });
  countEl.innerHTML = omegle_count;
});
