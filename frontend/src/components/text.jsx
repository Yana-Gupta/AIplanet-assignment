const text = ({ onenter, loading }) => {
  return (
    <div className="w-full flex flex-col items-center fixed bottom-28 ">
      {loading && (
        <div className="flex mb-2 w-3/4">
          <div
            className="animate-spin mr-2 inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          ></div>
          <div
            className="animate-spin mr-2 inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          ></div>
          <div
            className="animate-spin mr-2 inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          ></div>
          <div>Loading...</div>
        </div>
      )}

      <textarea
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await onenter(e.target.value)
            e.target.value = ""
          }
        }}
        disabled={loading}
        rows={1}
        className="border-black border border-1 p-2 w-3/4 rounded-md text-[18px]"
        placeholder="Ask Questions related to uploaded pdf and then press enter... "
      />
    </div>
  )
}

export default text
