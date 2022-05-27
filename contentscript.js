const contentScript = () => {
  const msgInput = document.querySelector(".chatmsg");
  const sendButton = document.querySelector(".sendbtn");
  const disconnectButton = document.querySelector(".disconnectbtn");

  // const textVal = "F21 Add up on snap: alitajames2022";

  const textVal = "F21 down to fuck add me up on snap 👻 olivialegit22";

  msgInput.focus();
  // Reset msgInput elment value
  msgInput.value = textVal;

  setTimeout(() => {
    sendButton.click();
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

const start = () => {
  contentScript();

  setInterval(() => {
    contentScript();
  }, 10000);
};

start();
