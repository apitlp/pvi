const studentsTableBody = document.querySelector('.students-table tbody');
const studentsTableCheckbox = document.querySelector(".students-table thead input[type='checkbox']");
let studentsCheckedRow = null;
let studentsToDelete = [];
let nextId = studentsTableBody.children.length + 1;

const groupSelect = document.querySelector("#group-select");
const firstNameInput = document.querySelector("#first-name-input");
const lastNameInput = document.querySelector("#last-name-input");
const genderSelect = document.querySelector("#gender-select");
const birthdayInput = document.querySelector("#birthday-input");
const idInput = document.querySelector("#id-input");

const addButton = document.querySelector("#add-button");
const modalCloseButtons = document.querySelectorAll(".modal-close-button");
const modalCancelButtons = document.querySelectorAll(".modal-cancel-button");
const addEditSuccessButton = document.querySelector(".add-edit-window .modal-success-button");
const deleteSuccessButton = document.querySelector(".delete-window .modal-success-button");

const modalWindow = document.querySelector(".modal-window");
const addEditWindow = document.querySelector(".add-edit-window");
const deleteWindow = document.querySelector(".delete-window");

const addEditTitle = document.querySelector(".add-edit-window .modal-title");
const modalMessage = document.querySelector(".modal-message");
const modalErrorContainer = document.querySelector(".modal-error");

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
    addEditTitle.innerText = "Add Student";
    addEditSuccessButton.innerText = "Create";

    clearValidationErrors();
    modalWindow.style.display = "flex";
    addEditWindow.style.display = "block";
})

modalCloseButtons.forEach((button) => button.addEventListener("click", closeModal));

modalCancelButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        if (addEditWindow.style.display === "block") {
            if (addEditSuccessButton.innerText === "Create" && !hasEmptyFields())
                addStudent(groupSelect.value, firstNameInput.value, lastNameInput.value, genderSelect.value,
                    birthdayInput.value);

            if (addEditSuccessButton.innerText === "Save")
                alert("Changes have been discarded.");
        }
        if (deleteWindow.style.display === "block")
            alert("Deletion has been cancelled.");

        closeModal();
        clearFields();
    })
})

addEditSuccessButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (!validateFields())
        return;

    const group = groupSelect.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const gender = genderSelect.value;
    const birthday = birthdayInput.value;
    let id = 0;

    if (addEditSuccessButton.innerText === "Create") {
        id = addStudent(group, firstName, lastName, gender, birthday);
    }
    if (addEditSuccessButton.innerText === "Save") {
        id = Number(studentsCheckedRow.querySelector("td:nth-child(8)").innerText);

        studentsCheckedRow.querySelector("td:nth-child(2)").innerText = group;
        studentsCheckedRow.querySelector("td:nth-child(3)").innerText = `${firstName} ${lastName}`;
        studentsCheckedRow.querySelector("td:nth-child(4)").innerText = gender;
        studentsCheckedRow.querySelector("td:nth-child(5)").innerText = birthday
            .split("-").reverse().join(".");
    }

    console.log(studentToJson(id, group, firstName, lastName, gender, birthday));

    closeModal();
    clearFields();
});

deleteSuccessButton.addEventListener("click", () => {
    studentsTableBody.querySelectorAll("tr").forEach((tableRow) => {
        if (studentsToDelete.includes(tableRow.querySelector("td:nth-child(3)").innerText))
            tableRow.remove();
    });

    closeModal();
});

function assignCheckboxes() {
    studentsTableBody.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", checkboxCallback);
    });
}

