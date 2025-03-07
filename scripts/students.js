const studentsTableBody = document.querySelector('.students-table tbody');
const studentsTableCheckbox = document.querySelector(".students-table thead input[type='checkbox']");

const groupSelect = document.querySelector("#group-select");
const firstNameInput = document.querySelector("#first-name-input");
const lastNameInput = document.querySelector("#last-name-input");
const genderSelect = document.querySelector("#gender-select");
const birthdayInput = document.querySelector("#birthday-input");

const addButton = document.querySelector("#add-button");
const modalCloseButtons = document.querySelectorAll(".modal-close-button");
const modalCancelButtons = document.querySelectorAll(".modal-cancel-button");
const modalSuccessButton = document.querySelector(".modal-success-button");

const modalWindow = document.querySelector(".modal-window");
const addEditWindow = document.querySelector(".add-edit-window");
const deleteWindow = document.querySelector(".delete-window");

assignCheckboxes();

studentsTableCheckbox.addEventListener("change", e => {
    studentsTableBody.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = e.target.checked;
    })

    if (e.target.checked) {
        studentsTableBody.querySelectorAll(".edit-button").forEach(editButton => {
            editButton.classList.add("button-disabled");
            editButton.disabled = true;
        })

        studentsTableBody.querySelectorAll(".remove-button").forEach(removeButton => {
            removeButton.classList.remove("button-disabled");
            removeButton.disabled = false;
        })
    } else {
        studentsTableBody.querySelectorAll(".remove-button").forEach(removeButton => {
            removeButton.classList.add("button-disabled");
            removeButton.disabled = true;
        })
    }
})

addButton.addEventListener("click", () => {
    const addEditTitle = document.querySelector(".add-edit-window .modal-title");
    addEditTitle.innerText = "Add Student";
    modalSuccessButton.innerText = "Create";

    modalWindow.style.display = "flex";
    addEditWindow.style.display = "block";
})

modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (addEditWindow.style.display === "block")
            addEditWindow.style.display = "none";
        if (deleteWindow.style.display === "block")
            deleteWindow.style.display = "none";

        modalWindow.style.display = "none";
    })
})

modalCancelButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
    })
})

modalSuccessButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (modalSuccessButton.innerText === "Create") {
        if (groupSelect.value === "none"
            || firstNameInput.value === ""
            || lastNameInput.value === ""
            || genderSelect.value === "none"
            || birthdayInput.value === ""
        ) {
            alert("Please, fill all fields");
            return;
        }

        // TODO: implement id mechanism
        const birthday = birthdayInput.value.split("-").reverse().join(".");
        const newTableRow = `
        <tr>
            <td><input type="checkbox" /></td>            
            <td>${groupSelect.value}</td>
            <td>${firstNameInput.value} ${lastNameInput.value}</td>
            <td>${genderSelect.value}</td>
            <td>${birthday}</td>
            <td class="circle-wrapper">
                <div class="circle circle-inactive"></div>
            </td>    
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled">edit</button>
                    <button class="button button-disabled">remove</button>
                </div>
            </td>
            <td class="student-id">5</td>       
        </tr>
        `;

        studentsTableBody.innerHTML += newTableRow;
        assignCheckboxes();
    }
})

function assignCheckboxes() {
    studentsTableBody.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", checkboxCallback);
    })
}

function checkboxCallback(e) {
    const rowRemoveButtons = e.target.closest("tr")
        .querySelectorAll(".remove-button");
    const checkedCheckboxes = studentsTableBody
        .querySelectorAll("input[type='checkbox']:checked");

    if (!e.target.checked && studentsTableCheckbox.checked)
        studentsTableCheckbox.checked = false;

    rowRemoveButtons.forEach((button) => {
        button.classList.toggle("button-disabled", !e.target.checked);
        button.disabled = !e.target.checked;
    })

    if (checkedCheckboxes.length === 1) {
        const checkedRow = checkedCheckboxes[0].closest("tr");
        const checkedEditButton = checkedRow.querySelector(".edit-button");

        checkedEditButton.classList.remove("button-disabled");
        checkedEditButton.disabled = false;
    } else {
        studentsTableBody.querySelectorAll(".edit-button").forEach((button) => {
            button.classList.add("button-disabled");
            button.disabled = true;
        });
    }
}