'use client'
import { Field, Button } from '../../../../components';
import React, { useState } from 'react';
import { ForgotPassword, Login } from '../../../../config/Api/login';
import { useRouter } from 'next/navigation';


function Index() {
    const Route = useRouter();
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleClick = async () => {
        const response = await ForgotPassword(email);
        if (response.responseCode === 200) {
            setMessage('Email Berhasil Dikirim');
            setUrl('/login');
            setShow(true);
        } else if (response == 400) {
            setMessage('Email Tidak terdaftar');
            setShow(true);
        }
    }

    const clickReturn = () => {
        Route.push(url);
        if (message == 'Email Tidak terdaftar') {
            setShow(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className='flex-col container rounded-md p-8 bg-white w-[30%]'>
                {!show ? (
                    <div>
                        <h1 className='text-center text-slate-950 mb-5 text-3xl font-bold'>Forgot Password</h1>
                        <Field
                            label='Email'
                            id='email'
                            name='email'
                            placeholder='Email'
                            type='email'
                            className='!h-11'
                            onChange={handleChange}
                        />
                        <Button
                            onClick={handleClick}
                            className='!rounded-full w-full bg-[#5D5FEF]'
                        >
                            <p className='text-white text-sm'>Kirim email</p>
                        </Button>
                    </div>
                ) : (
                    <div>
                        <h1 className={`text-center ${message === 'Email Tidak terdaftar' ? 'text-red-500' : 'text-green-400'}  mb-5 text-3xl font-bold`}>{message}</h1>
                        <Button
                            onClick={clickReturn} // Menyembunyikan pesan sukses
                            className='!rounded-full w-full bg-[#5D5FEF]'
                        >
                            <p className='text-white text-sm'>Kembali</p>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Index;
