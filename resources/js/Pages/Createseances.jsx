import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react'
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react'

export default function Createseances(props) {

  // const movieSearch = useForm({
  //   movieSearch:''
  // })
  const [movieSearch, setMovieSearch] = useState('')
  const { data, setData, post, get, processing, errors, reset } = useForm({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    hour: '',
    movie_id: '',
    hall_id: '',
    starts: '',
    ends: '',
    parter_price: 0.0,
    amphitheater_price: 0.0
  })

  function handleCreateSeance(e) {
    e.preventDefault()
    post('/seances', {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (e) => console.log(e),
    })
  }

  function setMovieId(e) {
    setData('movie_id'.split(' ')[0])
  }

  const loadMovies = debounce((keyword) => {

    router.visit(`/seances/create`,
      {
        only: ['movies'],
        method: 'get',
        data: { search: keyword },
        onError: (e) => console.log(e),
        preserveState: true
      })
  }, 800)


  return (
    <div>
      <AuthenticatedLayout
        auth={props.auth}
        errors={props.errors}
        header={<h2 className="font-semibold text-xl text-white leading-tight">Create Seance</h2>}
        navbarLinks={[{ to: '/seances', name: 'All Seances', active: false }, { to: '/seances/create', name: 'Create Seances', active: true }]}
      >
        <form className='grid place-content-center w-64 sm:w-32 lg:w-full mb-20' onSubmit={handleCreateSeance}>
          <div className='w-96 grid place-content-center bg-[#111827] translate-y-10 p-5 flex-col items-center drop-shadow-2xl rounded-xl'>
            <h3 className='text-3xl m-auto text-white mb-7'>New Seance</h3>
            <hr className='mb-6' />
            <p className='text-white'>Week Day</p>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.sunday} type="checkbox" onChange={() => setData('sunday', !data.sunday)} />&nbsp;Sunday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.monday} type="checkbox" onChange={() => setData('monday', !data.monday)} />&nbsp;Monday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.tuesday} type="checkbox" onChange={() => setData('tuesday', !data.tuesday)} />&nbsp;Tuesday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.wednesday} type="checkbox" onChange={() => setData('wednesday', !data.wednesday)} />&nbsp;Wednesday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.thursday} type="checkbox" onChange={() => setData('thursday', !data.thursday)} />&nbsp;Thursday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.friday} type="checkbox" onChange={() => setData('friday', !data.friday)} />&nbsp;Friday</label>
            <label className='text-gray-400 border-[#2c3c5f] font-bold'><input value={data.saturday} type="checkbox" onChange={() => setData('saturday', !data.saturday)} />&nbsp;Saturday</label>
            <p className='text-white'>Hour</p>
            <input className='w-80 h-10 rounded-md border-1 bg-[#0a101e] text-white border-[#2c3c5f]' value={data.hour} onChange={e => setData('hour', e.target.value)} type="time" />
            <p className='text-white'>Movie</p>
            <input value={movieSearch} onChange={(e) => {
              setMovieSearch(e.target.value)
              loadMovies(e.target.value)
            }
            } type="text" className='w-80 h-10 rounded-md border-1 bg-[#0a101e] text-white border-[#2c3c5f]' placeholder='Type to search the movie...' />

            <div onChange={(e) => setData('movie_id', e.target.attributes.dataid.value)}>
              {props.movies.map((elem) => (
                <div key={elem.id}>
                  <input  dataid={elem.id} name="movies w-full" type='radio' key={elem.id} value={elem.name} />
                  <label className='mt-3 w-auto text-gray-400' htmlFor="movies">{` ${elem.movieName}`}</label>
                </div>
              ))}
            </div>
            <p className='text-white'>Starts</p>
            <input className='w-80 h-10 rounded-md border-1 bg-[#0a101e] text-white border-[#2c3c5f]' value={data.starts} onChange={e => setData('starts', e.target.value)} type="date" />
            <p className='text-white'>Ends</p>
            <input className='w-80 h-10 rounded-md border-1 bg-[#0a101e] text-white border-[#2c3c5f]' value={data.ends} onChange={e => setData('ends', e.target.value)} type="date" />
            <p className='text-white'>Halls</p>
            <label className='text-gray-400 font-bold'><input value={1} type="radio" onChange={() => setData('hall_id', 1)} />&nbsp;Red</label>
            <label className='text-gray-400 font-bold'><input value={2} type="radio" onChange={() => setData('hall_id', 2)} />&nbsp;Blue</label>
            <p className='text-white'>Parterre Price</p>
            <input className='bg-[#0a101e] text-white border-[#2c3c5f] w-80 h-10 rounded-md border-1' value={data.parter_price} onChange={e => setData('parter_price', e.target.value)} type="number" min="0.00" max="1000000.00" />
            <p className='text-white'>Amphitheater Price</p>
            <input className='bg-[#0a101e] text-white border-[#2c3c5f] w-80 h-10 rounded-md border-1' value={data.amphitheater_price} onChange={e => setData('amphitheater_price', e.target.value)} type="number" min="0.00" max="1000000.00" />
            <div className='flex justify-center mt-4'>
              <button type='submit' className='text-white py-1 px-5 rounded-md bg-green-600'>Create</button>
            </div>
            {Object.keys(errors).length > 0 && <div className={`${Object.keys(errors).length > 0 ? 'h-auto transition-all duration-1000 ease-in-out p-3' : 'h-0 overflow-hidden'} grid place-content-center w-full bg-red-500 mt-4 py-5 rounded-md`}
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
      </AuthenticatedLayout>
    </div>
  )
}
