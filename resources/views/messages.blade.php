<x-index current_page="Messages">
    @vite('resources/css/messages.css')

    <div class="chat-container">
        <div class="chat-rooms-wrapper">
            <button class="button" id="open-create-chat-button">+ Create new chat room</button>

            <div class="chat-rooms">
{{--                <div class="chat-room">--}}
{{--                    <img src="{{ asset('images/blank-profile-picture.jpg') }}" alt="chat room image" />--}}

{{--                    <p class="chat-room-name">PZ</p>--}}
{{--                </div>--}}
            </div>
        </div>

        <div class="chat-wrapper">
            <h2 class="chat-title"></h2>

            <div class="chat-members">
                <span>Members:</span>
                <span class="chat-add-member" id="open-add-members-span">+</span>
                <div>
{{--                    <span>--}}
{{--                        <img src="{{ asset('images/blank-profile-picture.jpg') }}" alt="member">--}}
{{--                        <span class="member-online-status member-online-status-active"></span>--}}
{{--                    </span>--}}
                </div>
            </div>

            <div class="chat-messages">
{{--                <div class="chat-message chat-message-others">--}}
{{--                    <img src="{{ asset('images/blank-profile-picture.jpg') }}" alt="member">--}}
{{--                    <div>--}}
{{--                        <p class="chat-message-sender-name">Lorem Ipsum:</p>--}}

{{--                        <p class="chat-message-text">--}}
{{--                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi autem delectus dolorum!--}}
{{--                            Cum doloremque earum et illo molestiae necessitatibus nemo neque, nobis, nostrum obcaecati--}}
{{--                            pariatur quasi rerum, voluptate voluptatum.--}}
{{--                        </p>--}}
{{--                    </div>--}}
{{--                </div>--}}
            </div>

            <div class="chat-input-container">
                <textarea id="chat-textarea" placeholder="Type your message..." rows="1"></textarea>

                <button id="send-message-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    </section>
    </main>

    <section class="modal-window">
        <div class="create-chat-room-window">
            <div class="modal-header">
                <h2 class="modal-title">
                    Create new chat room
                </h2>
                <button class="button modal-close-button">X</button>
            </div>

            <div class="modal-members-wrapper">
                <p>Select members:</p>

                <input type="text" id="new-chat-member-input" placeholder="Search users..." class="modal-input">

                <div class="modal-members-container">
{{--                    <div class="modal-member">--}}
{{--                        <input type="checkbox" />--}}

{{--                        <img src="{{ asset('images/blank-profile-picture.jpg') }}" alt="profile picture">--}}

{{--                        <p>Polina Bakhmetieva</p>--}}
{{--                    </div>--}}
                </div>
            </div>

            <div class="modal-chat-name-wrapper">
                <p>Chat room name:</p>

                <input type="text" id="new-chat-name-input" placeholder="Chat room name..." class="modal-input">
            </div>

            <button class="button modal-button" id="create-chat-button">Create</button>
        </div>

        <div class="add-members-window">
            <div class="modal-header">
                <h2 class="modal-title">
                    Add members
                </h2>
                <button class="button modal-close-button">X</button>
            </div>

            <div class="modal-members-wrapper">
                <p>Select members:</p>

                <input type="text" id="new-chat-member-input" placeholder="Search users..." class="modal-input">

                <div class="modal-members-container">
{{--                    <div class="modal-member">--}}
{{--                        <input type="checkbox" />--}}

{{--                        <img src="{{ asset('images/blank-profile-picture.jpg') }}" alt="profile picture">--}}

{{--                        <p>Polina Bakhmetieva</p>--}}
{{--                    </div>--}}
                </div>
            </div>

            <button class="button modal-button" id="add-member-button">Add</button>
        </div>
    </section>

    @vite('resources/js/messages.js')
    @vite('resources/js/socket.js')
</x-index>
