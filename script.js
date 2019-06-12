Date.prototype.julian = function() {
  let today = new Date();
  // Start of this year (0th day)
  const start = new Date(today.getFullYear(), 0, 0);
  // without (possibly) daylight savings time
  let diff = today - start;
  // add in changes from daylight savings time if applicable
  diff += (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
  // divide by milliseconds per day
  return Math.floor(diff / 86400000);
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
