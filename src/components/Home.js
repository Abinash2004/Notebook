import React from 'react';
import AddNote from './AddNote';
import Notes from './Notes';

const Home = (props) => {
  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <Notes showAlert={props.showAlert} />
    </>
  )
}

export default Home
