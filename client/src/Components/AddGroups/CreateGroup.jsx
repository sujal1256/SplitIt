import React from 'react'

function CreateGroup() {
  return (
    <div className=''>
        <div>
            <p className='text-center'>Create Group</p>
            <form action="POST">
                <p>Group Name: </p>
                <input type="text" placeholder='Name' />
                
                <p>Members: </p>
                <input type="text" placeholder='Name' />
            </form>
        </div>
    </div>
  )
}

export default CreateGroup