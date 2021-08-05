/*
 * Given a date object, return a string representing YYYYMMDD.
 */
function ymd(dt) {
  let [month, day, year] = dt.toLocaleDateString().split("/");
  month = month < 10 ? "0" + month.toString() : month.toString();
  day = day < 10 ? "0" + day.toString() : day.toString();
  return `${year}${month}${day}`
}

/*
 * Test if an input is a date and return a string that Google Calendar
 * will accept as an argument to the `dates` parameter.
 */
function gCalDate(text) {
	let start = new Date(text);
  let dayInMs = 24*60*60*1000;
  // Is this a valid date?
  if (start.toString() !== 'Invalid Date' && !isNaN(start)) {
    // Calculate the next day.
    let end = new Date(start.getTime() + dayInMs);
    // End date needs to be at least one day after start date, else GCal shows the end date as 1 day previous.
    return `${ymd(start)}/${ymd(end)}` // 20201031/20201101
  }
  return false; // Not a valid date.
}

/*
 * Register a context menu when the extension is installed.
 */
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "calenderHelperContextMenu",
    "title": "Calendar Helper - Create Event",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
	let selection = item.selectionText;
  let g = gCalDate(selection);
	let currentUrl = tab.url;
  let dates = gCalDate(selection);
  if (dates) {
    let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Calendar Helper&dates=${dates}&details=From ${currentUrl}`;
    chrome.tabs.create({url: url, index: tab.index + 1});
  } else {
    alert(`The selection "${selection}" is not a date.`);
  }
});
