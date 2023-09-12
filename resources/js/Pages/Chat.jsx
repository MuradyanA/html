import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import moment from 'moment';


export default function Chat(props) {

    const [currentSession, setCurrentSession] = useState(props.currentSession ? props.currentSession : null)

    const [changeJoinChatBtn, setChangeJoinChatBtn] = useState(false)
    const [consultantMessage, setConsultantMessage] = useState('')
    // const { data, setData, get, errors, } = useForm({
    //     created_at: moment().startOf('day').format('yyyy-MM-DDTHH:mm'),
    //     end: moment().endOf('day').format('yyyy-MM-DDTHH:mm'),
    //     showActiveSessions: 1,
    //     zone: moment().zone(),
    //     currentSession: null
    // })

    const [data, setData] = useState({
        created_at: moment().startOf('day').format('yyyy-MM-DDTHH:mm'),
        end: moment().endOf('day').format('yyyy-MM-DDTHH:mm'),
        showActiveSessions: 1,
        zone: moment().zone(),
        currentSession: null
    })

    const filterSessions = (e) => {
        e.preventDefault()
        router.visit(`/chat`, {
            method: 'get',
            data
        })
    }

    const getSessiongBgColor = (session) => {
        let cls = 'w-full text-gray-300 block my-2 p-2  hover:text-gray-100 duration-300 '
        if (currentSession !== null && currentSession.id == session.id) {
            return cls += ' bg-slate-700 '
        } else {
            return cls += 'bg-green-600 hover:bg-green-900'
        }
    }

    const requestSessionMessages = (e, sessionId) => {
        // setData((prev) => { prev.currentSession = sessionId })
        e.preventDefault()
        // get('/chat', {
        //     preserveState: true,
        //     only: ['currentSession'],
        //     onSuccess: (resp) => {
        //         setChangeJoinChatBtn(true)
        //     },
        // })
        console.log(data)
        router.get(`/chat`,
            data,
            {
                preserveState: true,
                only: ['currentSession'],
                onSuccess: (resp) => {

                    setCurrentSession(resp.props.currentSession)
                    setChangeJoinChatBtn(true)
                },
            })
    }

    const sendMessage = (e) => {
        e.preventDefault()
        router.visit(`/chat/${activeSession.id}`, {
            method: 'put',
            msg: { consultantMessage, consultantId: props.auth.user.id }
        })
    }
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Chat</h2>}
            navbarLinks={[{ to: '/movies/create', name: 'Create New Movie', active: true }, { to: '/movies', name: 'All Movies', active: false }]}
        >
            <div className='w-full grid grid-rows-1 grid-cols-12 h-screen gap-2'>
                <div className='col-span-9 bg-[#1c222c]'>
                    <div className='flex w-full bg-[#253654] p-5'>

                        {/* <form onSubmit={filterSessions} className='flex items-baseline w-full'>
                                <div className='w-[80%]'>
                                    <label htmlFor="" className='text-md font-bold text-white'>Start
                                        <input value={data.created_at} onChange={e =>
                                            setData('created_at', e.target.value)} className='h-8 mx-3 text-gray-600' type="datetime-local" />
                                    </label>
                                    <label htmlFor="" className='text-md font-bold text-white'>End
                                        <input value={data.end} onChange={e => setData('end', e.target.value)} className='h-8 mx-3 text-gray-600' type="datetime-local" />
                                    </label>
                                    <label htmlFor="" className='ml-[5%] text-md font-bold text-white'>Active sessions only
                                        <input checked={data.showActiveSessions} onChange={e => setData('showActiveSessions', parseInt(e.target.checked))} className='mx-3 text-gray-600' type="checkbox" />
                                    </label>
                                </div>
                                <div className='w-[20%]'>
                                    <button className='bg-green-700 mb-4 m-auto text-white rounded-md w-24 h-8 text-md'>Filter</button>
                                </div>
                            </form> */}
                        <div  className='flex items-baseline w-full'>
                            <div className='w-[80%]'>
                                <label htmlFor="" className='text-md font-bold text-white'>Start
                                    <input value={data.created_at} onChange={e =>
                                        setData((prev) => prev.created_at = e.target.value)} className='h-8 mx-3 text-gray-600' type="datetime-local" />
                                </label>
                                <label htmlFor="" className='text-md font-bold text-white'>End
                                    <input value={data ? data.end : ''} onChange={e => setData((prev) => prev.end = e.target.value)} className='h-8 mx-3 text-gray-600' type="datetime-local" />
                                </label>
                                <label htmlFor="" className='ml-[5%] text-md font-bold text-white'>Active sessions only
                                    <input checked={data ? data.showActiveSessions : ''} onChange={e => setData((prev) => prev.showActiveSessions = parseInt(e.target.checked))} className='mx-3 text-gray-600' type="checkbox" />
                                </label>
                            </div>
                            <div className='w-[20%]'>
                                <button onClick={filterSessions} className='bg-green-700 mb-4 m-auto text-white rounded-md w-24 h-8 text-md'>Filter</button>
                            </div>
                        </div>



                    </div>
                    <div className='bg-[#161f2f] flex justify-end'>
                        {/* {console.log(currentSession)} */}
                        {currentSession !== null && currentSession.end == null &&
                            <button className='bg-blue-400 p-2 text-white'>{changeJoinChatBtn ? 'End Chat' : 'Join Chat'}</button>
                        }
                    </div>
                    {currentSession == null ?
                        <div className='bg-[#131c2f] h-[75%] flex items-center justify-center'>
                            <p className='text-2xl text-gray-300 '>Please select the session to start chat!</p>
                        </div>
                        :
                        <div className='bg-[#131c2f] h-[75%] grid overflow-y-auto'>
                            {currentSession.messages.map((msg) => (
                                <div key={msg.id} className={props.auth.user.id == msg.id ? "h-fit overflow-x-auto max-w-[100%]  text-white m-[5%] bg-[#2b5278] p-2 rounded-md justify-self-end" : "h-fit overflow-x-auto max-w-[100%]  text-white m-[5%] bg-[#2b5278] p-2 rounded-md justify-self-start"}>{msg.message}</div>


                            ))}
                        </div>
                    }
                    <div className='flex items-center h-fit mt-1'>
                        <textarea onChange={(e) => setConsultantMessage(e.target.value)} className='h-24 w-[90%] rounded-md focus:border-indigo-500 focus:ring-indigo-500  text-gray-400 border-[#2c3c5f] bg-[#0a101e] font-bold' rows="3">

                        </textarea>
                        <button onClick={(e) => sendMessage(e)} className='bg-green-600 text-white h-24 w-[10%] rounded-md'>Send</button>
                    </div>
                </div>

                <div className='col-span-3 w-[90%] overflow-y-auto'>
                    {props.sessions.map((session) => {
                        if (session.consultant_id == null) {
                            return <button onClick={(e) => requestSessionMessages(e, session.id)} key={session.id} className={getSessiongBgColor(session)}>NEW - {session.participant_email}</button>
                        }
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
