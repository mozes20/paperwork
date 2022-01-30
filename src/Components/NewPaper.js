import {Component, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom/cjs/react-router-dom";
const { ipcRenderer } = window.require('electron');
//const { ipcRenderer } = window.require('electron');

export function NewPaper (){
    let { id } = useParams();
    let [tnev,setTnev] = useState("");
    let [ttipus,setTtipus] = useState("");
    let [tgyszam,setTgyszam] = useState("");
    let [gynev,setGynev] = useState("");
    let [cpu,setCpu] = useState("");
    let [ram,setRam] = useState("");
    let [hattertar,setHattertar] = useState("");
    let [kijelzo,setKijelzo] = useState("");
    let [os,setOs] = useState("");
    let [garancia,setGarancia] = useState("");
    let [beuzemelte,setBeuzemelte] = useState(false);

    let [sablon,setSablon] = useState("");



    let [created,setCreated] = useState(false);


    console.log(id)

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            getDataFromSablon(sablon)
        }
    }

    const proba=()=> {
        ipcRenderer.send('try',id)
        ipcRenderer.on('tryre',(event,args)=>{
            if(args.length>0){
            let tmpdata= args[0]
            setTnev(tmpdata.tnev);
            setTtipus(tmpdata.ttipus);
            setTgyszam(tmpdata.tgyszam);
            setGynev(tmpdata.gynev);
            setCpu(tmpdata.cpu);
            setRam(tmpdata.ram)
            setHattertar(tmpdata.hattertar)
            setKijelzo(tmpdata.kijelzo)
            setOs(tmpdata.os)
            setCreated(true)
            }else {
                setTgyszam(id)
            }
        });
    }
    const getDataFromSablon=(value)=> {
        ipcRenderer.send('getSablon',value)
        ipcRenderer.on('getSablonResult',(event,args)=>{
            console.log(args[0])
            if(args.length>0){
                let tmpdata= args[0]
                setTnev(tmpdata.tnev);
                setTtipus(tmpdata.ttipus);
                setGynev(tmpdata.gynev);
                setCpu(tmpdata.cpu);
                setRam(tmpdata.ram)
                setHattertar(tmpdata.hattertar)
                setKijelzo(tmpdata.kijelzo)
                setOs(tmpdata.os)
                setTgyszam(id)
            }
        });
    }

    const SetNewPaper=()=>{
        let newObject={tnev:tnev,ttipus:ttipus,
            tgyszam:tgyszam,gynev:gynev,
            cpu:cpu,ram:ram,hattertar:hattertar,
            kijelzo:kijelzo,os:os,
            garancia:garancia,beuzemelte:beuzemelte}
        ipcRenderer.send('newPaperCreator',newObject)
        ipcRenderer.on('newPaperCreatorResult',(event,args)=>{})
    }

    const SetNewItem =()=>{
        let newObject={tnev:tnev,ttipus:ttipus,
                        tgyszam:tgyszam,gynev:gynev,
                        cpu:cpu,ram:ram,hattertar:hattertar,
                        kijelzo:kijelzo,os:os}

        ipcRenderer.send('newItemCreator',newObject)
        ipcRenderer.on('newItemCreatorResult',(event,args)=>{})
    }

    useEffect( () => {
        // Anything in here is fired on component mount.
        console.log("fut' ")
        if(!created){
            proba();
        }
    }, []);

    return (

            <div className={" px-4"}>
               <div className={"grid grid-cols-3"}>
                   <div className={"col-1 container "}>
                       { created == false &&
                       <div>
                       <label>Sablon:</label>
                       <input
                           className="m-4 shadow appearance-none border rounded w-4/6 py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="username" type="text" placeholder="" value={sablon} onChange={evt => setSablon(evt.target.value)} onKeyDown={handleKeyDown}/>

                       </div>}
                       <div className={"w-auto "}>
                           <div >
                           <Link className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} to="/">Vissza</Link>
                           </div>
                       </div>

                   </div>
                <div className=" container col-span-2 mx-auto px-4 mx-10 ">

                    <label>Termék neve</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={tnev} onChange={evt => setTnev(evt.target.value)}/>
                    <label>Termék típusa</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={ttipus} onChange={evt => setTtipus(evt.target.value)}/>
                    <label>Termék gyártó száma</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={tgyszam} onChange={evt => setTgyszam(evt.target.value)}/>
                        <label>Gyártó neve</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={gynev} onChange={evt => setGynev(evt.target.value)}/>
                        <label>Cpu</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={cpu} onChange={evt => setCpu(evt.target.value)}/>

                        <label>Ram</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={ram} onChange={evt => setRam(evt.target.value)}/>
                        <label>Háttértár</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={hattertar} onChange={evt => setHattertar(evt.target.value)}/>
                        <label>Kijelző</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={kijelzo} onChange={evt => setKijelzo(evt.target.value)}/>
                        <label>Os</label>
                    <input
                        className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="" value={os} onChange={evt => setOs(evt.target.value)}/>
                        <label>Garancia Idő</label>
                        <input
                            className="m-4 shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username" type="text" placeholder="" value={garancia} onChange={evt => setGarancia(evt.target.value)}/>


                        {created ==true &&
                        <div>
                        <label className="inline-flex items-center ">
                            Alapértelmezett: átadta
                            <input
                                className="mx-3 text-indigo-500 w-8 h-8 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded"
                                type="checkbox" onChange={evt => setBeuzemelte(evt.target.checked)}/>
                            Beüzemelte
                        </label>

                        <button className="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={SetNewPaper}>Create Paper</button>
                        </div>
                        }
                        {created ==false&&
                        <button className="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={SetNewItem}>Create New Item</button>
                        }
                </div>
               </div>
            </div>)
}
