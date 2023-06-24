import { Head } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Createmovies(props) {

  const { data, setData, post, processing, errors, reset } = useForm({
    movieName: '',
    genre: '',
    duration: '',
    description: '',
    realiseDate: '',
    poster: ''
  })

  function handleUploadMovie(e) {
    e.preventDefault()
    post('/movies', {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (e) => console.log(e),
    })
  }
  return (
    <AuthenticatedLayout
      auth={props.auth}
      errors={props.errors}
      header={<h2 className="font-semibold text-xl text-white leading-tight">Create Movie</h2>}
      navbarLinks={[{to:'/movies/create', name:'Create New Movie', active:true}, {to:'/movies', name:'All Movies', active:false}]}
    >
      <form className='w-full grid place-content-center' onSubmit={handleUploadMovie}>
        <div className='w-full sm:w-full lg:w-full grid place-content-center bg-[#111827] translate-y-10 p-5 flex-col items-center drop-shadow-2xl rounded-xl'>
          <h3 className='text-3xl mb-7 m-auto text-white'>New Movie</h3>
          <hr className='mb-6' />
          <p className='text-white'>Movie Name</p>
          <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.movieName} onChange={e => setData('movieName', e.target.value)} type="text" />
          <p className='text-white'>Genre</p>
          <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.genre} onChange={e => setData('genre', e.target.value)} type="text" />
          <p className='text-white'>Movie Duration</p>
          <input className='bg-[#0a101e] text-white border-[#2c3c5f] w-96 h-10 rounded-md border-1' value={data.duration} onChange={e => setData('duration', e.target.value)} type="time" />
          <p className='text-white'>Description</p>
          <textarea className='bg-[#0a101e] text-white border-[#2c3c5f] txtArea' value={data.description} onChange={e => setData('description', e.target.value)} type="text" />
          <p className='text-white'>Realise Date</p>
          <input className='bg-[#0a101e] text-white border-[#2c3c5f] h-10 rounded-md border-1' value={data.realiseDate} onChange={e => setData('realiseDate', e.target.value)} type="date" />
          <p className='text-white mt-5'>Poster</p>
          <input className='text-white' name={data.poster} onChange={e => setData('poster', e.target.files[0])} type="file" />
          <div className='flex justify-center mt-4'>
            <button type='submit' className='text-white py-1 px-5 rounded-md bg-green-600'>Create</button>
          </div>
          {Object.keys(errors).length > 0 && <div className={`${Object.keys(errors).length>0 ? 'h-auto transition-all duration-1000 ease-in-out ': 'h-0 overflow-hidden'} grid place-content-center w-full bg-red-500 mt-4 py-5 rounded-md`} 
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
      {props.message && <div className='messageBox'>
        <p>{props.message}</p>
      </div>
      }
    </AuthenticatedLayout>
  )
}
