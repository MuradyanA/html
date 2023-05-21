import React, { useEffect, useState } from 'react'


export default function Hall({ hall, auth, errors, scroll, setSeats, selectedSeats, reservedSeats }) {

    const removeItem = function (id) {
        setSeats(selectedSeats.filter((elem) => (
            elem.id != id
        )))
    }

    const toggleSeat = function (elem, event) {
        
        let checkSelectedSeat = selectedSeats.filter((e) => (
            elem.seat == e.seat
        ))
        console.log('gdf', elem)
        if (checkSelectedSeat.length == 0) {
            setSeats([...selectedSeats, elem])
        } else {
            removeItem(elem.id)
        }
    }

    useEffect(() => {
        scroll('selectedSeats')
    }, [selectedSeats])

    const getButtonClass = (elem) => {

        const element = selectedSeats.find((e) => (
            elem.id == e.id
        ))
        if(reservedSeats.includes(elem.seat)){
            return 'rounded-md p-1 m-1 mx-auto p-0 opacity-25'
        }
        if (element) {
            return 'rounded-md p-1 m-1 mx-auto p-0 bg-[#0AF025]'
        } else {
            return 'rounded-md p-1 m-1 mx-auto p-0'
        }
    }


    return (
        <div className='w-full'>
            <h2 className='text-5xl text-center text-white'>{hall.name} Hall</h2>
            <div className={hall.id == 2 ? "w-1/3 h-12 bg-gray-300 m-auto mt-5 border-2 border-y-4 border-[#0949E6] drop-shadow-2xl" : "w-1/3 h-12 bg-gray-300 m-auto mt-5 border-2 border-y-4 border-[#F50048] drop-shadow-2xl"}></div>
            <div className={hall.id == 2 ? "w-1/3 h-1/3 border-2 border-x-4 m-auto mt-6 border-[#0949E6] grid grid-cols-10 py-2" : "w-1/3 h-1/3 border-2 border-x-4 m-auto mt-6 border-[#F50048] grid grid-cols-10 py-2"}>
                {hall.seats.filter((elem) => (
                    elem.seatType == 'parterre'
                )).map((elem) => (
                    <button key={elem.id} onClick={(e) => toggleSeat(elem, e)}
                        className={getButtonClass(elem)}
                        disabled={reservedSeats.includes(elem.seat)}

                        title={`Parterre, Seat number:${elem.seat}`}>
                        <svg className='opacity-70' width="8.2806mm" height="7.5567mm" version="1.1" viewBox="0 0 8.2806 7.5567" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(-77.273 -101.39)">
                                <g transform="translate(10.445,90.22)" stroke="#999">
                                    <g transform="translate(-16.476,16.25)">
                                        <g fill="#ececec" strokeWidth=".17292">
                                            <rect transform="scale(-1,1)" x="-90.875" y=".08646" width="6.4358" height="1.5142" />
                                            <ellipse transform="scale(-1,1)" cx="-90.511" cy=".94844" rx=".7897" ry=".86198" />
                                            <ellipse transform="scale(-1,1)" cx="-84.572" cy=".94844" rx=".7897" ry=".86198" />
                                        </g>
                                        <ellipse transform="scale(-1,1)" cx="-87.569" cy="1.5054" rx="3.4206" ry=".91895" fill="#ccc" strokeWidth=".11458" />
                                    </g>
                                    <path d="m67.569 15.762c0-1.2402-1.5885-4.199 3.4522-4.2561 4.9091-0.05559 3.363 3.0159 3.363 4.2561-1e-6 1.2402-1.5805 1.4591-3.4624 1.4591s-3.3527-0.21884-3.3527-1.4591z" fill="#ececec" strokeWidth=".17292" />
                                    <path d="m73.231 13.052c0 1.6576 0.36181 4.1908 0.87782 4.1908s0.93462-2.5565 0.93462-4.2141-0.41861-1.7887-0.93462-1.7887-0.87782 0.1544-0.87782 1.812z" fill="#ccc" strokeWidth=".13018" />
                                    <path d="m66.893 13.052c0 1.6576 0.36181 4.1908 0.87782 4.1908s0.93462-2.5565 0.93462-4.2141-0.41861-1.7887-0.93462-1.7887-0.87782 0.1544-0.87782 1.812z" fill="#ccc" strokeWidth=".13018" />
                                </g>
                            </g>
                        </svg>
                    </button>
                ))}
            </div>
            <div className={hall.id == 2 ? "w-1/3 h-32 border-2 border-x-4 m-auto mt-1 border-[#0949E6] grid grid-cols-10 py-4" : "w-1/3 h-32 border-2 border-x-4 m-auto mt-1 border-[#F50048] grid grid-cols-10 py-4"}>
                {hall.seats.filter((elem) => (
                    elem.seatType == 'amphitheater'
                )).map((elem) => (
                    <button key={elem.id} onClick={(e) => toggleSeat(elem, e)} className={getButtonClass(elem)} title={`Amphitheater, Seat number:${elem.seat}`}>
                        <svg className='opacity-70' width="8.2806mm" height="7.5567mm" version="1.1" viewBox="0 0 8.2806 7.5567" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(-77.273 -101.39)">
                                <g transform="translate(10.445,90.22)" stroke="#999">
                                    <g transform="translate(-16.476,16.25)">
                                        <g fill="#ececec" strokeWidth=".17292">
                                            <rect transform="scale(-1,1)" x="-90.875" y=".08646" width="6.4358" height="1.5142" />
                                            <ellipse transform="scale(-1,1)" cx="-90.511" cy=".94844" rx=".7897" ry=".86198" />
                                            <ellipse transform="scale(-1,1)" cx="-84.572" cy=".94844" rx=".7897" ry=".86198" />
                                        </g>
                                        <ellipse transform="scale(-1,1)" cx="-87.569" cy="1.5054" rx="3.4206" ry=".91895" fill="#ccc" strokeWidth=".11458" />
                                    </g>
                                    <path d="m67.569 15.762c0-1.2402-1.5885-4.199 3.4522-4.2561 4.9091-0.05559 3.363 3.0159 3.363 4.2561-1e-6 1.2402-1.5805 1.4591-3.4624 1.4591s-3.3527-0.21884-3.3527-1.4591z" fill="#ececec" strokeWidth=".17292" />
                                    <path d="m73.231 13.052c0 1.6576 0.36181 4.1908 0.87782 4.1908s0.93462-2.5565 0.93462-4.2141-0.41861-1.7887-0.93462-1.7887-0.87782 0.1544-0.87782 1.812z" fill="#ccc" strokeWidth=".13018" />
                                    <path d="m66.893 13.052c0 1.6576 0.36181 4.1908 0.87782 4.1908s0.93462-2.5565 0.93462-4.2141-0.41861-1.7887-0.93462-1.7887-0.87782 0.1544-0.87782 1.812z" fill="#ccc" strokeWidth=".13018" />
                                </g>
                            </g>
                        </svg>
                    </button>

                ))}
            </div>
            <div>
            </div>
            <div className='grid place-content-center'>
            {selectedSeats.length > 0 && <h3 className='text-3xl py-5 text-white text-center'>Selected Seats</h3>}
                <div className='w-full place-content-center grid grid-cols-2' id='selectedSeats'>
                    {selectedSeats.length > 0 && selectedSeats.map((elem) => (
                        <div className='w-96' key={elem.id}>

                            <button onClick={(e) => removeItem(elem.id)} title='Remove Item' className='m-2 text-gray-100'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </button>
                            <span className='font-bold text-gray-400'> Seat Type:</span><span className='text-gray-300'> {elem.seatType}, </span>
                            <span className='font-bold text-gray-400'>Seat Number:</span><span className='text-gray-300'> {elem.seat}</span>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
