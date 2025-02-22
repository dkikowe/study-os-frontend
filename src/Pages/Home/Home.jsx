import s from "./Home.module.sass";
import Nav from "../../components/Nav/Nav";
import Header from "../../components/Header/Header";
import Greeting from "../../components/Greeting/Greeting";

export default function Home() {
  return (
    <div>
      <Nav></Nav>
      <Header />
      <Greeting></Greeting>
    </div>
  );
}
