export default class NotesView {
    /**
     * Notes view
     * @param {HTMLElement} root
     * @param {Object} obj
     * @param {Function} obj.onNoteSelect
     * @param {Function} obj.onNoteAdd
     * @param {Function} obj.onNoteEdit
     * @param {Function} obj.onNoteDelete
     */
    constructor(root, {onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete} = {}){
        this.root = root
        this.onNoteSelect = onNoteSelect
        this.onNoteAdd = onNoteAdd
        this.onNoteEdit = onNoteEdit
        this.onNoteDelete = onNoteDelete
        this.root.innerHTML = `
        <aside class="notes__sidebar">
            <button class="notes__add" type="button">
                Add new note
            </button>
            <div class="notes__list"></div>
        </aside>
        <main class="notes__main">
            <header class="notes__header">
                <input class="notes__title" type="text" placeholder="New note..." />
                <button class='theme__switch active-icon'>
                    <img class="theme__switch-icon" src='' width='14px' />
                </button>
            </header>
            <div class="notes__preview">
                <div class="notes__preview-edit">
                    <textarea class="notes__body">Take note...</textarea>
                </div>
            </div>
        </main>
        `

        const btnNewNote = this.root.querySelector(".notes__add")
        const inputTitle = this.root.querySelector(".notes__title")
        const inputBody = this.root.querySelector(".notes__body")

        btnNewNote.addEventListener('click', () => {
            this.onNoteAdd()
        })


        let inputField // ?? without this returns error for input field
        [inputTitle, inputBody].forEach(inputField => 
            inputField.addEventListener('blur', () => {
                const newTitle = inputTitle.value.trim()
                const newBody = inputBody.value.trim()

                this.onNoteEdit(newTitle, newBody)
            })
        )

        this.updateNotePreviewVisibility(false)
    }

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} body
     * @param {Date} updated
     */
    _createListItemHTML(id, title, body, updated){
        const MAX_BODY_LENGTH = 60

        return `
            <div class='notes__list-item' data-note-id="${id}">
                <div class='notes__item-header'>
                    <div class='notes__small-title'>
                        ${title}
                    </div>
                    <button class='notes__item-delete active-icon'>
                        <img src='./assets/xmark-solid.svg' alt='Delete note' width='14px' />
                    </button>
                </div>
                <div class='notes__small-body'>
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class='notes__small-updated'>
                    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
                </div>
            </div>
        `
    }

    /**
     * @param {Array} notes
     */
    updateNotesList(notes){
        const notesListContainer = this.root.querySelector(".notes__list")

        // Empty list
        notesListContainer.innerHTML = ""

        for(const note of notes){
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated))

            notesListContainer.insertAdjacentHTML("beforeend", html)
        }

        notesListContainer.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
            noteListItem.addEventListener('click', () => {
                this.onNoteSelect(noteListItem.dataset.noteId)
            })

            const deleteButton = noteListItem.querySelector('.notes__item-delete')

            deleteButton.addEventListener("click", () => {
                const isConfirm = confirm("Are you sure you want to delete this note?")

                if(isConfirm){
                    this.onNoteDelete(noteListItem.dataset.noteId)
                }
            })
        })
    }

    /**
     * @param {Object} note
     */
    updateActiveNote(note){
        this.root.querySelector(".notes__title").value = note.title
        this.root.querySelector(".notes__body").value = note.body

        this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
            noteListItem.classList.remove("notes__list-item--selected")
        })

        this.root.querySelector(`.notes__list-item[data-note-id='${note.id}']`).classList.add("notes__list-item--selected")
    }

    /**
     * @param {boolean} isVisible
     */
    updateNotePreviewVisibility(isVisible){
        this.root.querySelector(".notes__preview").style.visibility = isVisible ? "visible" : "hidden"
    }
}