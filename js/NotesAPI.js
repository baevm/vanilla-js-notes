export default class NotesAPI {
    static #localStorageKey = "notesapp-notes"

    static getAllNotes(){
        const notes = JSON.parse(localStorage.getItem(this.#localStorageKey) || "[]")
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1
        })
    }

    /**
     * @param {Object} note
     */
    static saveNote(note){
        const notes = NotesAPI.getAllNotes()

        const existing = notes.find(n => note.id === n.id)

        if(existing){
            existing.title = note.title
            existing.body = note.body
            existing.updated = new Date().toISOString()
        } else {
            note.id = Math.floor(Math.random() * 1_000_000)
            note.updated = new Date().toISOString()
            notes.push(note)
        }

        localStorage.setItem(this.#localStorageKey, JSON.stringify(notes))
    }

    /**
     * @param {number} id
     */
    static deleteNote(id){
        const notes = NotesAPI.getAllNotes()

        const newNotes = notes.filter(n => n.id !== id)

        localStorage.setItem(this.#localStorageKey, JSON.stringify(newNotes))
    }
}