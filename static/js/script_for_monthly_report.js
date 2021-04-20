let array_months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let today_date = new Date(), total_spents = 0, total_incomes = 0
header__selected_month.innerHTML = `${array_months[today_date.getMonth()]} ${today_date.getFullYear()} <span>▼</span>`
header__selected_month.dataset.date = `${today_date.getFullYear()}-${today_date.getMonth() < 9 ? '0' + (today_date.getMonth() + 1) : today_date.getMonth() + 1}-01`
// `${array_months[today_date.getMonth()]} ${today_date.getFullYear()}`
let last_date = new Date(today_date.getFullYear(), today_date.getMonth(), 1)

function list_of_monthes() {
    while (true) {

        let header__select_bounded = header__select.scrollHeight - header__select.scrollTop + header__select.clientHeight;
        if (header__select_bounded > header__select.scrollTop + header__select.clientHeight + 400) break;
        let div_for_insert = document.createElement('div')
        div_for_insert.classList.add('header__item')
        div_for_insert.dataset.date = `${last_date.getFullYear()}-${last_date.getMonth() < 9 ? '0' + (last_date.getMonth() + 1) : last_date.getMonth() + 1}-01`
        div_for_insert.innerText = `${array_months[last_date.getMonth()]} ${last_date.getFullYear()}`
        if (today_date.getMonth() == last_date.getMonth() && today_date.getFullYear() == last_date.getFullYear()) {
            div_for_insert.classList.add('selected')
        }
        header__select.append(div_for_insert)
        last_date.setMonth(last_date.getMonth() - 1)

    }
}

header__selected_month.onclick = function (event) {
    if (header__select.style.display == 'none' || header__select.style.display == '') {
        header__select.style.display = 'block'
        let this_position = this.getBoundingClientRect()
        header__select.style.top = `${this_position.bottom}px`
        header__select.style.left = `${(this_position.width - header__select.offsetWidth) / 2 + this_position.x}px`
        list_of_monthes()
    } else {
        header__select.style.display = 'none'
    }

}
window.onresize = function (event) {
    let button = header__selected_month.getBoundingClientRect()
    header__select.style.top = `${button.bottom}px`
    header__select.style.left = `${(button.width - header__select.offsetWidth) / 2 + button.x}px`
}
header__select.onscroll = function (event) {
    list_of_monthes()
}
document.body.onclick = function (event) {
    let target = event.target

    if (target.classList.contains('header__selected-month') || target.closest('button')?.classList.contains('header__selected-month')) {
        return
    }
    header__select.style.display = 'none'
}


header__select.onclick = function (event) {
    let target = event.target
    if (!target.classList.contains('header__item')) return;
    document.querySelector('.selected').classList.remove('selected')
    target.classList.add('selected')
    header__selected_month.innerHTML = `${document.querySelector('.selected').innerText} <span>▼</span>`
    fetcher_get_data(target.dataset.date).then(response => {
        insertListSpents(response.spents)
        insertListIncomes(response.incomes)
    })

}
function insertListSpents(data_spents) {
    let insertHTML = `<tr class="month-spendings__titles"><th>Category</th><th>Money</th><th>Date</th></tr>`
    total_spents = 0
    for (const iterator of data_spents) {
        insertHTML += `<tr class="month-spendings__item"><td>${iterator.category}</td><td>${iterator.spent}</td><td>${iterator.date}</td></tr>`
        total_spents += iterator.spent
    }
    month_spendings__list.innerHTML = insertHTML
}
function insertListIncomes(data_incomes) {
    monthly_incomes__list.innerHTML = ''
    if (!data_incomes) return;
    total_incomes = 0
    let container_incomes = document.createElement('div')
    container_incomes.classList.add('monthly-incomes__item-container')
    for (const iterator of data_incomes) {
        let day_incomes_item = document.createElement('form')
        day_incomes_item.classList.add('monthly-incomes__item')

        day_incomes_item.innerHTML = `<input type="hidden" value="${iterator.id}">
        <div class="monthly-incomes__inputs">
            <div class="monthly-incomes__money">${iterator.income}$</div>
        </div>
        <div class="monthly-incomes__buttons">
        <input class="monthly-incomes__edit" name="edit"  type="submit" value="Edit">
        <input class="monthly-incomes__delete" name="delete" type="submit" value="Delete">
        </div>`


        container_incomes.append(day_incomes_item)
        total_incomes += iterator.income
    }
    monthly_incomes__list.append(container_incomes)
    monthly_incomes__list.innerHTML += `<div class="totaly">
    <div class="totaly__incomes">Total income: ${total_incomes}$</div>
    <div class="totaly__spents">Total spent: ${total_spents}$</div>
    </div>`

}
document.addEventListener("DOMContentLoaded", ready);
async function ready(event) {
    let response = await fetcher_get_data(`${today_date.getFullYear()}-${today_date.getMonth() < 9 ? '0' + (today_date.getMonth() + 1) : today_date.getMonth() + 1}-01`)
    // let promis = new Promise(() => insertListSpents(response.spents))
    // promis.then(insertListIncomes(response.incomes))
    insertListSpents(response.spents)
    insertListIncomes(response.incomes)


}

