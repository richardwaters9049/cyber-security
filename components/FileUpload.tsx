'use client'

import { useState } from 'react'

type AnalysisResult = {
    filename: string
    size: string
    type: string
    sha256?: string
    indicators?: {
        yara_matches?: string[]
        magic_bytes?: string
        entropy?: number
        risk_score?: number
    }
}

export default function FileUpload() {
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const formData = new FormData(e.currentTarget)
            const file = formData.get('file')

            if (!file) {
                throw new Error('No file selected')
            }

            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Analysis failed')
            }

            const data: AnalysisResult = await res.json()
            setResult(data)

        } catch (err) {
            console.error('Analysis error:', err)
            setError(
                err instanceof Error ?
                    err.message :
                    'An unknown error occurred during analysis'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const getRiskLevel = (score?: number) => {
        if (!score) return 'Unknown'
        if (score >= 80) return 'Critical'
        if (score >= 60) return 'High'
        if (score >= 40) return 'Medium'
        if (score >= 20) return 'Low'
        return 'Very Low'
    }

    return (
        <div className="p-6 space-y-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Malware Analysis Dashboard</h2>
                <p className="text-gray-600">
                    Upload suspicious files for comprehensive security analysis
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Select File
                    </label>
                    <input
                        type="file"
                        name="file"
                        required
                        disabled={isLoading}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              disabled:opacity-50 hover:cursor-pointer"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium hover:cursor-pointer ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : (
                        'Analyze File'
                    )}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                            Analysis Report
                        </h3>
                        {result.indicators?.risk_score && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${result.indicators.risk_score >= 80 ? 'bg-red-100 text-red-800' :
                                result.indicators.risk_score >= 60 ? 'bg-orange-100 text-orange-800' :
                                    result.indicators.risk_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {getRiskLevel(result.indicators.risk_score)} Risk
                            </span>
                        )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">File Details</h4>
                                <dl className="mt-2 space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Filename</dt>
                                        <dd className="text-sm text-gray-900 font-mono truncate max-w-[200px]">
                                            {result.filename}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Size</dt>
                                        <dd className="text-sm text-gray-900">{result.size}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Type</dt>
                                        <dd className="text-sm text-gray-900">{result.type}</dd>
                                    </div>
                                    {result.sha256 && (
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-500">SHA256</dt>
                                            <dd className="text-sm text-gray-900 font-mono truncate max-w-[200px]">
                                                {result.sha256}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Security Indicators</h4>
                                <div className="mt-2 space-y-4">
                                    {result.indicators?.magic_bytes && (
                                        <div>
                                            <p className="text-sm text-gray-500">File Signature</p>
                                            <p className="text-sm font-mono text-gray-900">
                                                {result.indicators.magic_bytes}
                                            </p>
                                        </div>
                                    )}

                                    {result.indicators?.yara_matches && result.indicators.yara_matches.length > 0 ? (
                                        <div>
                                            <p className="text-sm text-gray-500">Threat Matches</p>
                                            <ul className="mt-1 space-y-1">
                                                {result.indicators.yara_matches.map((match, i) => (
                                                    <li key={i} className="text-sm font-mono text-red-600">
                                                        • {match}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-green-600">No known threat patterns detected</p>
                                    )}

                                    {result.indicators?.entropy && (
                                        <div>
                                            <p className="text-sm text-gray-500">Entropy Score</p>
                                            <div className="mt-1 flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${result.indicators.entropy > 7 ? 'bg-red-600' :
                                                            result.indicators.entropy > 6 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(result.indicators.entropy * 12.5, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {result.indicators.entropy.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Analysis completed at {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}