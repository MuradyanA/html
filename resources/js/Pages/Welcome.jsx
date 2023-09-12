import React, { useEffect, useState } from "react";
import { animationScenario2, animateElem } from '../animate.js'
import MovieSection from '@/Components/MovieSection'
import TextInput from '@/Components/TextInput';
import Hall from "./Hall.jsx";
import { router, useForm } from "@inertiajs/react";
import Footer from "@/Components/Footer.jsx";
export default function Welcome(props) {
    const [selectedSeance, setSelectedSeance] = useState(props.chosenSeance ? props.chosenSeance : '')
    const [selectedSeats, setSelectedSeats] = useState(props.chosenSeats ? props.chosenSeats : [])
    const [showSpinSeance, setShowSpinSeance] = useState(false)
    const [showOnlineChat, setShowOnlineChat] = useState(false)
    const [movies, setMovies] = useState(props.movies ? props.movies : '')
    const [halls, setHalls] = useState(props.halls ? props.halls : '')
    const [showSpinSeats, setShowSpinSeats] = useState(false)
    const [paymentForm, setPaymentForm] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [reservedSeats, setReservedSeats] = useState([])
    const [downloadStarted, setDownloadStarted] = useState(false)
    const [participantName, setParticipantName] = useState('')
    const [participantEmail, setParticipantEmail] = useState('')
    const [participantPhoneNumber, setParticipantPhoneNumber] = useState('')
    const [participantsErrors, setParticipantsErrors] = useState({})
    const [showChatWindow, setShowChatWindow] = useState(false)
    const [messages, setMessages] = useState([])
    let price = 0
    const { data, setData, post, errors } = useForm({
        name: '',
        cardNumber: '',
        amount: '',
        seance: '',
        seats: '',
    })

    const messageForm = useForm({
        message: ''
    })


    const setSeance = (e) => {
        router.visit(`/setSeance`, {
            method: 'post',
            data: { seance: e },
            preserveScroll: true,
            preserveState: true,
            onSuccess: (resp) => {
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

    const sendParticipantData = () => {
        router.visit(`/onlineChat`, {
            method: 'post',
            data: { name: participantName, email: participantEmail, phoneNumber: participantPhoneNumber },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowChatWindow(true)
                setShowOnlineChat(false)
            },
            onError: (e) => {
                setParticipantsErrors(e)
            },
        })
    }

    const sendMessage = (e) => {
        if (messageForm.data.message.trim()) {
            e.preventDefault()
            messageForm.post('/message', {
                onSuccess: () => {
                    e.preventDefault()
                    messages.push(messageForm.data.message)
                },
            })
        }
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
                onSuccess: e => {
                    setSelectedSeance('')
                    setSelectedSeats([])
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
            <div className="w-full grid grid-rows-[1fr,auto] min-h-screen bg-gray-800 my-16">
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
                        <form onSubmit={proccessPayment} id="paymentForm" className="w-96 h-full bg-gray-700 grid justify-items-center rounded-md">
                            <h2 className="text-gray-400 text-3xl mt-6 font-sans font-semibold">Payment Details</h2>

                            <hr className="w-80 mt-5 m-auto bg-gray-600 border-0 h-0.5 rounded-xl" />

                            <input type="text" className="w-80 mt-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" placeholder="Card Holder" value={data.name} onChange={e => setData('name', e.target.value)} />
                            <input type="number" className="w-80 mt-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" minLength="16" placeholder="Card Number" value={data.cardNumber} onChange={e => setData('cardNumber', e.target.value)} />
                            <div className="w-80 grid grid-cols-2">
                                <label className="text-gray-300 w-full col-span-2 pt-4" htmlFor="">Expire Date</label>
                                <input type="month" className="grid-cols-1 h-full w-44 rounded-md bg-gray-300 border-2 border-gray-300" minLength="16" name="ExpireDate" />
                                <input type="number" className="grid-cols-1 w-32 h-fit ml-8 rounded-md bg-gray-300 border-2 font-bold border-gray-300" minLength="4" placeholder="CVV" />
                            </div>
                            {Object.keys(errors).length > 0 && <div className={`${Object.keys(errors).length > 0 ? 'h-auto transition-all duration-1000 ease-in-out mt-5 p-2' : 'h-0 overflow-hidden'} grid place-content-center w-[90%] bg-red-500 mt-4 py-5 rounded-md`}
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
                    {paymentSuccess && !downloadStarted &&
                        <div
                            id="successfullPayment"
                            className="bg-blue-900 m-auto h-full p-3 text-center rounded-md border-2 border-blue-900 ">
                            <h4
                                className="text-gray-300 mt-5 font-bold text-xl mb-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>&nbsp;
                                Payment successful. Click the button below to download the tickets.
                            </h4>
                            <div>
                                <a href={`/downloadTicket`} onClick={() => setDownloadStarted(true)} className="bg-green-800 w-fit m-auto hover:bg-green-700 hover:border-green-700 text-center border-2  border-green-800 text-white font-bold py-2 px-4 rounded">Download Ticket</a>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {showOnlineChat == false &&
                <div className="fixed bottom-[6%] w-fit right-[2%]">
                    <div className="z-10 flex justify-end mr-[5%] mb-[2%]">
                        <button title="Online Consultant" onClick={() => setShowOnlineChat(true)} className=" h-[3%]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-gray-300 rounded-full p-2 text-blue-400 w-14">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
            {showOnlineChat &&
                <div className="fixed top-[40%] w-full">
                    <div id='onlineChat' scroll={'onlineChat'} className="flex justify-end mr-[5%] my-[5%]">
                        <div className="bg-[#4ade80] w-[18%] rounded-sm">
                            <button onClick={() => setShowOnlineChat(false)} title="Close Chat" className="hover:text-gray-500 duration-300 p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[8%]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                            <p className="p-1 font-sans font-bold text-lg text-center mb-[4%]">Online Assistant</p>
                            <div className="bg-[#0c1527] h-fit p-2 rounded-sm">
                                <p className="p-1 text-gray-300 text-lg text-center">How do we apply to you?</p>
                                <hr className="my-2" />
                                <input
                                    id="name"
                                    type="text"
                                    className={
                                        'w-full mt-2 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-400 border-[#2c3c5f] bg-[#0a101e] font-bold'
                                    }
                                    autoComplete="username"
                                    placeholder="Name"
                                    onChange={(e) => setParticipantName(e.target.value)}
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className={
                                        'w-full mt-2 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-400 border-[#2c3c5f] bg-[#0a101e] font-bold'
                                    }
                                    autoComplete="username"
                                    placeholder="E-mail"
                                    onChange={(e) => setParticipantEmail(e.target.value)}

                                />

                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    className={
                                        'w-full mt-2  focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-400 border-[#2c3c5f] bg-[#0a101e] font-bold'
                                    }
                                    autoComplete="username"
                                    placeholder="Phone Number"
                                    onChange={(e) => setParticipantPhoneNumber(e.target.value)}

                                />
                                {Object.keys(errors) &&
                                    <span>{Object.keys(participantsErrors).map((key) => (
                                        <li className='text-red-500' key={key}>{participantsErrors[key]}</li>
                                    ))}</span>
                                }
                                <div className="flex justify-center">

                                    <button onClick={() => sendParticipantData()} className="text-black mt-[10%] bg-[#03a9f4] p-1 w-[40%] rounded-sm font-sans font-medium hover:bg-[#015378] duration-300 hover:text-gray-300">Start Chat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {showChatWindow &&
                <div className="fixed top-[35%] right-[5%] w-[20%] h-[55%] bg-[#0c1527]">
                    <div className="w-full h-[88%] bg-[#0c1527]">
                        <div className="overflow-y-auto h-full bg-[#080c17] items-start">
                            <div className="m-[6%] grid ">
                                {messages.map((msg) => (
                                        <div key={msg} className="overflow-x-auto justify-self-end max-w-[100%]  text-white m-[5%] bg-[#2b5278] p-2 rounded-md">{msg}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row h-[12%] rounded-md">
                        <textarea onChange={e => messageForm.setData('message', e.target.value)} rows="3" type="text" className="bg-[#0a101e] w-3/4 text-white border-[#2c3c5f]" />
                        <button onClick={sendMessage} className="bg-[#03a9f4] w-1/4 flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Layer_1" viewBox="0 0 512.001 512.001" space="preserve">
                                <g>
                                    <g>
                                        <path d="M509.532,34.999c-2.292-2.233-5.678-2.924-8.658-1.764L5.213,225.734c-2.946,1.144-4.967,3.883-5.192,7.034    c-0.225,3.151,1.386,6.149,4.138,7.7l102.719,57.875l35.651,174.259c0.222,1.232,0.723,2.379,1.442,3.364    c0.072,0.099,0.131,0.175,0.191,0.251c1.256,1.571,3.037,2.668,5.113,3c0.265,0.042,0.531,0.072,0.795,0.088    c0.171,0.011,0.341,0.016,0.511,0.016c1.559,0,3.036-0.445,4.295-1.228c0.426-0.264,0.831-0.569,1.207-0.915    c0.117-0.108,0.219-0.205,0.318-0.306l77.323-77.52c3.186-3.195,3.18-8.369-0.015-11.555c-3.198-3.188-8.368-3.18-11.555,0.015    l-60.739,60.894l13.124-112.394l185.495,101.814c1.868,1.02,3.944,1.239,5.846,0.78c0.209-0.051,0.4-0.105,0.589-0.166    c1.878-0.609,3.526-1.877,4.574-3.697c0.053-0.094,0.1-0.179,0.146-0.264c0.212-0.404,0.382-0.8,0.517-1.202L511.521,43.608    C512.6,40.596,511.824,37.23,509.532,34.999z M27.232,234.712L432.364,77.371l-318.521,206.14L27.232,234.712z M162.72,316.936    c-0.764,0.613-1.429,1.374-1.949,2.267c-0.068,0.117-0.132,0.235-0.194,0.354c-0.496,0.959-0.784,1.972-0.879,2.986L148.365,419.6    l-25.107-122.718l275.105-178.042L162.72,316.936z M359.507,419.195l-177.284-97.307L485.928,66.574L359.507,419.195z" />
                                    </g>
                                </g>
                            </svg>
                        </button>

                    </div>
                </div>
                // <div className="fixed top-[35%] right-[5%] w-full h-[60%] flex justify-end">
                //     <div className="bg-[#4ade80] w-[18%] h-full rounded-sm flex items-end">
                //         <button onClick={() => setShowOnlineChat(false)} title="Close Chat" className="hover:text-gray-500 duration-300 p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[8%]">
                //             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                //         </svg>
                //         </button>
                //         <p className="p-1 font-sans font-bold text-lg text-center mb-[4%]">Online Chat</p>
                //         <div className="w-full sm:w-full lg:w-full grid bg-[#0c1527] translate-y-10 p-5 flex-col items-end drop-shadow-2xl h-[60%]">
                //             <input type="text" className="bg-[#0a101e] text-white border-[#2c3c5f] w-full h-10 rounded-md border-1" />
                //             <div className="flex justify-center">

                //             <button onClick={() => sendParticipantData()} className="text-black mt-[10%] bg-[#03a9f4] p-1 w-[40%] rounded-sm font-sans font-medium hover:bg-[#015378] duration-300 hover:text-gray-300">Send</button>
                //         </div>
                //         </div>


                //     </div>
                // </div>
            }
            <Footer />
        </div>
    );
}

