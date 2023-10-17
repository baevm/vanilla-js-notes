import NotesAPI from "./NotesAPI.js"
import NotesView from "./NotesView.js"

export default class App {
    
    /**
     * App
     * @param {HTMLElement} root
     */
    constructor(root){
        this.notes = []
        this.activeNote = null
        this.view = new NotesView(root, this._handlers())
        this.root = root
        this.isDark = false

        this._refreshNotes()

        const themeSwitchBtn = this.root.querySelector(".theme__switch")
        const themeSwitchIcon = this.root.querySelector(".theme__switch-icon")

        themeSwitchIcon.src = !this.isDark ? "./assets/sun-regular.svg" : "./assets/moon-regular.svg"
        document.documentElement.setAttribute("data-theme", "light")
        
        themeSwitchBtn.addEventListener("click", () => {
            if(this.isDark){
                themeSwitchIcon.src = "./assets/sun-regular.svg"
                document.documentElement.setAttribute("data-theme", "light")
            } else {
                themeSwitchIcon.src = "./assets/moon-regular.svg"
                document.documentElement.setAttribute("data-theme", "dark")
            }

            this.isDark = !this.isDark
        })
    }

    _handlers(){
        return {
            onNoteAdd: () => {
                const note = {
                    title: "New note",
                    body: "Take a note..."
                }

                NotesAPI.saveNote(note)
                this._refreshNotes()
            },
            onNoteSelect: (noteId) => {
                noteId = parseInt(noteId)
                const selectedNote = this.notes.find((note) => note.id === noteId)
                this._setActiveNote(selectedNote)
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                })
                this._refreshNotes()
            },
            onNoteDelete: (noteId) => {
                NotesAPI.deleteNote(parseInt(noteId))
                this._refreshNotes()
            },
        }
    }

    _refreshNotes(){
        const notes = NotesAPI.getAllNotes()

        this._setNotes(notes)

        if(notes.length > 0){
            this._setActiveNote(notes[0])
        }
    }

    /**
     * @param {Array} notes
     */
    _setNotes(notes){
        this.notes = notes
        this.view.updateNotesList(notes)
        this.view.updateNotePreviewVisibility(notes.length > 0)
    }

    /**
     * @param {Object} note
     */
    _setActiveNote(note){
        if(note){
            this.activeNote = note
            this.view.updateActiveNote(note)
        }
    }
}