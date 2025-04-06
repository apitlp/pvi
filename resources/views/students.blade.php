<x-index current_page="Students">
    @vite('resources/css/students.css')

    <button class="button" id="add-button">add</button>

    <table class="students-table">
        <thead>
        <tr>
            <th aria-label="Select all students">
                <input aria-label="select all students" type="checkbox"/>
            </th>
            <th>Group</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Birthday</th>
            <th>Status</th>
            <th>Options</th>
            <th class="student-id">Id</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><input aria-label="select student 1" type="checkbox"/></td>
            <td>PZ-25</td>
            <td>Andrii Potikha</td>
            <td>M</td>
            <td>18.12.2005</td>
            <td class="circle-wrapper">
                <div class="circle circle-active"></div>
            </td>
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled edit-button" disabled>edit</button>
                    <button class="button button-disabled remove-button" disabled>remove</button>
                </div>
            </td>
            <td class="student-id">1</td>
        </tr>
        <tr>
            <td><input aria-label="select student 2" type="checkbox"/></td>
            <td>PZ-25</td>
            <td>Polina Bakhmetieva</td>
            <td>F</td>
            <td>13.08.2006</td>
            <td class="circle-wrapper">
                <div class="circle circle-inactive"></div>
            </td>
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled edit-button" disabled>edit</button>
                    <button class="button button-disabled remove-button" disabled>remove</button>
                </div>
            </td>
            <td class="student-id">2</td>
        </tr>
        <tr>
            <td><input aria-label="select student 3" type="checkbox"/></td>
            <td>PZ-25</td>
            <td>Vladyslav Yedynak</td>
            <td>M</td>
            <td>16.03.2006</td>
            <td class="circle-wrapper">
                <div class="circle circle-inactive"></div>
            </td>
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled edit-button" disabled>edit</button>
                    <button class="button button-disabled remove-button" disabled>remove</button>
                </div>
            </td>
            <td class="student-id">3</td>
        </tr>
        <tr>
            <td><input aria-label="select student 4" type="checkbox"/></td>
            <td>PZ-25</td>
            <td>Oleksandr Zelinskyi</td>
            <td>M</td>
            <td>18.06.2006</td>
            <td class="circle-wrapper">
                <div class="circle circle-inactive"></div>
            </td>
            <td>
                <div class="student-buttons">
                    <button class="button button-disabled edit-button" disabled>edit</button>
                    <button class="button button-disabled remove-button" disabled>remove</button>
                </div>
            </td>
            <td class="student-id">4</td>
        </tr>
        </tbody>
    </table>

    <div class="students-pagination">
        <button class="button">&lt;</button>
        <button class="button button-active">1</button>
        <button class="button">2</button>
        <button class="button">3</button>
        <button class="button">&gt;</button>
    </div>
    </section>
    </main>

    <section class="modal-window">
        <div class="add-edit-window">
            <div class="modal-header">
                <h2 class="modal-title" aria-label="add/edit modal window title"></h2>
                <button class="button modal-close-button">X</button>
            </div>

            <div class="modal-error"></div>

            <form class="modal-form">
                <div class="modal-form-item">
                    <label for="group-select">Group</label>
                    <select id="group-select" required>
                        <option value="" disabled selected>Select Group</option>
                        <option value="PZ-21">PZ-21</option>
                        <option value="PZ-22">PZ-22</option>
                        <option value="PZ-23">PZ-23</option>
                        <option value="PZ-24">PZ-24</option>
                        <option value="PZ-25">PZ-25</option>
                        <option value="PZ-26">PZ-26</option>
                    </select>
                </div>

                <div class="modal-form-item">
                    <label for="first-name-input">First name</label>
                    <input type="text" id="first-name-input" required />
                </div>

                <div class="modal-form-item">
                    <label for="last-name-input">Last name</label>
                    <input type="text" id="last-name-input" required />
                </div>

                <div class="modal-form-item">
                    <label for="gender-select">Gender</label>
                    <select id="gender-select" required>
                        <option value="" disabled selected>Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>

                <div class="modal-form-item">
                    <label for="birthday-input">Birthday</label>
                    <input type="date" id="birthday-input" required />
                </div>

                <input type="hidden" value="" id="id-input" />

                <div class="modal-buttons">
                    <button class="button modal-cancel-button">Cancel</button>
                    <button class="button modal-success-button" aria-label="Modal success button"></button>
                </div>
            </form>
        </div>

        <div class="delete-window">
            <div class="modal-header">
                <h2 class="modal-title">Warning</h2>
                <button class="button modal-close-button">X</button>
            </div>

            <p class="modal-message"></p>

            <div class="modal-buttons">
                <button class="button modal-cancel-button">Cancel</button>
                <button class="button modal-success-button">Ok</button>
            </div>
        </div>
    </section>

    @vite('resources/js/students.js')
</x-index>