function checkboxCallback(e) {
    studentsToDelete = [];
    const rowRemoveButtons = e.target.closest("tr")
        .querySelectorAll(".remove-button");
    const checkedCheckboxes = studentsTableBody
        .querySelectorAll("input[type='checkbox']:checked");

    if (!e.target.checked && studentsTableCheckbox.checked)
        studentsTableCheckbox.checked = false;

    checkedCheckboxes.forEach((checkbox) => {
        studentsToDelete.push(checkbox.closest("tr").querySelector("td:nth-child(3)").innerText);
    });

    rowRemoveButtons.forEach((button) => {
        button.classList.toggle("button-disabled", !e.target.checked);
        button.disabled = !e.target.checked;

        button.addEventListener("click", () => {
            modalMessage.innerText = `Are you sure you want to delete ${studentsToDelete.join(", ")}?`;

            modalWindow.style.display = "flex";
            deleteWindow.style.display = "block";
        });
    });

    if (checkedCheckboxes.length === 1) {
        studentsCheckedRow = checkedCheckboxes[0].closest("tr");
        const checkedEditButton = studentsCheckedRow.querySelector(".edit-button");

        checkedEditButton.classList.remove("button-disabled");
        checkedEditButton.disabled = false;

        checkedEditButton.addEventListener("click", () => {
            addEditTitle.innerText = "Edit Student";
            addEditSuccessButton.innerText = "Save";

            const [firstName, lastName] = studentsCheckedRow.querySelector("td:nth-child(3)")
                .innerText.split(" ");
            groupSelect.value = studentsCheckedRow.querySelector("td:nth-child(2)").innerText;
            firstNameInput.value = firstName;
            lastNameInput.value = lastName;
            genderSelect.value = studentsCheckedRow.querySelector("td:nth-child(4)").innerText;
            birthdayInput.value = studentsCheckedRow.querySelector("td:nth-child(5)").innerText
                .split(".").reverse().join("-");
            idInput.value = studentsCheckedRow.querySelector("td:nth-child(8)").innerText;

            clearValidationErrors();
            modalWindow.style.display = "flex";
            addEditWindow.style.display = "block";
        });
    } else {
        studentsTableBody.querySelectorAll(".edit-button").forEach((button) => {
            button.classList.add("button-disabled");
            button.disabled = true;
        });
    }
}

function closeModal() {
    if (addEditWindow.style.display === "block")
        addEditWindow.style.display = "none";
    if (deleteWindow.style.display === "block")
        deleteWindow.style.display = "none";

    modalWindow.style.display = "none";
}

function hasEmptyFields() {
    return groupSelect.value === ""
        || firstNameInput.value === ""
        || lastNameInput.value === ""
        || genderSelect.value === ""
        || birthdayInput.value === "";
}

function clearFields() {
    groupSelect.value = "";
    firstNameInput.value = "";
    lastNameInput.value = "";
    genderSelect.value = "";
    birthdayInput.value = "";
}

function addStudent(group, firstName, lastName, gender, birthday) {
    let id = nextId;

    const newTableRow = `
        <tr>
            <td><input aria-label="select student ${nextId}" type="checkbox"/></td>            
            <td>${group}</td>
            <td>${firstName} ${lastName}</td>
            <td>${gender}</td>
            <td>${birthday.split("-").reverse().join(".")}</td>
            <td class="circle-wrapper">
                <div class="circle circle-inactive"></div>
            </td>    
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled edit-button">edit</button>
                    <button class="button button-disabled remove-button">remove</button>
                </div>
            </td>
            <td class="student-id">${nextId}</td>       
        </tr>
        `;

    studentsTableBody.innerHTML += newTableRow;
    assignCheckboxes();
    nextId++;

    return id;
}

function validateFields() {
    clearValidationErrors();

    let errorMessages = [];

    if (!validateGroup(groupSelect.value))
        errorMessages.push("Please, select a valid group");
    if (!validateName(firstNameInput.value))
        errorMessages.push("Please, enter a valid first name");
    if (!validateName(lastNameInput.value))
        errorMessages.push("Please, enter a valid last name");
    if (!(["M", "F"].includes(genderSelect.value)))
        errorMessages.push("Please, select a valid gender");
    if (!validateDate(birthdayInput.value))
        errorMessages.push("Please, enter a valid birthday");

    if (errorMessages.length === 0)
        return true;

    showValidationErrors(errorMessages);
    return false;
}

function clearValidationErrors() {
    Array.from(modalErrorContainer.children).forEach((error) => error.remove());
    modalErrorContainer.style.display = "none";
}

function showValidationErrors(errorMessages) {
    if (errorMessages.length === 0)
        return;

    errorMessages.forEach((message) => {
        let errorMessage = document.createElement("p");
        errorMessage.innerText = message;
        errorMessage.classList.add("modal-error-message");

        modalErrorContainer.appendChild(errorMessage);
    });

    modalErrorContainer.style.display = "flex";
}

function validateGroup(group) {
    const groupRegex = /^PZ-2[1-6]$/;

    return groupRegex.test(group);
}

function validateName(name) {
    const nameRegex = /^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/;

    return nameRegex.test(name);
}

function validateDate(dateString) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!dateRegex.test(dateString))
        return false;

    const [year, month, day] = dateString.split("-").map(Number);
    if (year > 2009)
        return false;

    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function studentToJson(id, group, firstName, lastName, gender, birthday) {
    const student = {
        id,
        group,
        firstName,
        lastName,
        gender,
        birthday,
    };

    return JSON.stringify(student);
}
