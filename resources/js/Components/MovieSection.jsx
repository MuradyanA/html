import React, { useState } from 'react'
import dayOfWeek from '@/Tools/dayOfWeek';
import moment from 'moment';

export default function MovieSection({ movie, halls, setSeance }) {
    const [openedDescription, setOpenedDescription] = useState(false)

    const [active, setActive] = useState(false);
    const [showSeances, setShowSeances] = useState(false);


    const handleMouseOver = () => {
        setActive(true);
    };

    const handleMouseOut = () => {
        setActive(false);
    };
    return (
        <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className='group shadow-lg shadow-neutral-400/20'>
            {active && <div
                className={active ?
                    " w-72 h-0 absolute group-hover:h-96 z-20 transition-all duration-200" :
                    "grid absolute place-content-center w-full"
                }>
                <h2 className="font-sans text-gray-200 text-2xl p-2 font-bold w-fit m-auto mt-5">Available Seances</h2>
                <hr className="w-64 ml-4 bg-gray-100 border-0 h-0.5 rounded-xl" />
                <table className='p-2 grid font-sans text-gray-200 text-lg w-full mt-5'>
                    {movie.seances.map((elem) => (
                        <React.Fragment key={elem.id}>
                            <thead>
                                <tr key={elem.id} className='grid justify-start'>
                                    <th>{dayOfWeek(elem.weekday)}</th>
                                </tr>
                                <tr key={elem.weekday}>
                                    <td><hr className="w-24 bg-gray-100 border-0 h-0.5 rounded-xl" /></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={elem.hall_id} className='grid justify-center mr-20'>
                                    <td><button onClick={() => setSeance(elem)} type='link' className='pl-5 underline  underline-offset-2 font-bold'>{moment(elem.hour, 'HH:mm:ss').format("hh:mm A")}</button></td>
                                </tr>
                            </tbody>
                        </React.Fragment>
                    ))}
                </table>
                        {/* <select>
                            {movie.seances.map((elem)=>(

                            ))}
                        </select> */}
                    
            </div>
            }
            <div className="z-10 w-72 h-fit bg-gray-600 rounded-md">
                <img className={active ? 'blur duration-200' : ''} src={movie.poster} alt="" />
                <p className={openedDescription ? "p-2 font-mono font-bold text-lg text-gray-400 leading-normal" : "p-2 font-mono font-bold text-lg text-gray-400 leading-normal whitespace-nowrap overflow-hidden text-ellipsis"}>{movie.description}</p><button onClick={(e) => setOpenedDescription(!openedDescription)} className="p-2 font-mono font-bold text-lg text-gray-400">...</button>
                <hr className="w-64 ml-4 bg-gray-700 border-0 h-0.5 rounded-xl" />
                <p className="p-2 font-mono font-bold text-lg text-gray-400 leading-normal">{movie.genre}</p>
                <hr className="w-64 ml-4 bg-gray-700 border-0 h-0.5 rounded-xl" />
                <p className="p-2 font-mono font-bold text-lg text-gray-400 leading-normal">Duration - {movie.duration}</p>
            </div>
        </div>
    )
}
