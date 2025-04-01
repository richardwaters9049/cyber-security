import FileUpload from '@/components/FileUpload'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-red-600">Mal</span>Viz
        </h1>
        <p className="text-gray-500 mb-8">
          Secure file analysis platforms
        </p>

        <FileUpload />

        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Container Status</h3>
            <p className="text-green-400 font-mono">Running</p>
          </div>
        </div>
      </div>
    </main>
  )
}