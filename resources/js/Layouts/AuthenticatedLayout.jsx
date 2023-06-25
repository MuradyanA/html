import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function Authenticated({ auth, header, children, navbarLinks }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [triggerSidebar, setTriggerSidebar] = useState(false)

    return (
        <div className="min-h-screen bg-[#1f2937]">
            <nav className="bg-[#111827] border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard.index')} active={route().current('dashboard.index')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('movies.index')} active={route().current('movies.index')}>
                                    Movies
                                </NavLink>
                                <NavLink href={route("seances.index")} active={route().current('seances.index')}>
                                    Seances
                                </NavLink>
                                <NavLink href={route("users.index")} active={route().current('users.index')}>
                                    Users
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard.index')} active={route().current('dashboard.index')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('movies.index')} active={route().current('movies.index')}>
                            Movies
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('seances.index')} active={route().current('seances.index')}>
                            Seances
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                            Users
                        </ResponsiveNavLink>
                        
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {auth.user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-[#111827]">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}
            {/* bg-[#d13e2a] */}
            <main className='grid grid-cols-12 gap-1'>
                {navbarLinks && <div className={triggerSidebar ? 'grid grid-cols-9 w-4 -translate-x-7 lg:w-full min-h-screen col-span-2 sm:col-span-4 lg:col-span-2 bg-green-400 drop-shadow-xl mt-1 z-20 duration-500' :
                    'grid grid-cols-9 w-52 sm:w-52 sm:static lg:w-full min-h-screen col-span-2 sm:col-span-4 lg:col-span-2 bg-green-400 drop-shadow-xl mt-1 z-20  duration-500'}>
                    <div className='col-span-8'>
                        <ul className={'overflow-hidden mt-[100%] sticky top-48 grid pl-[10%]'}>
                            {navbarLinks.map((link) => (
                                <li className='my-5 text-md' key={link.name}>
                                    <Link className={link.active ? 'text-[#111827] text-xl font-bold ' : 'text-[#111827]'} href={link.to}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='col-span-1 grid'>
                        <div onClick={() => setTriggerSidebar((prev) => !prev)} className='rounded-full w-9 bg-green-600 h-9 overflow-visible sticky top-1/2 mb-[50%] grid content-center justify-items-center sm:hidden md:w-[100%]'>
                            {triggerSidebar && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>}
                            {!triggerSidebar && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>}

                        </div>
                    </div>
                </div>
                }
                <div className='col-span-10 sm:col-span-8 lg:col-span-10'>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
