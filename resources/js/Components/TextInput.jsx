import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start bg-[#0a101e]">
            <input
                {...props}
                type={type}
                className={
                    ' focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-400 border-[#2c3c5f] bg-[#0a101e] font-bold' +
                    className
                }
                ref={input}
            />
        </div>
    );
});
