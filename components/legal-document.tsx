import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LegalDocumentProps {
  title: string
  lastUpdated?: string
  children: ReactNode
  className?: string
}

/**
 * LegalDocument Component
 * 
 * Provides a Word document-like UI for legal pages with:
 * - Paper-like white background with shadow
 * - Max-width container for readability
 * - Proper typography and spacing
 * - Document-like margins and padding
 */
export const LegalDocument: React.FC<LegalDocumentProps> = ({
  title,
  lastUpdated,
  children,
  className,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Document Container - Word-like paper appearance */}
        <article
          className={cn(
            'bg-white shadow-xl',
            'px-12 sm:px-16 lg:px-20',
            'pt-16 sm:pt-20',
            'pb-20 sm:pb-24',
            'legal-document-style',
            className
          )}
          style={{
            fontFamily: "'Times New Roman', 'Times', 'Georgia', serif",
            fontSize: '11pt',
            lineHeight: '1.6',
            color: '#333',
            maxWidth: '816px',
            margin: '0 auto',
          }}
        >
          {/* Document Title */}
          <header className="mb-12">
            <h1 
              className="font-bold text-gray-900 mb-4"
              style={{ 
                fontSize: '18pt',
                marginTop: 0,
                marginBottom: '16px',
                lineHeight: '1.2'
              }}
            >
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-sm text-gray-600 font-normal mb-0">
                Last Updated: {lastUpdated}
              </p>
            )}
          </header>

          {/* Document Content */}
          <div className="legal-content">
            {children}
          </div>
        </article>
      </div>
    </div>
  )
}

export default LegalDocument

