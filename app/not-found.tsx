import Link from "next/link";

export default function NotFound() {
  return (
    <html
    lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
            <Link
              href="/sign-up"
              className="inline-block mt-6 px-6 py-3 bg-[#39089D] text-white rounded-lg hover:bg-[#2e0673]"
            >
              Go sign up
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}