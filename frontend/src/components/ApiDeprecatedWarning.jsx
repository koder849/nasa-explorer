import React from "react";

export default function ApiDeprecatedWarning({ apiName, alternativeUrl, message }) {
  return (
    <div className="rounded-2xl border border-yellow-400/40 bg-yellow-500/10 p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-100">{apiName} API Archived</h3>
          <p className="mt-2 text-sm text-yellow-100/90">{message}</p>
          {alternativeUrl && (
            <a
              href={alternativeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-yellow-100 underline hover:text-yellow-50"
            >
              View alternative documentation →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
