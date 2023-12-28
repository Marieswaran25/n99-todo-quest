import * as React from 'react';
import './register.scss'
import { View } from '../View';

interface SignupProps {
	as: 'Login' | 'Signin',
}

interface InputProps {
	email: string,
	password: string,
	name?: string,
	avatar?: string
}


export const Register: React.FunctionComponent<SignupProps> = ({ as }) => {
	const [inputValue, setInputValue] = React.useState<InputProps>({
		email: '',
		password: '',
		name: '',
		avatar: ''
	})

	const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
		const { id, value } = e.currentTarget;
		setInputValue((prev) => {
			return {
				...prev,
				[id]: value
			}
		})
	}
	console.log(inputValue)
	return (
		<View className="registeration-form">
			<form className='form'>
				<h1>{'n99-todo-quest'}</h1>
				{/* <input type="file" name="image" id="avatar" /> */}
				{as === "Signin" && <input type='text' placeholder='Username' onChange={e => { handleInputChange(e) }} id="name" />}
				<input type='email' placeholder='Email' onChange={e => { handleInputChange(e) }} id='email' />
				<input type='password' placeholder='Password' onChange={e => { handleInputChange(e) }} id='password' />
				{as === "Login" && <a href={'./register'}>Don't have an account?</a>}
				<button>Submit</button>
				{as === "Signin" && <a href={'/'}>Already have an account?</a>}
			</form>
		</View>

	);
};