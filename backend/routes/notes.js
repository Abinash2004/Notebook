const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');

//Route 1 : Get all the notes
router.get('/fetchallnotes', fetchuser, async (req,res) => {
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
})
//Route 2 : Add a new note using post
router.post('/addnote', fetchuser, [
    //Validation of the new user signin
    body('title','Enter a valid name').isLength({min: 3}),
    body('description','Description must be atleast 5 characters').isLength({min: 5}),
], async (req,res) => {
    try {
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()});
        }
    
        const note = new Notes({
            title, description, tag, user: req.user.id
    
        });
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

//Route 3 : Update an existing note
router.put('/updatenote/:id', fetchuser, async (req,res) => {
    try {
        const {title, description, tag} = req.body;
        // create a new note object
        const newNote = {};
        if(title) {newNote.title = title;}
        if(description) {newNote.description = description;}
        if(tag) {newNote.tag = tag;}

        //find the note to be updated 
        let note = await Notes.findById(req.params.id);
        if(!note) {req.status(404).send("Not Found");}
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json({note});
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

//Route 4 : Delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req,res) => {
    try {

        //find the note to be deleted 
        let note = await Notes.findById(req.params.id);
        if(!note) {req.status(404).send("Not Found");}
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Allow deletetion only if user owns this note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({success: "Note has been deleted"});
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;