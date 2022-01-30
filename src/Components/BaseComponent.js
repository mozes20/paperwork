import {Component, useState} from "react";
import {Link, useHistory} from "react-router-dom";
const { ipcRenderer } = window.require('electron');

export function BaseComponent(){
    let [inputValue,setInputValue] = useState()
    let history = useHistory();

    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            history.push("/newpaper/"+inputValue)
        }
    }
        return(
            <div>
                <div className="container mx-auto px-4">
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder=""
                        value={inputValue} onChange={evt => setInputValue(evt.target.value)}  onKeyDown={_handleKeyDown}/>
                    <Link to={"/getPaper"}><a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">Garancia vissza keresése</a></Link>
                </div>
            </div>)

}
