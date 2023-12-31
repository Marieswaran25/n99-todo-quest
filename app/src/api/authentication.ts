import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config'

interface User {
    email: string,
    password: string,
    username?: string
}
interface AuthResponse {
    username: string
    email: string
    avatar: string | null
    accesstoken: string
}
interface VerifyAuthResponse {
    success: boolean,
    accesstoken: string
}

export function Authentication() {
    return {
        createAccount: async function (user: User) {
            try {
                const response: AxiosResponse<AuthResponse> = await axios.post(API_BASE_URL.concat('authentication'), { ...user })
                return response.data
            } catch (error: any) {
                return error.response.data
            }
        },
        verifyAccount: async function (user: User) {
            try {
                const response: AxiosResponse<VerifyAuthResponse> = await axios.post(API_BASE_URL.concat('authentication/validate'), { ...user })
                return response.data
            } catch (error: any) {
                return error.response.data
            }
        }
    }
}