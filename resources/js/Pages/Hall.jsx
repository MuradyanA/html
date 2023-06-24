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
        if (reservedSeats.includes(elem.seat)) {
            return 'rounded-md p-1 m-1 mx-auto p-0 opacity-25'
        }
        if (element) {
            return 'rounded-md p-1 m-1 mx-auto p-0 bg-[#0AF025]'
        } else {
            return 'rounded-md p-1 m-1 mx-auto p-0'
        }
    }


    return (
        <div className='w-full my-14 '>
            <h2 className='text-5xl text-center text-white'>{hall.name} Hall</h2>
            <div className={(hall.id == 2 ? " border-[#0949E6]" : "border-[#F50048]") + ' flex justify-center lg:w-[40%] md:w-[75%] w-[85%] xl:w-[40%] overflow m-auto mt-5'}><svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                // width="294.101" //882.303
                // height="31.166" //93.499
                version="1.1"
                className='w-full xl:w-[100%]'
                viewBox="0 0 154.068 14.155"
            >
                <defs>
                    <linearGradient id="linearGradient1676">
                        <stop offset="0" stopColor="#9c9c9c" stopOpacity="1"></stop>
                        <stop offset="1" stopColor="#767676" stopOpacity="0"></stop>
                    </linearGradient>
                    <radialGradient
                        id="radialGradient1680"
                        cx="398.984"
                        cy="105.424"
                        r="290.353"
                        fx="398.984"
                        fy="105.424"
                        gradientTransform="matrix(1 0 0 .08826 0 96.12)"
                        gradientUnits="userSpaceOnUse"
                        xlinkHref="#linearGradient1676"
                    ></radialGradient>
                </defs>
                <g transform="translate(-28.53 -20.902)">
                    <path
                        fill="#999"
                        fillOpacity="0"
                        stroke="#000"
                        strokeWidth="0.265"
                        d="M28.565 20.936V34.95h.006a80.812 17.917 0 0176.905-12.416 80.812 17.917 0 0176.909 12.416h.18V20.936z"
                    ></path>
                    <path
                        fill="url(#radialGradient1680)"
                        fillOpacity="1"
                        stroke={hall.id==2 ? '#0949E6' : "#F50048"}
                        strokeDasharray="none"
                        strokeOpacity="1"
                        strokeWidth="2.268"
                        d="M108.967 80.133v50.308l2.558-1.615c30.834-19.464 108.667-35.692 199.616-41.617 55.74-3.631 119.293-3.63 175.015.002 91.018 5.932 168.761 22.137 199.604 41.607 1.4.884 2.7 1.606 2.892 1.606.192 0 .35-11.316.35-25.147V80.133H398.984z"
                        transform="scale(.26458)"
                    ></path>
                    <path
                        fill="none"
                        fillOpacity="1"
                        stroke="none"
                        strokeWidth="0.671"
                        d="M109.637 105.02V80.803H688.33v24.14c0 13.277-.124 24.14-.276 24.14-.152 0-2.39-1.219-4.975-2.709-31.533-18.18-105.968-33.428-192.9-39.515-25.567-1.79-37.133-2.157-78.79-2.498-68.167-.556-113.169 1.766-165.903 8.561-62.055 7.997-113.012 21.398-134.341 35.33l-1.51.985z"
                        transform="scale(.26458)"
                    ></path>
                </g>
            </svg></div>
            <div className={(hall.id == 2 ? " border-[#0949E6]" : "border-[#F50048]") + ' w-[85%] lg:w-1/3 md:w-2/3 h-1/3 border-2 border-x-4 m-auto mt-28 grid grid-cols-10 py-2'}>
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
            <div className={(hall.id == 2 ? " border-[#0949E6] " : "border-[#F50048]") + ' w-[85%] lg:w-1/3 md:w-2/3 h-32 border-2 border-x-4 m-auto mt-1 grid grid-cols-10 py-4'}>
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
