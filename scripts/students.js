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

    const group = groupSelect.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const gender = genderSelect.value;
    const birthday = birthdayInput.value;

    if (hasEmptyFields()) {
        alert("Please, fill all fields");
        return;
    }

    if (addEditSuccessButton.innerText === "Create") {
        addStudent(group, firstName, lastName, gender, birthday);
    }
    if (addEditSuccessButton.innerText === "Save") {
        studentsCheckedRow.querySelector("td:nth-child(2)").innerText = group;
        studentsCheckedRow.querySelector("td:nth-child(3)").innerText = `${firstName} ${lastName}`;
        studentsCheckedRow.querySelector("td:nth-child(4)").innerText = gender;
        studentsCheckedRow.querySelector("td:nth-child(5)").innerText = birthday
            .split("-").reverse().join(".");
    }

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
}
