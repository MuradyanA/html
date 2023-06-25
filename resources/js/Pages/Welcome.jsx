import React, { useEffect, useState } from "react";
import { animationScenario2, animateElem } from '../animate.js'
import MovieSection from '@/Components/MovieSection'
import Hall from "./Hall.jsx";
import { router, useForm } from "@inertiajs/react";
import Footer from "@/Components/Footer.jsx";
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
        name: '',
        cardNumber: '',
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
        <div className="bg-gray-800 h-full">
            <nav className="bg-[#E66353] p-2">
                <img src="/logo.png" alt="" />
            </nav>
            <div className="w-full grid grid-rows-[1fr,auto] min-h-screen bg-gray-800 py-5">
                <div className='grid justify-center'>
                    <h1 className='text-gray-300 font-bold text-5xl font-sans my-10 '>Seances</h1>
                    <div className={props.movies.length != 5 ? `grid justify-center min-w-max lg:grid-cols-2 xl:grid-cols-${props.movies.length} 2xl:grid-cols-${props.movies.length} gap-5 w-10/12` : `grid h-full justify-center min-w-max lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 w-10/12`}>
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
                                Payment Successful. Click the button below to download the tickets.
                            </h4>
                            <div>
                                <a href={`/downloadTicket`} className="bg-green-800 w-fit m-auto hover:bg-green-700 hover:border-green-700 text-center border-2  border-green-800 text-white font-bold py-2 px-4 rounded">Download Ticket</a>
                            </div>
                        </div>}
                </div>
            </div>
            <Footer />
        </div>
    );
}

