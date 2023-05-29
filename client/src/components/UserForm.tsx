import { FormEvent, useContext } from "react";
import { UserContext } from "@context/UserContext";
import styles from '@styles/UserForm.module.css';

const UserForm: React.FC = () => {
  const userState = useContext(UserContext);
  
  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const username = new FormData(form).get('username');

    if (typeof username === 'string') {
      userState.set(username);
    }
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
