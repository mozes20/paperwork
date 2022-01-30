import {Link, useHistory} from "react-router-dom";
import {useState} from "react";
const { ipcRenderer } = window.require('electron');


export default function GetDataFromPapers() {
    let [inputValue,setInputValue] = useState()
    let [obj,setobj] = useState()


    let history = useHistory();

    const datedif = (date) => {
        var date1 = new Date();
        var diff = new Date(date1.getTime() - date.getTime());
        return (diff.getUTCMonth())
    }

    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log(inputValue)
            ipcRenderer.send('getDataFromDatabase',inputValue)
            setInputValue("")
        }
    }

    ipcRenderer.on('responsDataFromDatabase',(event,args)=>{
        args.ervenyes=datedif(args.kikialitas)
        setobj(args)
    })

    return(
        <div>
            <div className={"container"}>
                    <div className={"w-full  m-5"}>
                        <Link className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} to="/">Vissza</Link>
                    </div>
                <input
                    className="m-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username" type="text" placeholder=""
                    value={inputValue} onChange={evt => setInputValue(evt.target.value)}  onKeyDown={_handleKeyDown}/>

                <div className={"w-full "}>
                    <p className={"mx-4 font-bold text-xl"}>garancia: {obj?.garancia}</p>
                    <p className={"mx-4 font-bold text-xl"}>vásárlás időpontja: {obj?.kikialitas.toISOString().split('T')[0]}</p>
                    <p className={"mx-4 font-bold text-xl"}>termék név: {obj?.tnev}</p>
                    <p className={"mx-4 font-bold text-xl"}>termék típus: {obj?.ttipus}</p>
                    <p className={"mx-4 font-bold text-xl"}>Cpu: {obj?.cpu}</p>
                    <p className={"mx-4 font-bold text-xl"}>Ram: {obj?.ram}</p>
                    <p className={"mx-4 font-bold text-xl"}>Háttértár: {obj?.hattertar}</p>
                    <p className={"mx-4 font-bold text-xl"}>Kijelző: {obj?.kijelzo}</p>
                    <p className={"mx-4 font-bold text-xl"}>Os: {obj?.os}</p>
                    <p className={"mx-4 font-bold text-xl"}>Ki állítástol eltelt idő (hónap): {obj?.ervenyes}</p>
                </div>



            </div>
        </div>
    )

}
