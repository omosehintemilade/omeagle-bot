//Global Varaiables
const host = "https://omegle-backend.herokuapp.com";

const contentScript = ({ omegle_text, key, omegle_count }) => {
  const msgInput = document.querySelector(".chatmsg");
  const sendButton = document.querySelector(".sendbtn");
  const disconnectButton = document.querySelector(".disconnectbtn");

  // return;
  msgInput.focus();
  // Reset msgInput elment value
  msgInput.value = omegle_text;
  // return;
  setTimeout(async () => {
    sendButton.click();

    // Deduct Key Value
    const { data } = await deductKey(key);
    // chrome.runtime.sendMessage({ omegle_count: data.count }, function () {});

    // Disconnect from room
    disconnectButton.click();
  }, 4000);
  setTimeout(() => {
    // Confirm disconnect
    disconnectButton.click();
  }, 5000);

  setTimeout(() => {
    // look for new user
    disconnectButton.click();
  }, 7000);
};

const validateKey = async (key) => {
  const body = JSON.stringify({ key });
  const res = await fetch(`${host}/key/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });
  const data = await res.json();

  if (data.success === false) {
    alert(data.error.message);
    throw Error(data.error.message);
  } else {
    return data;
  }
};

const deductKey = async (key) => {
  const body = JSON.stringify({ key });
  const res = await fetch(`${host}/key/deduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });
  const data = await res.json();

  if (data.success === false) {
    throw Error(data.error.message);
  } else {
    return data;
  }
};

const start = (interval) => {
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if (request.start_bombing === true) {
      sendResponse({});

      const { key, save_okey } = request;

      const { data } = await validateKey(key);
      // console.log("data:", data);
      const omegle_count = data.count;

      chrome.storage.sync.set({ omegle_count }, function () {
        console.log("count saved successfully");
      });

      if (save_okey === true) {
        chrome.storage.sync.set({ okey: data.passkey }, function () {
          console.log("secret key saved successfully");
        });
      }

      chrome.storage.sync.get(null, function ({ omegle_text }) {
        console.log({ omegle_text, omegle_count });
        if (!omegle_text) {
          throwError(
            "No text found",
            "No text found. Kindly update your settings.",
            interval
          );
        }

        if (omegle_count <= 0) {
          throwError(
            "Slots exhausted",
            "Omeagle slots exhausted. Kindly contact the developer on Whatsapp or via phone call => +234 803 9635 377",
            interval
          );
        }
        contentScript({ omegle_text, key, omegle_count });
      });
    } else {
      if (!interval) {
        alert("An error occured, please try again in 1 minute");
      } else {
        clearInterval(interval);
        alert("You deserve a break Your Majesty 👑👑👑!");
      }
    }
  });
};

const throwError = (errmsg, alertmsg, interval) => {
  clearInterval(interval);
  console.log("Interval cleared", { interval });
  alertmsg && alert(alertmsg);
  throw Error(errmsg);
};



start()

// function WatchStartFunc() {
//   let interval = null;

//   interval = setInterval(() => {
//     start(interval);
//   }, 10 * 1000);
//   start(interval);
// }
// WatchStartFunc();
