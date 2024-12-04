import React from 'react'

function NewGroup() {
  return (
    <>
    <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 m-2 text-center '>
            <h1> GROUP NAME </h1>
            <h1> YOU OWE</h1>
        </div>

    {/* extra Tabs */}
    <div className='flex justify-center space-x-11 mb-2'>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600'>
            <h2>Settle up</h2>
        </div>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600'>
            <h2>Currency Convertor</h2>
        </div>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600'>
            <h2>Expenses</h2>
        </div>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600'>
            <h2>Total Expenses</h2>
        </div>
    </div>

    <div className='flex justify-center gap-16'>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 w-[calc(50%-30px)]'>
            <h2 className='text-center text-xl font-semibold'> Expenses</h2>
            <div>
                <div>
                    date, photo, name, owe/lent
                </div>
                <div>
                date, photo, name, owe/lent
                </div>
                <div>
                    date, photo, name, owe/lent
                </div>
                <div>
                date, photo, name, owe/lent
                </div>
            </div>
        </div>
        <div className='border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 w-[calc(30%-30px)]'>
        <h2 className='text-center text-xl font-semibold'> Total Expenses</h2>
        </div>
    </div>
    </>
  )
}

export default NewGroup
