import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useGetGPSDatsQuery, useUploadGPSDatsMutation } from "./filesApiSlice";

const GPSDatsUpload = () => {
    let fileInfos = []
    const [selectedFiles, setSelectedFiles] = useState('')
    const [currentFile, setCurrentFile] = useState('')
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const onChangeSelectFile = (e) => setSelectedFiles(e.target.files)
    const { data: file_Infos } = useGetGPSDatsQuery()

    fileInfos = file_Infos


    const [uploadGPSDats] = useUploadGPSDatsMutation()

    const upload = async () => {
        let currFile = selectedFiles[0];

        setProgress(0)
        setCurrentFile(currFile)
        const f = await uploadGPSDats(currFile)
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
        <div>
            {/* {currentFile && (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )} */}

            <label className="btn btn-default">
                <input type="file" onChange={onChangeSelectFile} />
            </label>

            <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
            >
                import GPS data
            </button>

            <div className="alert alert-light" role="alert">
                {message}
            </div>

            <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a href={file.url}>{file.name}</a>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
    // }
}
export default GPSDatsUpload