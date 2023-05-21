import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import moment from 'moment';


export default function Dashboard(props) {
    console.log(props)
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Dashboard</h2>}
        >
            <div className='grid place-content-center text-gray-500'>
                    <h1 className='text-gray-300 text-2xl font-bold my-10'>Payments</h1>
                <table className='table-auto border-separate border-2 border-gray-300 '>
                    <thead className='bg-blue-200'>
                        <tr>
                            <th className='p-1'>Seance</th>
                            <th className='p-1'>Payer Name</th>
                            <th className='p-1'>Amount</th>
                            <th className='p-1 pl-4'>Status</th>
                            <th className='p-1 pl-4'>CreatedAt</th>
                            <th className='p-1 pl-4'>Cancel Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.payments.data.map((elem) => (
                            <tr key={elem.id}>
                                <td className='p-1  border-2'>{moment(elem.SeanceDate + ' ' + elem.SeanceTime).format('ddd DD-MM-YY HH:mm')}</td>
                                <td className='p-1  border-2'>{elem.name}</td>
                                <td className='p-1  border-2'>{Intl.NumberFormat('en-US').format(elem.amount)}</td>
                                <td className='p-1  border-2'>{elem.status}</td>
                                <td className='p-1  border-2'>{moment(elem.created_at).format('ddd DD-MM-YY HH:mm')}</td>
                                <td className='p-1 text-center border-2'><button className='p-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-500 rounded-full text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
