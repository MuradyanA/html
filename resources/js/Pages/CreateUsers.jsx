import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import React from 'react'

export default function CreateUsers(props) {
    // console.log(props)
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Users</h2>}
            navbarLinks={[{ to: '/users', name: 'All Users', active: false }, { to: '/users/create', name: 'Create Users', active: true }]}
        >
            <div>
                <form className='grid place-content-center w-full' onSubmit={submit}>
                    <div className=' grid place-content-center bg-[#111827] translate-y-10 p-5 flex-col items-center drop-shadow-2xl rounded-xl'>
                        <h3 className='text-3xl mb-7 m-auto text-white'>Register New User</h3>
                        <hr className='mb-6' />
                        <p className='text-white'>Name</p>
                        <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.name} onChange={e => setData('name', e.target.value)} type="text" />
                        <p className='text-white'>Email</p>
                        <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.email} onChange={e => setData('email', e.target.value)} type="email" />
                        <p className='text-white mt-5'>Password</p>
                        <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.password} onChange={e => setData('password', e.target.value)} type="password" />
                        <p className='text-white mt-5'>Confirm Password</p>
                        <input className='bg-[#0a101e] text-white border-[#2c3c5f] w-96 h-10 rounded-md border-1' value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} type="password" />
                        <div className='flex justify-center mt-6'>
                            <button type='submit' className='text-white py-1 px-5 rounded-md bg-green-600'>Create</button>
                        </div>
                        {Object.keys(errors).length > 0 && <div className={`${Object.keys(errors).length > 0 ? 'h-auto transition-all duration-1000 ease-in-out ' : 'h-0 overflow-hidden'} grid place-content-center w-full bg-red-500 mt-4 py-5 rounded-md`}
                        >
                            {Object.keys(errors) && <div className='messageBox'>
                                <ul>{Object.keys(errors).map((key) => (
                                    <li className='text-white' key={key}>{errors[key]}</li>
                                ))}</ul>
                            </div>
                            }
                        </div>
                        }
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}
