/* Custom form validation */

// reset all form inputs on page load
const form = document.querySelector("form");
form.reset();

// debounce helper function for delay on  form validation check
const debounce = (fn, delay = 2000) => {
  let timeoutId;
  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timer);
    }
    // set new timer
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

// focus on Name field on pageLoad
const nameInput = document.querySelector("#name");
nameInput.focus();

// job role extra information only displayed when 'other' selection made
const jobTitleInput = document.querySelector("#title");
const jobTitleExtraInput = document.querySelector("#other-job-role");

jobTitleExtraInput.style.display = "none";

jobTitleInput.addEventListener("change", () => {
  jobTitleInput.value === "other"
    ? (jobTitleExtraInput.style.display = "")
    : (jobTitleExtraInput.style.display = "none");
});

/* T shirt extra info only show once selection is made */
const tShirtSizeInput = document.querySelector("#shirt-sizes");
const tShirtDesignInput = document.querySelector("#design");
const tShirtColorInput = document.querySelector("#color");
const tShirtColorSection = document.querySelector("#shirt-colors");

tShirtColorSection.style.display = "none";

tShirtDesignInput.addEventListener("change", () => {
  tShirtColorSection.style.display = "";
  tShirtColorInput.selectedIndex = 0;
  for (let i = 0; i < tShirtColorInput.options.length; i++) {
    tShirtDesignInput.value === tShirtColorInput.options[i].dataset.theme
      ? (tShirtColorInput.options[i].hidden = false)
      : (tShirtColorInput.options[i].hidden = true);
  }
});

/* resister activities section tallies cost of activities */
const activitiesField = document.querySelector("#activities");
const activitiesCostDisplay = document.querySelector("#activities-cost");
const activitiesCheckbox = document.querySelectorAll("input[type=checkbox]");

let activitiesCost = 0;

// if statement to check each key input
// if valid remove not-valid, add valid class and hide hint
// if invalid add not-valid class, remove valid and show hint
activitiesField.addEventListener("change", (e) => {
  if (e.target.checked) {
    activitiesCost += parseInt(e.target.dataset.cost);
    // loop over activities to disable any conflicts that are NOT e.target
    activitiesCheckbox.forEach((activity) => {
      if (
        e.target.dataset.dayAndTime === activity.dataset.dayAndTime &&
        activity !== e.target
      ) {
        activity.parentElement.classList.add("disabled");
        activity.disabled = true;
      }
    });
  } else if (!e.target.checked) {
    activitiesCost -= parseInt(e.target.dataset.cost);
    // loop over activities to re enable any conflicts
    activitiesCheckbox.forEach((activity) => {
      if (e.target.dataset.dayAndTime === activity.dataset.dayAndTime) {
        activity.parentElement.classList.remove("disabled");
        activity.disabled = false;
      }
    });
  }

  activitiesCostDisplay.innerHTML = `Total: $${activitiesCost}`;
});

// add focus on 'register for activities' section
activitiesCheckbox.forEach((checkbox) =>
  checkbox.addEventListener("focus", () => {
    checkbox.parentElement.classList.add("focus");
  })
);

activitiesCheckbox.forEach((checkbox) =>
  checkbox.addEventListener("blur", () => {
    checkbox.parentElement.classList.remove("focus");
  })
);

/* filter payment options based on users selection */
const paymentMethodInput = document.querySelector("#payment");
const paymentCreditCard = document.querySelector("#credit-card");
const paymentPayPal = document.querySelector("#paypal");
const paymentBitCoin = document.querySelector("#bitcoin");

paymentMethodInput.options[1].selected = true;
paymentPayPal.style.display = "none";
paymentBitCoin.style.display = "none";

paymentMethodInput.addEventListener("change", () => {
  // start by removing not valid on parent when changing option
  paymentMethodInput.parentElement.classList.remove("not-valid");
  if (paymentMethodInput.value === "credit-card") {
    paymentCreditCard.style.display = "";
    paymentPayPal.style.display = "none";
    paymentBitCoin.style.display = "none";
  } else if (paymentMethodInput.value === "bitcoin") {
    paymentCreditCard.style.display = "none";
    paymentPayPal.style.display = "none";
    paymentBitCoin.style.display = "";
  } else if (paymentMethodInput.value === "paypal") {
    paymentCreditCard.style.display = "none";
    paymentPayPal.style.display = "";
    paymentBitCoin.style.display = "none";
  }
});

/* helper functions for validation */
// name validation
const nameValidate = () => {
  const regex = /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*|\w{2,}$/;
  if (regex.test(nameInput.value)) {
    nameInput.parentElement.classList.add("valid");
    nameInput.parentElement.classList.remove("not-valid");
    nameInput.parentElement.lastElementChild.style.display = "";
    return true;
  } else {
    nameInput.parentElement.classList.add("not-valid");
    nameInput.parentElement.classList.remove("valid");
    nameInput.parentElement.lastElementChild.style.display = "block";
    return false;
  }
};

