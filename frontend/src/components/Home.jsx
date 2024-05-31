import Text from "./text"
import { useState } from "react"

const Page = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const [qa, setQa] = useState([])

  const [uploadingstate, setUploadingstate] = useState(false)

  const [loadingans, setLoadingans] = useState(false)


  const [fileid, setFileid] = useState(
    ""
  )

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const [error, setError] = useState("")

  const uploadPdf = async () => {
    if (!selectedFile) {
      console.error("No file selected")
      return
    }
    setUploadingstate(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      console.log(data)

      setFileid(data?.new_file_info?.pdfkey)
    } catch (error) {
      console.error("Error uploading PDF:", error)
    }

    setUploadingstate(false)
  }

  const onEnter = async (text) => {
    console.log(text)
    if (!text) return
    if (!selectedFile) {
      setError("No files uploaded")
      return
    }

    setError("")

    setLoadingans(true)
    try {
      const response = await fetch("http://localhost:8000/qn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileid,
          question: text,
        }),
      })
      const data = await response.json()
      setQa((prevQa) => [...prevQa, { text: text, ans: "", ans: data.result }])

    } catch (error) {
      console.error("Error uploading PDF:", error)
    }

    setLoadingans(false)
  }

  return (
    <div className="h-5/6 flex flex-col align-middle justify-between items-center w-full py-6 overflow-auto bg-slate-50">
      <div className="flex flex-col justify-between items-center p-6 ">
        {!uploadingstate ? 
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
          /> : (
          <p>Uploading...</p>
        )}

        <button
        onClick={uploadPdf}
          className="px-4 py-2 my-4 bg-green-400 hover:bg-green-500 border border-1 rounded-md"
        >
          Upload { fileid ? "New" : ""} PDF
        </button>
      </div>
      <div className="w-full px-5">
        {/* Div for the text question and answer */}
        {qa.map((data, index) => (
          <div
            key={index}
            className="bg-slate-200 py-1 px-2 rounded-md my-2 text-[18px]"
          >
            <div className="font-medium">
              <span className="font-semibold">Question : </span>
              {data.text}{" "}
            </div>
            <div className="font-medium">
              <span className="font-semibold">Answer : </span>
              <span className="font-[400]">{data.ans} </span>
            </div>
          </div>
        ))}
      </div>
      <div className="h-full w-full flex flex-col justify-end items-center">

        <Text onenter={onEnter} loading={loadingans} />
        {<p className="text-red-700 text-md h-6 mt-1"> {error} </p>}
      </div>
    </div>
  )
}

export default Page
