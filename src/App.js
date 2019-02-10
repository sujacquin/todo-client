import React, { Component } from 'react';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTimesCircle)

class App extends Component {
  state = {
    title: "",
    titleList: []
  }

  handlechange = async event => {
    const name = event.target.name;
    const value = event.target.value;
    const statesToUpdate = {};

    statesToUpdate[name] = value;

    await this.setState(statesToUpdate);
  }


  addItem = async (event) => {
    event.preventDefault();

    await this.setState(prevState => ({
      titleList: [...prevState.titleList, { desc: this.state.title, status: "new" }]
    }), this.setState({ title: "" }));


  }

  strikeTask = async (index) => {

    const array = this.state.titleList;

    if (this.state.titleList[index].status === "new") {
      array[index].status = "done"

    } else if (this.state.titleList[index].status === "done") {
      array[index].status = "new"

    }


    array.sort(function (a, b) { return a.status.length - b.status.length });

    await this.setState({ titleList: array })
  }

  removeTask = async (index) => {

    const array = this.state.titleList;
    array.splice(index, 1)


    await this.setState({ titleList: array })





  }

  render() {


    return (<>

      <h1>To-Do list</h1>
      <ul>{this.state.titleList.map((x, index) => {
        if (x.status === "new") { return <li key={index} ><div onClick={() => this.removeTask(index)}><FontAwesomeIcon icon="times-circle" /></div><p onClick={() => this.strikeTask(index)}>{x.desc}</p></li> }
        return <li key={index} ><div onClick={() => this.removeTask(index)}><FontAwesomeIcon icon="times-circle" /></div><p className="strike" onClick={() => this.strikeTask(index)}> {x.desc}</p></li>
      })}</ul>
      <form >
        <input type="text" placeholder="Titre" value={this.state.title} name="title" onChange={this.handlechange}></input>
        <button onClick={this.addItem}>Add task</button>
      </form>
    </>

    )
  }

}
export default App;
