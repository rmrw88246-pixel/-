import React, { useState } from 'react'

// Translation Mini-App (Single-file React component) // - Contains two modes: MOCK mode (no API required) and API mode (call a real translator) // - Tailwind utility classes are used for styling (no imports needed) // - Replace API_URL / API_KEY in the callTranslateAPI function with your preferred translation service

export default function TranslationMiniApp() { const [mode, setMode] = useState('mock') // 'mock' or 'api' const [sourceLang, setSourceLang] = useState('auto') const [targetLang, setTargetLang] = useState('ar') const [inputText, setInputText] = useState('') const [outputText, setOutputText] = useState('') const [loading, setLoading] = useState(false) const [error, setError] = useState('')

const languages = [ { code: 'auto', name: 'Auto-Detect' }, { code: 'en', name: 'English' }, { code: 'ar', name: 'Arabic' }, { code: 'es', name: 'Spanish' }, { code: 'de', name: 'German' }, { code: 'fr', name: 'French' }, { code: 'zh', name: 'Chinese' }, { code: 'hi', name: 'Hindi' }, { code: 'ru', name: 'Russian' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'tr', name: 'Turkish' }, { code: 'nl', name: 'Dutch' }, { code: 'sv', name: 'Swedish' }, ]

// Mock translation function: demonstrates flow without calling external APIs. function mockTranslate(text, target) { if (!text) return '' const words = text.split(/(\s+)/) const reversed = words.reverse().join('') return ${reversed}\n\n[SIMULATED translation -> ${target}] }

async function callTranslateAPI(text, source, target) { const API_URL = 'https://libretranslate.com/translate' const API_KEY = null

const body = {
  q: text,
  source: source === 'auto' ? 'auto' : source,
  target,
  format: 'text',
}

const headers = { 'Content-Type': 'application/json' }
if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`

const resp = await fetch(API_URL, {
  method: 'POST',
  headers,
  body: JSON.stringify(body),
})

if (!resp.ok) {
  const txt = await resp.text()
  throw new Error(`API error ${resp.status}: ${txt}`)
}

const data = await resp.json()
return data.translatedText || JSON.stringify(data)

}

async function handleTranslate() { setError('') setOutputText('') if (!inputText.trim()) { setError('ادخل نص للترجمة') return }

setLoading(true)
try {
  let result = ''
  if (mode === 'mock') {
    await new Promise((r) => setTimeout(r, 400))
    result = mockTranslate(inputText, targetLang)
  } else {
    result = await callTranslateAPI(inputText, sourceLang, targetLang)
  }
  setOutputText(result)
} catch (e) {
  setError(e.message || 'حصل خطأ أثناء الترجمة')
} finally {
  setLoading(false)
}

}

function swapLanguages() { if (sourceLang === 'auto') return const prev = sourceLang setSourceLang(targetLang) setTargetLang(prev) setInputText(outputText) setOutputText(inputText) }

return ( <div className="max-w-3xl mx-auto p-4"> <div className="flex items-center justify-between mb-4"> <h1 className="text-2xl font-semibold">محاكي ميني-اب: ترجمة</h1> <div className="flex gap-2 items-center"> <label className="text-sm">الوضع:</label> <select value={mode} onChange={(e) => setMode(e.target.value)} className="border rounded p-1" > <option value="mock">Mock (محاكي - بدون API)</option> <option value="api">API (استدعاء خدمة ترجمة)</option> </select> </div> </div>

<div className="grid grid-cols-2 gap-3 mb-3">
    <div>
      <label className="text-sm">من</label>
      <select
        className="w-full border rounded p-2 mt-1"
        value={sourceLang}
        onChange={(e) => setSourceLang(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-sm">إلى</label>
      <select
        className="w-full border rounded p-2 mt-1"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        {languages
          .filter((l) => l.code !== 'auto')
          .map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
      </select>
    </div>
  </div>

  <div className="mb-3">
    <textarea
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      rows={6}
      placeholder="اكتب النص هنا..."
      className="w-full border rounded p-3"
    />
  </div>

  <div className="flex items-center gap-2 mb-3">
    <button
      onClick={handleTranslate}
      disabled={loading}
      className="px-4 py-2 rounded shadow-md text-white bg-gradient-to-r from-indigo-600 to-blue-500 disabled:opacity-60"
    >
      {loading ? 'جارٍ الترجمة...' : 'ترجم'}
    </button>

    <button
      onClick={() => {
        setInputText('')
        setOutputText('')
        setError('')
      }}
      className="px-3 py-2 rounded border"
    >
      مسح
    </button>

    <button onClick={swapLanguages} className="px-3 py-2 rounded border">
      تبديل
    </button>

    <div className="ml-auto text-sm text-gray-600">وضع حالي: {mode === 'mock' ? 'محاكاة' : 'استدعاء API'}</div>
  </div>

  {error && <div className="text-red-600 mb-3">{error}</div>}

  <div>
    <label className="text-sm">الناتج</label>
    <div className="w-full border rounded p-3 min-h-[120px] whitespace-pre-wrap bg-gray-50 mt-1">{outputText || <span className="text-gray-400">النتيجة ستظهر هنا بعد الضغط على "ترجم"</span>}</div>
  </div>

  <div className="flex gap-2 mt-3">
    <button
      onClick={() => navigator.clipboard?.writeText(outputText)}
      disabled={!outputText}
      className="px-3 py-2 rounded border disabled:opacity-60"
    >
      نسخ
    </button>

    <button
      onClick={() => {
        const blob = new Blob([outputText || ''], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'translation.txt'
        a.click()
        URL.revokeObjectURL(url)
      }}
      disabled={!outputText}
      className="px-3 py-2 rounded border disabled:opacity-60"
    >
      تحميل
    </button>
  </div>

  <div className="mt-6 text-xs text-gray-500">
    <strong>ملاحظات تقنية:</strong>
    <ul className="list-disc pl-5">
      <li>الوضع <em>Mock</em> يحاكي سلوك الترجمة ليعرض لك الواجهة بدون مفاتيح أو إعدادات.</li>
      <li>في الوضع <em>API</em> عدِّل متغير <code>API_URL</code> و<code>API_KEY</code> داخل الدالة <code>callTranslateAPI</code> لربط أي خدمة ترجمة خارجية.</li>
      <li>التبديل ينقل النصوص بين المدخل والمخرج لتجربة سريعة شبيهة بما تراه في مواقع الترجمة.</li>
    </ul>
  </div>
</div>

) }

https://libretranslate.com/translatedata.translatedTextl.namea.hrefa.download# -
موقع للترجمة 
