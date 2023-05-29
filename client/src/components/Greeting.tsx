import { useContext } from "react";
import { UserContext } from "@context/UserContext";

const Greeting: React.FC = () => {  
  const userState = useContext(UserContext);
  
  return <h1>Hello, {userState.value?.username}</h1>;
}

export default Greeting;
