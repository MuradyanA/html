import { useState, useRef, useEffect } from 'react'
import 'animate.css';
import moment from 'moment';
import { useForm } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { animationScenario2, animateElem } from '../animate.js'


export default function MovieBox(props) {
    const { data, setData, post, errors, delete: destroy } = useForm({
        id: props.data.id,
        movieName: props.data.movieName,
        description: props.data.description,
        genre: props.data.genre,
        realiseDate: props.data.realiseDate,
        image: null
    })

    const [active, setActive] = useState(false);
    const [openedDescription, setOpenedDescription] = useState(false)

    const [updateMovie, setUpdateMovie] = useState(false);

    const errorWindow = useRef()


    const deleteBox = () => {
        destroy(`/movies/${data.id}`, {
            onError: (e) => props.setDeleteErrors(e)
        })
    }

    const editMovie = (e) => {
        e.preventDefault()
        console.log(data)
        post(`/movies/${data.id}`, {
            preserveScroll: true,
            onError: (e) => {
                console.log(e)
                animateElem(errorWindow, animationScenario2)
            },
            onSuccess: setUpdateMovie(false)
        })
    }

    const handleMouseOver = () => {
        setActive(true);
    };

    const handleMouseOut = () => {
        setActive(false);
    };

    return (

        <div className='grid drop-shadow-2xl mt-5 max-w-full overflow-hidden'>
            <div className='grid place-content-start max-w-xl' onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}>
                {!updateMovie && props.auth.user.isAdmin==1 && <div
                    className={active ? "bg-[#2a3c67] rounded-sm w-20 absolute group:hover h-96 transition-all translate-x-5 ease-out duration-300  grid place-content-center opacity-80 top-0 left-0  overflow-hidden" :
                        "grid place-content-center w-20 absolute translate-x-5 opacity-75 h-0 overflow-hidden bg-[#0a101e] top-0 left-0 "
                    }>
                    <button onClick={deleteBox} className='rounded-full p-5 border-2 m-14 bg-red-600'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    <button onClick={() => setUpdateMovie(true)} className='rounded-full p-5 border-2 m-14 bg-gray-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                </div>
                }
                <img src={props.data.poster} className="w-full" />
                <div className='grid bg-[#111827] p-2 w-full top-0'>
                    {updateMovie && <form className='w-full' onSubmit={editMovie}>
                        <div className='flex flex-col items-start'>
                            <input value={data.movieName} className='text-white w-full bg-[#0a101e] h-10 rounded-md border-1 border-[#2c3c5f]' onChange={e => setData('movieName', e.target.value)} type="text" /><br />
                            <input value={data.genre} className='bg-[#0a101e] text-white border-[#2c3c5f] w-full h-10 rounded-md border-1' onChange={e => setData('genre', e.target.value)} type="text" /><br />
                            <textarea value={data.description} className='bg-[#0a101e] text-white border-[#2c3c5f] w-full h-20 rounded-md border-1' onChange={e => setData('description', e.target.value)} type="text" /> <br />
                            <input value={data.realiseDate} className='bg-[#0a101e] text-white border-[#2c3c5f] w-full h-10 rounded-md border-1' onChange={e => setData('realiseDate', e.target.value)} type="date" /> <br />
                            <input className='text-white w-full h-10 rounded-md border-1' onChange={e => setData('image', e.target.files[0])} type="file" /> <br />
                        </div>
                        <div className='flex justify-around mb-2'>
                            <button className='bg-red-600 w-20 h-8 rounded text-white hover:bg-red-700 transition-colors delay-150' onClick={() => setUpdateMovie(false)}>Cancel</button>
                            <button className='bg-green-600 w-20 h-8 rounded text-white  hover:bg-green-700 transition-colors delay-150' type='submit'>Save</button> <br />
                        </div>
                        {((Object.keys(errors).length > 0) || props.deleteErrors) && <div ref={errorWindow} className='transition-all duration-300 ease opacity-0 h-0 grid place-content-center bg-red-500 mt-4 py-5 rounded-md'
                        >
                            {Object.keys(errors) && <div className='messageBox'>
                                <ul>{Object.keys(errors).map((key) => (
                                    <li className='text-white' key={key}>{errors[key]}</li>
                                ))}</ul>
                            </div>
                            }
                        </div>
                        }
                    </form>
                    }
                    {!updateMovie &&
                        <div className='bg-[#111827] drop-shadow-md'>
                            <h4 className='font-semibold text-4xl text-gray-300 mb-4 min-h-[120px]'>{data.movieName}</h4>
                            <p className='text-xl'><span className='font-bold text-gray-300'> Genre: </span> <span className='text-gray-400'>{data.genre}</span></p>
                            <p className='text-xl'> <span className='font-bold text-gray-300'> Realise Date: </span> <span className='text-gray-400'>{moment(data.realiseDate).format("MMMM, YYYY")}</span></p>
                            <hr className='my-2' />
                            <p className={openedDescription ? "text-gray-300 overflow-visible h-fit" : "text-gray-300 overflow-hidden text-ellipsis h-12"
                            }>{data.description}</p><button onClick={(e) => setOpenedDescription(!openedDescription)} className="text-gray-400">...</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
