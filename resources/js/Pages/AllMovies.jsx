import { Head } from '@inertiajs/react'
import './AllMovies.css'
import { Link } from '@inertiajs/react'
import MovieBox from '@/Components/MovieBox'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef, useState } from 'react';


export default function AllMovies({ auth, data, next_page_url, prev_page_url, errors }) {
  const [deleteErrors, setDeleteErrors] = useState(null)
  const errorWindow = useRef()
  useEffect(() => {
    if (deleteErrors) {
      setTimeout(() => {
        errorWindow.current.classList.remove('opacity-100')
        errorWindow.current.classList.add('opacity-0')
      }, 1500);
      setTimeout(() => {
        setDeleteErrors(null)
      }, 2500);
    }
  }, [deleteErrors])
  return (
    <AuthenticatedLayout
      auth={auth}
      errors={errors}
      header={<h2 className="font-semibold text-xl text-white leading-tight">Movies</h2>}
      navbarLinks={auth.user.isAdmin ? [{ to: '/movies/create', name: 'Create New Movie', active: false }, { to: '/movies', name: 'All Movies', active: true }] : [{ to: '/movies', name: 'All Movies', active: true }]}
    >
      <Head title="All Movies" />

      {deleteErrors && <div ref={errorWindow} className='m-auto drop-shadow-3xl rounded-md bg-red-700 h-20 w-fit p-5 mt-5 transition-opacity opacity-100 delay-150 duration-1000'><p className='text-white text-2xl'>{deleteErrors.id}</p></div>}
      <div className='flex justify-center p-5'>
        <div className='grid gap-5 lg:grid-cols-4 md:grid-cols-2 md:grid-rows-2 justify-items-center'>
          {data && data.map((elem) => (
            <MovieBox auth={auth} setDeleteErrors={setDeleteErrors} key={elem.id} data={elem} errors={errors} />
          ))}
        </div>
      </div>
      <div className='flex justify-center m-10'>
        <Link className={!prev_page_url ? 'mr-5 font-bold text-xl text-black p-4 border-2 border-solid border-black rounded-sm drop-shadow-2xl grad py-1  px-5' : 'mr-5 font-bold text-xl text-red-700 py-1  px-5 border-2 border-red-700 rounded-sm drop-shadow-2xl grad'} as='button' type='button' disabled={prev_page_url == null ? true : false} href={prev_page_url}>Prev</Link>
        <Link className='font-bold text-xl text-green-500 py-1 px-5 border-2 border-green-500' as='button' type='button' href={next_page_url}>Next</Link>
      </div>
    </AuthenticatedLayout>
  )
}
