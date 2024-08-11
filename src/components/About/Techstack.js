import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  DiGit,
  DiIonic,
  DiJavascript1,
  DiMongodb,
  DiNodejs,
  DiReact,
} from "react-icons/di";
import {
  SiCapacitor,
  SiFirebase,
  SiNextdotjs,
  SiPostgresql,
  SiSupabase
} from "react-icons/si";
import { TbBrandGolang } from "react-icons/tb";


function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <DiJavascript1 />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <TbBrandGolang />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiNodejs />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiReact />
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <DiMongodb />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiNextdotjs />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGit />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFirebase />
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <SiPostgresql />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiIonic />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiCapacitor />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiSupabase />
      </Col>

    </Row>
  );
}

export default Techstack;
