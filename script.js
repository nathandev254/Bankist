'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// alert("Welcome to the site")
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const DisplayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    }${type}</div>
      <div class="movements__value">${movement}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Creating user name
const createUsername = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  // console.log(acc)
};
createUsername(accounts);

// DisplayBalance

const CalcDisplayBalance = function (currentAccount) {
  currentAccount.balance = currentAccount.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  // console.log('Whats up G');
  if (currentAccount.balance < 0) {
    labelBalance.textContent = `0000€`;
  } else {
    labelBalance.textContent = `${currentAccount.balance}€`;
  }
};

// Calculate Summary  and display
const calcDisplaysummary = function (acc) {
  const deposits = acc.movements
    .filter(mov => mov > 0)
    .reduce(function (acc, movement) {
      return acc + movement;
    });
  labelSumIn.textContent = `${deposits}€`;
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce(function (acc, mov) {
      return acc + mov;
    });
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (interest) {
      if (interest >= 1) return interest;
    })
    .reduce(function (acc, deposit) {
      return acc + deposit;
    });
  labelSumInterest.textContent = `${interest}€`;
};

// IMPLEMENTING LOGIN FEATURE
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    const inputLoginuser = inputLoginUsername.value.toLowerCase();
    return acc.username === inputLoginuser;
  });
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    } `;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Display movements
    DisplayMovements(currentAccount.movements);
    //Display Balance
    CalcDisplayBalance(currentAccount);
    //Display summary
    calcDisplaysummary(currentAccount);
  }
  //  console.log(currentAccount)
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.push(-amount);
    receiverAcc.push(amount);

    //update ui
    DisplayMovements(currentAccount.movements);
    //Display Balance
    CalcDisplayBalance(currentAccount);
    //Display summary
    calcDisplaysummary(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= loanAmount / 10;
    })
  ) {
    currentAccount.movements.push(loanAmount);
    DisplayMovements(currentAccount.movements);
    //Display Balance
    CalcDisplayBalance(currentAccount);
    //Display summary
    calcDisplaysummary(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // console.log(`We want to close this account`)
    const index = accounts.findIndex(function (acc) {
      return acc.username === inputCloseUsername.value;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  DisplayMovements(currentAccount.movements, sorted);
});

const now = new Date
console.log(now)

