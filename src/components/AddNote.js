import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/NoteContext'

function AddNote(props) {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title:"", description:"", tag:""})
    const handleClick = (e)=> {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title:"", description:"", tag:""});
        props.showAlert("Note Added Successfully", "success");
    }
    const onChange = (e)=> {
        setNote({...note, [e.target.name]: e.target.value});
    }
    return (
        <div className='container my-3'>
            <h2>Add Your Note</h2>
            <form className='container my-3'>
                <div className="mb-3">
                    <label htmlFor="title" name="title" className="form-label">Title</label>
                    <input type="text" className="form-control" value={note.title} id="title" name="title" aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" name="description" className="form-label">Description</label>
                    <input type="text" className="form-control" value={note.description} id="description" name="description" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" name="tag" className="form-label">tag</label>
                    <input type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange}/>
                </div>
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
