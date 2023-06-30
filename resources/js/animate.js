// export const animationScenario = [{
//     removeClass: 'opacity-0 h-0',
//     addClass: 'transition-all duration-700 shadow-lg shadow-slate-600 h-36 ease-out-in',
//     startAfter: 0
// },
// {
//     removeClass: 'bg-slate-400',
//     addClass: 'bg-red-400 scale-125 text-2xl text-blue-800',
//     startAfter: 700
// },
// {   removeClass: 'duration-700',
//     addClass: 'bg-red-400 rotate-180 origin-top-right -scale-25 duration-500 rounded-full',
//     startAfter: 1000
// },
// {
//     removeClass: 'bg-red-400 -scale-25 duration-500',
//     addClass: 'duration-1000 bg-yellow-200 duration-700',
//     startAfter: 1200
// },
// {
//     removeClass: 'bg-red-400 scale-125',
//     addClass: 'duration-600 bg-red-500 -rotate-45',
//     startAfter: 1500
// },
// {
//     removeClass: 'scale-10 scale-110 duration-700 ',
//     addClass: ' duration-400 opacity-100 bg-red-500 translate-x-48 -translate-y-20 scale-0 bg-orange-400',
//     startAfter: 1900
// }]

export const animationScenario2 = [
    {
        removeClass: 'opacity-0 h-0',
        addClass: 'transition-all duration-300 ease h-24 opacity-100 shadow-lg shadow-slate-600 -rotate-12',
        startAfter: 0
    },
    {
        removeClass: '-rotate-12',
        addClass: 'rotate-12',
        startAfter: 300
    },
    {
        removeClass: 'rotate-12',
        addClass: 'rotate-0',
        startAfter: 600
    },
    // {
    //     removeClass: '-rotate-12',
    //     addClass: '-rotate-12',
    //     startAfter: 1300
    // },
    // {
    //     removeClass: 'rotate-0',
    //     startAfter: 1900
    // }
]

export const animateElem = (elem, scenario) => {
    scenario.forEach(so => {
        setTimeout(() => {
            // alert("dfgnhdfg")
            if(elem.current){
                so.hasOwnProperty('removeClass') ? elem.current.classList.remove(...so.removeClass.trim().split(' ')) : ''
                so.hasOwnProperty('addClass') ? elem.current.classList.add(...so.addClass.trim().split(' ')) : ''
            }
        }, so.startAfter);
    });
}