import { useUserContext } from "@hooks/useUserContext";

const Greeting: React.FC = () => {  
  const userState = useUserContext();
  
  return <h1>Hello, {userState.value?.username}</h1>;
}

export default Greeting;
