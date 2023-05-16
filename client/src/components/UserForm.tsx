import { FormEvent, FormEventHandler, useContext } from "react";
import styles from '@styles/UserForm.module.css';
import { hasCookie, setCookie } from "cookies-next";
import { UsernameContext } from "@context/UsernameContext";

interface IUserFormProps {
  onSubmit?: FormEventHandler;
}

const UserForm: React.FC<IUserFormProps> = ({ onSubmit }) => {
  const [_, setUsername] = useContext(UsernameContext);
  
  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (hasCookie('username')) return;
    
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('username') as string;

    if (!username) return;

    setCookie('username', username);
    setUsername(username);
    
    if (onSubmit) onSubmit(event);
  };

  return (
    <form 
      className={styles['user-form']} 
      onSubmit={onFormSubmit}
    >
      <label
        className={styles['user-form__label']} 
        htmlFor="username__input"
      />
      <input
        id="username__input"
        className={styles['user-form__input']} 
        name="username" 
      />
      <input 
        className={styles['user-form__button']}
        type="submit" 
        value="Start"
      />
    </form>
  );
}

export default UserForm;
