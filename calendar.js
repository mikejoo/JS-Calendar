const today = new Date();
let currentMonth = new Month(today.getFullYear(), today.getMonth());

let monthList = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let weekdayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let dayTRtag = "<tr>";
for (d in weekdayList) {
    dayTRtag += "<th weekdayDisplay='" + weekdayList[d] + "'>" + weekdayList[d] + "</th>";
}
dayTRtag += "</tr>";
// Get the id and display the 
document.getElementById("calendarWeekday").innerHTML = dayTRtag;

// for (let i = 1 ; i < 31 ; i++) {
//     fetch("getEvents.php", {
//         method: 'POST',
//         body: JSON.stringify({'year' : 2020, 'month' : 3, 'day': i}),
//         headers: {'content-type': 'application/json'}
//     })
//     .then(response => response.text())
//     .then(text => console.log(text));
// }

document.getElementById("today").addEventListener("click", function (event) {
    currentMonth.month = today.getMonth();
    currentMonth.year = today.getFullYear();
    updateCalendar(currentMonth.month, currentMonth.year);
}, false);

updateCalendar(currentMonth.month, currentMonth.year);


//WUSTL CSE 330 Course Wiki
document.getElementById("prev_month_btn").addEventListener("click", function (event) {
    currentMonth = currentMonth.prevMonth();
    updateCalendar(currentMonth.month, currentMonth.year);
}, false);

document.getElementById("next_month_btn").addEventListener("click", function (event) {
    currentMonth = currentMonth.nextMonth();
    updateCalendar(currentMonth.month, currentMonth.year);
}, false);

function updateCalendar(month, year) {
    let monthYear_text = document.createTextNode(monthList[month] + " " + year);
    let monthYear = document.getElementById("monthYear");
    monthYear.textContent = "";
    monthYear.appendChild(monthYear_text);

    let calendarDays = document.getElementById("calendarDay");
    calendarDays.textContent = "";

    let firstDay = new Date(year, month);
    let firstDay_day = firstDay.getDay();

    let curDate = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let temp = document.createElement('td');
            if (i == 0 && j < firstDay_day) {
                temp.textContent = "";
                temp.className = 'normal';
            } else if (curDate > daysInMonth(month + 1, year)) {
                break;
            } else {
                temp.textContent = "";
                if (curDate === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    temp.className = 'today';
                } else {
                    temp.className = 'normal';
                }
                temp.appendChild(document.createTextNode(curDate));
                temp.appendChild(document.createElement('br'));
                temp.appendChild(document.createElement('br'));
                curDate++;

                const data = {'year' : year, 'month' : month + 1, 'day' : curDate - 1};
                fetch("getEvents.php", {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {'content-type' : 'application/json'}
                })
                .then(response=>response.json())
                .then(data=>{
                    if (data.success) {
                        //console.log(data);
                        for (let k = 0 ; k < data.eventIDs.length ; k++) {
                            let eventbtn = document.createElement('button');
                            eventbtn.className = data.eventTags[k] + 'Button';
                            eventbtn.id = data.eventIDs[k];
                            eventbtn.appendChild(document.createTextNode(data.eventStartTimes[k].substring(11, 16) + " " + data.eventNames[k]));
                            temp.appendChild(eventbtn);
                            temp.appendChild(document.createElement('br'));

                            document.getElementById(data.eventIDs[k]).addEventListener("click", function(event) {
                                document.getElementById('viewEventModal').style.display = 'block';
                                eventModalInfo(data.eventIDs[k]);
                            }, false);
                        }
                    }
                })
                .catch(err=>console.error(err));

            }
            row.appendChild(temp);
        }
        calendarDays.appendChild(row);


    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
    "use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
    Date.prototype.deltaDays = function (n) {
        // relies on the Date object to automatically wrap between months for us
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
    };

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
    Date.prototype.getSunday = function () {
        return this.deltaDays(-1 * this.getDay());
    };
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
    "use strict";

    this.sunday = initial_d.getSunday();


    this.nextWeek = function () {
        return new Week(this.sunday.deltaDays(7));
    };

    this.prevWeek = function () {
        return new Week(this.sunday.deltaDays(-7));
    };

    this.contains = function (d) {
        return (this.sunday.valueOf() === d.getSunday().valueOf());
    };

    this.getDates = function () {
        var dates = [];
        for (var i = 0; i < 7; i++) {
            dates.push(this.sunday.deltaDays(i));
        }
        return dates;
    };
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
    "use strict";

    this.year = year;
    this.month = month;

    this.nextMonth = function () {
        return new Month(year + Math.floor((month + 1) / 12), (month + 1) % 12);
    };

    this.prevMonth = function () {
        return new Month(year + Math.floor((month - 1) / 12), (month + 11) % 12);
    };

    this.getDateObject = function (d) {
        return new Date(this.year, this.month, d);
    };

    this.getWeeks = function () {
        var firstDay = this.getDateObject(1);
        var lastDay = this.nextMonth().getDateObject(0);

        var weeks = [];
        var currweek = new Week(firstDay);
        weeks.push(currweek);
        while (!currweek.contains(lastDay)) {
            currweek = currweek.nextWeek();
            weeks.push(currweek);
        }

        return weeks;
    };
}


