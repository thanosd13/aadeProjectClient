import React from "react";
import "./Footer.css";
import { Fade } from "react-reveal";
import { greeting } from "../Portofolio/portfolio";

export default function Footer(props) {
  return (
    <div className="footer-div">
      <Fade>
        <p className="footer-text" style={{ color: props.theme.secondaryText }}>
          Made by td13
        </p>
      </Fade>
    </div>
  );
}
