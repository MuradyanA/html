import Footer from '@/Components/Footer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { useState } from 'react';


export default function Dashboard(props) {
    let searchParam = new URLSearchParams(window.location.search).get('search')
    const [nameSearch, setNameSearch] = useState(searchParam ? searchParam : '')
    const filterPayments = debounce((keyword) => {
        router.visit(`/dashboard`,
            {
                only: ['payments'],
                method: 'get',
                data: { search: keyword },
                preserveState: true
            })
    }, 800)

    const clearSearchBar = () => {
        setNameSearch('')
        filterPayments('')
        router.visit(`/dashboard`,
            {
                only: ['payments'],
                method: 'get',
                data: { search: '' },
                preserveState: true
            })
    }

    const canclePayment = (id) => {
        router.visit(`/dashboard/${id}`,
            {
                method: 'put',
            })
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Dashboard</h2>}
        >
            <div className='grid grid-rows-[1fr,auto] min-h-screen'>
                <div className='flex-grow w-auto sm:w-full lg:w-full grid place-content-center text-gray-500'>
                    <div className='mt-[6%] grid grid-cols-2 grid-rows-2 w-80 sm:w-full'>
                        <div className='col-span-2 grid justify-center'>
                            <p className='text-2xl'>Month Income</p>
                            <div className='w-36 h-36 grid content-center text-center bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full font-bold text-black' ><p className='text-2xl text-gray-300'>
                                {Intl.NumberFormat('en-US').format(props.statistics.incomeCurrentMonth)
                                }</p></div>
                            
                        </div>
                        <div className='col-span-1 grid justify-around'>
                            <p className='text-lg'>Last Week Income</p>
                            <div className='w-36 h-36 grid content-center text-center bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full   font-bold text-black text-3xl' ><p className='text-2xl text-gray-300'>{Intl.NumberFormat('en-US').format(props.statistics.incomeLastWeek)
                            }</p></div>
                        </div>
                        <div className='col-span-1 grid justify-around'>
                            <p className='text-lg'>This Week Income</p>
                            <div className='w-36 h-36 grid content-center text-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full  font-bold text-black text-3xl' ><p className='text-2xl text-gray-300'>{Intl.NumberFormat('en-US').format(props.statistics.incomeThisWeek)
                            }</p></div>
                        </div>



                    </div>
                    <h1 className='text-gray-300 text-2xl font-bold my-10'>Payments</h1>
                    <div className='flex flex-row'>
                        <input value={nameSearch} onChange={(e) => {
                            setNameSearch(e.target.value)
                            filterPayments(e.target.value)
                        }
                        } placeholder='Type name for search' className='rounded-l-lg w-80 h-10 bg-[#0a101e] text-white border-[#0a101e]' type="text" />
                        <button onClick={() => clearSearchBar()} className='rounded-r-lg mb-10 bg-[#0a101e] border-[#2c3c5f]'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </button>
                    </div>

                    <table className='table-auto text-center'>
                        <thead className='bg-blue-100'>
                            <tr className='border-2'>
                                <th className='sm:p-3'>Id</th>
                                <th className='sm:p-3'>Seance</th>
                                <th className='sm:p-3'>Payer Name</th>
                                <th className='sm:p-3'>Amount</th>
                                <th className='sm:p-3 pl-4'>Status</th>
                                <th className='sm:p-3 pl-4'>CreatedAt</th>
                                {props.auth.user.isAdmin == 1 && <th className='p-3 pl-4'>Cancel Payment</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {props.payments.data.map((elem) => (
                                <tr className='text-gray-200 bg-[#111827]' key={elem.id}>
                                    <td className='sm:p-3  border-2'>{elem.id}</td>
                                    <td className='sm:p-3  border-2'>{moment(elem.SeanceDate + ' ' + elem.SeanceTime).format('ddd DD-MM-YY HH:mm')}</td>
                                    <td className='sm:p-3  border-2'>{elem.name}</td>
                                    <td className='sm:p-3  border-2'>{Intl.NumberFormat('en-US').format(elem.amount)}</td>
                                    <td className='sm:p-3  border-2'>{elem.status}</td>
                                    <td className='sm:p-3  border-2'>{moment(elem.created_at).format('ddd DD-MM-YY HH:mm')}</td>
                                    {props.auth.user.isAdmin == 1 && <td className='p-1 text-center border-2'><button onClick={() => canclePayment(elem.id)} className='p-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-500 rounded-full text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    </button></td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-center m-10'>
                        <Link className={!props.payments.prev_page_url ? 'mr-5 font-bold text-xl text-black p-4 border-2 border-solid border-black rounded-sm drop-shadow-2xl grad py-1  px-5' : 'mr-5 font-bold text-xl text-red-700 py-1  px-5 border-2 border-red-700 rounded-sm drop-shadow-2xl grad'} as='button' type='button' disabled={props.payments.prev_page_url == null ? true : false} href={props.payments.prev_page_url}>Prev</Link>
                        <Link className='font-bold text-xl text-green-500 py-1 px-5 border-2 border-green-500' as='button' type='button' href={props.payments.next_page_url}>Next</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
