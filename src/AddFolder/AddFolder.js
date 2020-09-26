import React, { Component } from "react";
import NotefulContext from "../NotefulContext/NotefulContext";

export default class AddFolder extends Component {
  static contextType = NotefulContext;

  render() {
    return (
      <section className="AddFolder">
        <form className="AddFolder__form" />
      </section>
    );
  }
}