// validation for name field on blur with debounce to not fire too quick
nameInput.addEventListener("blur", debounce(nameValidate));

// email validation
const emailInput = document.querySelector("#email");

const emailValidate = () => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailInput.value === "") {
    emailInput.parentElement.lastElementChild.innerText =
      "Email field cannot be blank";
    emailInput.parentElement.classList.add("not-valid");
    emailInput.parentElement.classList.remove("valid");
    emailInput.parentElement.lastElementChild.style.display = "block";
    return false;
  } else if (regex.test(emailInput.value)) {
    emailInput.parentElement.classList.add("valid");
    emailInput.parentElement.classList.remove("not-valid");
    emailInput.parentElement.lastElementChild.style.display = "";
    return true;
  } else {
    emailInput.parentElement.classList.add("not-valid");
    emailInput.parentElement.classList.remove("valid");
    emailInput.parentElement.lastElementChild.innerText =
      "Email address must be formatted correctly";
    emailInput.parentElement.lastElementChild.style.display = "block";
    return false;
  }
  return;
};

// validation on keyup for email section on blur, but using debounce to not fire instantly
emailInput.addEventListener("blur", debounce(emailValidate));

// function to make sure > 0 activities checked
const activitiesValidate = () => {
  if (activitiesCost > 0) {
    activitiesField.classList.add("valid");
    activitiesField.classList.remove("not-valid");
    activitiesField.lastElementChild.style.display = "";
    return true;
  } else {
    activitiesField.classList.add("not-valid");
    activitiesField.classList.remove("valid");
    activitiesField.lastElementChild.style.display = "block";
    return false;
  }
};
// run validate when user changes form
activitiesField.addEventListener("change", activitiesValidate);

// fucntion to validate credit card info if active
// is card num valid
const cardNumInput = document.querySelector("#cc-num");
const zipInput = document.querySelector("#zip");
const cvvInput = document.querySelector("#cvv");

const cardNumValidate = (cardNum) => {
  const cardRegex = /^[1-9]{13,15}$/;
  if (cardRegex.test(cardNum)) {
    cardNumInput.parentElement.classList.add("valid");
    cardNumInput.parentElement.classList.remove("not-valid");
    cardNumInput.parentElement.lastElementChild.style.display = "";
    return true;
  } else {
    cardNumInput.parentElement.classList.add("not-valid");
    cardNumInput.parentElement.classList.remove("valid");
    cardNumInput.parentElement.lastElementChild.style.display = "block";
    return false;
  }
};

// is zip valid
const zipValidate = (zip) => {
  const zipRegex = /^[1-9]{5}$/;
  if (zipRegex.test(zip)) {
    zipInput.parentElement.classList.add("valid");
    zipInput.parentElement.classList.remove("not-valid");
    zipInput.parentElement.lastElementChild.style.display = "";
    return true;
  } else {
    zipInput.parentElement.classList.add("not-valid");
    zipInput.parentElement.classList.remove("valid");
    zipInput.parentElement.lastElementChild.style.display = "block";
    return false;
  }
};

// is cvv valid
const cvvValidate = (cvv) => {
  const cvvRegex = /^[1-9]{3}$/;
  if (cvvRegex.test(cvv)) {
    cvvInput.parentElement.classList.add("valid");
    cvvInput.parentElement.classList.remove("not-valid");
    cvvInput.parentElement.lastElementChild.style.display = "";
    return true;
  } else {
    cvvInput.parentElement.classList.add("not-valid");
    cvvInput.parentElement.classList.remove("valid");
    cvvInput.parentElement.lastElementChild.style.display = "block";
    return false;
  }
};

const creditCardValidate = () => {
  if (paymentMethodInput.options[1].selected) {
    const isCvvValid = cvvValidate(cvvInput.value);
    const isZipValid = zipValidate(zipInput.value);
    const isCardNumValid = cardNumValidate(cardNumInput.value);
    return isCvvValid && isZipValid && isCardNumValid ? true : false;
  }
};

/* form submit handler */
form.addEventListener("submit", (e) => {
  // capture results of each test
  const isNameValid = nameValidate();
  const isEmailValid = emailValidate();
  const isActivitiesValid = activitiesValidate();
  const isCreditCardValid = creditCardValidate();

  // check if all valid, if valid sumbit, if not prevent default
  const isFormValid =
    isNameValid && isEmailValid && isActivitiesValid && isCreditCardValid;
  if (isFormValid) {
    return;
  } else {
    e.preventDefault();
  }
});
