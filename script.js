let salary = 0;
let expenseData = [];
let pieChart;

// elements
const salaryInput = document.getElementById("salaryInput");
const setSalaryBtn = document.getElementById("setSalaryBtn");

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const totalSalary = document.getElementById("totalSalary");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");

const expenseList = document.getElementById("expenseList");
const balanceLine = document.getElementById("balanceLine");
const warningMessage = document.getElementById("warningMessage");


// page load
window.onload = function () {
    let savedSalary = localStorage.getItem("salary");
    let savedExpenses = localStorage.getItem("expenses");

    if (savedSalary) {
        salary = Number(savedSalary);
    }

    if (savedExpenses) {
        expenseData = JSON.parse(savedExpenses);
    }

    showData();
};


// save salary
setSalaryBtn.addEventListener("click", function () {
    let enteredSalary = Number(salaryInput.value);

    if (enteredSalary <= 0) {
        alert("Please enter valid salary");
        return;
    }

    salary = enteredSalary;

    localStorage.setItem("salary", salary);

    salaryInput.value = "";

    showData();
});


// add expense
addExpenseBtn.addEventListener("click", function () {
    let name = expenseName.value.trim();
    let amount = Number(expenseAmount.value);

    if (name === "" || amount <= 0) {
        alert("Please enter valid expense details");
        return;
    }

    let item = {
        name: name,
        amount: amount
    };

    expenseData.push(item);

    localStorage.setItem("expenses", JSON.stringify(expenseData));

    expenseName.value = "";
    expenseAmount.value = "";

    showData();
});


// main update
function showData() {
    let spent = 0;

    expenseList.innerHTML = "";

    if (expenseData.length === 0) {
        expenseList.innerHTML =
            "<li id='emptyMessage'>No expenses added yet</li>";
    }

    expenseData.forEach(function (item, index) {
        spent += item.amount;

        let li = document.createElement("li");

        li.innerHTML = `
            <span>${item.name} - ₹${item.amount}</span>
            <button class="delete-btn" onclick="removeExpense(${index})">
                🗑
            </button>
        `;

        expenseList.appendChild(li);
    });

    let balance = salary - spent;

    totalSalary.textContent = salary;
    totalExpenses.textContent = spent;
    remainingBalance.textContent = balance;

    if (salary > 0 && balance < salary * 0.1) {
        balanceLine.style.color = "red";
        warningMessage.textContent = "⚠ Low balance warning";
    } else {
        balanceLine.style.color = "black";
        warningMessage.textContent = "";
    }

    updateChart(spent, balance);
}


// delete expense
function removeExpense(index) {
    expenseData.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenseData));

    showData();
}


// chart function

function updateChart(spent, balance) {
    const chartBox = document.getElementById("expenseChart");

    // remove old chart before creating new one
    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(chartBox, {
        type: "pie",
        data: {
            labels: ["Total Expenses", "Remaining Balance"],
            datasets: [{
                data: [spent, balance],
                backgroundColor: [
                    "#c8b6a6",
                    "#9caf88"
                ],
                borderWidth: 1
            }]
        }
    });
}