// //old code
// // The Date object and related methods are inspired by 
// // https://www.w3schools.com/js/js_date_methods.asp
// const today = new Date();
// let curMonth = today.getMonth();
// let curYear = today.getFullYear();
// // End of the inspiration

// // A function for the next button, go to the next month calendar
// function post() {
//     if (curMonth === 11) {
//         curYear = curYear + 1;
//     } else {
//         curYear = curYear;
//     }
//     curMonth = (curMonth + 1) % 12;
//     display(curMonth, curYear);
// }

// // A function for the previous button, go to the last month
// function pre() {
//     if (curMonth === 0) {
//         curYear = curYear - 1;
//         curMonth = 11;
//     } else {
//         curYear = curYear;
//         curMonth = curMonth - 1;
//     }
//     display(curMonth, curYear);

// }

// // yearRange = gen_year_table(1900, 2999);
// // function gen_year_table(start, end){
// //     for(var year = start; year < end + 1; year++){
// //         // we create a year that contains the range of the calendar with option tag
// //         // so user can select
// //         year += "<option value='" + year + "'>" + year + "</option>";
// //     }
// //     return year;
// // }
// //document.getElementById(monthYear).innerHTML = yearRange;

// // Setup the variable by get the elements by id
// let calendar = document.getElementById("table_cal");

// // monthList and weekdayList
// let monthList = ["January", "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December"];
// let weekdayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// // Using tr and th tag to create a table looklike display.
// // Knowledge source: https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_table_test
// // A template for that is 
// // <table>
// //     <tr>
// //         <th>Month</th>
// //         <th>Savings</th>
// //     </tr>
// //     <tr>
// //         <td>January</td>
// //         <td>$100</td>
// //     </tr>
// //     <tr>
// //         <td>February</td>
// //         <td>$80</td>
// //     </tr>
// // </table>

// // Display the weekdays by table
// let dayTRtag = "<tr>";
// for (d in weekdayList) {
//     dayTRtag += "<th weekdayDisplay='" + weekdayList[d] + "'>" + weekdayList[d] + "</th>";
// }
// dayTRtag += "</tr>";
// // Get the id and display the 
// document.getElementById("calendarWeekday").innerHTML = dayTRtag;
// display(curMonth, curYear);
// //daysInMonth(curMonth + 1, curYear);



// // It's a big function that handle the calendar display.
// // get the https://www.w3schools.com/js/tryit.asp?filename=tryjs_date_setfullyear_options
// function display(month, year) {

//     // get the month and year info and display using innerHTML.
//     let monY = document.getElementById("monthYear");
//     monY.innerHTML = monthList[month] + "  " + year;
//     // The date of today
//     // get the weekday of the today
//     let today_weekDay = today.getDay();
//     // The first day of a month, create a day object give month and year
//     firstdayMonth = new Date(year, month);
//     let firstdayMonth_weekDay = firstdayMonth.getDay();

//     //let tableDay = document.getElementById("calendarDay");
//     //tableDay.innerHTML = "";

