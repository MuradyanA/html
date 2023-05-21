import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import moment from 'moment';
import React, { useState } from 'react'
import dayOfWeek from '@/Tools/dayOfWeek';

export default function Seances(props) {
  console.log(props.seances)

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
        navbarLinks={[{ to: '/seances', name: 'All Seances', active: true }, { to: '/seances/create', name: 'Create Seances', active: false }]}
      >
        <div className='grid place-content-center text-gray-500'>
          <label className='font-semibold'>Choose the date: &nbsp; <input className='my-10 w-36' onChange={(e) => changeDate(e.target.value)} value={date} type="date" />
            {!date && <span className='pl-2 text-gray-200'>To view actual seances, please select the date</span>}
          </label>
          <button className='mb-4 m-auto border-2 border-gray-500 rounded-md w-32' onClick={(e) => changeDate(e.target.value, true)}>See All Seances</button>
          <table className='table-auto border-separate border-2 border-gray-300 '>
            <thead>
              <tr>
                <th className='p-1'>Id</th>
                <th className='p-1'>MovieName</th>
                <th className='p-1'>Weekday</th>
                <th className='p-1'>Hour</th>
                <th className='p-1'>Hall</th>
                <th className='p-1 pl-4'>CreatedAt</th>
                <th className='p-1 pl-4'>Starts</th>
              </tr>
            </thead>
            <tbody>
              {props.seances.data.map((elem) => (
                <tr key={elem.id}>
                  <td className='p-1  border-2'>{elem.id}</td>
                  <td className='p-1  border-2'>{elem.movieName}</td>
                  <td className='p-1  border-2'>{dayOfWeek(elem.weekday)}</td>
                  <td className='p-1  border-2'>{moment(elem.hour, "hh:mm:ss").format('LT')}</td>
                  <td className='p-1  border-2'>{elem.hall_id==1 ? 'Red' : 'Blue'}</td>
                  <td className='p-1 text-center border-2'>{moment(elem.created_at).format('LLL')}</td>
                  <td className='p-1 text-center border-2'>{moment(elem.starts).format('LLL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </div>
  )
}
