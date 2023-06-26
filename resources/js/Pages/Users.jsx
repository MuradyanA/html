import moment from 'moment';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/Footer';
import { useState } from 'react';
import debounce from 'lodash.debounce';
import { Link, router } from '@inertiajs/react';


export default function Users(props) {
    console.log(props)
    let searchParam = new URLSearchParams(window.location.search).get('search')
    const [nameSearch, setNameSearch] = useState(searchParam ? searchParam : '')
    const [blockUser, setBlockUser] = useState(false)
    const [promoteToAdmin, setPromoteToAdmin] = useState(false)

    const filterPayments = debounce((keyword) => {
        router.visit(`/users`,
            {
                only: ['users'],
                method: 'get',
                data: { search: keyword },
                preserveState: true
            })
    }, 800)

    const assigneAsAdmin = (id) => {
        setPromoteToAdmin(!promoteToAdmin)
        router.visit(`/users/updateRole/${id}`,
            {
                method: 'put',
                preserveState: true
            })
    }
    
    const BlockUser = (id) => {
        setBlockUser(!blockUser)
        router.visit(`/users/${id}`,
            {
                method: 'put',
                preserveState: true
            })
    }

    const clearSearchBar = () => {
        setNameSearch('')
        filterPayments('')
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Users</h2>}
            navbarLinks={[{ to: '/users', name: 'All Users', active: true }, { to: '/users/create', name: 'Create User', active: false }]}
        >
            <div className={nameSearch ? 'w-full h-full py-5' : 'w-full h-screen py-5'}
            >
                <div className='grid justify-center'>
                    <div className='flex flex-row'>
                        <input value={nameSearch} onChange={(e) => {
                            setNameSearch(e.target.value)
                            filterPayments(e.target.value)
                        }
                        } placeholder='Type name for search' className='rounded-l-lg w-80 h-10 bg-[#0a101e] text-white border-[#0a101e] mb-10' type="text" />
                        <button onClick={() => clearSearchBar()} className='rounded-r-lg mb-10 bg-[#0a101e] border-[#2c3c5f]'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </button>
                    </div>
                    <div className={props.users.data.length != 3 ? `grid justify-center min-w-max lg:grid-cols-2 xl:grid-cols-${props.users.data.length} 2xl:grid-cols-${props.users.data.length} gap-10 w-10/12` : `grid justify-center min-w-max lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 w-10/12`}>
                        {props.users.data.map((elem) => (

                            <div key={elem.id} className='border-gray-800 w-96 h-36 bg-gray-900 rounded-md drop-shadow-2xl'>
                                <div className='my-2 ml-4 flex flex-row '>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className='pl-2'>
                                        <p className='text-gray-400 text-md'><span className='text-gray-300 text-lg'> Name:</span> {elem.name}</p>
                                        <p className='text-gray-400 text-md'><span className='text-gray-300 text-lg'> E-mail:</span> {elem.email}</p>
                                        {props.auth.user.isAdmin && elem.id != props.auth.user.id &&
                                            <button onClick={() => assigneAsAdmin(elem.id)} type="checkbox" className={'text-gray-300  w-48 my-1 h-7 border-0 rounded-sm ' + (elem.isAdmin == 0 ?
                                                'focus:border-blue-800 active:border-blue-800 w-48 h-7 bg-blue-800'  : 'focus:border-red-600 active:border-red-600 bg-red-600')} >{elem.isAdmin==0 ? 'Promote to Admin' : 'Demote from Admin'}</button>
                                        }
                                    </div>

                                    <div>

                                        {elem.id != props.auth.user.id && <button onClick={() => BlockUser(elem.id)} className={'text-gray-300  w-20 rounded-sm ' + (elem.status ? 'focus:border-red-800 active:border-red-800 bg-red-800' : 'focus:border-green-800 active:border-green-800 bg-green-800')}> {elem.status ? 'Disable' : 'Enable'}</button>}
                                        {elem.id == props.auth.user.id && <p className='text-xl pl-[60%] text-green-400 font-bold'>You</p>}
                                    </div>
                                </div>

                                <hr className='w-[90%] m-auto bg-gray-100 border-0 h-0.5 rounded-xl' />
                                <p className='text-gray-400 text-lg ml-5 p-1'><span className='text-gray-300 text-lg'> Registration Date</span> {moment(elem.created_at).format('yy-MM-DD')}</p>
                            </div>

                        ))}
                    </div>
                </div>
                <div className='flex justify-center m-10'>
                    <Link className={!props.users.prev_page_url ? 'mr-5 font-bold text-xl text-red-900 p-4 border-2 border-solid border-red-800 rounded-sm drop-shadow-2xl grad py-1  px-5' : 'mr-5 font-bold text-xl text-red-700 py-1  px-5 border-2 border-red-700 rounded-sm drop-shadow-2xl grad'} as='button' type='button' disabled={props.users.prev_page_url == null ? true : false} href={props.users.prev_page_url}>Prev</Link>
                    <Link className={props.users.next_page_url ? 'font-bold text-xl text-green-500 py-1 px-5 border-2 border-green-500' : 'font-bold text-xl text-green-900 py-1 px-5 border-2 border-green-800'} as='button' type='button' disabled={props.users.next_page_url == null ? true : false} href={props.users.next_page_url}>Next</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
