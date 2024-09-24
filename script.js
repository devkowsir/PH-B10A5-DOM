let balanceAmount = Math.floor(Math.random() * 99000) + 1000;
const donationHistory = [];

// set initial amount
const currentBalanceElement = document.getElementById("current-balance");
currentBalanceElement.innerText = `${balanceAmount} BDT`;
const dialogElement = document.getElementById("dialog");
dialogElement.querySelector("button").addEventListener("click", () => dialogElement.setAttribute("hidden", true));

// Tab Handling
const tabButtonElements = document.querySelectorAll("#tab-buttons > button");
const tabContentElements = document.querySelectorAll("#tab-contents > div");
let activeTabIndex = 0;

function updateCurrentTab() {
  tabButtonElements.forEach((btn, i) => i != activeTabIndex && btn.classList.remove("primary"));
  tabContentElements.forEach((cnt, i) => i != activeTabIndex && cnt.classList.add("hidden"));
  tabButtonElements[activeTabIndex].classList.add("primary");
  tabContentElements[activeTabIndex].classList.remove("hidden");
}

updateCurrentTab();

tabButtonElements.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    activeTabIndex = i;
    updateCurrentTab();
  });
});

// Donations Tab
const donationTabElement = document.getElementById("donation-tab");
const donationElements = donationTabElement.querySelectorAll("li > div");
const donateButtonElements = donationTabElement.querySelectorAll("button");

function deductFromBalance(amount) {
  balanceAmount -= amount;
  currentBalanceElement.innerText = `${balanceAmount} BDT`;
}

function addDonatedAmount(amount, index) {
  const spanElement = donationElements[index].querySelector(".donated-amount span");
  const prevAmount = parseFloat(spanElement.innerText.split(" ")[0]);
  spanElement.innerHTML = `${prevAmount + amount} BDT`;
}

donateButtonElements.forEach((btn, buttonIndex) =>
  btn.addEventListener("click", () => {
    const donationElement = donationElements[buttonIndex];
    const amountInput = donationElement.querySelector("input");
    if (!isValidDonationAmount(amountInput.value)) return;

    const amount = parseFloat(amountInput.value);
    amountInput.value = "";
    deductFromBalance(amount);
    addDonatedAmount(amount, buttonIndex);

    const donatingTo = donationElement.querySelector("h2").innerText;
    donationHistory.push({ amount, donatingTo, date: new Date().toLocaleString() });
    updateHistory();

    dialogElement.querySelector(".content > div > span").innerText = `${amount} BDT`;
    dialogElement.removeAttribute("hidden");
  })
);

// History tab
const historyTab = document.getElementById("history-tab");

function updateHistory() {
  historyTab.innerHTML = `<ul>
    ${donationHistory
      .map(
        ({ amount, donatingTo, date }) => `<li>
      <h2>${amount} Taka is Donated for ${donatingTo}</h2>
      <p>${date}</p>
    </li>`
      )
      .join("")}
  </ul>`;
}

// functions
function isValidDonationAmount(amount) {
  if (amount == "") alert("Enter donation amount.");
  else if (isNaN(amount) || amount == "0" || amount.startsWith("-")) alert("Enter a valid amount.");
  else if (amount > balanceAmount) alert("Insufficient balance.");
  else return true;
}
