export default function NBTEditor() {
  return (
    <div className="flex flex-col w-full my-4 h-100 md:h-full md:mt-5 bg-type-1 md:my-0">
      <div className="mx-auto text-[20px] md:text-[24px]">NBTEditor</div>
      <div className="flex-1 p-3">
        <textarea
          name="nbt-editor"
          id="nbt-editor"
          className="w-full h-full text-xl outline-none bg-type-2 text-primary-700 font-bai-jamjuree"
        ></textarea>
      </div>
    </div>
  )
}
