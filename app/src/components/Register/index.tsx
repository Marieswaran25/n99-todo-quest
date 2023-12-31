import * as React from 'react';
import './register.scss'
import { View } from '../View';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema, registerSchema } from '../../helpers/form-schema';
import { Authentication } from '../../api/authentication';
import { LocalStorage } from '../../types/localstorage';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
	as: 'Login' | 'Signin',
}

interface InputProps {
	email: string,
	password: string,
	confirmPassword?: string,
	name?: string,
	avatar?: string
}


export const Register: React.FunctionComponent<SignupProps> = ({ as }) => {
	const { createAccount, verifyAccount } = Authentication();
	const [isLoading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<InputProps>(
		{
			resolver: yupResolver(as === "Login" ? loginSchema : registerSchema)
		}
	)
	async function handleFormSubmit(data: InputProps) {
		setError("");
		const { email, password, name: username } = { ...data }
		if (as === "Login") {
			setLoading(true)
			const res = await verifyAccount({ email, password, username })
			if (res && res.success) {
				setLoading(false)
				localStorage.setItem(LocalStorage.ACCESS_TOKEN, res.accesstoken);
				reset();
				navigate('/chat');
			}
			else {
				if (res.message) {
					setError(res.message)
				}
			}
		}
		else {
			setLoading(true);
			const res = await createAccount({ email, password, username })
			if (res && res.accesstoken) {
				setLoading(false)
				localStorage.setItem(LocalStorage.ACCESS_TOKEN, res.accesstoken);
				reset();
				navigate('/')
			}
			else {
				if (res.message) {
					setError(res.message)
				}
			}
		}
		setLoading(false)
	}
	return (
		<View className="registeration-form">
			<form className='form' onSubmit={handleSubmit(handleFormSubmit)}>
				<h1>{'n99-todo-quest'}</h1>
				{as === "Signin" &&
					<div>
						<input type='text' placeholder='Username' {...register("name")} id="name" />
						{errors.name && <small>{errors.name.message}</small>}
					</div>
				}
				<div>
					<input type='email' placeholder='Email' id='email' {...register("email")} />
					{errors.email && <small>{errors.email.message}</small>}
				</div>
				<div>
					<input type='password' placeholder='Password'{...register("password")} id='password' />
					{errors.password && <small>{errors.password.message}</small>}
				</div>
				{
					as === "Signin" && <div>
						<input type='password' placeholder='Confirm Password'{...register("confirmPassword")} id='confirmPassword' />
						{errors.confirmPassword && <small>{errors.confirmPassword.message}</small>}
					</div>
				}
				{error && <small>{error}</small>}
				{as === "Login" && <a href={'./register'}>Don't have an account?</a>}
				<button>
					{isLoading ?
						<div className="loader"></div> : <>Submit</>
					}
				</button>
				{as === "Signin" && <a href={'/'}>Already have an account?</a>}
			</form>
		</View>

	);
};
