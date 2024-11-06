'use client';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { Button, Field } from '../../../components';
import useLocalStorage from '../../../utils/HookLocalStorage';
import { Login } from '../../../config/Api/login';
import { useRouter } from 'next/navigation';
import { ShowLoading, SwalClose } from '../../../utils/loading';
import { signIn } from "next-auth/react";

export default function Index() {
    const Route = useRouter();
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const [rememberUser, setRememberUser] = useLocalStorage('username')
    const [rememberPassword, setRememberPassword] = useLocalStorage('password')
    const [errMessage, setErrMessage] = useState('')
    const [remember, setRemember] = useState(false)
    const onChecked = (e) => {
        const { checked } = e.target
        if (!checked) {
            setRememberUser("")
            setRememberPassword("")
        } else {
            setRememberUser(form.username)
            setRememberPassword(form.password)
        }
        setRemember(checked)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (remember) {
            if (name == 'username') {
                setRememberUser(value)
            } else {
                setRememberPassword(value)
            }
        }
        setForm(() => {
            return {
                ...form,
                [name]: value
            }
        })
    }

    const handleClick = async (e) => {
        e?.preventDefault();
        ShowLoading()
        const response = await signIn('credentials', {
            redirect: false,
            username: form.username,
            password: form.password,
            callbackUrl: '/main/dashboard'
        });

        console.log(response);

        if (response.status == 200) {
            Route.push('/main/dashboard');
        } else if (response == 400) {
            setErrMessage('password wrong')
        } else if (response == 404) {
            setErrMessage('User Not Found')
        } else {
            setErrMessage('Check Your Input')
        }
        SwalClose()
    }

    const handleKeypress = (event) => {
        if (event.key === "Enter" && event.shiftKey === false) {
            handleClick()
        }
    }

    const rememberMe = useMemo(() => {
        if (rememberUser) {
            setRemember(true)
            setForm({
                username: rememberUser,
                password: rememberPassword
            })
            return true
        }
    }, [remember, rememberUser, rememberPassword])



    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('token');
        if (token) {
            return Route.push('/main/dashboard')
        }
    }

    return (
        <div className='!bg-white min-h-screen w-full p-6 flex gap-8 xl:justify-around xl:flex-row flex-col'>
            <div className='w-full xl:w-1/2'>
                <img src="/image/login-img.png" alt="" className='flex-1 flex flex-col justify-center' />
            </div>
            <div className='flex flex-col justify-center flex-1'>
                <h1 className='font-bold text-3xl'>Sign In</h1>
                <p className='text-gray-400 text-sm mb-6'>Please login to your account.</p>
                <hr className='w-full' />
                {errMessage && (
                    <div className='bg-red-500 py-3 bg-opacity-20 flex justify-center rounded-lg'>
                        <h1 className='text-red-500 font-medium'>{errMessage}</h1>
                    </div>
                )}
                <form className='my-5' onSubmit={handleClick} method='POST'>
                    <Field
                        label='Username'
                        id='username'
                        name='username'
                        require="required"
                        value={form.username}
                        placeholder='username'
                        className='h-12'
                        onChange={handleChange}
                        onKeyPress={handleKeypress}
                    />
                    <Field
                        label='Password'
                        id='password'
                        name='password'
                        require="required"
                        value={form.password}
                        placeholder='password'
                        type='password'
                        className='h-12'
                        onChange={handleChange}
                        onKeyPress={handleKeypress}
                    />
                    <div className='flex justify-between'>
                        <div className="flex items-center">
                            <input onChange={onChecked} checked={rememberMe} id="remember" type="checkbox" value="" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label className="ml-2 text-sm font-medium text-black dark:text-gray-300">Remember Me</label>
                        </div>
                        <div className='my-4'>
                            <a href='/auth/login/forgot-password' className='text-blue-800'>
                                Forgot Your Password?
                            </a>
                        </div>
                    </div>
                    <div className='w-full my-6'>
                        <Button
                            // onClick={handleClick}
                            title="Login"
                            className='bg-[#5D5FEF] w-full h-12 !rounded-full text-white'
                        >
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

