let date = new Date()

let array_months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let math_date = new Date(date.getFullYear(), date.getMonth(), 1)

prev.onclick = function (event) {
    math_date.setMonth(math_date.getMonth() - 1)
    insertDataSpent(null)
    createCalendar(calendar__table, math_date.getFullYear(), math_date.getMonth())
}

next.onclick = function (event) {
    math_date.setMonth(math_date.getMonth() + 1)
    insertDataSpent(null)
    createCalendar(calendar__table, math_date.getFullYear(), math_date.getMonth())
}

async function fetch_date_spents(date) {
    let response = await fetch("/calendar", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ "date": date })

    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return null
    })
    return response
}

Date.prototype.getCalendarDay = function () {
    let day = this.getDay();
    if (day == 0) day = 7;
    return day - 1;
}
function createCalendar(elem, year, month) {
    let new_date = new Date(year, month)
    let title_h1 = document.querySelector('.calendar__date>h1')
    title_h1.innerText = `${array_months[month]} ${year}`
    let todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    let table = '<tr class="calendar__weekdays"><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr class="calendar__row">'



    for (let i = 0; i < new_date.getCalendarDay(); i++) {
        table += '<td></td>';
    }

    while (new_date.getMonth() == month) {
        let CalendarDay = new_date.getCalendarDay()
        let today_class = ''
        let dataset_date = `${new_date.getFullYear()}-${new_date.getMonth() < 9 ? '0' + (new_date.getMonth() + 1) : new_date.getMonth() + 1}-${new_date.getDate() < 10 ? '0' + new_date.getDate() : new_date.getDate()}`
        if (new_date.getTime() == todayDate.getTime()) {
            today_class = 'class="today-date"'
            let date_for_fetch = dataset_date
            fetch_date_spents(date_for_fetch).then(response => insertDataSpent(response))
        }
        table += `<td ${today_class} data-date="${dataset_date}">` + new_date.getDate() + '</td>';

        if (CalendarDay % 7 == 6) {
            table += '</tr><tr class="calendar__row">';
        }
        new_date.setDate(new_date.getDate() + 1)
    }
    if (new_date.getCalendarDay() != 0) {
        for (let i = new_date.getCalendarDay(); i < 7; i++) {
            table += '<td></td>';
        }
    }


    table += '</tr></table>';

    elem.innerHTML = table;




}
function checkHightlightDate() {
    let previous_highlighted = document.querySelector('.highlight-date')
    if (!previous_highlighted) {
        previous_highlighted = document.querySelector('.today-date')
    }
    return previous_highlighted
}
function changeHighlightedDate(target) {
    let previous_highlighted = document.querySelector('.highlight-date')
    if (previous_highlighted) {
        previous_highlighted.classList.remove('highlight-date')
    }
    if (target.classList.contains("today-date")) return;
    target.classList.add('highlight-date')
}
function insertDataSpent(response) {
    window['day-spendings__list'].innerHTML = ''
    if (!response) return;
    let totaly = 0
    for (const iterator of response.data) {
        let day_spendings_item = document.createElement('form')
        day_spendings_item.classList.add('day-spendings__item')

        day_spendings_item.innerHTML = `<input type="hidden" value="${iterator.id}">
        <div class="day-spendings__inputs">
            <div class="day-spendings__category">${iterator.category}</div>
            <div class="day-spendings__money">${iterator.spent}$</div>
        </div>
        <div class="day-spendings__buttons">
        <input class="day-spendings__edit" name="edit"  type="submit" value="Edit">
        <input class="day-spendings__delete" name="delete" type="submit" value="Delete">
        </div>`


        window['day-spendings__list'].append(day_spendings_item)
        totaly += iterator.spent
    }
    window['day-spendings__list'].innerHTML += `<div class="day-spendings__totaly"><span>Total:</span><span>${totaly}$</span></div>`

}

calendar__table.onclick = async function (event) {

    let target = event.target
    if (target.nodeName != 'TD' || !target.dataset.date) return;
    let date = target.dataset.date.split('-')
    let target_date = new Date(+date[0], +date[1] - 1, +date[2])
    date = new Date()
    if (target_date > date) return;
    changeHighlightedDate(target)

    let post_data = {
        name: 'peterson',
        date: target.dataset.date
    }

    let response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(post_data)
    }).then(response => {
        if (response.ok) {

            return response.json()
        }
        return null
    })

    if (response) {

        insertDataSpent(response)

    }


}
add_spent_form.onsubmit = async function (event) {
    event.preventDefault();
    let FD = new FormData(add_spent_form);

    let get_date = document.querySelector('.highlight-date')
    if (!get_date) {
        get_date = document.querySelector('.today-date')
    }
    FD.append('date', `${get_date.dataset.date}`)
    let response = await fetch('/calendar/insert', {
        method: "POST",
        body: FD
    }).then(response => {
        if (response.ok) {

            return true
        }
        return null
    })
    if (response) {
        let result = checkHightlightDate()
        fetch_date_spents(result.dataset.date).then(response => insertDataSpent(response))


    }
}
async function fetcher_change_spent(path, data) {
    let response = await fetch(path, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)

    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return null
    })
    return response
}

let innerHTML_for_cancel;
window['day-spendings__list'].onsubmit = function (event) {
    event.preventDefault()
    let target = event.target
    let elem_date = checkHightlightDate()
    if (event.submitter.value == 'Edit') {
        innerHTML_for_cancel = target.innerHTML
        let change_category, change_money;
        change_category = target.children[1].children[0].innerText
        let money = target.children[1].children[1].innerText
        money = money.slice(0, money.indexOf('$'))
        change_money = money
        let query_of_options = document.querySelectorAll('.form__select-option')

        target.innerHTML = `<input type="hidden" value="${target.children[0].value}">
    <div class="day-spendings__inputs">
        <select class="category-edit-input" type="text" name="category" required></select>
        <input class="spent-edit-input" type="number" value="${change_money}" min="1">
    </div>
    <div class="day-spendings__buttons">
        <input class="day-spendings__edit" name="save" type="submit" value="Save">
        <input class="day-spendings__delete" name="cancel" type="submit" value="Cancel">
    </div>`
        for (const iterator of query_of_options) {
            let new_node = iterator.cloneNode(true)
            if (new_node.value == change_category) new_node.setAttribute("selected", true);
            target[1].append(new_node)
        }

    }
    if (event.submitter.value == 'Save') {
        let data_post = {
            category: target[1].value,
            spent: target[2].value,
            spent_id: target[0].value
        }
        fetcher_change_spent("/calendar/update", data_post).then(() => {
            fetch_date_spents(elem_date.dataset.date).then(response => insertDataSpent(response))
        })
    }
    if (event.submitter.value == 'Delete') {
        let data_post = {
            spent_id: target[0].value
        }
        fetcher_change_spent("/calendar/delete", data_post).then(() => {
            fetch_date_spents(elem_date.dataset.date).then(response => insertDataSpent(response))
        })

    }
    if (event.submitter.value == 'Cancel') {
        target.innerHTML = innerHTML_for_cancel
    }

}




createCalendar(calendar__table, date.getFullYear(), date.getMonth())