import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import moment from 'moment';
import React, { useState } from 'react'
import dayOfWeek from '@/Tools/dayOfWeek';

export default function Seances(props) {

  const [date, setDate] = useState(props.currentDate ? props.currentDate : '')

  const changeDate = (e, all = false) => {
    let data = {}
    if (all) {
      data.all = true
    } else {
      data.date = e
      setDate(e)
    }
    router.visit(`/seances`,
      {
        only: ['seances'],
        method: 'get',
        data,
        preserveState: true
      })
  }



  return (
    <div>
      <AuthenticatedLayout
        auth={props.auth}
        errors={props.errors}
        header={<h2 className="font-semibold text-xl text-white leading-tight">Seances</h2>}
        navbarLinks={props.auth.user.isAdmin ? [{ to: '/seances', name: 'All Seances', active: true }, { to: '/seances/create', name: 'Create Seances', active: false }] : [{ to: '/seances', name: 'All Seances', active: true }]}
      >
        <div className='w-72 sm:w-32 lg:w-full grid place-content-center text-gray-500'>
          <label className='font-semibold'>Choose the date: &nbsp; <input className='my-10 w-36' onChange={(e) => changeDate(e.target.value)} value={date} type="date" />
            {!date && <span className='pl-2 text-gray-200'>To view actual seances, please select the date</span>}
          </label>
          <button className='mb-4 m-auto border-2 border-gray-400 text-gray-400 rounded-md w-40 h-10 text-xl' onClick={(e) => changeDate(e.target.value, true)}>See All Seances</button>
          <table className='table-auto text-center'>
            <thead className='bg-blue-100'>
              <tr className='border-2'>
                <th className='sm:p-3'>Id</th>
                <th className='sm:p-3'>MovieName</th>
                <th className='sm:p-3'>Weekday</th>
                <th className='sm:p-3'>Hour</th>
                <th className='sm:p-3'>Hall</th>
                <th className='sm:p-3 pl-4'>CreatedAt</th>
                <th className='sm:p-3 pl-4'>Starts</th>
              </tr>
            </thead>
            <tbody>
              {props.seances.data.map((elem) => (
                <tr className='text-gray-200 bg-[#111827] text-xl' key={elem.id}>
                  <td className='p-1 sm:p-2 lg:p-3  border-2'>{elem.id}</td>
                  <td className='p-1 sm:p-2 lg:p-3  border-2'>{elem.movieName}</td>
                  <td className='p-1 sm:p-2 lg:p-3  border-2'>{dayOfWeek(elem.weekday)}</td>
                  <td className='p-1 sm:p-2 lg:p-3  border-2'>{moment(elem.hour, "hh:mm:ss").format('LT')}</td>
                  <td className='p-1 sm:p-2 lg:p-3  border-2'>{elem.hall_id==1 ? 'Red' : 'Blue'}</td>
                  <td className='p-1 sm:p-2 lg:p-3 text-center border-2'>{moment(elem.created_at).format('LLL')}</td>
                  <td className='p-1 sm:p-2 lg:p-3 text-center border-2'>{moment(elem.starts).format('LLL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </div>
  )
}
