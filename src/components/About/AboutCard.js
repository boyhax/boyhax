import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Said alhajri </span>
            from <span className="purple"> Oman .</span>
            <br />
            I am currently employed as a quality inspector at special technical services.
            <br />
            I have completed mechanical engineer at ibra collage of technology.
            <br />
           
          </p>
          

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Said</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
