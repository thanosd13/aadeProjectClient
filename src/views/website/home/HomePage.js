import React, { Component } from "react";
import Footer from "../../../components/footer/Footer";
import TopButton from "../../../components/topButton/TopButton";
import Header from "../../../components/header/Header";
import Greeting from "../../../components/greeting/Greeting";
import Skills from "../../../components/skills/Skills";
import { chosenTheme } from "../../../theme";

class Home extends Component {
  render() {
    return (
      <div>
        <Header theme={chosenTheme} />
        <Greeting theme={chosenTheme} />
        <Skills theme={chosenTheme} />
        <Footer theme={chosenTheme} />
        <TopButton theme={chosenTheme} />
      </div>
    );
  }
}

export default Home;
