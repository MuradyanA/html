import React, { useEffect, useState } from "react";
import { animationScenario2, animateElem } from '../animate.js'
import MovieSection from '@/Components/MovieSection'
import Hall from "./Hall.jsx";
import { router, useForm } from "@inertiajs/react";

export default function Welcome(props) {
    const [selectedSeance, setSelectedSeance] = useState(props.chosenSeance ? props.chosenSeance : '')
    const [selectedSeats, setSelectedSeats] = useState(props.chosenSeats ? props.chosenSeats : [])
    const [showSpinSeance, setShowSpinSeance] = useState(false)
    const [movies, setMovies] = useState(props.movies ? props.movies : '')
    const [halls, setHalls] = useState(props.halls ? props.halls : '')
    const [showSpinSeats, setShowSpinSeats] = useState(false)
    const [paymentForm, setPaymentForm] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [reservedSeats, setReservedSeats] = useState([])
    let price = 0
    const { data, setData, post, errors } = useForm({
        name: 'jkl;',
        cardNumber: '4444444444444444',
        amount: '',
        seance: '',
        seats: '',
    })


    const setSeance = (e) => {
        console.log(e)
        router.visit(`/setSeance`, {
            method: 'post',
            data: { seance: e },
            preserveScroll: true,
            preserveState: true,
            onSuccess: (resp) => {
                console.log('resp', resp)
                setSelectedSeance(resp.props.chosenSeance)
                setReservedSeats(resp.props.reservedSeats)
            },
            only: ['selectedSeance', 'chosenSeance', 'reservedSeats'],
        })

    }


    const setSeats = (e) => {
        router.visit(`/setSeats`, {
            method: 'post',
            data: { seats: e },
            preserveScroll: true,
            preserveState: true,
            onSuccess: (resp) => {
                setSelectedSeats(e)
                setReservedSeats(resp)
            },
            only: ['chosenSeats']
        })
    }

    const clalculateTotalPrice = () => {
        selectedSeats.map((elem) => {
            if (elem.seatType == 'parterre') {
                price = price + selectedSeance.parter_price
            }
            if (elem.seatType == 'amphitheater') {
                price = price + selectedSeance.amphitheater_price
            }
        })
        data.amount = price
        data.seance = selectedSeance
        data.seats = selectedSeats
        setPaymentForm(true)

        setTotalPrice(price)

    }


    const scroll = (targetId) => {
        const target = document.getElementById(targetId);
        const targetPosition = target.offsetTop;
        window.scrollTo(0, targetPosition)

    }


    const proccessPayment = (e) => {
        e.preventDefault()
        if (selectedSeance != '' && selectedSeats.length > 0) {
            post(`/payment`, {
                preserveScroll: true,
                preserveState: true,
                only: ['paymentId'],
                // onError: e => {'err', console.log(e)},
                onSuccess: e => {
                    // console.log(e)
                    setSelectedSeance('')
                    setSelectedSeats('')
                    setPaymentForm(false)
                    setPaymentSuccess(true)
                    setTimeout(() => {
                        scroll('successfullPayment')
                    }, 100);
                },
            })
        }
    }

    // useEffect(()=>{
    //     setMovies()
    //     setHalls(props.halls)
    // },[])

    useEffect(() => {
        if (selectedSeance != '') {
            setTimeout(() => {
                scroll('hallSection')
            }, 100);
        }
        if (paymentForm != false) {
            setTimeout(() => {
                scroll('paymentForm')
            }, 100);
        }
    }, [selectedSeance, paymentForm])



    return (
        <>
            <nav className="bg-[#E66353] p-2">
                <img src="/logo.png" alt="" />
            </nav>
            <div className="w-full h-full bg-gray-800 py-5">
                <div className='grid justify-center'>
                    <h1 className='text-gray-300 font-bold text-5xl font-sans my-10 '>Current Week</h1>
                    <div className={props.movies.length != 5 ? `grid justify-center min-w-max lg:grid-cols-2 xl:grid-cols-${props.movies.length} 2xl:grid-cols-${props.movies.length} gap-5 w-10/12` : `grid h-screen justify-center min-w-max lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 w-10/12`}>
                        {Object.values(props.movies).map((movie) => (
                            <MovieSection setSeance={setSeance} key={movie.id} movie={movie} halls={props.halls} />
                        ))}
                    </div>
                </div>
                <div id="hallSection" className="w-full h-full">
                    {selectedSeance && <Hall reservedSeats={props.reservedSeats} hall={halls.find((hall) => (hall.id == selectedSeance.hall_id))} scroll={scroll} setSeats={setSeats} selectedSeats={selectedSeats} />}
                </div>
                <div className="w-full h-full grid justify-center">
                    {selectedSeats.length > 0 && <button onClick={(e) => clalculateTotalPrice(e)} className="mt-6 mb-6 m-auto bg-blue-700 font-bold w-36 h-10 rounded-md font-sans text-gray-300 hover:bg-blue-900 duration-200">Buy Tickets</button>}
                    {paymentForm &&
                        <form onSubmit={proccessPayment} id="paymentForm" className="w-96 h-full bg-gray-700 grid justify-center rounded-md">
                            <h2 className="text-gray-400 text-3xl mt-6 font-sans font-semibold">Payment Details</h2>

                            <hr className="w-80 mt-5 m-auto bg-gray-600 border-0 h-0.5 rounded-xl" />

                            <input type="text" className="w-80 mt-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" placeholder="Card Holder" value={data.name} onChange={e => setData('name', e.target.value)} />
                            <input type="number" className="w-80 mt-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" minLength="16" placeholder="Card Number" value={data.cardNumber} onChange={e => setData('cardNumber', e.target.value)} />
                            <div className="w-80 grid grid-cols-2">
                                <label className="text-gray-300 w-full col-span-2 pt-4" htmlFor="">Expire Date</label>
                                <input type="month" className="grid-cols-1 h-full w-44 rounded-md bg-gray-300 border-2 border-gray-300" minLength="16" name="ExpireDate" />
                                <input type="number" className="grid-cols-1 w-32 h-fit ml-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" minLength="4" placeholder="CVV" />
                            </div>
                            {Object.keys(errors).length > 0 && <div className={`${Object.keys(errors).length > 0 ? 'h-auto transition-all duration-1000 ease-in-out mt-5 p-2' : 'h-0 overflow-hidden'} grid place-content-center w-full bg-red-500 mt-4 py-5 rounded-md`}
                            >
                                {Object.keys(errors) && <div className='messageBox'>
                                    <ul>{Object.keys(errors).map((key) => (
                                        <li className='text-white' key={key}>{errors[key]}</li>
                                    ))}</ul>
                                </div>
                                }
                            </div>
                            }
                            <hr className="w-80 mt-7 m-auto bg-gray-600 border-0 h-0.5 rounded-xl" />
                            <h3 className="text-gray-400 text-xl mt-6 font-sans font-medium">Total is: <span className="font-bold">{totalPrice}</span></h3>
                            <hr className="w-80 mt-7 m-auto bg-gray-600 border-0 h-0.5 rounded-xl" />
                            <button type="submit" className="mt-6 mb-6 m-auto bg-green-700 font-bold w-36 h-10 rounded-md font-sans text-gray-300 hover:bg-green-900 duration-200">Confirm</button>

                        </form>
                    }
                    {paymentSuccess &&
                        <div
                            id="successfullPayment"
                            className="bg-blue-900 m-auto h-full p-3 text-center rounded-md border-2 border-blue-900">
                            <h4
                                className="text-gray-300 mt-5 font-bold text-xl mb-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>&nbsp;
                                Payment Successfull. Click the button below to download the tickets.
                            </h4>
                            <div>
                                <a href={`/downloadTicket`} className="bg-green-800 w-fit m-auto hover:bg-green-700 hover:border-green-700 text-center border-2  border-green-800 text-white font-bold py-2 px-4 rounded">Download Ticket</a>
                            </div>
                        </div>}
                </div>
            </div>
            <footer className="bg-gray-900 h-40 p-5 min-h-full align-middle">
                <p className="text-gray-400 pb-3 text-xl">Made By: Armen Muradyan</p>
                <h2 className="text-gray-400 text-lg pb-3">Follow Us On</h2>
                <div className="grid grid-rows-1 grid-cols-4">
                <a href="https://google.com"><svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 3 C 12.861562 3 3 12.861562 3 25 C 3 36.019135 11.127533 45.138355 21.712891 46.728516 L 22.861328 46.902344 L 22.861328 29.566406 L 17.664062 29.566406 L 17.664062 26.046875 L 22.861328 26.046875 L 22.861328 21.373047 C 22.861328 18.494965 23.551973 16.599417 24.695312 15.410156 C 25.838652 14.220896 27.528004 13.621094 29.878906 13.621094 C 31.758714 13.621094 32.490022 13.734993 33.185547 13.820312 L 33.185547 16.701172 L 30.738281 16.701172 C 29.349697 16.701172 28.210449 17.475903 27.619141 18.507812 C 27.027832 19.539724 26.84375 20.771816 26.84375 22.027344 L 26.84375 26.044922 L 32.966797 26.044922 L 32.421875 29.564453 L 26.84375 29.564453 L 26.84375 46.929688 L 27.978516 46.775391 C 38.71434 45.319366 47 36.126845 47 25 C 47 12.861562 37.138438 3 25 3 z M 25 5 C 36.057562 5 45 13.942438 45 25 C 45 34.729791 38.035799 42.731796 28.84375 44.533203 L 28.84375 31.564453 L 34.136719 31.564453 L 35.298828 24.044922 L 28.84375 24.044922 L 28.84375 22.027344 C 28.84375 20.989871 29.033574 20.060293 29.353516 19.501953 C 29.673457 18.943614 29.981865 18.701172 30.738281 18.701172 L 35.185547 18.701172 L 35.185547 12.009766 L 34.318359 11.892578 C 33.718567 11.811418 32.349197 11.621094 29.878906 11.621094 C 27.175808 11.621094 24.855567 12.357448 23.253906 14.023438 C 21.652246 15.689426 20.861328 18.170128 20.861328 21.373047 L 20.861328 24.046875 L 15.664062 24.046875 L 15.664062 31.566406 L 20.861328 31.566406 L 20.861328 44.470703 C 11.816995 42.554813 5 34.624447 5 25 C 5 13.942438 13.942438 5 25 5 z" fill="#9ca3af"/></svg></a>
                    
                    <a href="https://google.com"><svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 34.21875 5.46875 C 28.238281 5.46875 23.375 10.332031 23.375 16.3125 C 23.375 16.671875 23.464844 17.023438 23.5 17.375 C 16.105469 16.667969 9.566406 13.105469 5.125 7.65625 C 4.917969 7.394531 4.597656 7.253906 4.261719 7.277344 C 3.929688 7.300781 3.632813 7.492188 3.46875 7.78125 C 2.535156 9.386719 2 11.234375 2 13.21875 C 2 15.621094 2.859375 17.820313 4.1875 19.625 C 3.929688 19.511719 3.648438 19.449219 3.40625 19.3125 C 3.097656 19.148438 2.726563 19.15625 2.425781 19.335938 C 2.125 19.515625 1.941406 19.839844 1.9375 20.1875 L 1.9375 20.3125 C 1.9375 23.996094 3.84375 27.195313 6.65625 29.15625 C 6.625 29.152344 6.59375 29.164063 6.5625 29.15625 C 6.21875 29.097656 5.871094 29.21875 5.640625 29.480469 C 5.410156 29.742188 5.335938 30.105469 5.4375 30.4375 C 6.554688 33.910156 9.40625 36.5625 12.9375 37.53125 C 10.125 39.203125 6.863281 40.1875 3.34375 40.1875 C 2.582031 40.1875 1.851563 40.148438 1.125 40.0625 C 0.65625 40 0.207031 40.273438 0.0507813 40.71875 C -0.109375 41.164063 0.0664063 41.660156 0.46875 41.90625 C 4.980469 44.800781 10.335938 46.5 16.09375 46.5 C 25.425781 46.5 32.746094 42.601563 37.65625 37.03125 C 42.566406 31.460938 45.125 24.226563 45.125 17.46875 C 45.125 17.183594 45.101563 16.90625 45.09375 16.625 C 46.925781 15.222656 48.5625 13.578125 49.84375 11.65625 C 50.097656 11.285156 50.070313 10.789063 49.777344 10.445313 C 49.488281 10.101563 49 9.996094 48.59375 10.1875 C 48.078125 10.417969 47.476563 10.441406 46.9375 10.625 C 47.648438 9.675781 48.257813 8.652344 48.625 7.5 C 48.75 7.105469 48.613281 6.671875 48.289063 6.414063 C 47.964844 6.160156 47.511719 6.128906 47.15625 6.34375 C 45.449219 7.355469 43.558594 8.066406 41.5625 8.5 C 39.625 6.6875 37.074219 5.46875 34.21875 5.46875 Z M 34.21875 7.46875 C 36.769531 7.46875 39.074219 8.558594 40.6875 10.28125 C 40.929688 10.53125 41.285156 10.636719 41.625 10.5625 C 42.929688 10.304688 44.167969 9.925781 45.375 9.4375 C 44.679688 10.375 43.820313 11.175781 42.8125 11.78125 C 42.355469 12.003906 42.140625 12.53125 42.308594 13.011719 C 42.472656 13.488281 42.972656 13.765625 43.46875 13.65625 C 44.46875 13.535156 45.359375 13.128906 46.3125 12.875 C 45.457031 13.800781 44.519531 14.636719 43.5 15.375 C 43.222656 15.578125 43.070313 15.90625 43.09375 16.25 C 43.109375 16.65625 43.125 17.058594 43.125 17.46875 C 43.125 23.71875 40.726563 30.503906 36.15625 35.6875 C 31.585938 40.871094 24.875 44.5 16.09375 44.5 C 12.105469 44.5 8.339844 43.617188 4.9375 42.0625 C 9.15625 41.738281 13.046875 40.246094 16.1875 37.78125 C 16.515625 37.519531 16.644531 37.082031 16.511719 36.683594 C 16.378906 36.285156 16.011719 36.011719 15.59375 36 C 12.296875 35.941406 9.535156 34.023438 8.0625 31.3125 C 8.117188 31.3125 8.164063 31.3125 8.21875 31.3125 C 9.207031 31.3125 10.183594 31.1875 11.09375 30.9375 C 11.53125 30.808594 11.832031 30.402344 11.816406 29.945313 C 11.800781 29.488281 11.476563 29.097656 11.03125 29 C 7.472656 28.28125 4.804688 25.382813 4.1875 21.78125 C 5.195313 22.128906 6.226563 22.402344 7.34375 22.4375 C 7.800781 22.464844 8.214844 22.179688 8.355469 21.746094 C 8.496094 21.3125 8.324219 20.835938 7.9375 20.59375 C 5.5625 19.003906 4 16.296875 4 13.21875 C 4 12.078125 4.296875 11.03125 4.6875 10.03125 C 9.6875 15.519531 16.6875 19.164063 24.59375 19.5625 C 24.90625 19.578125 25.210938 19.449219 25.414063 19.210938 C 25.617188 18.96875 25.695313 18.648438 25.625 18.34375 C 25.472656 17.695313 25.375 17.007813 25.375 16.3125 C 25.375 11.414063 29.320313 7.46875 34.21875 7.46875 Z" fill="#9ca3af" /></svg></a>
                    
                    <a href="https://google.com"><svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 20 20" version="1.1">
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-340.000000, -7439.000000)" fill="#9ca3af">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273 M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748 M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956 M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792 M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792" id="instagram-[#167]" fill="#9ca3af">

                                    </path>
                                </g>
                            </g>
                        </g>
                    </svg></a>
                </div>
            </footer>
        </>
    );
}

