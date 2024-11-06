'use client'
import React, { useEffect, useState } from 'react';
import { Field, Button } from '../../../../../components';
import { useRouter, useParams } from 'next/navigation';
import { ConfirmPassword } from '../../../../../config/Api/login';

function Index() {
    const Route = useRouter();
    const params = useParams();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(() => {
            return {
                ...form,
                [name]: value
            }
        })

        if (name === 'confirmPassword') {
            if (value === form.password) {
                setMessage('Password match');
            } else {
                setMessage('Password not match');
            }
        }
    }

    const handleClick = async () => {
        const payload = {
            token: params.token,
            password: form.password,
            confirmPassword: form.confirmPassword
        }
        const response = await ConfirmPassword(payload)
        console.log(response);
        if (response.responseCode == 200) {
            setShow(true);
        } else {
            setShow(false);
            setMessage('Token expired');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className='flex-col container rounded-md p-8 bg-white w-[30%]'>
                {!show ? (
                    <>
                        <h1 className='text-center text-slate-950 mb-5 text-3xl font-bold'>Confirm Password</h1>
                        <p className={`text-lg font-bold ${message == 'Password match' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
                        <div className=''>
                            <Field
                                label='New Password'
                                id='password'
                                name='password'
                                placeholder='Password'
                                type='password'
                                className='!h-11'
                                onChange={handleChange}
                            />
                            <Field
                                label='Confirm Password'
                                id='confirmPassword'
                                name='confirmPassword'
                                placeholder='Confirm Password'
                                type='password'
                                className='!h-11'
                                onChange={handleChange}
                            />
                            <Button
                                onClick={handleClick}
                                className='!rounded-full w-full bg-[#5D5FEF]'
                            >
                                <p className='text-white text-sm'>Send</p>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div>
                        <h1 className={`text-center text-green-400  mb-5 text-3xl font-bold`}>Success Reset Password</h1>
                        <Button onClick={Route.push('/login')}
                            className='!rounded-full w-full bg-[#5D5FEF]'
                        >
                            <p className='text-white text-sm'>Kembali</p>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Index