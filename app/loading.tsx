import Loading from '@/components/Loading'

export default function LoadingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-3xl p-6 text-center">
        <Loading />
        <p className="mt-4 text-gray-400 font-display">Loading CeloSwap...</p>
      </div>
    </main>
  )
}
