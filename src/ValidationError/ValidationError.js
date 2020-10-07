import React from "react";
import PropTypes from "prop-types";
import "./ValidationError.css";

export default function ValidationError(props) {
  if (props.message) {
    return <span className="error">{props.message}</span>;
  }
  return <></>;
}

ValidationError.propTypes = {
  message: PropTypes.string,
};
