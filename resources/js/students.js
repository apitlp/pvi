const studentsTableBody = document.querySelector(".students-table tbody");
const studentsTableCheckbox = document.querySelector(".students-table thead input[type='checkbox']");
let studentsCheckedRow = null;
let studentsToDelete = [];
const paginationContainer = document.querySelector(".students-pagination");

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

const BASE_API_URL = "http://127.0.0.1:8000/api";
let currentPage = 1;

await renderPage();
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

    clearFields();
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
                alert("Adding has been cancelled.");

            if (addEditSuccessButton.innerText === "Save")
                alert("Changes have been discarded.");
        }
        if (deleteWindow.style.display === "block")
            alert("Deletion has been cancelled.");

        closeModal();
        clearFields();
    })
})

addEditSuccessButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!validateFields())
        return;

    const group = groupSelect.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const gender = genderSelect.value;
    const birthday = birthdayInput.value;

    const requestBody = {
        group,
        first_name: firstName,
        last_name: lastName,
        gender,
        birthday
    };

    try {
        if (addEditSuccessButton.innerText === "Create") {
            const data = await fetchStudentsApi("add", requestBody);

            currentPage = data.last_page;
        }
        if (addEditSuccessButton.innerText === "Save") {
            const studentId = Number(studentsCheckedRow.querySelector("td.student-id")
                .innerText);

            await fetchStudentsApi("edit", requestBody, studentId);
        }

        closeModal();
        await renderPage();
        clearFields();
    } catch (e) {
        const { errors } = e.body;

        showValidationErrors(Object.values(errors));
    }
});

deleteSuccessButton.addEventListener("click", async () => {
    for (const checkbox of studentsTableBody.querySelectorAll("input[type='checkbox']:checked")) {
        const tableRow = checkbox.closest("tr");
        await fetchStudentsApi(
            "remove",
            null,
            Number(tableRow.querySelector("td.student-id").innerText)
        );
    }

    closeModal();
    await renderPage();
});

async function renderPage()
{
    try {
        const data = await fetchStudentsApi("get", null, null);

        studentsTableBody.innerHTML = "";
        paginationContainer.innerHTML = "";

        if (data.students.data.length === 0)
            return;

        data.students.data.forEach(student => {
            const {id, group, first_name: firstName, last_name: lastName, gender, birthday} = student;

            renderStudent(id, group, firstName, lastName, gender, birthday);
        });

        data.students.links.forEach(link => {
            const { url, label, active } = link;

            renderPaginationButton(label, active, url);
            assignPaginationButtons();
        });
    } catch (e) {
        console.log(e);
    }
}

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

function renderStudent(id, group, firstName, lastName, gender, birthday) {
    const newTableRow = `
        <tr>
            <td><input aria-label="select student ${id}" type="checkbox"/></td>
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
            <td class="student-id">${id}</td>
        </tr>
        `;

    studentsTableBody.innerHTML += newTableRow;
    assignCheckboxes();
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

async function fetchStudentsApi(action, body = null, id = null) {
    const { requestType, method } = getRequestConfig(action, body, id);

    const response = await fetch(`${BASE_API_URL}/students${requestType}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("api_token"),
        },
        body: (method === "GET") ? null : JSON.stringify(body),
        credentials: "include"
    });

    if (!response.ok) {
        const error = new Error("API request failed");
        error.status = response.status;
        error.body = await response.json();

        throw error;
    }

    return await response.json();
}

function getRequestConfig(action, body = null, id = null) {
    const config = {
        add: {
            requestType: "/add",
            method: "POST"
        },
        edit: {
            requestType: `/edit/${id}`,
            method: "PUT"
        },
        remove: {
            requestType: `/remove/${id}`,
            method: "DELETE"
        },
        get: {
            requestType: `?page=${currentPage}`,
            method: "GET"
        }
    };

    return config[action];
}

function renderPaginationButton(label, isActive, url) {
    const mapLabel = {
        "&laquo; Previous": "&lt;",
        "Next &raquo;": "&gt;"
    };
    const isDisabled = url === null;

    if (Object.keys(mapLabel).includes(label))
        label = mapLabel[label];

    const newPaginationButton = `
        <button class="button ${(isActive) ? "button-active" : ""} ${(isDisabled) ? "button-disabled" : ""}"
                ${(isDisabled) ? "disabled" : ""}>
            ${label}
        </button>
    `;

    paginationContainer.innerHTML += newPaginationButton;
}

function assignPaginationButtons() {
    paginationContainer.querySelectorAll("button")
        .forEach((paginationButton) => {
            paginationButton.addEventListener("click", async () => {
                if (paginationButton.innerHTML.trim() === "&lt;") {
                    currentPage--;
                    await renderPage();
                    return;
                }
                if (paginationButton.innerHTML.trim() === "&gt;")
                {
                    currentPage++;
                    await renderPage();
                    return;
                }

                currentPage = Number(paginationButton.innerText);
                await renderPage();
            });
        });
}
