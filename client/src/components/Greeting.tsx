'use client';

import { useContext } from "react";
import { UsernameContext } from "@context/UsernameContext";

const Greeting: React.FC = () => {  
  const [username] = useContext(UsernameContext);
  
  return <h1>Hello, {username}</h1>;
}

export default Greeting;
