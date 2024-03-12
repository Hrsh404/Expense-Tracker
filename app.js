document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseList = document.getElementById('expenseList');
    let isEditing = false;
    let editId = null;

    function submitExpenseForm(e) {
        e.preventDefault();
        const name = expenseNameInput.value;
        const amount = expenseAmountInput.value;

        if (name === '' || amount === '') {
            alert('Please fill in all fields');
            return;
        }

        if (isEditing) {
            updateExpense(editId, name, amount);
        } else {
            const id = Date.now().toString();
            addExpense(id, name, amount);
        }
        expenseForm.reset();
        isEditing = false;
        editId = null;
    }

    function addExpense(id, name, amount) {
        const expense = { id, name, amount };
        let expenses = getExpensesFromLocalStorage();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        appendExpenseToList(expense);
    }

    function updateExpense(id, name, amount) {
        let expenses = getExpensesFromLocalStorage();
        const index = expenses.findIndex(expense => expense.id === id);
        if (index !== -1) {
            expenses[index] = { id, name, amount };
            localStorage.setItem('expenses', JSON.stringify(expenses));
            loadExpenses();
        }
    }

    function deleteExpense(id) {
        let expenses = getExpensesFromLocalStorage();
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        loadExpenses();
    }

    function appendExpenseToList({ id, name, amount }) {
        const item = document.createElement('li');
        item.classList.add('list-group-item');
        item.dataset.id = id;
        item.innerHTML = `
            ${name} - Rs ${amount}
            <button class="btn btn-danger btn-sm float-right delete-btn">Delete</button>
            <button class="btn btn-primary btn-sm float-right edit-btn mr-2">Edit</button>
        `;
        expenseList.appendChild(item);
    }

    function loadExpenses() {
        const expenses = getExpensesFromLocalStorage();
        expenseList.innerHTML = '';
        expenses.forEach(expense => appendExpenseToList(expense));
    }

    function getExpensesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('expenses')) || [];
    }

    function handleExpenseActions(e) {
        const id = e.target.parentElement.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            deleteExpense(id);
        } else if (e.target.classList.contains('edit-btn')) {
            const expense = getExpensesFromLocalStorage().find(expense => expense.id === id);
            if (expense) {
                expenseNameInput.value = expense.name;
                expenseAmountInput.value = expense.amount;
                isEditing = true;
                editId = id;
            }
        }
    }

    expenseForm.addEventListener('submit', submitExpenseForm);
    expenseList.addEventListener('click', handleExpenseActions);
    loadExpenses();
});
