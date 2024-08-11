import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import shiftdays from "../../Assets/Projects/shiftdays.png";
import shoflytawseel from "../../Assets/Projects/shoflytawseel.png";
import manazl from "../../Assets/Projects/manazl.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={manazl}
              isBlog={false}
              title="ManazlApp"
              description="Rentals service for private properties in oman. it provide features mixed from booking and airbnb"
              // ghLink="https://github.com/soumyajit4419/Chatify"
              demoLink="https://play.google.com/store/apps/details?id=com.boyhax.manazl&pcampaignid=web_share&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={shoflytawseel}
              isBlog={false}
              title="ShoflyTawseel"
              description="Delivery service providers by personal carriers in oman. provide easy search map and panel for delivery man"
              ghLink="https://github.com/boyhax/ShoflyTawseel-ionic-react-firebase-delivery-app"
              demoLink="https://play.google.com/store/apps/details?id=com.boyhax.shoflyTawseel"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={shiftdays}
              isBlog={false}
              title="Shiftdays"
              description="Easy Callender for who work by shift .it hightlight 14 days of work."
              ghLink="https://github.com/boyhax/shift-days"
              demoLink="https://play.google.com/store/apps/details?id=com.boyhax.shiftDays"              
            />
          </Col>

         
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
