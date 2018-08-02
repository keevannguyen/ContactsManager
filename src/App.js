import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addOrEdit
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Contacts</h1>
        </header>
        <Form name="Kevin" phone="7143604046" birthday="1998-12-05" edit={true} id={"replacethislater"} />
      </div>
    );
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name ? this.props.name : "",
      phone: this.props.phone ? this.props.phone : "",
      birthday: this.props.birthday ? this.props.birthday : "",
    }
  }

  handleName(e) {
    this.setState({name: e.target.value});
  }

  handlePhone(e) {
    this.setState({phone: e.target.value});
  }

  handleBirthday(e) {
    this.setState({birthday: e.target.value});
  }

  addContact(e) {
    e.preventDefault();
    if ( this.state.name && this.state.phone && this.state.birthday) {
      fetch("/contact/create", {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.name,
          phone: this.state.phone,
          birthday: this.state.birthday
        })
      })
      .then( res => {
        if(res.status === 200) {
          console.log("Contact sucessfully added!");
        } else {
          console.log("Failed to add contact.");
        }
      })
      .catch( err => {
        alert("ERROR", err);
      });
    } else {
      alert("Incomplete Contact Information");
    }
  }

  editContact(e) {
    e.preventDefault();
    if ( this.state.name && this.state.phone && this.state.birthday) {

    }
  }

  cancelContact(e) {
    e.preventDefault();
    this.setState({name: "", phone: "", birthday: ""});
  }

  render() {
    return (
      <div className="container">
        <div className="col-md-6 offset-md-3">
          <form>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Name" value={this.state.name} onChange={(e)=>this.handleName(e)} />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Phone Number" value={this.state.phone} onChange={(e)=>this.handlePhone(e)} />
            </div>
            <div className="form-group">
              <input type="date" className="form-control" value={this.state.birthday} onChange={(e)=>this.handleBirthday(e)} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" onClick={(e)=>this.addContact(e)}>{this.props.edit ? "Edit" : "Add"}</button>
            <button type="button" className="btn btn-danger btn-block" onClick={(e)=>this.cancelContact(e)}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }
}

class Contacts extends Component {
  render() {
    return (
      <div className="container">
        <div className="col-md-6">
          <p>{this.props.name}</p>
          <p>{this.props.phone}</p>
          <p>{this.props.birthday}</p>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-secondary btn-block">Edit</button>
          <button type="button" className="btn btn-secondary btn-block">Delete</button>
        </div>
      </div>
    );
  }
}

export default App;
