let expenses = []
let selectedIndex = -1

const nameInput = document.getElementById("expenseName")
const amountInput = document.getElementById("amount")
const categoryInput = document.getElementById("category")

const table = document.getElementById("expenseTable")
const totalDisplay = document.getElementById("total")

document.getElementById("addBtn").addEventListener("click", addExpense)
document.getElementById("updateBtn").addEventListener("click", updateExpense)


function addExpense() {
    let name = nameInput.value
    let amount = parseFloat(amountInput.value)
    let category = categoryInput.value

    let expense = {
        name: name,
        amount: amount,
        category: category
    }
    expenses.push(expense)
    displayExpenses()
    clearInputs()
}


function displayExpenses() {
    table.innerHTML = ""
    let total = 0
    expenses.forEach((expense, index) => {
        total += expense.amount
        let row = document.createElement("tr")
        row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
        </td>
        `
        table.appendChild(row)
    })
    totalDisplay.innerText = total
}


function editExpense(index) {
    let exp = expenses[index]
    nameInput.value = exp.name
    amountInput.value = exp.amount
    categoryInput.value = exp.category
    selectedIndex = index
}


function updateExpense() {
    if (selectedIndex === -1) return
    expenses[selectedIndex].name = nameInput.value
    expenses[selectedIndex].amount = parseFloat(amountInput.value)
    expenses[selectedIndex].category = categoryInput.value
    displayExpenses()
    selectedIndex = -1
    clearInputs()
}


function deleteExpense(index) {
    expenses.splice(index, 1)
    displayExpenses()
}


function clearInputs() {
    nameInput.value = ""
    amountInput.value = ""
    categoryInput.value = "select"
}