//     let t = document.getElementById("calendarDay");
//     // to clear out the previous outcome when user go to pre and post month
//     t.innerHTML = "";
//     //let temp2 = document.createElement("tr");
//     // let temp1 = document.createElement("tr");
//     // let temp = document.createElement("td");
//     // let temp3 = document.createElement("td");
//     // let tempText2 = document.createTextNode("testode");
//     // let tempText = document.createTextNode("");
//     // temp.appendChild(tempText);
//     // temp3.appendChild(tempText2);
//     // temp1.appendChild(temp);
//     // temp1.appendChild(temp3);
//     // temp1.appendChild(temp3);
//     // temp1.appendChild(temp3);
//     // temp1.appendChild(temp3);
//     // //temp1.appendChild(temp3);
//     // //temp2.appendChild(temp3);
//     // t.appendChild(temp1);
//     // //t.appendChild(temp2);

//     // Display the days in a month
//     // At most we may need to display 6 rows in a month
//     // Display the table cells was inspired by https://www.w3schools.com/jsref/coll_table_cells.asp
//     // And https://www.w3schools.com/tags/tag_td.asp

//     let counter = 1;
//     for (let i = 0; i < 6; i++) {
//         // each row has 7 weekdays
//         // create a row variable to contain the 7 days (columns)
//         let tag = "<tr>";
//         //let row = document.createElement("tr");
//         for (let j = 0; j < 7; j++) {
//             // at the first row, if the j is less than the first day of the week
//             // means that day is from previous month, we don't want it to display.
//             // And we add a blank cell.
//             if (i == 0 && j < firstdayMonth_weekDay) {

//                 //let cell = document.createElement("td");
//                 // The createTextNode method was inspired by:
//                 // https://stackoverflow.com/questions/29929781/how-do-i-create-the-empty-table-data-boxes-with-javascript
//                 // let cellText = document.createTextNode("empty_cell");
//                 // cell.appendChild(cellText);
//                 // row.appendChild(cell);
//                 let temp = "<td class=normal>" + " " + "</td>";
//                 tag += temp;
//                 // if the counter is greater than the number of days in the month, break
//             } else if (counter > daysInMonth(month + 1, year)) {
//                 break;
//             } else {
//                 //let getEventbyDate = queryEvent(month, year, counter);
//                 // create element td for te cell and set the attributes, 
//                 // reference:
//                 // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_setattribute1
//                 // let cell = document.createElement("td");
//                 // cell.setAttribute("setmonth", month + 1);
//                 // cell.setAttribute("setyear", year);
//                 // cell.setAttribute("setdate", count);
//                 // cell.setAttribute("setMonthName", monthList[month]);
//                 // cell.classname = "calDays_number";
//                 // let cellText = document.createTextNode(counter);
//                 // cell.appendChild(cellText);
//                 // row.appendChild(cell);

//                 let temp = "";
//                 if (counter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
//                     temp = "<td style='background-color: wheat; color:green; font-weight: bold; text-decoration:underline'>" + counter + "<br><br>";
//                 } else {
//                     temp = "<td class=normal>" + counter + "<br><br>";
//                 }
//                 tag += temp;
//                 //append event list to tag here
//                 getEvents(tag, month, counter, year);
//                 tag += "</td>";
//                 counter++;
//             }
//         }

//         //t.appendChild(row);

//         tag += "</tr>";
//         t.innerHTML += tag;
//         //break;
//     }
// }

// function daysInMonth(month, year) {
//     return new Date(year, month, 0).getDate();
//     //alert(new Date(year, month, 0).getDate())
// }

// function getEvents(tag, month, day, year) {
//     const data = {'year' : year, 'month' : month, 'day' : day};

//     fetch("getEvents.php", {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {'content-type' : 'application/json'}
//     })
//     .then(response => response.text())
//     .then(text => console.log(text));
//     // .then(response=>response.json())
//     // .then(data=>eventsToHTML(tag, data))
//     // .catch(err=>console.error(err));
// }

// function eventsToHTML(tag, data) {
//     if (data.success) {
//         let eventIDs = data.eventIDs;
//         let eventNames = data.eventNames;
//         let eventStartTimes = data.eventStartTimes;
//         let eventTags = data.eventTags;

//         for (i = 0 ; i < eventIDs.length ; i++) {
//             let btn = document.createElement("button");
//             btn.className = eventTags[i];
//             btn.id = eventIDs[i];
//             let eventInfo = document.createTextNode(eventStartTimes[i].substring(11, 16) + eventNames[i]);
//             btn.appendChild(eventInfo);
//             tag.appendChild(btn);
//         }
//     }
// }