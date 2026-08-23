import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className='w-full grow min-h-[40vh] flex flex-col items-center justify-center py-20'>
      <Loader2 className='h-10 w-10 animate-spin  text-primary' />
      <p className='text-primary font-rajdhani'>Wczytywanie...</p>
    </div>
  )
}

export default Loading
