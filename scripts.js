Date.prototype.julian = function() {
  let today = new Date();
  // Start of this year (0th day)
  const start = new Date(this.getFullYear(), 0, 0);
  // without (possibly) daylight savings time
  let diff = this - start;
  // add in changes from daylight savings time if applicable
  diff += (start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
  // divide by milliseconds per day
  return Math.floor(diff / 86400000);
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

Date.prototype.getMonthName = function() {
  return months[this.getMonth()];
};
Date.prototype.getDayName = function() {
  return days[this.getDay()];
};

Number.prototype.nth = function() {
  // calculate the ordinal for the day number
  if (this % 1) return this;
  const s = this % 100;
  if (s > 3 && s < 21) return this + 'th';
  switch (s % 10) {
    case 1:
      return this + 'st';
    case 2:
      return this + 'nd';
    case 3:
      return this + 'rd';
    default:
      return this + 'th';
  }
};

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.getElementById(
      'ordinal-day'
    ).innerHTML = new Date().julian().nth();
  },
  false
);

const dayDisplay = document.getElementById('ordinal-day');
const dayInput = document.getElementById('day-input');
const dayPrefix = document.getElementById('day-prefix');
const daySuffix = document.getElementById('day-suffix');

document.getElementById('ordinal-day').addEventListener('click', (e) => {
  const currentDay = parseInt(dayDisplay.innerHTML.slice(0, -2));

  dayInput.value = currentDay;

  updateWithDay();
  showInput(true);
});

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BODY') {
    showInput(false);
  }
});

function updateWithDay() {
  // check if it's a leap year to get max days in the year
  const currYear = new Date().getFullYear();
  const daysThisYear = !(currYear & 3 || (!(currYear % 25) && currYear & 15))
    ? 366
    : 365;

  // validate input day of the year
  let newDay = Math.min(daysThisYear, Math.max(parseInt(dayInput.value), 1));
  if (isNaN(newDay)) {
    newDay = '';
  }

  // create a Date from the given day of the year
  let newDate = new Date(currYear, 0, 0);
  newDate.setDate(newDate.getDate() + newDay);

  // determine verb tense
  const todayDate = new Date().julian();
  const otherDate = newDate.julian();
  let tense;
  if (otherDate < todayDate) {
    tense = 'was';
  } else if (otherDate > todayDate) {
    tense = 'will be';
  } else {
    tense = 'is';
  }

  const displayDate = `${newDate.getDayName()}, ${newDate.getMonthName()} ${newDate
    .getDate()
    .nth()} <br/> ${tense} the `;

  dayPrefix.innerHTML = displayDate;
  daySuffix.innerHTML = `<span id='underlined'>${newDay
    .nth()
    .slice(-2)}</span><br/> day of the year`;

  dayInput.value = newDay;
  dayInput.style.width = `${String(newDay).length}ch`;
}

dayInput.addEventListener('keyup', () => {
  updateWithDay();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    showInput(false);
  }
});

function showInput(shouldShow) {
  dayDisplay.hidden = shouldShow;
  dayInput.hidden = !shouldShow;
  if (!shouldShow) {
    dayPrefix.innerHTML = 'Today is the ';
    daySuffix.innerHTML = ' day of the year';
  } else {
    dayInput.focus();
    dayInput.select();
  }
}