async function fetcher_get_data(date) {
    let date_from = date
    let array_date = date.split('-')
    let date_to = new Date(+array_date[0], +array_date[1], 1)
    date_to = `${date_to.getFullYear()}-${date_to.getMonth() < 9 ? '0' + (date_to.getMonth() + 1) : date_to.getMonth() + 1}-01`
    let data_post = {
        "date_from": date_from,
        "date_to": date_to
    }
    let response = await fetch('/calendar/monthly-report', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data_post)
    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return null
    })
    return response
}
form_add_salary.onsubmit = async function (event) {
    event.preventDefault();
    let FD = new FormData(form_add_salary);
    let selected_date = document.querySelector('.selected')
    if (selected_date) {
        if (selected_date.dataset.date == header__selected_month.dataset.date) {
            selected_date = `${today_date.getFullYear()}-${today_date.getMonth() < 9 ? '0' + (today_date.getMonth() + 1) : today_date.getMonth() + 1}-${today_date.getDate() < 10 ? '0' + today_date.getDate() : today_date.getDate()}`
        } else {
            selected_date = selected_date.dataset.date
        }
    } else {

        selected_date = `${today_date.getFullYear()}-${today_date.getMonth() < 9 ? '0' + (today_date.getMonth() + 1) : today_date.getMonth() + 1}-${today_date.getDate() < 10 ? '0' + today_date.getDate() : today_date.getDate()}`
    }
    FD.append('date', `${selected_date}`)
    let response = await fetch('/calendar/monthly-report/insert', {
        method: "POST",
        body: FD
    }).then(response => {
        if (response.ok) {

            return true
        }
        return null
    })
    if (response) {

        fetcher_get_data(document.querySelector('.selected') ? document.querySelector('.selected').dataset.date : header__selected_month.dataset.date).then(response => insertListIncomes(response.incomes))


    }
}
async function fetcher_change_income(path, data) {
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
monthly_incomes__list.onsubmit = async function (event) {
    event.preventDefault();
    let target = event.target
    if (event.submitter.value == 'Edit') {
        innerHTML_for_cancel = target.innerHTML
        change_category = target.children[1].children[0].innerText
        let income = target.children[1].children[0].innerText
        let change_money = income.slice(0, income.indexOf('$'))

        target.innerHTML = `<input type="hidden" value="${target[0].value}">
    <div class="monthly-incomes__inputs">
        
        <input class="income-edit-input" type="number" value="${change_money}" min="1">
    </div>
    <div class="monthly-incomes__buttons">
        <input class="monthly-incomes__edit" name="save" type="submit" value="Save">
        <input class="monthly-incomes__delete" name="cancel" type="submit" value="Cancel">
    </div>`
    }
    if (event.submitter.value == 'Save') {
        let data_post = {
            income_id: target[0].value,
            income: target[1].value
        }
        let response = await fetcher_change_income('/calendar/monthly-report/update', data_post)
            .then(() => fetcher_get_data(document.querySelector('.selected') ? document.querySelector('.selected').dataset.date : header__selected_month.dataset.date))
        insertListIncomes(response.incomes)

    }
    if (event.submitter.value == 'Delete') {
        let data_post = {
            income_id: target[0].value,
        }

        let response = await fetcher_change_income('/calendar/monthly-report/delete', data_post)
            .then(() => fetcher_get_data(document.querySelector('.selected') ? document.querySelector('.selected').dataset.date : header__selected_month.dataset.date))
        insertListIncomes(response.incomes)
    }
    if (event.submitter.value == 'Cancel') {
        target.innerHTML = innerHTML_for_cancel
    }

}