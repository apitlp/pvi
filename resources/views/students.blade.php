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
        </tbody>
    </table>

    <div class="students-pagination"></div>
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
