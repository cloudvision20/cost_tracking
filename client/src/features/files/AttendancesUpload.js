import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useGetAttendancesQuery, useUploadAttendancesMutation } from "./filesApiSlice";
import useAuth from "../../hooks/useAuth"

const AttendancesUpload = () => {
    let fileInfos = []
    const { userid } = useAuth()
    const [selectedFiles, setSelectedFiles] = useState('')
    const [currentFile, setCurrentFile] = useState('')
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const onChangeSelectFile = (e) => setSelectedFiles(e.target.files)
    const { data: file_Infos } = useGetAttendancesQuery()

    fileInfos = file_Infos


    const [uploadAttendances] = useUploadAttendancesMutation()

    const upload = async () => {
        let currFile = selectedFiles[0];
        currFile.userid = userid
        setProgress(0)
        setCurrentFile(currFile)
        const f = await uploadAttendances(currFile)
        if (f.data.status === "success") {
            //setFileInfos(f.data.fileInfos)
            fileInfos = f.data.fileInfos
        } else {

            setProgress(0)
            setMessage("Could not upload the file!")
            setCurrentFile('')
        }


        setSelectedFiles('')
    }



    return (
        // <div style={{ fontSize: '12px' }}>
        //     <div><b>Upload and import Attendances</b></div>
        //     {/* {currentFile && (
        //         <div className="progress">
        //             <div
        //                 className="progress-bar progress-bar-info progress-bar-striped"
        //                 role="progressbar"
        //                 aria-valuenow={progress}
        //                 aria-valuemin="0"
        //                 aria-valuemax="100"
        //                 style={{ width: progress + "%" }}
        //             >
        //                 {progress}%
        //             </div>
        //         </div>
        //     )} */}

        //     <label className="btn-sm">
        //         <input type="file" onChange={onChangeSelectFile} />
        //     </label>

        //     <button
        //         className="btn btn-success btn-xs"
        //         style={{ fontSize: '12px' }}
        //         disabled={!selectedFiles}
        //         onClick={upload}
        //     >import
        //     </button>

        //     <div className="alert alert-light" role="alert">
        //         {message}
        //     </div>
        //     {/* 
        //     <div className="card" style={{ fontSize: '10px' }}>
        //         <div className="card-header">List of Files</div>
        //         <ul className="list-group list-group-flush">
        //             {fileInfos &&
        //                 fileInfos.map((file, index) => (
        //                     <li className="list-group-item" key={index}>
        //                         <a href={file.url}>{file.name}</a>
        //                     </li>
        //                 ))}
        //         </ul>
        //     </div> */}
        // </div>



        <div className="row" style={{ fontSize: '12px', padding: '0px' }}>
            <div className=" col-sm-3 " style={{ fontSize: '12px', padding: '0px' }} ><b>Attendances</b></div>
            <div className=" col-sm-4" style={{ padding: '0px' }}>
                <label className="btn-sm">
                    <input type="file" onChange={onChangeSelectFile} />
                </label>
            </div>
            <div className=" col-sm-4">
                <button
                    className="btn btn-success btn-xs"
                    style={{ fontSize: '12px' }}
                    disabled={!selectedFiles}
                    onClick={upload}
                >import
                </button>
            </div>
            <div className=" col-sm-1">
                <div className="alert alert-light" role="alert">
                    {message}
                </div>
            </div>


        </div >
    );
    // }
}
export default AttendancesUpload