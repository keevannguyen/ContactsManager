import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const AppRouter = () => (
  <Router>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route path="/add" component={AddContactPage} />
      <Route path="/contact/:id" component={EditContactPage} />
    </div>
  </Router>
);

const HomePage = () => (
  <div>
    <Header />
    <Contacts />
  </div>
);

const AddContactPage = () => (
  <div>
    <Header />
    <ContactForm />
  </div>
)

const EditContactPage = ( {match} ) => (
  <div>
    <Header />
    <ContactForm id={match.params.id} />
  </div>
)

class Header extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Contacts</h1>
        </header>
      </div>
    );
  }
}

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      birthday: "",
      redirect: false
    }
  }

  componentDidMount() {
    if (this.props.id) {
      fetch('/api/contact/' + this.props.id, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then( ({contact}) => {
        this.setState({
        name: contact.name,
        phone: contact.phone,
        birthday: new Date(contact.birthday).toISOString().slice(0, 10)
      })})
      .catch(err => console.log("ERROR:", err));
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

  updateContact(e) {
    e.preventDefault();
    if ( this.state.name && this.state.phone && this.state.birthday ) {
      fetch('/api/contact/' + (this.props.id ? this.props.id : 'create'), {
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
          console.log("Contact sucessfully " + (this.props.id ? "edited!" : "added!"));
          this.setState({"redirect": true});
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

  cancelContact(e) {
    e.preventDefault();
    this.setState({"redirect": true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />
    } else {
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
              <button type="submit" className="btn btn-success btn-block" onClick={(e)=>this.updateContact(e)}>{this.props.id ? "Edit" : "Add"}</button>
              <button type="button" className="btn btn-danger btn-block" onClick={(e)=>this.updateContact(e)}>Cancel</button>
            </form>
          </div>
        </div>
      );
    }
  }
}

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      redirect: false,
      id: ""
    }
  }

  componentDidMount() {
    this.getContacts();
  }

  getContacts() {
    fetch('/api/contacts', {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(res => res.json())
    .then(json => this.setState({ contacts: json.contacts }))
    .catch( err => console.log("ERROR:", err));
  }

  handleEdit(id) {
    this.setState({redirect: true, id: id});
  }

  handleDelete(id) {
    fetch('/api/contact/delete/' + id, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(res.status === 200) {
        console.log("Contact sucessfully deleted!");
        this.getContacts();
      } else {
        console.log("Failed to delete contact.");
      }
    })
    .catch( err => {
      alert("ERROR", err);
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/contact/" + this.state.id} />
    } else {
      return (
        <div className="container">
          <a href="/add" className="btn btn-primary btn-block mb-3">Add Contact</a>
          { this.state.contacts.map(c => {
            let phone = `(${c.phone.slice(0,3)})-${c.phone.slice(3,6)}-${c.phone.slice(6)}`;
            let bday = new Date(c.birthday).toDateString().split(" ").slice(1);
            bday = `${bday[0]} ${bday[1]}, ${bday[2]}`;
            return <Contact key={c.name} name={c.name} phone={phone} birthday={bday} id={c._id}
              editHandler={this.handleEdit.bind(this)} deleteHandler={this.handleDelete.bind(this)} />
          })}
        </div>
      );
    }
  }
}

class Contact extends Component {
  render() {
    return (
      <div className="card">
        <div className="row card-body">
          <div className="col-md-8" style={{fontSize: 20}}>
            <div><b>Name:</b> {this.props.name}</div>
            <div><b>Phone:</b> {this.props.phone}</div>
            <div><b>Birthday:</b> {this.props.birthday}</div>
          </div>
          <div className="col-md-4">
            <button type="button" className="btn btn-secondary btn-block" onClick={()=>this.props.editHandler(this.props.id)}>Edit</button>
            <button type="button" className="btn btn-danger btn-block" onClick={()=>this.props.deleteHandler(this.props.id)}>Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppRouter;
