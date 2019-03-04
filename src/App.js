import React, { Component } from 'react';
import axios from "axios";
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTimesCircle)

class App extends Component {
  state = {
    title: "",
    titleList: [],
    dragStart: "",
    drop: ""
  }


  dragStart = async (index) => {

    await this.setState({ dragStart: index });
    console.log("drag", index);


  }


  drop = async (index) => {
    try {
      if (index === "last") {
        await this.setState({ drop: this.state.titleList.length - 1 })
      } else { await this.setState({ drop: index }) }

      const taskArray = [...this.state.titleList];
      const array = [];

      const dragged = this.state.titleList[this.state.dragStart];

      // taskArray.splice(this.state.dragStart, 1);


      // taskArray[this.state.drop] = dragged


      for (let i = 0; i < this.state.dragStart; i++) {
        array[i] = taskArray[i]
      }

      array[this.state.drop] = dragged;

      if (this.state.dragStart < this.state.drop) {
        for (let i = 0; i < this.state.dragStart; i++) {
          array[i] = taskArray[i]
        }

        for (let i = this.state.dragStart; i < this.state.drop; i++) {
          array[i] = taskArray[i + 1]
        }
        for (let i = this.state.drop + 1; i < taskArray.length; i++) {
          array[i] = taskArray[i]
        }

      }

      if (this.state.dragStart > this.state.drop) {
        for (let i = 0; i < this.state.drop; i++) {
          array[i] = taskArray[i]
        }
        for (let i = this.state.drop + 1; i <= this.state.dragStart; i++) {
          array[i] = taskArray[i - 1]
        }
        for (let i = this.state.dragStart + 1; i < taskArray.length; i++) {
          array[i] = taskArray[i]
        }

      }


      await this.setState({ titleList: array })
    } catch (error) {
      console.log(error.message);
    }

  }

  handlechange = async event => {
    const name = event.target.name;
    const value = event.target.value;
    const statesToUpdate = {};

    statesToUpdate[name] = value;

    await this.setState(statesToUpdate);
  }



  reloadPage = async () => {
    const response = await axios.get("https://todo-server-susana.herokuapp.com/");
    const array = response.data;
    array.sort(function (a, b) { return a.status.length - b.status.length });

    await this.setState({ title: "", titleList: array })

  }


  addItem = async (event) => {
    event.preventDefault();

    await axios.post("https://todo-server-susana.herokuapp.com/create", {
      desc: this.state.title
    })

    this.reloadPage();

  }

  strikeTask = async (index) => {

    await axios.post("https://todo-server-susana.herokuapp.com/update", {
      id: this.state.titleList[index]._id
    })

    this.reloadPage();

  }

  removeTask = async (index) => {

    await axios.post("https://todo-server-susana.herokuapp.com/delete", {
      id: this.state.titleList[index]._id
    })

    this.reloadPage();

  }

  render() {


    return (<>

      <h1>To-Do list</h1>
      <ul>{this.state.titleList.map((x, index) => {
        if (x.status === "new") { return <li key={index} draggable="true" onDragStart={() => { this.dragStart(index) }} onDragOver={(event) => event.preventDefault()} onDrop={() => { this.drop(index) }} ><div onClick={() => this.removeTask(index)}><FontAwesomeIcon icon="times-circle" /></div><p onClick={() => this.strikeTask(index)}>{x.desc}</p></li> }
        return <li key={index} ><div onClick={() => this.removeTask(index)}><FontAwesomeIcon icon="times-circle" /></div><p className="strike" onClick={() => this.strikeTask(index)}> {x.desc}</p></li>
      })}<li key="transparent" style={{ height: "15px" }} onDragOver={(event) => event.preventDefault()} onDrop={() => { this.drop("last") }}></li>
      </ul>
      <form >
        <input type="text" placeholder="Titre" value={this.state.title} name="title" onChange={this.handlechange}></input>
        <button onClick={this.addItem}>Add task</button>
      </form>
    </>

    )
  }

  async componentDidMount() {
    const response = await axios.get("https://todo-server-susana.herokuapp.com/");
    const array = response.data;
    array.sort(function (a, b) { return a.status.length - b.status.length });
    await this.setState({ titleList: array })
  }

}
export default App;
